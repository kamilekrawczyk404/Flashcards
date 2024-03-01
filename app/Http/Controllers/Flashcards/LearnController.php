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
    public function show(int $set_id): Response
    {
        return Inertia::render('Flashcards/Learn', [
            'set' => FlashcardSets::find($set_id),
            'groupsNames' => FlashcardSets::getGroupsNames($set_id),
        ]);
    }

    public static function prepareForLearn(int $user_id, int $set_id, $groups): array {
        $groups = FlashcardSets::getGroups($user_id, $set_id, $groups);

        $final = [];

        foreach ($groups as $key => $group) {
            $translationsCount = 0;
            $answers = $terms = $definitions = [];

            foreach ($group['translations'] as $translation) {
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
                'translationsCount' => $translationsCount,
            ];
        }

        return $final;
    }
}