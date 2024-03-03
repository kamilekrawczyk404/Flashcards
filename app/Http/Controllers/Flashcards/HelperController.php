<?php

namespace App\Http\Controllers\Flashcards;

use App\Http\Controllers\Controller;
use App\Models\FlashcardSets;
use App\Models\Translations;
use Illuminate\Support\Facades\DB;

class HelperController extends Controller
{
    public static function makeAnswers(string $term, string $definition, array $source, array $target): object
    {
        $answersCount = 3; // without correct (4 - 1)

        if (count($target) > 4) {
            array_splice($source, array_search($term, $source), 1);
            array_splice($target, array_search($definition, $target), 1);

            shuffle($source);
            shuffle($target);

            $source = array_slice($source, 0, $answersCount);
            $target = array_slice($target, 0, $answersCount);

            $source[] = $term;
            $target[] =  $definition;
        }

        shuffle($source);
        shuffle($target);

        return (object)['sourceAnswers' => $source, 'targetAnswers' => $target];
    }

    public static function getTrueOrFalseData($translation, $group): array
    {
        switch(fake()->boolean()) {
            case true:
                    return ['component' => 'TrueOrFalseAnswer', 'name' => $group['name'], 'id' => $translation->id, 'term' => $translation->term, 'definition' => $translation->definition, 'answer' => true,];
            case false:
                // without correct answer
                $definitions = array_map(fn ($t) => $t->definition, $group['translations']);
                $definitions = array_splice($definitions, array_search($translation->definition, $definitions) - 1, 1);

                return ['component' => 'TrueOrFalseAnswer', 'name' => $group['name'], 'id' => $translation->id, 'term' => $translation->term, 'definition' => fake()->randomElement($definitions), 'answer' => false];
            default:
                return [];
        }
    }

    public static function getChooseAnswerData($translation, $translations): array {
        $terms = $definitions = [];

        foreach ($translations as $t) {
            $terms[] = $t->term;
            $definitions[] = $t->definition;
        }

        $answers = HelperController::makeAnswers($translation->term,
            $translation->definition, $terms, $definitions);


        return [
            'type' => 'ChooseAnswer',
            'translation' => $translation,
            'answers' => $answers,
        ];
    }

    public static function getEnterAnswerData($translation): array {
        return ['type' => 'EnterAnswer', 'translation' => $translation];
    }
}