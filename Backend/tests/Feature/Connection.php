<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;

class Connection extends TestCase
{
    /**
     * A basic feature test example.
     */
    use WithFaker, RefreshDatabase;
    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        // Refresh the database and run the DatabaseSeeder after all tests
        Artisan::call('migrate:fresh');
        Artisan::call('db:seed');
    }
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
    public function test_create_connection(): void
    {
        $user = User::factory()->create([
            'id' => 1221,
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'password' => bcrypt('password'),
        ]);
        $user2 = User::factory()->create([
            'id' => 1260,
            'name' => 'Test User2',
            'email' => 'test2@gmail.com',
            'password' => bcrypt('password'),
        ]);
        $user = User::find(1221);
        Sanctum::actingAs($user, ['*']);
        $response = $this->post('/api/connect/1260');
        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'pending',
        ]);
    }
    public function test_accept_connection(): void
    {
        // Assuming the connection created in test_create_connection() has ID 1 for demonstration.
        // In real tests, you should retrieve the actual ID from the response or database.
        $this->test_create_connection();
        $connectionId = \DB::table('connections')
            ->where('requesting_user_id', 1221)
            ->where('accepting_user_id', 1260)
            ->orderByDesc('id')
            ->value('id');
        $user = User::find(1260);
        Sanctum::actingAs($user, ['*']);
        $response = $this->post('/api/update_connection/' . $connectionId, [
            'status' => 'accepted',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'accepted',
        ]);
    }
}
