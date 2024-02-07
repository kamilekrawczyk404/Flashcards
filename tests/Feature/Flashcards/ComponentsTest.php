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

        $response = $this->actingAs($user)->get('/set/' . $set->id . '/' . $set->title . '/learn');

        $response->assertOk();
    }

    public function test_test_rendered(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/set/' . $set->id . '/' . $set->title . '/test');

        $response->assertOk();
    }

    public function test_match_rendered(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/set/' . $set->id . '/' . $set->title . '/match');

        $response->assertOk();
    }

    public function test_is_match_score_inserted(): void {
        $user = User::factory()->create();
        $set = FlashcardSets::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->post('/store_new_match_time/' . $set->id, [
            'score' => rand(10,100)
        ]);

        $response->assertOk();
    }
}