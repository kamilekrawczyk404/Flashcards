<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SetsSearchIndex extends Model
{
    use HasFactory;

    protected $table = "sets_search_index";

    public static function insertNewValuesForSet(int $setId, string $title): void
    {
        $wordsInTitle = explode("_", $title);

        foreach ($wordsInTitle as $word) {
            $record = new SetsSearchIndex();
            $record->timestamps = false;
            $record->flashcard_sets_id = $setId;
            $record->sets_search_term_id = SetsSearchTerm
                ::where('term', $word)->value('id');
            $record->save();
        }
    }

    public function sets(): BelongsTo
    {
        return $this->belongsTo(FlashcardSets::class);
    }

    public function setsSearchTerms(): BelongsTo {
        return $this->belongsTo(SetsSearchTerm::class);
    }
}