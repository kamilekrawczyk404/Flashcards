<?php

namespace App\Http\Controllers\Flashcards;

use App\Http\Controllers\Controller;
use App\Http\Requests\MatchTimeRequest;
use App\Models\FlashcardSets;
use App\Models\MatchScores;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MatchController extends Controller
{
    private int $translationsPerPage = 6;

    public function prepareForMatch($set_id): array {
        return FlashcardSets::getGroups(Auth::id(), $set_id, [], ['translations_per_page' => $this->translationsPerPage]);
    }

    public function show(int $set_id): Response
    {
        return Inertia::render('Flashcards/Match', [
            'set' => FlashcardSets::find($set_id),
            'groups' => FlashcardSets::getGroups(Auth::id(), $set_id),
            'translations' => $this->prepareForMatch($set_id),
            'bestResult' => MatchScores::getBestResult($set_id),
            'rankingList' => MatchScores::getTopFiveRankings($set_id),
            'translationsPerPage' => $this->translationsPerPage,
        ]);
    }

    public function store(int $id, MatchTimeRequest $request): void {
        $scoreTime = new MatchScores;
        $scoreTime->matching_time = $request->score;
        $scoreTime->set_id = $id;

        $user = Auth::user();
        $user->matchScores()->save($scoreTime);

    }
}