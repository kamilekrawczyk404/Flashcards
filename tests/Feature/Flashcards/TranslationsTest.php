<?php

namespace Tests\Feature\Flashcards;

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
    public function test_are_hard_translations_updated(): void
    {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);
        $answers = [];

        foreach(DB::connection('mysql')->table($set->title)->get() as $translation) {
            $term = json_decode($translation->term);
            $definition = json_decode($translation->definition);

            $answers[] = [
                'index' => $translation->id,
                'term' => ['word' => $term->word ?? $term->{0}->word],
                'definition' => ['word' => $definition->word ?? $definition->{0}->word],
            ];
        }
        $response = $this->actingAs($user)->put('/set/' . $set->title . '/updateHardTranslations', [
            'incorrect' => ['translations' => $answers]
        ]);

        $response->assertOk();
    }

    public function test_user_can_update_single_translation() {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        $translation = DB::connection('mysql')->table($set->title)->first();

        $updated = [
            'term' => [
                'word' => Translations::randomWord('English'),
                'language' => 'en'
            ],
            'definition' => [
                'word' => Translations::randomWord('Polish'),
                'language' => 'pl'
            ]
        ];

        $response = $this->actingAs($user)->put('/set/update-translation/' . $translation->id . '/' . $set->title, ['translation' => ['0' => $updated]]);

        $response->assertOk();
    }

    public function test_user_can_delete_single_translation(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete('/delete/translation/1/' . $set->title);

        $response->assertOk();
    }
}