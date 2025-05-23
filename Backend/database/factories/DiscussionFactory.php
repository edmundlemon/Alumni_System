<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Discussion>
 */
class DiscussionFactory extends Factory
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
            'user_id' => User::inRandomOrder()->value('id'),
            'subject' => $this->faker->sentence(),
            'content' => $this->faker->paragraph(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function withComments($count = 3)
    {
        return $this->afterCreating(function ($discussion) use ($count) {
            \App\Models\Comment::factory($count)->create([
                'discussion_id' => $discussion->id,
                'user_id' => User::inRandomOrder()->first()->id,
            ]);
        });
    }
}
