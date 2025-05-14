<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Major;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => fake()->randomElement(['student', 'alumni']),
            'major_id' => Major::inRandomOrder()->first()->id,
            'phone' => fake()->phoneNumber(),
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

    // State for users with connections
    public function withConnections($count = 3)
    {
        return $this->afterCreating(function (User $user) use ($count) {
            // Create accepted connections where user is the requester
            $user->requestedConnections()->attach(
                User::factory($count)->create()->pluck('id'),
                ['status' => 'accepted', 'created_at' => now()]
            );
            
            // Create accepted connections where user is the acceptor
            $user->acceptedConnections()->attach(
                User::factory($count)->create()->pluck('id'),
                ['status' => 'accepted', 'created_at' => now()]
            );
        });
    }

    public function withPendingConnections($count = 3)
    {
        return $this->afterCreating(function (User $user) use ($count) {
            // Create pending connections where user is the requester
            $user->requestedConnections()->attach(
                User::factory($count)->create()->pluck('id'),
                ['status' => 'pending', 'created_at' => now()]
            );
        });
    }

}
