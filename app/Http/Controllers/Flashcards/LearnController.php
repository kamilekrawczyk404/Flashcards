<?php

namespace App\Http\Controllers\Flashcards;

use App\Models\FlashcardSets;
use App\Models\Translations;
use Illuminate\Support\Facades\Auth;
use Inertia\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LearnController extends Controller
{
    public function show(int $set_id,): Response
    {
        return Inertia::render('Flashcards/Learn', [
            'set' => FlashcardSets::find($set_id),
            'groups' => LearnController::prepareForLearn($set_id),
        ]);
    }

    public static function prepareForLearn(int $set_id): array {
        $groups = FlashcardSets::getGroups(Auth::id(), $set_id);
        $answers = $final = $terms = $definitions = [];

        foreach ($groups as $key => $group) {
            $translationsCount = 0;
            $groupLearned = true;

            foreach ($group['translations'] as $translation) {
                if ($translation->status !== 'known') {
                    $groupLearned = false;
                }
                $terms[] = $translation->term;
                $definitions[] = $translation->definition;
                $translationsCount++;
            }

            foreach ($group['translations'] as $translation) {
                $answers = HelperController::makeAnswers($translation->term,
                    $translation->definition, $terms, $definitions);
            }

            $final[$key] = [
                'name' => $group['name'],
                'translations' => $group['translations'],
                'answers' => $answers,
                'isChecked' => !$groupLearned,
                'translationsCount' => $translationsCount
            ];
        }

        return $final;
    }
}