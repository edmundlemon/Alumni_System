<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Jobs\SendEventCancelledEmail;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::latest()->get();

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
            'description' => 'required|string|max:1000',
            'location' => 'required|string|max:255',
            'event_date' => 'required|date_format:Y-m-d|after:tomorrow',
            'event_time' => 'required|date_format:H:i',
            'max_participant' => 'nullable|integer',
            'registration_close_date' => 'required|date|after:today|before:event_date',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'event_mode' => 'required|in:Online,Physical,Hybrid',
            'location' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($request) {
                    if (($request->event_mode ?? 'Physical') === 'Online' && !filter_var($value, FILTER_VALIDATE_URL)) {
                        $fail('The location must be a valid URL when event mode is online.');
                    }
                },
            ],
        ]);


        $user = Auth::guard('sanctum')->user();
        if (!$user->hasRole('alumni')) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to create an event',
            ], 403);
        }
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('event_pictures'), $filename);
            $photoPath = asset('event_pictures/'.$filename);
        }
        $event = Event::create([
            'event_title' => $request->event_title,
            'description' => $request->description,
            'location' => $request->location,
            'event_mode' => $request->event_mode ?? 'physical',
            'photo' => $photoPath,
            'event_date' => $request->event_date,
            'event_time' => $request->event_time,
            'max_participants' => $request->max_participants,
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

    public function viewPastEvents()
    {
        $events = Event::where('event_date', '<', now()->format('Y-m-d'))
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Past events fetched successfully',
            'events' => $events,
        ], 200);
    }
    public function viewUpcomingEvents()
    {
        $events = Event::where('event_date', '>=', now()->format('Y-m-d'))
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Upcoming events fetched successfully',
            'events' => $events,
        ], 200);
    }
    public function myUpcomingEvents()
    {
        $user = Auth::guard('sanctum')->user();
        $events = Event::where('user_id', $user->id)->latest()->get();

        return response()->json([
            'status' => true,
            'message' => 'Your events fetched successfully',
            'events' => $events,
        ], 200);
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
        if (!$user || ($user->id !== $event->user_id && !$user->hasRole('admin'))) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to delete this event',
            ], 403);
        }
        $affectedAttendees = $event->attendees()->get();
        foreach ($affectedAttendees as $attendee) {
            // Detach each attendee from the event
            Log::channel('auth_activity')->info("Attendee {$attendee->email} with email {$attendee->email} is being detached from event: {$event->event_title}");
        }
        // Dispatch job to send cancellation email
        $event->update(['status' => 'cancelled']);
        SendEventCancelledEmail::dispatch($affectedAttendees, $event);
        return response()->json([
            'status' => true,
            'message' => 'Event deleted successfully',
        ], 200);
    }
}
