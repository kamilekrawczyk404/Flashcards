<?php

namespace App\Http\Controllers;

use App\Models\FlashcardsSetsProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FlashcardsSetsProgressController extends Controller
{
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