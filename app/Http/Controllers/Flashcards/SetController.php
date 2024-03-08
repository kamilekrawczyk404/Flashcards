<?php

namespace App\Http\Controllers\Flashcards;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FlashcardsSetsProgressController;
use App\Http\Requests\StoreNewSetRequest;
use App\Http\Requests\UpdateSetRequest;
use App\Http\Resources\DictionaryResource;
use App\Models\FlashcardSets;
use App\Models\FlashcardsSetsProgress;
use App\Models\Translations;
use App\Providers\RouteServiceProvider;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class SetController extends Controller
{
    public function showSet(int $set_id): Response
    {
        return Inertia::render('Flashcards/SetInfo', [
            'set' => FlashcardSets::find($set_id),
            'groups' => FlashcardSets::getGroups(Auth::id(), $set_id),
            'progression' => FlashcardsSetsProgressController::getSetProgress(Auth::id(), $set_id),
            'author' => FlashcardSets::getAuthorName($set_id),
            'translationsCount' => FlashcardSets::countTranslations($set_id)
        ]);
    }

    public function showEdit(int $set_id): Response
    {
        return Inertia::render('Flashcards/EditSet', [
            'set' => FlashcardSets::find($set_id)->toArray(),
            'groups' => FlashcardSets::getGroups(Auth::id(), $set_id),
        ]);
    }

    public function showNewSet(): Response
    {
        return Inertia::render('Flashcards/CreateSet', [
            'message' => session('message')
        ]);
    }

    public function store(StoreNewSetRequest $request): RedirectResponse {
        // Store new set
        $flashcardSet = new FlashcardSets;

        $languages = $request->languages;
        $title = trim($request->title);
        $title = str_replace(' ', '_', $title);
        $flashcardSet->title = $title;
        $flashcardSet->description = trim($request->description);
        $flashcardSet->source_language = $languages['source'];
        $flashcardSet->target_language = $languages['target'];

        $user = Auth::user();
        $user->sets()->save($flashcardSet);

        // Create a new table storing all translations
        if (!Schema::hasTable($title)) {
            Schema::connection('mysql')->create($title, function (Blueprint $table) {
                $table->id();
                $table->string('group_name');
                $table->string('term');
                $table->string('term_phonetic');
                $table->string('term_audio');
                $table->string('term_language');
                $table->string('definition');
                $table->string('definition_phonetic');
                $table->string('definition_audio');
                $table->string('definition_language');
            });

            // For storing indexes in the progression table
            $countIndex = 1;

            foreach ($request->groups as $group) {

                foreach ($group['translations'] as $translation) {

                    // Store translation in main table
                    $term = TranslationsController::makeSingle($translation['term'], TranslationsController::getLanguageShortcut
                    ($languages['source']));

                    $definition = TranslationsController::makeSingle($translation['definition'], TranslationsController::getLanguageShortcut
                    ($languages['target']));

                    DB::table($title)->insert([
                        'group_name' => $group['name'],
                        'term' => $term['word'],
                        'term_phonetic' => $term['phonetic'] ?? "",
                        'term_audio' => $term['audioPath'] ?? "",
                        'term_language' => $term['language'],
                        'definition' => $definition['word'],
                        'definition_phonetic' => $definition['phonetic'] ?? "",
                        'definition_audio' => $definition['audioPath'] ?? "",
                        'definition_language' => $definition['language'],
                    ]);

                    // Store data for an individual user

                    $setProgress = new FlashcardsSetsProgress;

                    $setProgress->flashcard_sets_id = FlashcardSets::orderBy('id', 'desc')->first()->id;
                    $setProgress->translation_id = $countIndex;
                    $setProgress->status = 'unknown';
                    $setProgress->is_favourite = false;

                    $user->setsProgress()->save($setProgress);

                    $countIndex += 1;
                }
            }
        }

        return to_route('flashcards.showSet', [FlashcardSets::orderBy('id', 'desc')->first()->id])->with('success', "Your set has been created successfully");
    }

    public function update(int $set_id, UpdateSetRequest $request)
    {
        $title = FlashcardSets::getTitle($set_id);
        $set = FlashcardSets::find($set_id)->toArray();
        $user = Auth::user();
        $lastId = DB::table($title)->orderBy('id', 'desc')->first()->id;

        foreach ($request->groups as $group) {

            foreach($group['translations'] as $translation) {
                $term = TranslationsController::makeSingle($translation['term'], TranslationsController::getLanguageShortcut
                ($set['source_language']));

                $definition = TranslationsController::makeSingle($translation['definition'], TranslationsController::getLanguageShortcut
                ($set['target_language']));

                $values = [
                    'group_name' => $group['name'],
                    'term' => $term['word'],
                    'term_phonetic' => $term['phonetic'] ?? "",
                    'term_audio' => $term['audioPath'] ?? "",
                    'term_language' => $term['language'],
                    'definition' => $definition['word'],
                    'definition_phonetic' => $definition['phonetic'] ?? "",
                    'definition_audio' => $definition['audioPath'] ?? "",
                    'definition_language' => $definition['language'],
                ];

                if (in_array('isNew', $translation)) {
                    DB::table($title)->insert($values);
                    $setProgress = new FlashcardsSetsProgress;

                    $setProgress->flashcard_sets_id = $set['id'];
                    $setProgress->translation_id = $lastId;
                    $setProgress->status = 'unknown';
                    $setProgress->is_favourite = false;

                    $user->setsProgress()->save($setProgress);
                    $lastId += 1;
                } else {
                    DB::table($title)->where('id', $translation['id'])->update($values);
                }
            }
        }

        $newTitle = str_replace(' ', '_', $request->title);

        if ($title !== $newTitle) {
            FlashcardSets::where('title', $title)->update([
                'title' => $newTitle
            ]);
            DB::connection('mysql')->statement("RENAME TABLE `$title` TO `$newTitle`");
        }

        FlashcardSets::where('id', $set_id)->update(['title' => $newTitle, 'description' => $request->description]);

        return redirect()->route('flashcards.showSet', ['set_id' => $set_id,])->with('success', 'Your set has been updated successfully');
    }

    public function deleteSet(int $set_id)
    {
        Schema::dropIfExists(FlashcardSets::getTitle($set_id));

        //Remove also in set progress
        FlashcardsSetsProgress::where(['user_id' => Auth::id(), 'flashcard_sets_id' => $set_id])->delete();
        FlashcardSets::find($set_id)->delete();

        return redirect()->route('home')->with('success', 'Set has been removed successfully');
    }

    public static function getUserSets(int $id): array {
        return FlashcardSets::getUserSets($id);
    }

    public static function getFoundSets(int $currentPage, string $searching, $filters): array {

        return FlashcardSets::getFoundSets($currentPage, $searching, $filters);
    }
}