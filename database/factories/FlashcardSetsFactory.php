<?php

namespace Database\Factories;

use App\Models\FlashcardSets;
use App\Models\FlashcardsSetsProgress;
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
            $table->string('group_name');
            $table->string('term');
            $table->string('term_phonetic');
            $table->string('term_audio');
            $table->string('term_language');
            $table->string('definition');
            $table->string('definition_phonetic');
            $table->string('definition_audio');
            $table->string('definition_language');
        });

        for ($groupCount = 0; $groupCount < 1; $groupCount++) {

            $group_name = fake()->unique()->words(1);
            for ($i = 0; $i < random_int(4,20); $i++) {

                // Store translation in main table

                $randomTerm = Translations::randomWord($randomLanguages[0]);
                $randomDefinition = Translations::getTranslation(Translations::getLanguageShortcut($randomLanguages[1], true), $randomTerm);

                $term = Translations::makeSingle($randomTerm, Translations::getLanguageShortcut
                ($randomLanguages[0]));
                $definition = Translations::makeSingle($randomDefinition, Translations::getLanguageShortcut
                ($randomLanguages[1]));

                DB::table($title)->insert([
                    'group_name' => reset($group_name),
                    'term' => $term['word'],
                    'term_phonetic' => $term['phonetic'] ?? "",
                    'term_audio' => $term['audioPath'] ?? "",
                    'term_language' => $term['language'],
                    'definition' => $definition['word'],
                    'definition_phonetic' => $definition['phonetic'] ?? "",
                    'definition_audio' => $definition['audioPath'] ?? "",
                    'definition_language' => $definition['language'],
                ]);
            }
        }

        return [
            'title' => $title,
            'description' => fake()->realText(),
            'source_language' => $randomLanguages[0],
            'target_language' =>  $randomLanguages[1]
        ];
    }
}