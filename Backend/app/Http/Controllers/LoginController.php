<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class LoginController extends Controller
{
    //
    public function login(Request $request)
    {
        // Validate the request
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        // Attempt to log the user in
        if (Auth::guard('admin')->attempt($request->only('email', 'password'))) {
            // Redirect to the intended page or dashboard
            
            Log::channel('auth_activity')->info('User Authenticated: ', $request->all());
                $token = $request->user()->createToken('userToken')->plainTextToken;
                return response()->json([
                    'message' => 'Success!',
                    'token' => $token,
                    'user' => $request->user(),
                    // 'role' => $request->user()->role()
                ], 200);

                $token = $request->user()->createToken('userToken')->plainTextToken;
                return response()->json([
                    'message' => 'Success!',
                    'token' => $token,
                    'user' => $request->user(),
                    // 'role' => $request->user()->role()
                ], 200);
            }

            return response()->json([
                'message' => 'Login Failed',
                'user' => auth()->user(),
            ], 400);
        }


    public function logout(Request $request)
    {
        // Log the user out
        $user = Auth::guard('sanctum')->user();
        // Log::channel('api_post_log')->error('User Logged Out: ', ['user' => $user]);
        $user->tokens()->delete();
        return response()->json([
            'message' => 'Logged out'
        ], 200);
    }

    public function userForgotPassword(Request $request)
    {
        // Validate the request
        $request->validate([
            'email' => 'required|email',
        ]);

        // Find the user by email
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Generate a password reset token
        $token = Password::createToken($user);

        // Send the password reset email
        Mail::to($user->email)->send(new PasswordReset($token));

        return response()->json([
            'message' => 'Password reset email sent'
        ], 200);
    }
}
