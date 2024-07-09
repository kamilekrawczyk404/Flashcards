<?php

use App\Http\Controllers\Flashcards\LearnController;
use App\Http\Controllers\Flashcards\SetController;
use App\Http\Controllers\Flashcards\TestController;
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

Route::get('/get-user-sets/{user_id}', function ($user_id) {
    return SetController::getUserSets($user_id);
})->name('getUserSets');

Route::get('/search-in-sets/', function (Request $request) {
    return SetController::getFoundSets($request->currentPage, $request->searching, $request->filters);
})->name('searchInSets');

Route::get('/get-groups-for-learning/', function(Request $request) {
    return LearnController::prepareForLearn($request->user_id, $request->set_id, $request->groups, $request->options);
})->name('getGroupsForLearning');

Route::get('/get-groups-for-test/', function(Request $request) {
    return TestController::prepareForTest($request->user_id, $request->set_id, $request->groups, $request->options);
})->name('getGroupsForTest');