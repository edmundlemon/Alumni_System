<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
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
            'event_title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'location' => $this->faker->city(),
            'event_mode' => $this->faker->randomElement(['physical', 'virtual']),
            'event_date' => $this->faker->dateTimeBetween('now', '+1 year')->format('Y-m-d'),
            'event_time' => $this->faker->time(),
            'max_participant' => $this->faker->numberBetween(10, 100),
            'registration_close_date' => $this->faker->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'status' => 'upcoming',
            'user_id' => \App\Models\User::where('role', 'alumni')->inRandomOrder()->value('id'),
        ];
    }
}
