<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class FlashcardSets extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id', 'title', 'description', 'languages'
    ];

    protected $guarded = [];

    protected $casts = [
        'title' => 'string',
        'description' => 'string',
        'languages' => 'string'
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

    public static function getUserSets(int $id): array
    {
        $final = [];
        $sets = FlashcardSets::where('user_id', $id)->get()->toArray();

        foreach ($sets as $set) {
            $count = ['count' => FlashcardSets::countTranslations($set['title'])];
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

            // user still can update other's sets, change sth in authentication

            // if user choose a language and count of all available languages not equals to total length of languages in sets
            if (count($languages) > 0 && count($languages) !== count(FlashcardSets::getAvailableLanguages())) {

                $sets[] = FlashcardSets::when($languages, function($query) use ($languages) {
                    $query->where(function ($query) use ($languages) {
                        foreach($languages as $language) {
                            $query->orWhereJsonContains('languages', ['source' => $language])->orWhereJsonContains('languages', ['target' => $language]);
                        }
                    });
                })->where('title', 'like', "%$word%")->skip($currentPage * $take)->take($take)->get()->toArray();
            } else {
                // There is no filters
                $sets[] = FlashcardSets::where('title', 'like', "%$word%")->skip($currentPage * $take)->take($take)->get()->toArray();
            }
        }


        foreach($sets[0] as $set) {
            $translationsCount = ['count' => FlashcardSets::countTranslations($set['title'])];
            $final[] = array_merge($translationsCount, $set);
        }

        return $final;
    }

    public static function getAllTranslations($title) {
        $toSend = [];
        $data = DB::table($title)->get(['id', 'term', 'definition', 'isFavourite']);
        foreach ($data as $row) {
            $toSend[] = collect([
                'id' => $row->id,
                'term' => json_decode($row->term),
                'definition' => json_decode($row->definition),
                'isFavourite' => $row->isFavourite
            ]);
        }

        return collect($toSend);

    }

    public static function countTranslations($title): int {
        return DB::table($title)->select(DB::raw('count(*) as count'))->value('count');
    }

    public static function getAuthorName($id): string {
        return User::where('id', FlashcardSets::find($id)->value('user_id'))->value('name');
    }

    public static function getLanguages($id) {
        return json_decode(FlashcardSets::where(['id' => $id])->value('languages'));
    }
}