<?php

namespace App\Http\Controllers\Flashcards;

use App\Http\Controllers\Controller;
use App\Models\FlashcardSets;
use Inertia\Inertia;
use Inertia\Response;

class TestController extends Controller
{
    public function show(int $id, string $title): Response
    {
        $translations = FlashcardSets::getGroups($title);
        return Inertia::render('Flashcards/Test', [
            'set' => FlashcardSets::find($id),
            'shuffledTranslations' => HelperController::prepareForTest($title),
            'translations' => FlashcardSets::getGroups($title),
            'trueOrFalseData' => HelperController::getTrueOrFalseComponentData($translations->toArray())
        ]);
    }
}