<?php

namespace App\Http\Controllers\Flashcards;

use App\Http\Controllers\Controller;
use App\Models\FlashcardSets;

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

    public static function getTrueOrFalseComponentData($translations): array
    {
        $trueOrFalseComponentData = [];
        $cases = [0, 1, 1, 0, 0, 1];

        $temp = array_map(function($translation) {
            return $translation['definition']->word ?? $translation['definition']->{0}->word;
        },  $translations);

        foreach ($translations as $key => $translation) {
            switch ($cases[rand(0, count($cases) - 1)]) {
                case 1:
                    $trueOrFalseComponentData[$key] = (object)[
                        'id' => $key + 1,
                        'term' =>
                            (object)['word' => $translation['term']->word ?? $translation['term']->{0}->word],
                        'definition'
                        =>
                            (object)['word' => $translation['definition']->word ??
                                $translation['definition']->{0}->word],
                        'answer' =>
                            true,
                    ];
                    break;
                case 0:
                    array_splice($temp, $translation['id'] - 1, 1);
                    $randomAnswer = $temp[rand(0, count($temp) - 1)];

                    $trueOrFalseComponentData[$key] = (object)[
                        'id' => $key + 1,
                        'term' =>
                            (object)['word' => $translation['term']->word ?? $translation['term']->{0}->word],
                        'definition'
                        =>
                            (object)['word' => $randomAnswer],
                        'answer' =>
                            false,

                    ];
                    break;
                default:
                    break;
            }
        }
        return $trueOrFalseComponentData;
    }

    public static function prepareForTest($title): array {
        $shuffledTranslations = FlashcardSets::getAllTranslations($title)->toArray();
        $definitions = [];
        $terms = [];

        foreach ($shuffledTranslations as $translation) {
            $definitions[] = $translation['definition']->word ?? $translation['definition']->{0}->word;
            $terms[] = $translation['term']->word ?? $translation['term']->{0}->word;
        }

        $toSend = [];
        foreach ($shuffledTranslations as $translation) {

            $translation['answers'] = HelperController::makeAnswers($translation['term']->word ?? $translation['term']->{0}->word,$translation['definition']->word ?? $translation['definition']->{0}->word, $terms, $definitions);
            $toSend[] = $translation;

        }

        return $toSend;
    }
}