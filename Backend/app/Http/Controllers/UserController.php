<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Mail\RegistrationMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    //
    public function index()
    {
        // Fetch all users
        $users = User::all();
        return response()->json($users);
    }
    public function create(Request $request)
    {
        //
        // dd($request->all());
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            // 'password' => 'required|string|min:8|confirmed',
            // 'faculty' => 'required|string|max:255',
            'major_id' => 'required|integer|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'role' => 'required|string|in:student,alumni',
        ]);
        // dd($request->all());
        $user = Auth::guard('sanctum')->user();
        if (!$user->hasRole('admin')) {
            return response()->json([
                'error' => 'You are not authorized to perform this action',
            ], 403);
        }
        $registration = new User();
        $registration->name = $request->name;
        $registration->email = $request->email;
        $autogeneratedPassword = Str::password(8);
        $registration->password = bcrypt($autogeneratedPassword);
        // $registration->faculty = $request->faculty;
        $registration->role = $request->role;
        $registration->phone = $request->phone;
        $registration->enrollment_year = $request->enrollment_year;
        $registration->graduation_year = $request->graduation_year;
        $registration->bio = $request->bio;
        $registration->home_country = $request->home_country;
        $registration->job_title = $request->job_title;
        $registration->company = $request->company;
        $registration->position = $request->position;
        $registration->account_status = 'active';
        $registration->registration_date = now();
        $registration->major_id = $request->major_id;
        $registration->admin_id = $user->id;

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('profile_pictures'), $filename);
            // $request->photo = $filename;
            $photoPath = asset('profile_pictures/'.$filename);
            // Returns: http://yourdomain.com/profile_pictures/1654012345.jpg
            $registration->photo = $photoPath;
        }
        $registration->save();
        // Send email to the user with the autogenerated password
        // dd($registration);
        Mail::to($registration->email)->send(new RegistrationMail($registration, $autogeneratedPassword));
        return response()->json([
            'message' => 'Registration successful',
            'registration' => $registration,
        ], 201);
    }
    public function search(Request $request)
    {
        // Search for users
        $query = $request->input('query');
        $users = User::where('name', 'LIKE', "%$query%")
            ->orWhere('email', 'LIKE', "%$query%")
            ->orWhere('id', 'LIKE', "%$query%")
            ->get();
        // $admin = Auth::guard('sanctum')->user(
        return response()->json($users);
    }
    public function show(User $user)
    {
        // You can add multiple temporary attributes like this:
        $user->past_events = $user->hostedEvents()
            ->where('event_date', '<', now())
            ->get();
        $user->discussions = $user->discussions()
            ->with('comments')
            ->get();
        $user->discussions->each(function ($discussion) {
            $discussion->makeHidden('user');
        });
        return response()->json(
            $user
        );
    }
    public function update(Request $request, User $userToBeEdited)
    {
        // Update user details
        $user = Auth::guard('sanctum')->user();
        if (!$user || !$user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        Log::channel('auth_activity')->info('User to be edited: ', ['user' => $userToBeEdited]);
        dd($request->all());
        $photoPath = $userToBeEdited->photo;
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('profile_pictures'), $filename);
            // $request->photo = $filename;
            $photoPath = asset('profile_pictures/'.$filename);
            // Returns: http://yourdomain.com/profile_pictures/1654012345.jpg
            // $request->photo = $filename;
        }
        $userToBeEdited->update($request->all());
        $userToBeEdited->photo = $photoPath;
        $userToBeEdited->save();
        return response()->json($userToBeEdited);
    }
    public function deactivate(User $user)
    {
        // Deactivate a user
        $admin = Auth::guard('sanctum')->user();
        if (!$admin || !$admin->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $user->update(['account_status' => 'inactive']);
        return response()->json(['message' => 'User deactivated successfully']);
    }
    public function destroy(User $user)
    {
        // Delete a user
        $admin = Auth::guard('sanctum')->user();
        if (!$admin || !$admin->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
    public function viewAllStudents()
    {
        // Fetch all students
        $students = User::where('role', 'student')->get();
        return response()->json($students);
    }
    public function viewAllAlumni()
    {
        // Fetch all alumni
        $alumni = User::where('role', 'alumni')->get();
        return response()->json($alumni);
    }

    public function viewConnectedUsers()
    {
        $user = Auth::guard('sanctum')->user();
        // Fetch all connections
        $acceptedConnections = $user->acceptedConnections
        ->makeHidden(['pivot', 'major']);
        $requestedConnections = $user->requestedConnections
        ->makeHidden(['pivot', 'major']);
        $connectedUsers = $acceptedConnections->merge($requestedConnections);

        return response()->json([
            'connected_users' => $connectedUsers,
        ], 200);
    }
}
