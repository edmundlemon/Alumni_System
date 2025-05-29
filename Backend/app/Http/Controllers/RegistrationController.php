<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use Illuminate\Support\Str;
use App\Models\Registration;
use Illuminate\Http\Request;
use App\Mail\RegistrationMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class RegistrationController extends Controller
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
                'message' => 'You are not authorized to view registrations',
            ], 403);
        }
        $registrations = Registration::where('user_id', $user->id)->with('event')->latest()->get();
        return response()->json([
            'status' => true,
            'message' => 'Registrations fetched successfully',
            'registrations' => $registrations,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    
    public function create(Request $request, Event $event)
    {
        // $request->validate([
        //     'event_id' => 'required|integer',
        // ]);
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to create a registration',
            ], 403);
        }
        $attendeeCount = Registration::where('event_id', $event->id)->count();
        if ($attendeeCount >= $event->max_attendees && $event->max_attendees != null) {
            return response()->json([
                'status' => false,
                'message' => 'Event is full',
            ], 400);
        }
        $existingRegistration = Registration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();
        if ($existingRegistration) {
            return response()->json([
                'status' => false,
                'message' => 'You are already registered for this event',
            ], 400);
        }
        $registration = Registration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Registration created successfully',
            'registration' => $registration,
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
    public function show(Registration $registration)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Registration $registration)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Registration $registration)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Registration $registration)
    {
        //
        $user = Auth::guard('sanctum')->user();
        if (!$user || $user->id !== $registration->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to delete a registration',
            ], 403);
        }
        $registration->delete();
        return response()->json([
            'status' => true,
            'message' => 'Registration deleted successfully',
        ], 200);
    }
}
