<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Admin;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DonationPostTest extends TestCase
{
    /**
     * A basic feature test example.
     */

     public function setUp(): void
     {
         parent::setUp();
         $this->user = User::find(1221);
        //  Sanctum::actingAs($this->user, ['*']);
        $this->admin = Admin::find(1001);
     }
    public $user;
    public $admin;
    public $donationPost;
    public $donationPostId;

    public function test_view_all_donation_psts(): void
    {
        Sanctum::actingAs($this->user, ['*']);
        $response = $this->getJson('/api/view_all_donation_posts');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'donation_posts' =>[
                    '*' => [
                        'id',
                        'admin_id',
                        'donation_title',
                        'description',
                        'target_amount',
                        'end_date',
                        'status',
                        'current_amount',
                        // 'created_at',
                        // 'updated_at',
                        ],
                ] 
            ]);

            Sanctum::actingAs($this->admin, ['*']);
        $response = $this->getJson('/api/view_all_donation_posts');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'donation_posts' =>[
                    '*' => [
                        'id',
                        'admin_id',
                        'donation_title',
                        'description',
                        'target_amount',
                        'end_date',
                        'status',
                        'current_amount',
                        // 'created_at',
                        // 'updated_at',
                    ],
                ] 
            ]);
    }

    public function test_create_donation_post(): void
    {
        Sanctum::actingAs($this->admin, ['*']);
        $response = $this->postJson('/api/create_donation_post', [
            'donation_title' => 'Test Donation Post',
            'description' => 'This is a test donation post',
            'target_amount' => 1000,
            'end_date' => now()->addDays(30)->format('Y-m-d'),
        ]);
        $response->assertStatus(201)
            ->assertJsonStructure([
                // 'message',
                'donation_post' => [
                    'id',
                    'admin_id',
                    'donation_title',
                    'description',
                    'target_amount',
                    'end_date',
                    'status',
                    // 'created_at',
                    // 'updated_at',
                ],
            ]);
    }
    public function test_create_donation_post_with_existing_title(): void
    {
        Sanctum::actingAs($this->admin, ['*']);
        $response = $this->postJson('/api/create_donation_post', [
            'donation_title' => 'Test Donation Post',
            'description' => 'This is a test donation post',
            'target_amount' => 1000,
            'end_date' => now()->addDays(30)->format('Y-m-d'),
        ]);
        $response->assertStatus(409)
            ->assertJson([
                'message' => 'Donation post with this title already exists',
            ]);
    }
    public function test_view_donation_post_by_id(): void
    {
        Sanctum::actingAs($this->user, ['*']);
        $response = $this->getJson('/api/view_donations_by_donation_post/1');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'donation_post' => [
                    'id',
                    'admin_id',
                    'donation_title',
                    'description',
                    'target_amount',
                    'end_date',
                    'status',
                    // 'created_at',
                    // 'updated_at',
                ],
            ]);
    }
    public function test_update_donation_post(): void
    {
        Sanctum::actingAs($this->admin, ['*']);
        $response = $this->putJson('/api/edit_donation_post/1', [
            'donation_title' => 'Updated Donation Post',
            'description' => 'This is an updated test donation post',
            'target_amount' => 2000,
            'end_date' => now()->addDays(30)->format('Y-m-d'),
        ]);
        $response->assertStatus(200)
            ->assertJsonStructure([
                'donation_post' => [
                    'id',
                    'admin_id',
                    'donation_title',
                    'description',
                    'target_amount',
                    'end_date',
                    'status',
                    // 'created_at',
                    // 'updated_at',
                ],
            ]);
    }
    public function test_update_donation_post_with_invalid_id(): void
    {
        Sanctum::actingAs($this->admin, ['*']);
        $response = $this->putJson('/api/update_donation_post/999', [
            'donation_title' => 'Updated Donation Post',
            'description' => 'This is an updated test donation post',
            'target_amount' => 2000,
            'end_date' => '2024-01-31',
        ]);
        $response->assertStatus(404);
            // ->assertJson([
            //     'message' => 'Donation post not found',
            // ]);
    }
    public function test_delete_donation_post(): void
    {
        Sanctum::actingAs($this->admin, ['*']);
        $response = $this->deleteJson('/api/cancel_donation_post/1');
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Donation post cancelled successfully',
            ]);
    }
    public function test_delete_donation_post_with_invalid_id(): void
    {
        Sanctum::actingAs($this->admin, ['*']);
        $response = $this->deleteJson('/api/cancel_donation_post/999');
        $response->assertStatus(404);
            // ->assertJson([
            //     'message' => 'Donation post not found',
            // ]);
    }
}
