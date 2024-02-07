<?php

namespace App\Models;

use Database\Factories\Words;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

    public static function getLanguageShortcut(string $language, bool $isForTranslator = false): string {
        return match($language) {
            'English' => $isForTranslator ? 'en-GB' : 'en',
            'Spanish' => 'es',
            'Polish' => 'pl',
            'German' => 'de'
        };
    }

    public static function getDataFromDictionary(string $languageShortcut, string $word) {
        $response = Http::withUrlParameters([
            'endpoint' => 'https://api.dictionaryapi.dev',
            'page' => 'api',
            'version' => 'v2',
            'directory' => 'entries',
            'language' => $languageShortcut,
            'word' => $word
        ])->get('{+endpoint}/{page}/{version}/{directory}/{language}/{word}');

        if($response->ok()) {
            return $response->json();
        }

        return ['word' => $word, 'language' => $languageShortcut];

    }

    public static function getTranslation(string $targetLanguage, string $term): string {
        $authKey = '472a58e2-1abc-5b83-5c00-a4c254512ede:fx';
        $translator = new \DeepL\Translator($authKey);

        $translation = $translator->translateText($term, null, $targetLanguage)->text;

        return str_replace('.', '', $translation);
    }

    public static function randomWord(string $language): string {
        return match($language) {
            'English' => fake()->unique()->randomElement(Words::getEnglishWords()),
            'Polish' => fake()->unique()->randomElement(Words::getPolishWords()),
            'German' => fake()->unique()->randomElement(Words::getGermanWords()),
            'Spanish' => fake()->unique()->randomElement(Words::getSpanishWords()),
        };
    }

    public static function makeSingle(string $word, string $languageShortcut): string {
        // Generate single data from dictionary when user updates data in the translations table
        $data = Translations::getDataFromDictionary($languageShortcut, $word);

        if (array_key_exists( 0, $data)) {
            // Extract data from dictionary hidden under '0' index
            $data = $data['0'];
        }
        $data['language'] = $languageShortcut;

        return json_encode($data);
    }
}