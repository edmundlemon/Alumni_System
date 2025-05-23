<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Donation>
 */
class DonationFactory extends Factory
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
            'donation_post_id' => \App\Models\DonationPost::inRandomOrder()->value('id'),
            'user_id' => \App\Models\User::inRandomOrder()->value('id'),
            'donated_amount' => $this->faker->randomFloat(2, 10, 1000),
        ];
    }
}
