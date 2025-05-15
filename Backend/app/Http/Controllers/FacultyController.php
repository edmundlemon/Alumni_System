<?php

namespace App\Http\Controllers;

use App\Models\faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $faculties = faculty::latest()->get();
        return response()->json([
            'status' => true,
            'message' => 'Faculties fetched successfully',
            'faculties' => $faculties,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
        $request->validate([
            'faculty_name' => 'required|string|max:255',
        ]);
        $admin = Auth::guard('sanctum')->user();
        if (!$admin->hasRole('admin')) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to create a faculty',
            ], 403);
        }

        $faculty = faculty::create([
            'faculty_name' => $request->faculty_name,
            'admin_id' => $admin->id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Faculty created successfully',
            'faculty' => $faculty,
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
    public function show(faculty $faculty)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(faculty $faculty)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, faculty $faculty)
    {
        //
        $request->validate([
            'faculty_name' => 'required|string|max:255',
        ]);
        $admin = Auth::guard('sanctum')->user();
        if (!$admin->hasRole('admin')) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to update a faculty',
            ], 403);
        }
        $faculty->update([
            'faculty_name' => $request->faculty_name,
        ]);
        return response()->json([
            'status' => true,
            'message' => 'Faculty updated successfully',
            'faculty' => $faculty,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(faculty $faculty)
    {
        //
        $admin = Auth::guard('sanctum')->user();
        if (!$admin->hasRole('admin')) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to delete a faculty',
            ], 403);
        }
        $faculty->delete();
        return response()->json([
            'status' => true,
            'message' => 'Faculty deleted successfully',
        ], 200);
    }
}
