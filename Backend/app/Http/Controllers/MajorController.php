<?php

namespace App\Http\Controllers;

use App\Models\Major;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MajorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $majors = Major::all();
        return response()->json($majors);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
        $request->validate([
            'major_name' => 'required|string|max:255',
            'faculty_id' => 'required|exists:faculties,id',
        ]);

        $user = Auth::guard('sanctum')->user();
        if(!$user->hasRole('admin')) {
            return response()->json([
                'error' => 'You are not authorized to perform this action',
            ], 403);
        }
        $major = new Major();
        $major->major_name = $request->major_name;
        $major->faculty_id = $request->faculty_id;
        $major->save();

        return response()->json($major, 201);
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
    public function show(Major $major)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Major $major)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Major $major)
    {
        //
        $user = Auth::guard('sanctum')->user();
        if(!$user->hasRole('admin')) {
            return response()->json([
                'error' => 'You are not authorized to perform this action',
            ], 403);
        }

        $request->validate([
            'major_name' => 'required|string|max:255',
        ]);

        $major->major_name = $request->major_name;
        $major->save();

        return response()->json($major, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Major $major)
    {
        //

    }
}
