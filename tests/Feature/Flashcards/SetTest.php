<?php

namespace Tests\Feature\Flashcards;

use App\Models\FlashcardSets;
use App\Models\Translations;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SetTest extends TestCase
{

    public function test_user_can_get_set(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        if($set) {
            $this->assertTrue(true);
        } else {
            $this->assertFalse(false);
        }
    }

    public function test_edit_set_rendered(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('flashcards.showEdit', [
            'id' => $set->id,
            'title' => $set->title
        ]));

        $response->assertOk();
    }

    public function test_user_can_create_set(): void {
        $user = User::factory()->create();
        $languages = ['English', 'German', 'Spanish', 'Polish'];
        $randomLanguages = fake()->unique()->randomElements($languages, 2);

        $translations = [];

        for($i = 0; $i < rand(2,4); $i++) {
            $term = Translations::randomWord($randomLanguages[0]);
            $definition = Translations::getTranslation(Translations::getLanguageShortcut($randomLanguages[1], true),
                $term);

            $translations[] = ['term' => $term, 'definition' => $definition];
        }

        $title = implode('_', fake()->unique()->words());
        $response = $this->actingAs($user)->post(route('flashcards.storeNewSet', [
            'title' => $title,
            'description' => fake()->realText(),
            'languages' => ['source' => fake()->unique()->randomElement($languages), 'target' => fake()
                ->unique()->randomElement($languages)],
            'translations' => $translations
        ]));

        $response->assertRedirectToRoute('flashcards.showSet', ['id' => DB::table('flashcard_sets')->where('title', $title)->value('id'), 'title' => $title])->assertSessionHas('success');
    }

    public function test_user_can_update_set(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        $languages = FlashcardSets::getLanguages($set->id);

        $translations[] = [
            'term' => [
                'word' => Translations::randomWord($languages->source),
                'language' => Translations::getLanguageShortcut($languages->source)
            ],
            'definition' => [
                'word' => Translations::randomWord($languages->target),
                'language' => Translations::getLanguageShortcut($languages->target)
            ],
            'isNew' => true
        ];

        $response = $this->actingAs($user)->put(route('flashcards.update', [
            'id' => $set->id,
            'title' => $set->title
            ]), [
                'title' => $set->title,
                'description' => fake()->realText(),
                'translations' => $translations,
                'isTitleDirty' => false,
                'isDescriptionDirty' => true,
                'isDataFromDictionary' => [
                    'term' => $languages->source === 'English',
                    'definition' => $languages->target === 'English'
                ],
                'isTranslationDirty' => false
        ]);

        $response->assertRedirectToRoute('flashcards.showSet', ['id' => $set->id, 'title' => $set->title])->assertSessionHas('success');
    }

    public function test_user_can_delete_set(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete(route('flashcards.deleteSet', [
            'id' => $set->id,
            'title' => $set->title
        ]));

        $response->assertRedirectToRoute('home')->assertSessionHas('success');
    }
}