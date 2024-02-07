<?php

namespace App\Http\Controllers\Flashcards;

use App\Http\Controllers\Controller;
use App\Models\Translations;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TranslationsController extends Controller
{
    public function update(int $id, string $title, Request $request) {
        $data = [];

        foreach ($request->translation as $element) {

            match((array_keys($element)[0])) {
                'definition' => $data['definition'] = Translations::makeSingle($element['definition']['word'],
                    $element['definition']['language']),
                'term' => $data['term'] = Translations::makeSingle($element['term']['word'], $element['term']['language'])
            };
        }

        DB::connection('mysql')->table($title)->where(['id' => $id])->update($data);
    }
    public function delete($id, $title): void {
        DB::table($title)->where('id', $id)->delete();
    }

    public static function updateHardTranslations(string $title, Request $request): void
    {
        foreach ($request->incorrect['translations'] as $incorrect) {
            DB::table($title)->where('id', $incorrect['id'])->update([
                'isHard' => true
            ]);
        }
    }

    public function updateOnlyFavourite(int $id, string $title): void {
        $isFavourite = DB::table($title)->where('id', $id)->value('isFavourite');

        DB::table($title)->where('id', $id)->update([
            'isFavourite' => !$isFavourite
        ]);
    }
}