<?php

namespace App\Http\Controllers\Flashcards;

use App\Models\FlashcardSets;
use Inertia\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LearnController extends Controller
{
    public function show(int $id, string $title): Response
    {
        $translations = FlashcardSets::getAllTranslations($title);
        $definitions = [];
        $terms = [];

        foreach ($translations as $translation) {
            $definitions[] = $translation['definition']->word ?? $translation['definition']->{0}->word;
            $terms[] = $translation['term']->word ?? $translation['term']->{0}->word;
        }

        foreach ($translations as $translation) {
            $translation['answers'] = HelperController::makeAnswers($translation['term']->word ?? $translation['term']->{0}->word,
                $translation['definition']->word ?? $translation['definition']->{0}->word,
                $terms, $definitions);
        }

        return Inertia::render('Flashcards/Learn', [
            'set' => FlashcardSets::find($id),
            'title' => $title,
            'translations' => $translations
        ]);
    }
}