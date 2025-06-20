<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminAccess extends Controller
{
    //
    public function index()
    {
        $user = auth()->user();
        if (!$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $user_count = \App\Models\User::count();
        $event_count = \App\Models\Event::count();
        $total_donations = \App\Models\Donation::sum('donated_amount');
        $total_discussions = \App\Models\Discussion::count();
        $total_active_users = \App\Models\User::where('first_login', '0')->count();
        $total_user_count = \App\Models\User::count();
        $donation_by_category = \App\Models\Donation::selectRaw('donation_post_id, SUM(donated_amount) as total_amount')
            ->groupBy('donation_post_id')
            ->get();

        return response()->json([
            'user_count' => $user_count,
            'event_count' => $event_count,
            'total_donations' => $total_donations,
            'total_discussions' => $total_discussions,
            'total_active_users' => $total_active_users,
            'total_user_count' => $total_user_count,
            'donation_by_category' => $donation_by_category,
        ]);
    }
}
