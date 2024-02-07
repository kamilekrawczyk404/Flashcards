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
    private int $translationsSetPerOnePage = 6;
    private function leaveOnlyTermsAndDefinitions($translations): array
    {
        // it must be odd number
        $breakPoints = 0;
        $array = [];
        $count = 0;

        foreach ($translations as $key => $translation) {
            if ($key % $this->translationsSetPerOnePage == 0)
                $breakPoints += 1;

            $translation['term']=
                json_decode(json_encode([
                    'id' => $translation['id'],
                    'refId' => $count++,
                    'text' => $translation['term']->word ?? $translation['term']->{0}->word,
                    'isFocused' => false,
                    'page' => $breakPoints
                ]));

            $translation['definition'] =
                json_decode(json_encode([
                    'id' => $translation['id'],
                    'refId' => $count++,
                    'text' => $translation['definition']->word ?? $translation['definition']->{0}->word,
                    'isFocused' => false,
                    'page' => $breakPoints
                ]));
        }

        foreach ($translations as $translation) {
            $array[] = $translation['term'];
            $array[] = $translation['definition'];
        }

        for ($i = 0; $i < $breakPoints; $i++) {
            $sliceOfArray = array_slice($array, $i * ($this->translationsSetPerOnePage + 3), $this->translationsSetPerOnePage + 3);
            shuffle($sliceOfArray);
            array_splice($array, $i * ($this->translationsSetPerOnePage + 3), $this->translationsSetPerOnePage + 3, $sliceOfArray);
        }
        return $array;
    }

    public function show(int $id, string $title): Response
    {
        return Inertia::render('Flashcards/Match', [
            'set' => FlashcardSets::find($id),
            'onlyTranslations' => $this->leaveOnlyTermsAndDefinitions(FlashcardSets::getAllTranslations($title)),
            'setsPerPage' => $this->translationsSetPerOnePage,
            'bestResult' => MatchScores::getBestResult($id),
            'rankingList' => MatchScores::getTopFiveRankings($id)
        ]);
    }

    public function store(int $id, MatchTimeRequest $request): void {
        $scoreTime = new MatchScores;
        $scoreTime->matchingTime =
            json_encode($request->score);
        $scoreTime->set_id = $id;

        $user = Auth::user();
        $user->matchScores()->save($scoreTime);

    }
}