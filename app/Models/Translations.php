<?php

namespace App\Models;

use Database\Factories\Words;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class Translations extends Model
{
    use HasFactory;

    protected $attributes = [
        'isHard' => false
    ];

    protected $fillable = [
        'term', 'definition'
    ];

    protected array $guard = [];

    public static array $languages = ['English', 'Polish', 'German', 'Spanish'];

    public static function getTranslationsCountPerGroup($set_id, $group_name): int {
        return DB::table(FlashcardSets::getTitle($set_id))->where('group_name', $group_name)->count();
    }
}