<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MatchScores extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';

    public static function getBestResult(int $id){
        return MatchScores::where(
            [
                'user_id' => Auth::id(),
                'set_id' => $id
            ])
            ->orderBy('matchingTime',
                'desc')
            ->first()
            ?? -1;
    }

    public static function getTopFiveRankings(int $id) {
        return MatchScores::selectRaw("name, min(matchingTime) AS matchingTime")
            ->join('users', 'users.id', '=', 'match_scores.user_id')
            ->where('set_id', $id)
            ->groupBy('users.id')
            ->orderBy('match_scores.matchingTime', 'ASC')
            ->limit(5)
            ->get() ?? -1;
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function set(): BelongsTo {
        return $this->belongsTo(FlashcardSets::class);
    }
}