<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SetsSearchTerm extends Model
{
    use HasFactory;

    protected $table = "sets_search_term";

    public function setsSearchIndex(): HasMany {
        return $this->hasMany(SetsSearchIndex::class);
    }

    public static function insertNewTitle(string $title): void {
        $wordsInTitle = explode("_", $title);

        foreach($wordsInTitle as $word) {
            if (SetsSearchTerm::where('term', '=', $word)->count() === 0) {
                $setsSearchTerm = new SetsSearchTerm;
                $setsSearchTerm->timestamps = false;
                $setsSearchTerm->term = $word;
                $setsSearchTerm->save();
            }
        }
    }
}