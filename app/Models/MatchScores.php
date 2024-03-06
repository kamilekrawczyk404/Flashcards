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

    public static function getBestResult(int $set_id){
        return MatchScores::where(
            [
                'user_id' => Auth::id(),
                'set_id' => $set_id
            ])
            ->orderBy('matching_time',
                'desc')
            ->first()
            ?? -1;
    }

    public static function getTopFiveRankings(int $set_id) {
        return MatchScores::selectRaw("name, min(matching_time) AS matching_time")
            ->join('users', 'users.id', '=', 'match_scores.user_id')
            ->where('set_id', $set_id)
            ->groupBy('users.id')
            ->orderBy('match_scores.matching_time', 'ASC')
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