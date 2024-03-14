<?php

namespace App\Http\Controllers\Flashcards;

use App\Http\Controllers\Controller;
use App\Models\FlashcardSets;
use App\Models\FlashcardsSetsProgress;
use App\Models\Translations;
use App\Providers\RouteServiceProvider;
use Database\Factories\Words;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redirect;

class TranslationsController extends Controller
{
    public function update(int $set_id, int $translation_id, Request $request): RedirectResponse{
        $translation = $request->translation;
        $data = [];

        foreach($translation as $key => $item) {
            match($key) {
                'definition' => $data['definition'] = TranslationsController::makeSingle($translation['definition'],
                    $translation['term_language']),
                'term' => $data['term'] = TranslationsController::makeSingle($translation['term'], $translation['term_language']),
                default => ""
            };
        }
        $values = [
            'term' => $data['term']['word'],
            'term_phonetic' => $data['term']['phonetic'] ?? "",
            'term_audio' => $data['term']['audioPath'] ?? "",
            'definition' =>  $data['definition']['word'],
            'definition_phonetic' => $data['definition']['phonetic'] ?? "",
            'definition_audio' => $data['definition']['audioPath'] ?? ""
        ];

        DB::connection('mysql')->table(FlashcardSets::getTitle($set_id))->where(['id' => $translation_id])->update($values);

        return redirect()->route('flashcards.showSet', ['set_id' => $set_id])->with('success', "Translation has been updated successfully");
    }
    public function delete($id, $translation_id, $title): void {
        DB::table($title)->where('id', $translation_id)->delete();
    }

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

        if ($response->ok()) {
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

    public static function makeSingle(string $word, string $languageShortcut): array {
        // Generate single data from dictionary when user updates data in the translations table
        $dictionary = TranslationsController::getDataFromDictionary($languageShortcut, $word);
        $data = [];

        if (array_key_exists( 0, $dictionary)) {
            // Extract data from dictionary hidden under '0' index
            $dictionary = $dictionary['0'];
            $phonetics = array_filter($dictionary['phonetics'], fn ($phonetic) => str_contains($phonetic['audio'], ".mp3"));

            $data['phonetic'] = $dictionary['phonetic'] ?? "";
            $data['audioPath'] = reset($phonetics)['audio'] ?? "";
        }

        $data['word'] = $dictionary['word'];
        $data['language'] = $languageShortcut;

        return $data;
    }
}