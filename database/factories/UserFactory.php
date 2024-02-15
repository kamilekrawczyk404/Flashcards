<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
//        $userName = fake()->name();
        $userName = "user";
        $userEmail = "user@gmail.com";

        return [
            'name' => $userName,
//            'email' => fake()->unique()->safeEmail(),
            'email' => $userEmail,
            'email_verified_at' => now(),
            'password' => 'qwerty',
            'avatar' => 'default.png',
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}