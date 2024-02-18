<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}