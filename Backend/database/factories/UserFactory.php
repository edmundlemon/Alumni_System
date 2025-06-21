<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Event;
use App\Models\Major;
use App\Models\Comment;
use App\Models\Discussion;
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

    public function withExistingConnections($count = 3){

        return $this->afterCreating(function (User $user) use ($count) {
            // Get random existing users (excluding the current user)
            $existingUsers = User::where('id', '!=', $user->id)->inRandomOrder()->limit($count)->get();

            // Attach as accepted connections (requester)
            $user->requestedConnections()->attach(
                $existingUsers->pluck('id'),
                ['status' => 'accepted', 'created_at' => now()]
            );

            // Attach as accepted connections (acceptor)
            $user->acceptedConnections()->attach(
                $existingUsers->pluck('id'),
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

    public function withDiscussions($count = 3)
    {
        return $this->afterCreating(function (User $user) use ($count) {
            // Create discussions for the user
            $user->discussions()->saveMany(
                Discussion::factory($count)->withComments(5)->create(['user_id' => $user->id])
            );
        });
    }

    public function withComments($count = 3)
    {
        return $this->afterCreating(function (User $user) use ($count) {
            // Create comments for the user
            $user->comments()->saveMany(
                Comment::factory($count)->create(['user_id' => $user->id])
            );
        });
    }

    public function withEvents($count = 3)
    {
        return $this->afterCreating(function (User $user) use ($count) {
            // Create future events for the user (within next 3 months)
            $futureEvents = Event::factory($count)->create([
            'user_id' => $user->id,
            'event_date' => fake()->dateTimeBetween('now', '+3 months'),
            ]);
            $user->joinedEvents()->saveMany($futureEvents);

            // Create past events for the user (within previous 3 months)
            // $pastEvents = Event::factory($count)->create([
            // 'user_id' => $user->id,
            // 'event_date' => fake()->dateTimeBetween('-3 months', 'now'),
            // ]);
            // $user->joinedEvents()->saveMany($pastEvents);
        });
    }

}
