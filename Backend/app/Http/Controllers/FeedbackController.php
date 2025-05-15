<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Feedback;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to view feedback',
            ], 403);
        }
        $feedbacks = Feedback::where('user_id', $user->id)->with('event')->latest()->get();
        return response()->json([
            'status' => true,
            'message' => 'Feedback fetched successfully',
            'feedbacks' => $feedbacks,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, Event $event)
    {
        //
        $request->validate([
            'feedback_remarks' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);
        $user = Auth::guard('sanctum')->user();
        $registration = Registration::where('user_id', $user->id)->where('event_id', $event->id)->first();
        if (!$user || !$registration) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to create feedback for this event',
            ], 403);
        }
        $feedback = Feedback::create([
            'user_id' => $user->id,
            'event_id' => $event->id,
            'feedback_remarks' => $request->input('feedback_remarks'),
            'rating' => $request->input('rating'),
        ]);
        return response()->json([
            'status' => true,
            'message' => 'Feedback created successfully',
            'feedback' => $feedback,
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
    public function show(Feedback $feedback)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Feedback $feedback)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Feedback $feedback)
    {
        //
        $request->validate([
            'feedback_remarks' => 'sometimes|string',
            'rating' => 'sometimes|integer|min:1|max:5',
        ]);
        $user = Auth::guard('sanctum')->user();
        if (!$user || $user->id !== $feedback->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to update this feedback',
            ], 403);
        }
        $feedback->update([
            'feedback_remarks' => $request->input('feedback_remarks'),
            'rating' => $request->input('rating'),
        ]);
        return response()->json([
            'status' => true,
            'message' => 'Feedback updated successfully',
            'feedback' => $feedback,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Feedback $feedback)
    {
        //
        $user = Auth::guard('sanctum')->user();
        if (!$user || $user->id !== $feedback->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to delete this feedback',
            ], 403);
        }
        $feedback->delete();
        return response()->json([
            'status' => true,
            'message' => 'Feedback deleted successfully',
        ], 200);
    }
}
