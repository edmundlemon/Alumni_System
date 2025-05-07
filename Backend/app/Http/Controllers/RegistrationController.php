<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegistrationController extends Controller
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'faculty' => 'required|string|max:255',
            'program' => 'required|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'role' => 'required|string|in:student,alumni',
        ]);
        $user = Auth::guard('sanctum')->user();
        if (!$user->hasRole('admin')) {
            return response()->json([
                'error' => 'You are not authorized to perform this action',
            ], 403);
        }
        $registration = new Registration();
        $registration->name = $request->name;
        $registration->email = $request->email;
        $registration->password = bcrypt($request->password);
        $registration->faculty = $request->faculty;
        $registration->program = $request->program;
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('photos'), $filename);
            $registration->photo = $filename;
        }
        $registration->save();
        return response()->json([
            'message' => 'Registration successful',
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
    }
}
