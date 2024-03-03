<?php

namespace Tests\Feature\Flashcards;

use App\Http\Controllers\Flashcards\TranslationsController;
use App\Models\FlashcardSets;
use App\Models\Translations;
use App\Models\User;
use Database\Factories\Words;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class TranslationsTest extends TestCase
{
    public function test_update_hard_translations(): void
    {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);
        $answers = [];
        $translations = DB::connection('mysql')->table($set->title)->get();

        foreach ($translations as $translation) {
            $term = json_decode($translation->term);
            $definition = json_decode($translation->definition);

            $answers[] = [
                'id' => $translation->id,
                'term' => ['word' => $term->word],
                'definition' => ['word' => $definition->word],
            ];
        }

        $response = $this
            ->actingAs($user)
            ->put(route('flashcards.updateHardTranslations', [
                'title' => $set->title
            ]), [
                'incorrect' => [
                    'translations' => $answers
                ]
            ]);

        $response->assertOk();
    }

    public function test_user_can_update_single_translation() {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);
        $translation = DB::connection('mysql')->table($set->title)->first();

        $newTranslation = [
            'term' => [
                'word' => TranslationsController::randomWord('English'),
                'language' => TranslationsController::getLanguageShortcut('English')
            ],
            'definition' => [
                'word' => TranslationsController::randomWord('Polish'),
                'language' => TranslationsController::getLanguageShortcut('Polish')
            ]
        ];

        $response = $this
            ->actingAs($user)
            ->put(route('flashcards.updateTranslation', [
                'id' => $set->id,
                'translation_id' => $translation->id,
                'title' => $set->title
        ]),
            ['translation' => $newTranslation]
        );

        $response
            ->assertRedirectToRoute('flashcards.showSet', [
                'id' => $set->id,
                'title' => $set->title
            ])
            ->assertSessionHas('success');
    }

    public function test_user_can_delete_single_translation(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);
        $translation = DB::connection('mysql')->table($set->title)->first();


        $response = $this
            ->actingAs($user)
            ->delete(route('flashcards.deleteTranslation', [
                'id' => $set->id,
                'translation_id' => $translation->id,
                'title' => $set->title
            ])
        );

        $response->assertOk();
    }
}