<?php

use App\Http\Controllers\Flashcards\SetController;
use App\Http\Resources\SetCollection;
use App\Http\Resources\SetResource;
use App\Models\FlashcardSets;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/get-user-sets/{id}', function (int $id) {
    return SetController::getUserSets($id);
});

Route::get('/search-in-sets/', function (Request $request) {
    return SetController::getFoundSets($request->currentPage, $request->searching, $request->filters);
});