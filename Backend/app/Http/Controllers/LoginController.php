<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
// use Illuminate\Validation\Rules\Password;

class LoginController extends Controller
{
    //
    public function adminLogin(Request $request)
    {
        // Validate the request
        $request->validate([
            // 'email' => 'required|email',
            'id' => 'required|integer',
            'password' => 'required|min:6',
        ]);

        // Attempt to log the admin in
        if (Auth::guard('admin')->attempt($request->only('id', 'password'))) {
            // Redirect to the intended page or dashboard
            
            Log::channel('auth_activity')->info('User Authenticated: ', $request->all());
            $token = $request->user()->createToken('userToken')->plainTextToken;
            return response()->json([
                'message' => 'Login successful!',
                'token' => $token,
                'user' =>$request->user(),
                'role' => $request->user()->role()
            ], 200);
        }

        return response()->json([
            'message' => 'Login Failed',
            'user' => auth()->user(),
        ], 400);
    }


    public function adminLogout(Request $request)
    {
        // Log the user out
        $user = Auth::guard('sanctum')->user();
        $user->tokens()->delete();
        return response()->json([
            'message' => 'Logged out'
        ], 200);
    }




    // Please note that the below code is for the user (Student and Alumni) related login and logout
    public function userLogin(Request $request)
    {
        // Validate the request
        $request->validate([
            // 'email' => 'required|email',
            'id' => 'required|integer',
            'password' => 'required|min:6',
        ]);

        // Attempt to log the user in
        if (Auth::guard('user')->attempt($request->only('id', 'password'))) {
            // Redirect to the intended page or dashboard
            $user = Auth::guard('user')->user();
            User::where('id', $user->id)->update(['first_login' => false]);
            $token = $user->createToken('userToken')->plainTextToken;
            return response()->json([
                'token' => $token,
                'message' => 'Login successful!',
                'user' => $user->makeHidden(['password', 'remember_token', 'major']),
                'role' => $user->role,
            ], 200);
        }

        return response()->json([
            'message' => 'Login Failed',
            'user' => auth()->user(),
        ], 400);
    }

    // log the user out
    public function userLogout(Request $request)
    {
        // Log the user out
        $user = Auth::guard('sanctum')->user();
        $user->tokens()->delete();
        return response()->json([
            'message' => 'Logged out'
        ], 200);
    }

    // Validate the user and change the password
    public function changePassword(Request $request)
    {
        // Validate the request
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8',
            'confirm_password' => 'required|same:new_password',
        ]);

        // Check if the current password is correct
        if (!Hash::check($request->current_password, Auth::guard('sanctum')->user()->password)) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 400);
        }

        // Update the password
        Auth::guard('sanctum')->user()->update(['password' => Hash::make($request->new_password)]);

        return response()->json([
            'message' => 'Password changed successfully'
        ], 200);
    }

    // Validate user and send password reset link if user is valid
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
        Mail::to($user->email)->send(new PasswordReset($token, $user));

        return response()->json([
            'message' => 'Password reset email sent'
        ], 200);
    }

    // Validate the token and reset the password
    public function userResetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
            'password_confirmation' => 'required|same:password',
        ]);
        // Find the user by email
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
        // Check if the token is valid
        if (Password::tokenExists($user, $request->token)) {
            // Update the password
            $user->password = bcrypt($request->password);
            $user->save();
            // Delete the token
            Auth::guard('user')->attempt(['id' => $user->id, 'password' => $request->password]);
            // Log the user in
            $token = $user->createToken('userToken')->plainTextToken;
            Log::channel('auth_activity')->info('User Password Reset: ', ['user_id' => $user->id]);
            Password::deleteToken($user);
            return response()->json([
                'token' => $token,
                'user' => $user->makeHidden(['password', 'remember_token', 'major']),
                'message' => 'Password reset successfully'
            ], 200);
        }
        else {
            return response()->json([
                'message' => 'Invalid Request'
            ], 400);
        }
        
    }
}
