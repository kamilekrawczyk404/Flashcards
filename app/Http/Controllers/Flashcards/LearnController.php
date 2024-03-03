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
            'groupsProperties' => FlashcardSets::getGroupsProperties($set_id),
        ]);
    }

    public static function prepareForLearn(int $user_id, int $set_id, $groups): array {
        $groups = FlashcardSets::getGroups($user_id, $set_id, $groups);

        $final = [];
        $components = ['EnterAnswer', 'ChooseAnswer'];

        foreach ($groups as $key => $group) {
            $final[$key]['group_name'] = $group['name'];
            $final[$key]['translationsCount'] = count($group['translations']);

            foreach ($group['translations'] as $tKey => $translation) {
                $final[$key]['components'][$tKey] = match(fake()->randomElement($components)) {
                    'EnterAnswer' => HelperController::getEnterAnswerData($translation),
                    'ChooseAnswer' => HelperController::getChooseAnswerData($translation, $group['translations']),
                };
            }
        }

        return $final;
    }
}