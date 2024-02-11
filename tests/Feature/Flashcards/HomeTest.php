<?php

namespace Tests\Feature\Flashcards;

use App\Models\FlashcardSets;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class HomeTest extends TestCase
{
//    public function test_home_as_user_rendered(): void
//    {
//        $user = User::factory()->create();
//
//        $response = $this
//            ->actingAs($user)
//            ->get('/');
//
//        $response->assertOk();
//    }
//    public function test_home_as_guest_rendered(): void
//    {
//        $response = $this
//            ->get('/');
//
//        $response->assertOk();
//    }
//
//    public function test_user_can_render_each_set() {
//        $user = User::factory()->create();
//        $sets =
//            FlashcardSets::factory(1)->create(['user_id' => $user->id]);
//
//        $responses = [];
//        foreach ($sets as $set) {
//            $responses[] = $this->actingAs($user)->get('/set/' . $set->id .  '/' . $set->title);
//        }
//
//        $this->assertTrue(count(array_filter($responses, fn ($response) => $response->assertOk())) === count($responses));
//    }

    public function test_user_can_search_tests() {
        $user = User::factory()->create();
        $sets =
            FlashcardSets::factory(1)->create(['user_id' => $user->id]);

        $response = $this
            ->actingAs($user)
            ->get('/search-in-sets', [
                'params' => [
                    'currentPage' => 0,
                    'searching' => fake()->randomElement($sets)->title
                ]
        ]);

        $response->assertOk();
    }

}