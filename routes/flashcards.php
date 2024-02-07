<?php

use App\Http\Controllers\Flashcards\FlashcardsController;
use App\Http\Controllers\Flashcards\LearnController;
use App\Http\Controllers\Flashcards\MatchController;
use App\Http\Controllers\Flashcards\SetController;
use App\Http\Controllers\Flashcards\TestController;
use App\Http\Controllers\Flashcards\TranslationsController;
use Illuminate\Support\Facades\Route;

    Route::middleware('auth')->name('flashcards.')->group(function () {
        // SetController
        Route::get('/create-set', [SetController::class, 'showNewSet'])->name('showNewSet');
        Route::get('/set/{id}/{title}', [SetController::class, 'showSet'])->name('showSet');
        Route::post('/create-set', [SetController::class, 'store'])->name('storeNewSet');

        // FlashcardsController
        Route::get('/set/{id}/{title}/flashcards', [FlashcardsController::class, 'show'])->name('flashcards');

        // LearnController
        Route::get('/set/{id}/{title}/learn', [LearnController::class, 'show'])->name('learn');

        // Match Controller
        Route::get('/set/{id}/{title}/match', [MatchController::class, 'show'])->name('match');
        Route::post('/store_new_match_time/{id}', [MatchController::class, 'store'])->name('match.store');

        // TestController
        Route::get('/set/{id}/{title}/test', [TestController::class, 'show'])->name('test');

        // TranslationsController
        Route::put('/set/{title}/updateHardTranslations', [TranslationsController::class, 'updateHardTranslations'])->name('updateHardTranslations');

    });

    Route::middleware(['auth', 'canEditSet'])->name('flashcards.')->group(function () {
        // Set controller
        Route::get('/edit-set/{id}/{title}', [SetController::class, 'showEdit'])->name('showEdit');
        Route::put('/update-set/{id}/{title}', [SetController::class, 'update'])->name('update');
        Route::delete('/delete/set/{id}/{title}', [SetController::class, 'deleteSet'])->name('deleteSet');

        // Translations controller
        Route::put('/set/update-translation/{id}/{title}', [TranslationsController::class, 'update'])->name('updateTranslation');
        Route::delete('/delete/translation/{id}/{title}', [TranslationsController::class, 'delete'])->name('deleteTranslation');
        Route::put("/setFavourite/{id}/{title}", [TranslationsController::class, 'updateOnlyFavourite'])->name('updateOnlyFavourite');
    });