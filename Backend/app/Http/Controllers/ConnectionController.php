<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConnectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, User $acceptingUser)
    
    {
        //
        $user = Auth::guard('sanctum')->user();
        if($acceptingUser->id === $user->id) {
            return response()->json([
                'error' => 'You cannot send a connection request to yourself',
            ], 400);
        }
        if ($user->isConnected($acceptingUser)) {
            return response()->json([
                'error' => 'You are already connected with this user',
            ], 400);
        }
        // if ($user->hasPendingRequest($acceptingUser)) {
        //     return response()->json([
        //         'error' => 'You have already sent a connection request to this user',
        //     ], 400);
        // }
        if (!$user)
        {
            return response()->json([
                'error' => 'User not found',
            ], 404);
        }
        $connection = new Connection();
        $connection->requesting_user_id = $user->id;
        $connection->accepting_user_id = $acceptingUser->id;
        $connection->status = 'pending';
        $connection->save();
        return response()->json([
            'message' => 'Connection request sent successfully',
            'connection' => $connection,
        ], 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Connection $connection)
    {
        //
    }

    public function viewConnectedUsers()
    {
        // Fetch connected users
        $user = Auth::guard('sanctum')->user();
        $connectedUsers = $user->connectedUsers();
        return response()->json([
            'connected_users' => $connectedUsers,
        ],200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Connection $connection, Request $request)
    {
        //
        // Check if the user is authorized to accept/reject the connection
        // Assuming you have a way to get the authenticated user
        // and the connection belongs to that user
        //
        $user = Auth::guard('sanctum')->user();
        if ($connection->accepting_user_id !== $user->id) {
            return response()->json([
                'error' => 'You are not authorized to perform this action',
            ], 403);
        }
        return response()->json($connection);

        $request->validate([
            'status' => 'required|string|in:accepted,rejected',
        ]);
        $connection->status = $request->status;
        $connection->save();
        return response()->json([
            'message' => 'Connection status updated successfully',
            'connection' => $connection,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Connection $connection)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Connection $connection)
    {
        //
    }
}
