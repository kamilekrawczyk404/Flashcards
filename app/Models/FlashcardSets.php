<?php

namespace App\Models;

use App\Http\Controllers\Flashcards\TranslationsController;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FlashcardSets extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id', 'title', 'description', 'source_language', 'target_language'
    ];

    protected $guarded = [];

    protected $casts = [
        'title' => 'string',
        'description' => 'string',
        'source_language' => 'string',
        'target_language' => 'string'
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function matchScores(): HasMany {
        return $this->hasMany(MatchScores::class);
    }

    public function setsSearchIndex(): HasMany {
        return $this->hasMany(SetsSearchIndex::class);
    }

    public function setsProgress() {
        return $this->hasMany(FlashcardsSetsProgress::class);
    }

    public static function getUserSets(int $user_id): array
    {
        $final = [];
        $sets = FlashcardSets::where('user_id', $user_id)->get()->toArray();

        foreach ($sets as $set) {
            $count = ['count' => FlashcardSets::countTranslations($set['id'])];
            $final[] = array_merge($set, $count);
        }

        return $final;
    }

    public static function getAvailableLanguages() {
        return ["English", "Polish", "German", "Spanish"];
    }

    public static function getFoundSets(int $currentPage, string $searching, $filters): array {
        $final = [];
        $sets = [];
        $take = 4;

        // implementation with tables

//        $words = str_replace("_", " ", $searching);
//
//        $termsId = SetsSearchTerm::where("term", 'like', "%$words%")->get('id')->toArray() ?? -1;
//
//        if($termsId === -1)
//            return $final;
//
//
//        $termsId = array_map(function($termId) { return $termId['id'];}, $termsId);
//
//        foreach($termsId as $termId) {
//            $sets[] = FlashcardSets::where('id', SetsSearchIndex::where('sets_search_term_id', $termId)->value('flashcard_sets_id'))->get()->toArray();
//        }
//
//        $sets = array_slice($sets, ($currentPage * $take), $take);
//
//        foreach ($sets as $set) {
//            $count = ['count' => FlashcardSets::countTranslations($set[0]['title'])];
//            $final[] = array_merge($set[0], $count);
//        }

        $words = explode(" ", $searching);

        $languages = $filters['languages'] ?? [];

        foreach($words as $word) {

            // if user choose a language and count of all available languages not equals to total length of languages in sets
            if (count($languages) > 0 && count($languages) !== count(FlashcardSets::getAvailableLanguages())) {

                $sets[] = FlashcardSets::when($languages, function($query) use ($languages) {
                    $query->where(function ($query) use ($languages) {
                        foreach($languages as $language) {
                            $query->where(['source_language' => $language, 'target_language' => $language]);
                        }
                    });
                })->where('title', 'like', "%$word%")->skip($currentPage * $take)->take($take)->get()->toArray();
            } else {
                // There is no filters
                $sets[] = FlashcardSets::where('title', 'like', "%$word%")->skip($currentPage * $take)->take($take)->get()->toArray();
            }
        }

        foreach($sets[0] as $set) {
            $progression = [];
            if (Auth::id() === $set['user_id']) {
                $progression['progression'] = [FlashcardsSetsProgress::getSetProgress(Auth::id(), $set['id'])];
            }
            $translationsCount = ['count' => FlashcardSets::countTranslations($set['id'])];
            $final[] = array_merge($translationsCount, $set, $progression);
        }

        return $final;
    }

    public static function getGroups($user_id, $set_id, $groups = []): array {
        $data = [];
        $allGroups = false;
        $translationTableName = FlashcardSets::getTitle($set_id);

        // If third parameter was no declared
        if (!count($groups)) {
            $allGroups = true;
            $groups = DB::table($translationTableName)
                ->distinct()
                ->get('group_name')
                ->toArray();
        }

        foreach($groups as $key => $group) {
            $translationsBelongToGroup =
                DB::table('flashcards_sets_progress AS fsp')
                    ->leftJoin($translationTableName . ' AS t', 'fsp.translation_id', '=', 't.id')
//                    ->join('flashcard_sets AS fs', 'fs.id', '=', 'fsp.flashcard_sets_id')
//                    ->join('users AS u', 'u.id', '=', 'fsp.user_id')
                    ->where(['t.group_name' =>  $allGroups ? $group->group_name : $key, 'fsp.user_id' => $user_id])
                    ->select( 't.*' ,'fsp.isFavourite', 'fsp.status')
                    ->distinct()
                    ->get()
                    ->unique('id')
                    ->toArray();

            $data[] = [
                'name' => $allGroups ? $group->group_name : $key,
                // splice D:
                'translations' => $allGroups ? $translationsBelongToGroup : array_splice($translationsBelongToGroup, $group['minValue'], $group['maxValue'] - $group['minValue']),
            ];
        }

        return $data;
    }

    public static function getGroupsProperties(int $set_id): array {
        $groupsNames = DB::table(FlashcardSets::getTitle($set_id))->distinct()->get('group_name')->toArray();
        $dataForForm = [];

        foreach($groupsNames as $key => $groupName) {
            $dataForForm[$key] = [
                // default value for a form
                $groupName->group_name => false,
                'group_name' => $groupName->group_name,
                'settings_on' => false,
                'minValue' => 1,
                'maxValue' => TranslationsController::countTranslationsSingleGroup($set_id, $groupName->group_name)
            ];
        }

        return $dataForForm;
    }

    public static function countTranslations($set_id, ): int {
        return DB::table(
            FlashcardSets::getTitle($set_id))->select(DB::raw('count(*) as count'))->value('count');
    }

    public static function getAuthorName($set_id): string {
        return User::where('id', FlashcardSets::find($set_id)->value('user_id'))->value('name');
    }

    public static function getLanguages($set_id): array {
        return FlashcardSets::where(['id' => $set_id])->value(['source_language', 'target_language']);
    }

    public static function getTitle($set_id): string {
        return FlashcardSets::where('id', $set_id)->value('title');
    }
}