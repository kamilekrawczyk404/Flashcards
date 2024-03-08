<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\FlashcardSets;
use App\Models\FlashcardsSetsProgress;
use App\Models\MatchScores;
use App\Models\SetsSearchIndex;
use App\Models\SetsSearchTerm;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     */
    public function run(): void
    {
        User::factory(1)->create()->each(function ($user) {
            $user->sets()->saveMany(FlashcardSets::factory(5)->create());
//                ->each(function($set) {
//                SetsSearchTerm::insertNewTitle($set->title);
//                SetsSearchIndex::insertNewValuesForSet($set->id, $set->title);
//            }));
            $userSets = FlashcardSets::getUserSets($user->id);
            foreach ($userSets as  $set) {
                FlashcardsSetsProgress::insertNewValues($user->id, $set['id']);
                MatchScores::create([
                    'user_id' => $user->id,
                    'set_id' => FlashcardSets::inRandomOrder()->first()->value('id'),
                    'matching_time' => fake()->randomFloat(2, 5, 20)
                ]);
            }
        });
    }
}