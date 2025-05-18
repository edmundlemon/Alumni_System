<?php

namespace App\Http\Controllers;

use App\Models\Discussion;
use Dom\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DiscussionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        // Fetch all discussions
        $discussions = Discussion::latest()->with('comments')->paginate(10);


        return response()->json([
            'discussions' => $discussions,
        ], 200);
    }

    public function viewConnectedUsersDiscussion()
    {
        // Fetch discussions for connected users
        $user = Auth::guard('sanctum')->user();
        // To find out the connected users
        $acceptedConnections = $user->acceptedConnections
        ->makeHidden(['pivot', 'major']);
        $requestedConnections = $user->requestedConnections
        ->makeHidden(['pivot', 'major']);
        $connectedUsers = $acceptedConnections->merge($requestedConnections)->pluck('id');
        // Fetch discussions for connected users
        $discussions = Discussion::whereIn('user_id', $connectedUsers)->with('comments')->latest()->paginate(10);
        return response()->json([
            'discussions' => $discussions,
        ], 200);
    }

    public function viewMyOwnDiscussion()
    {
        // Fetch discussions for connected users
        $user = Auth::guard('sanctum')->user();
        // To find out the connected users
        $discussions = Discussion::where('user_id', $user->id)->with('comments')->latest()->paginate(10);
        return response()->json([
            'discussions' => $discussions,
        ], 200);
    }

    public function viewComments(Discussion $discussion)
    {
        // Fetch comments for a specific discussion
        $comments = $discussion->comments()->latest()->paginate(10);
        return response()->json([
            'comments' => $comments,
        ], 200);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
        $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $discussion = Discussion::create([
            'user_id' => Auth::guard('sanctum')->user()->id,
            'subject' => $request->subject,
            'content' => $request->content,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Discussion created successfully',
            'discussion' => $discussion,
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
    public function show(Discussion $discussion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Discussion $discussion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Discussion $discussion)
    {
        //
        $request->validate([
            'subject' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
        ]);
        $user = Auth::guard('sanctum')->user();
        if ($user->id !== $discussion->user_id) {
            return response()->json([
                'message' => 'You are not authorized to update this discussion',
            ], 403);
        }
        $discussion->update([
            'subject' => $request->subject,
            'content' => $request->content,
        ]);
        return response()->json([
            'message' => 'Discussion updated successfully',
            'discussion' => $discussion,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Discussion $discussion)
    {
        //
        $user = Auth::guard('sanctum')->user();
        if ($user->id !== $discussion->user_id && !$user->hasRole('admin')) {
            return response()->json([
                'message' => 'You are not authorized to delete this discussion',
            ], 403);
        }
        
        $discussion->delete();

        return response()->json([
            'message' => 'Discussion deleted successfully',
        ], 200);
    }
}
