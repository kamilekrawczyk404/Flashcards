<?php

namespace Tests\Feature\Flashcards;

use App\Models\FlashcardSets;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AllSetsTest extends TestCase
{
    public function test_sets_rendered(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/sets');

        $response->assertOk();
    }

    public function test_user_can_render_each_set() {
        $user = User::factory()->create();
        $sets =
            FlashcardSets::factory(2)->create(['user_id' => $user->id]);

        $responses = [];
        foreach ($sets as $set) {
            $responses[] = $this->actingAs($user)->get('/set/' . $set->id .  '/' . $set->title);
        }

        $this->assertTrue(count(array_filter($responses, fn ($response) => $response->assertOk())) === count($responses));
    }
}