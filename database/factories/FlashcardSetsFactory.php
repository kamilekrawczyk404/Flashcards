<?php

namespace Database\Factories;

use App\Models\Translations;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FlashcardSets>
 */
class FlashcardSetsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {
        $randomLanguages = fake()->randomElements(Translations::$languages, 2);
        $title = implode("_", fake()->unique()->words());

        Schema::connection('mysql')->create($title, function (Blueprint $table) {
            $table->id();
            $table->json('term');
            $table->json('definition');
            $table->boolean('isHard');
            $table->boolean('isFavourite');
        });

        for ($i = 0; $i < random_int(4,20); $i++) {
            $term = Translations::randomWord($randomLanguages[0]);
            $definition = Translations::getTranslation(Translations::getLanguageShortcut($randomLanguages[1], true), $term);

            $term = Translations::makeSingle($term, Translations::getLanguageShortcut
            ($randomLanguages[0]));
            $definition = Translations::makeSingle($definition, Translations::getLanguageShortcut
            ($randomLanguages[1]));

            DB::table($title)->insert([
                'term' => $term,
                'definition' => $definition,
                'isHard' => false,
                'isFavourite' => rand(0, 1),
            ]);
        }

        return [
            'title' => $title,
            'description' => fake()->realText(),
            'languages' => json_encode([
                'source' => $randomLanguages[0],
                'target' => $randomLanguages[1],
            ])
        ];
    }
}