<?php

namespace App\Http\Controllers;
// ini_set('memory_limit', '256M');
use App\Models\Donation;
use App\Models\DonationPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class DonationPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $donationPosts = DonationPost::get();
        return response()->json([
            'donation_posts' => $donationPosts,
        ]);
    }

    public function getDonationPostsByDonationId(DonationPost $donationPost)
    {
        if(!$donationPost->exists) {
            return response()->json([
                'message' => 'Donation post not found',
            ], 404);
        }
        $donationPost = DonationPost::where('id', $donationPost->id)->with('donations')->first();
        return response()->json([
            'donation_post' => $donationPost
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
        $form_fields = $request->validate([
            'donation_title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'target_amount' => 'required|numeric',
            'end_date' => 'required|date|after:today',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('donation_posts'), $filename);
            $photoPath = asset('donation_posts/'.$filename);
        }

        $admin = Auth::guard('sanctum')->user();
        if (!$admin->hasRole('admin')) {
            return response()->json([
                'message' => 'You are not authorized to create a donation post',
            ], 403);
        }
        $donationPost = DonationPost::where('donation_title', $form_fields['donation_title'])->first();
        if ($donationPost) {
            return response()->json([
                'message' => 'Donation post with this title already exists',
            ], 409);
        }
        $donationPost = DonationPost::create([
            'admin_id' => $admin->id,
            'donation_title' => $form_fields['donation_title'],
            'description' => $form_fields['description'],
            'target_amount' => $form_fields['target_amount'],
            'photo' => $photoPath,
            'end_date' => $form_fields['end_date'],
        ]);
        return response()->json([
            'donation_post' => $donationPost
        ], 201);
    }
    public function search(Request $request)
    {
        //
        $query = $request->input('query');
        $donationPosts = DonationPost::where('donation_title', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->get();
        return response()->json([
            'donation_posts' => $donationPosts,
        ]);
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
    public function update(Request $request, DonationPost $donationPost)
    {
        //
        $form_fields = $request->validate([
            'donation_title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:255',
            'target_amount' => 'sometimes|numeric',
            'end_date' => 'sometimes|date|after:today',
        ]);

        $admin = Auth::guard('sanctum')->user();
        if ($admin !== $donationPost->admin_id && !$admin->hasRole('admin')) {
            return response()->json([
                'message' => 'You are not authorized to edit this donation post',
            ], 403);
        }

        $donationPost->update($form_fields);
        return response()->json([
            'donation_post' => $donationPost
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */

    public function cancelDonationPost(DonationPost $donationPost)
    {
        //
        $admin = Auth::guard('sanctum')->user();
        if ( $admin->id !== $donationPost->admin_id && $admin->role !== 'admin' ) {
            return response()->json([
                'message' => 'You are not authorized to cancel this donation post',
            ], 403);
        }
        $donationPost->update([
            'status' => 'cancelled',
        ]);
        return response()->json([
            'message' => 'Donation post cancelled successfully',
        ]);
    }

    public function destroy(DonationPost $donationPost)
    {
        //
    }
}
