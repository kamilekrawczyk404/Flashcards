<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\FlashcardSets;
use App\Models\SetsSearchIndex;
use App\Models\SetsSearchTerm;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     */
    public function run(): void
    {
        //TODO: generate also matching scores

        User::factory(1)->create()->each(function ($user) {
            $user->sets()->saveMany(FlashcardSets::factory(2)->create()->each(function($set) {
                SetsSearchTerm::insertNewTitle($set->title);
                SetsSearchIndex::insertNewValuesForSet($set->id, $set->title);
            }));
        });
    }
}