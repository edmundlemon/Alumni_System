<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Connection>
 */
class ConnectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            
            'requesting_user_id' => \App\Models\User::factory(),
            'accepting_user_id' => \App\Models\User::factory(),
            'status' => $this->faker->randomElement(['pending', 'accepted', 'rejected']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
