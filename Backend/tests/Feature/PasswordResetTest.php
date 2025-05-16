<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PasswordResetTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_user_can_request_password_reset_link(){
        $response = $this->postJson('/api/forgot_password', [
            'email' => 'test@example.com',
        ]);
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password reset email sent',
            ]);
    }

    public function test_user_can_reset_password(){
        $newPassword = 'newpassword123';
        $user = User::where('email', 'test@example.com')->first();

        $token = Password::createToken($user);
        $response = $this->postJson('/api/reset_password', [
            'email' => 'test@example.com',
            'token' => $token,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);
        $response->assertStatus(200);
        //     ->assertJson([
        //         'message' => 'Password reset successfully.',
        // ]);  
    }

    public function test_new_user_with_new_password_can_login(){
        $response = $this->postJson('/api/user_login', [
            'id' => 1221,
            'password' => 'newpassword123',
        ]);
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Login successful!',
            ]);
        }
}
