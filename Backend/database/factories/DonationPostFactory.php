<?php

namespace Database\Factories;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DonationPost>
 */
class DonationPostFactory extends Factory
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
            'admin_id' => Admin::inRandomOrder()->first()->id,
            'donation_title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(3),
            'target_amount' => $this->faker->randomFloat(2, 1000, 100000),
            'end_date' => $this->faker->dateTimeBetween('now', '+1 year'),
            'status' => $this->faker->randomElement(['ongoing', 'completed', 'cancelled']),
        ];
    }
}
