<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        'is_favourite' => false
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function sets() {
        return $this->belongsTo(FlashcardSets::class);
    }

    public static function insertNewValues(int $user_id, int $set_id): void {
        $translations = DB::table(FlashcardSets::getTitle($set_id))->get()->toArray();

        foreach($translations as $translation) {
            FlashcardsSetsProgress::create([
                'user_id' => $user_id,
                'translation_id' => $translation->id,
                'flashcard_sets_id' => $set_id,
                'is_favourite' => rand(0, 1),
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

    public function updateFavourite(Request $request): void {
        FlashcardsSetsProgress::where([
            'user_id' => Auth::id(),
            'flashcard_sets_id' => $request->set_id,
            'translation_id' => $request->translation_id
        ])->update(['is_favourite' => +$request->value]);
    }
}