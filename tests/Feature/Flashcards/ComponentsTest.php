<?php

namespace Tests\Feature\Flashcards;

use App\Models\FlashcardSets;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ComponentsTest extends TestCase
{
    public function test_learn_rendered(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('flashcards.learn', [
            'id' => $set->id,
            'title' => $set->title
        ]));

        $response->assertOk();
    }

    public function test_test_rendered(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('flashcards.test', [
            'id' => $set->id,
            'title' => $set->title
        ]));

        $response->assertOk();
    }

    public function test_match_rendered(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('flashcards.match', [
            'id' => $set->id,
            'title' => $set->title
        ]));

        $response->assertOk();
    }

    public function test_is_match_score_inserted(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->post(route('flashcards.match.store', [
            'id' => $set->id
        ]), [
            'score' => rand(10,100)
        ]);

        $response->assertOk();
    }
}