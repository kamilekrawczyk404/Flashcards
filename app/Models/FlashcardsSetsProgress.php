<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FlashcardsSetsProgress extends Model
{
    use HasFactory;

    protected $table = "flashcards_sets_progress";

    protected $fillable = [
        'translations'
    ];

    public $timestamps = false;

    protected $primaryKey = 'id';

    protected $attributes = [
        'status' => 'unknown',
        'isFavourite' => false
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function sets() {
        return $this->belongsTo(FlashcardSets::class);
    }

    public static function getSetProgress(int $user_id, int $set_id): array {
        $translations = FlashcardsSetsProgress::where([
            'flashcard_sets_id' => $set_id,
            'user_id' => $user_id
        ])->get()->toArray();

        $known = 0;
        $unknown = 0;
        $difficult = 0;

        foreach ($translations as $translation) {
            match ($translation['status']) {
                'known' => $known += 1,
                'unknown' => $unknown += 1,
                'difficult' => $difficult += 1
            };
        }

        return [
            'known' => $known,
            'unknown' => $unknown,
            'difficult' => $difficult,
        ];
    }

    public static function insertNewValues(int $user_id, int $set_id): void {
        $translations = DB::table(FlashcardSets::getTitle($set_id))->get()->toArray();

        foreach($translations as $translation) {
            FlashcardsSetsProgress::create([
                'user_id' => $user_id,
                'translation_id' => $translation->id,
                'flashcard_sets_id' => $set_id,
                'isFavourite' => rand(0, 1),
            ]);
        }
    }

    public static function updateTranslationStatus(Request $request): void {
        FlashcardsSetsProgress::where([
            'user_id' => $request->user_id,
            'flashcard_sets_id' => $request->set_id,
            'translation_id' => $request->translation_id
        ])->update(['status' => $request->is_correct ? "known" : "difficult"]);
    }
}