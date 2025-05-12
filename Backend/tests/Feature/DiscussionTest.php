<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class DiscussionTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    // public function test_example(): void
    // {
    //     $response = $this->get('/');

    //     $response->assertStatus(200);
    // }
    public $token;
    public function test_view_all_discussions()
    {
        $token = $this->post('/api/login', [
            'id' => 1221,
            'password' => 'password',
        ]);
        $response = $this->get('/api/discussions');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'discussions' => [
                    '*' => [
                        'id',
                        'user_id',
                        'discussion_content',
                        'created_at',
                        'updated_at',
                    ],
                ],
            ]);
    }
}
