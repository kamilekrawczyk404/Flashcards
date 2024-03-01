<?php

namespace App\Http\Controllers\Flashcards;

use App\Http\Controllers\Controller;
use App\Models\FlashcardsSetsProgress;
use App\Models\Translations;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class TranslationsController extends Controller
{
    public function update(int $id, int $translation_id, string $title, Request $request): RedirectResponse{
        $translation = $request->translation;
        $data = [];

        foreach($translation as $key => $item) {
            match($key) {
                'definition' => $data['definition'] = Translations::makeSingle($translation['definition']['word'],
                    $translation['definition']['language']),
                'term' => $data['term'] = Translations::makeSingle($translation['term']['word'], $translation['term']['language']),
                default => ""
            };
        }

        DB::connection('mysql')->table($title)->where(['id' => $translation_id])->update($data);

        return redirect()->route('flashcards.showSet', ['id' => $id, 'title' => $title])->with('success', "Translation has been updated successfully");
    }
    public function delete($id, $translation_id, $title): void {
        DB::table($title)->where('id', $translation_id)->delete();
    }

    public function updateOnlyFavourite(int $id, int $translation_id, string $title): void {
        $isFavourite = DB::table($title)->where('id', $translation_id)->value('isFavourite');

        DB::connection('mysql')->table($title)->where('id', $translation_id)->update([
            'isFavourite' => !$isFavourite
        ]);
    }
}