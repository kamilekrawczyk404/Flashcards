<?php

use App\Http\Controllers\ProfileController;
use App\Models\FlashcardSets;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'availableLanguages' => FlashcardSets::getAvailableLanguages()
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/delete-social', [ProfileController::class, 'deleteSocial'])->name('profile.deleteSocial');
    Route::patch('/profile/update-socials', [ProfileController::class, 'updateSocials'])->name('profile.updateSocials');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
require __DIR__.'/flashcards.php';
require __DIR__.'/api.php';