<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::latest()->all();

        return response()->json([
            'status' => true,
            'message' => 'Events fetched successfully',
            'events' => $events,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
        $request->validate([
            'event_title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'event_date' => 'required|date|format:Y-m-d|after:tomorrow',
            'event_time' => 'required|date_format:H:i',
            'max_participant' => 'nullable|integer',
            'registration_close_date' => 'required|date|after:today|before:event_date',
        ]);
        $user = Auth::guard('user')->user();
        if (!$user->hasRole('alumni')) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to create an event',
            ], 403);
        }
        $event = Event::create([
            'event_title' => $request->event_title,
            'description' => $request->description,
            'location' => $request->location,
            'event_date' => $request->event_date,
            'event_time' => $request->event_time,
            'max_participant' => $request->max_participant,
            'registration_close_date' => $request->registration_close_date,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Event created successfully',
            'event' => $event,
        ], 201);
        
    }
    public function search(Request $request)
    {
        $query = $request->input('query');
        $events = Event::where('event_title', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->orWhere('location', 'LIKE', "%{$query}%")
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Events fetched successfully',
            'events' => $events,
        ], 200);
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
    public function show(Event $event)
    {
        //
    }

    public function viewSingleEvent(Event $event)
    {
        $event = Event::where('id', $event->id)->with('attendees')->first();
        return response()->json([
            'status' => true,
            'message' => 'Event fetched successfully',
            'event' => $event,
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        //
        $request->validate([
            'title' => 'sometimes',
            'description' => 'sometimes',
            'date' => 'sometimes|date',
            'time' => 'sometimes',
            'location' => 'sometimes',
        ]);
        $user = Auth::guard('sanctum')->user();
        if (!$user || $user->id !== $event->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to update this event',
            ], 403);
        }
        $event->update($request->all());
        return response()->json([
            'status' => true,
            'message' => 'Event updated successfully',
            'event' => $event,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        //
        $user = Auth::guard('sanctum')->user();
        if (!$user || $user->id !== $event->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to delete this event',
            ], 403);
        }
        $event->delete();
        return response()->json([
            'status' => true,
            'message' => 'Event deleted successfully',
        ], 200);
    }
}
