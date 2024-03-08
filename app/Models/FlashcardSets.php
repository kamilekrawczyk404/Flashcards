<?php

namespace App\Models;

use App\Http\Controllers\Flashcards\TranslationsController;
use App\Http\Controllers\FlashcardsSetsProgressController;
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
            $temp = [
                'translationsCount' => FlashcardSets::countTranslations($set['id']),
                'groupsCount' => FlashcardSets::countGroups($set['id']),
                'progression' => FlashcardsSetsProgressController::getSetProgress($user_id, $set['id'])
            ];
            $final[] = array_merge($set, $temp);
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
                $progression['progression'] = FlashcardsSetsProgressController::getSetProgress(Auth::id(), $set['id']);
            }
            $translationsCount = ['translationsCount' => FlashcardSets::countTranslations($set['id'])];
            $final[] = array_merge($translationsCount, $set, $progression);
        }

        return $final;
    }

    public static function getGroups($user_id, $set_id, $groups = [], $matching_properties = []): array {
        $data = [];
        $allGroups = false;
        $translationTableName = FlashcardSets::getTitle($set_id);

        // for matching
        $breakPoints = $count = 0;
        $translationsApart = [];

        // If third parameter was no declared
        if (!count($groups)) {
            $allGroups = true;
            $groups = DB::table($translationTableName)
                ->distinct()
                ->get('group_name')
                ->toArray();
        }

        foreach($groups as $gKey => $group) {
            $translationsBelongToGroup =
                DB::table('flashcards_sets_progress AS fsp')
                    ->leftJoin($translationTableName . ' AS t', 'fsp.translation_id', '=', 't.id')
//                    ->join('flashcard_sets AS fs', 'fs.id', '=', 'fsp.flashcard_sets_id')
//                    ->join('users AS u', 'u.id', '=', 'fsp.user_id')
                    ->where(['t.group_name' =>  $allGroups ? $group->group_name : $group['group_name'], 'fsp.user_id' => $user_id])
                    ->select( 't.*' ,'fsp.is_favourite', 'fsp.status')
                    ->distinct()
                    ->get()
                    ->unique('id')
                    ->toArray();

            // if user wants to generate matching component, first we need to convert groups into single translations which can help us to display and separate them apart. Then we need to assign to a single translation properties: group name, page and ref index (for calling correctly animations)

            if (count($matching_properties)) {
                foreach ($translationsBelongToGroup as $translation) {

                    if ($count % ($matching_properties['translations_per_page'] * 2) == 0) {
                        $breakPoints += 1;
                    }

                    $translationsApart[] = ['id' => $translation->id, 'word' => $translation->term, 'group_name' => $translation->group_name, 'page' => $breakPoints, 'ref_id' => $count++, 'translation_id' => $translation->id, 'group_id' => $gKey];
                    $translationsApart[] = ['id' => $translation->id, 'word' => $translation->definition, 'group_name' => $translation->group_name, 'page' => $breakPoints, 'ref_id' => $count++, 'translation_id' => $translation->id];

                }

                for($i = 0; $i < $breakPoints; $i++) {
                    $temp = $translationsApart;

                    $shuffled = array_splice($temp, ($i * $matching_properties['translations_per_page'] * 2), $matching_properties['translations_per_page'] * 2);
                    shuffle($shuffled);

                    array_splice($translationsApart, ($i * $matching_properties['translations_per_page'] * 2), $matching_properties['translations_per_page'] * 2, $shuffled);
                }

            } else {
                $data[] = [
                    'name' => $allGroups ? $group->group_name : $group['group_name'],
                    'translations' => $allGroups ? $translationsBelongToGroup : array_splice($translationsBelongToGroup, $group['minValue'] - 1, $group['maxValue'] - ($group['minValue'] - 1)),
                ];
            }
        }

        return count($matching_properties) !== 0  ? $translationsApart : $data ;
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
                'maxValue' => Translations::getTranslationsCountPerGroup($set_id, $groupName->group_name)
            ];
        }

        return $dataForForm;
    }

    public static function countTranslations($set_id, ): int {
        return DB::table(
            FlashcardSets::getTitle($set_id))->count();
    }

    public static function countGroups($set_id): int {
        return DB::table(FlashcardSets::getTitle($set_id))->distinct('group_name')->count();
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