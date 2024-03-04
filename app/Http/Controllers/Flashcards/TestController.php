<?php

namespace App\Http\Controllers\Flashcards;

use App\Http\Controllers\Controller;
use App\Models\FlashcardSets;
use App\Models\Translations;
use Inertia\Inertia;
use Inertia\Response;

class TestController extends Controller
{
    public function show(int $set_id): Response
    {
        return Inertia::render('Flashcards/Test', [
            'set' => FlashcardSets::find($set_id),
            'groupsProperties' => FlashcardSets::getGroupsProperties($set_id)
        ]);
    }

    public static function prepareForTest(int $user_id, int $set_id, $groups, $options): array {
        $options = array_filter($options, fn ($value, $option) => $value === "true", ARRAY_FILTER_USE_BOTH);
        $groups = FlashcardSets::getGroups($user_id, $set_id, $groups);
        $final = [];

        foreach($groups as $key => $group) {
            foreach($group['translations'] as $tKey => $translation) {
                $final[$key]['group_name'] = $group['name'];
                $final[$key]['translationsCount'] = count($group['translations']);

                $final[$key]['components'][$tKey] = match(array_rand($options)) {
                    'TrueOrFalseAnswer' => HelperController::getTrueOrFalseData($translation, $group),
                    'ChooseAnswer' => HelperController::getChooseAnswerData($translation, $group['translations']),
                    'EnterAnswer', => HelperController::getEnterAnswerData($translation),
                };
            }
            shuffle($final[$key]['components']);
        }

        return $final;
    }
}