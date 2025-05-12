<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    //
    public function index()
    {
        // Fetch all users
        $users = User::all();
        return response()->json($users);
    }
    public function show($id)
    {
        // Fetch a single user by ID
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }
    public function update(Request $request, $id)
    {
        // Update user details
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->update($request->all());
        return response()->json($user);
    }
    public function destroy($id)
    {
        // Delete a user
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
    public function viewAllStudents()
    {
        // Fetch all students
        $students = User::where('role', 'student')->get();
        return response()->json($students);
    }
    public function viewAllAlumni()
    {
        // Fetch all alumni
        $alumni = User::where('role', 'alumni')->get();
        return response()->json($alumni);
    }

    public function viewConnectedUsers()
    {
        $user = Auth::guard('sanctum')->user();
        // Fetch all connections
        $acceptedConnections = $user->acceptedConnections;
        $requestedConnections = $user->requestedConnections;
        $connectedUsers = $acceptedConnections->merge($requestedConnections);

        return response()->json([
            'connected_users' => $connectedUsers,
        ], 200);
    }
}
