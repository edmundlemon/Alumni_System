<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Admin;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DiscussionTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    // use RefreshDatabase;

    public $user;
    public $admin;
    public $discussion;

    public function test_user_can_view_all_discussions()
    {
        $this->user = User::find(1221);
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->getJson('/api/discussions');
        // dd($response->json());
        $response->assertStatus(200)
            ->assertJsonStructure([
                'discussions' =>[
                    'data' => [
                        '*' => [
                            'id',
                            'user_id',
                            'subject',
                            'content',
                            // 'created_at',
                            // 'updated_at',
                            'comments'
                        ],
                    ],
                ] 
            ]);
    }

    public function test_user_can_view_connected_users_discussions()
    {
        $this->user = User::find(1221);
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->getJson('/api/view_connected_users_discussion');
        // dd($response->json());
        $response->assertStatus(200)
            ->assertJsonStructure([
                'discussions' =>[
                    'data' => [
                        '*' => [
                            'id',
                            'user_id',
                            'subject',
                            'content',
                            'created_at',
                            'updated_at',
                            'comments'
                        ],
                    ],
                ] 
            ]);
    }

    public function test_user_can_view_comments()
    {
        $this->user = User::find(1221);
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->getJson('/api/view_comments/1');
        // dd($response->json());
        $response->assertStatus(200)
            ->assertJsonStructure([
                'comments' =>[
                    'data' => [
                        '*' => [
                            'id',
                            'discussion_id',
                            'user_id',
                            'comment_content',
                        ],
                    ],
                ] 
            ]);
    }
    public function test_user_can_view_own_discussions()
    {
        $this->user = User::find(1221);
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->getJson('/api/view_my_own_discussion');
        // dd($response->json());
        $response->assertStatus(200)
            ->assertJsonStructure([
                'discussions' =>[
                    'data' => [
                        '*' => [
                            'id',
                            'user_id',
                            'subject',
                            'content',
                            'comments'
                        ],
                    ],
                ] 
            ]);
    }
    public function test_user_can_create_discussion()
    {
        $this->user = User::find(1221);
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->postJson('/api/create_discussion', [
            'subject' => 'Test Discussion',
            'content' => 'This is a test discussion content.',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Discussion created successfully',
            ]);
    }
    public function test_user_can_edit_discussion()
    {
        $this->user = User::find(1221);
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->putJson('/api/edit_discussion/1', [
            'subject' => 'Updated Discussion',
            'content' => 'This is an updated discussion content.',
        ]);
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Discussion updated successfully',
            ]);
    }
    public function test_non_owner_cannot_edit_discussion()
    {
        $this->user = User::find(1225);
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->putJson('/api/edit_discussion/1', [
            'subject' => 'Updated Discussion',
            'content' => 'This is an updated discussion content.',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'You are not authorized to update this discussion',
            ]);
    }
     public function test_user_can_delete_discussion()
    {
        $this->user = User::find(1221);
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->postJson('/api/create_discussion', [
            'subject' => 'Test Discussion',
            'content' => 'This is a test discussion content.',
        ]);

        $responseData = $response->json();
        $discussionId = $responseData['discussion']['id'];
        $response = $this->deleteJson('/api/delete_discussion/' . $discussionId);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Discussion deleted successfully',
            ]);
    }
    public function test_admin_can_delete_discussion()
    {
        $this->user = User::find(1221);
        Sanctum::actingAs($this->user, ['*']);
        $response = $this->postJson('/api/create_discussion', [
            'subject' => 'Test Discussion',
            'content' => 'This is a test discussion content.',
        ]);

        $responseData = $response->json();
        $discussionId = $responseData['discussion']['id'];
        $this->admin = Admin::find(1001);
        Sanctum::actingAs($this->admin, ['*']);
        $response = $this->deleteJson('/api/delete_discussion/' . $discussionId);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Discussion deleted successfully',
            ]);
    }
}
