<?php

use App\Http\Controllers\Flashcards\FlashcardsController;
use App\Http\Controllers\Flashcards\LearnController;
use App\Http\Controllers\Flashcards\MatchController;
use App\Http\Controllers\Flashcards\SetController;
use App\Http\Controllers\Flashcards\TestController;
use App\Http\Controllers\Flashcards\TranslationsController;
use App\Models\FlashcardsSetsProgress;
use Illuminate\Support\Facades\Route;

    Route::middleware('auth')->name('flashcards.')->group(function () {
        // SetController
        Route::get('/create-set', [SetController::class, 'showNewSet'])->name('showNewSet');

        Route::post('/create-set', [SetController::class, 'store'])->name('storeNewSet');

        Route::get('/set/{set_id}', [SetController::class, 'showSet'])->name('showSet');

        // FlashcardsController
        Route::get('/set/{set_id}/flashcards', [FlashcardsController::class, 'show'])->name('flashcards');

        // LearnController
        Route::get('/set/{set_id}/learn', [LearnController::class, 'show'])->name('learn');

        // Match Controller
        Route::get('/set/{set_id}/match', [MatchController::class, 'show'])->name('match');
        Route::post('/store_new_match_time/{set_id}', [MatchController::class, 'store'])->name('match.store');

        // TestController
        Route::get('/set/{set_id}/test', [TestController::class, 'show'])->name('test');

        // TranslationsController
        Route::put('/set/updateTranslationStatus', [FlashcardsSetsProgress::class, 'updateTranslationStatus'])->name('updateTranslationStatus');

    });

    Route::middleware(['auth', 'canEditSet'])->name('flashcards.')->group(function () {
        // Set controller
        Route::get('/edit-set/{set_id}', [SetController::class, 'showEdit'])->name('showEdit');

        Route::put('/update-set/{set_id}', [SetController::class, 'update'])->name('update');

        Route::delete('/delete/set/{set_id}', [SetController::class, 'deleteSet'])->name('deleteSet');

        // Translations controller
        Route::put('/set/{set_id}/update-translation/{translation_id}/{title}', [TranslationsController::class, 'update'])->name('updateTranslation');

        Route::delete('/set/{set_id}/delete/translation/{translation_id}/{title}', [TranslationsController::class, 'delete'])->name('deleteTranslation');

        Route::put("/set/{set_id}/setFavourite/{translation_id}/{title}", [TranslationsController::class, 'updateOnlyFavourite'])->name('updateOnlyFavourite');
    });