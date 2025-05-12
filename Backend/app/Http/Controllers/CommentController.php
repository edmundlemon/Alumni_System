<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
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
    public function create(Request $request)
    {
        //
        $request->validate([
            'discussion_id' => 'required|integer',
            'comment_content' => 'required|string|max:255',
        ]);
        $user = Auth::guard('sanctum')->user();
        $comment = new Comment();
        $comment->user_id = $user->id;
        $comment->discussion_id = $request->discussion_id;
        $comment->comment_content = $request->comment_content;
        $comment->save();
        return response()->json([
            'message' => 'Comment created successfully',
            'comment' => $comment,
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
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        //
    }
}
