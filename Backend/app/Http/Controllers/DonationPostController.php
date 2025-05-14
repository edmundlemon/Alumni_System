<?php

namespace App\Http\Controllers;
ini_set('memory_limit', '256M');
use App\Models\Donation;
use App\Models\DonationPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DonationPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $donationPosts = DonationPost::get();
        // dd($donationPosts);
        // Log::channel('auth_activity')->info('Donation posts retrieved successfully.', [
        //     'donationPosts' => $donationPosts,
        // ]);
        return response()->json([
            'donationPosts' => $donationPosts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function show(DonationPost $donationPost)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DonationPost $donationPost)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DonationPost $donationPost)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DonationPost $donationPost)
    {
        //
    }
}
