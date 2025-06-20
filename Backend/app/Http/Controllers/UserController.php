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
            // 'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048|string',
            'role' => 'required|string|in:student,alumni',
        ]);
        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
        }
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

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('profile_pictures'), $filename);
            // $request->image = $filename;
            $imagePath = asset('profile_pictures/'.$filename);
            // Returns: http://yourdomain.com/profile_pictures/1654012345.jpg
            $registration->image = $imagePath;
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
    // Hosted Events
    $user->events = $user->hostedEvents()->get();

    // Discussions with comments
    $user->discussions = $user->discussions()->with('comments')->get();
    $user->discussions->each(function ($discussion) {
        $discussion->makeHidden('user');
    });

    // Combine accepted and requested connections
    $connections = $user->acceptedConnections
        ->merge($user->requestedConnections)
        ->unique('id')
        ->makeHidden(['pivot', 'email', 'phone', 'bio']);

    // Add connections data and count as additional attributes
    $user->connections_count = $connections->count();
    $user->connections = $connections->map(function ($connection) {
        return [
            'id' => $connection->id,
            'name' => $connection->name,
            'role' => $connection->role,
            'image' => $connection->image,
            'job_title' => $connection->job_title,
            'company' => $connection->company,
            'graduation_year' => $connection->graduation_year,
            'major_name' => $connection->major->major_name ?? null,
            'faculty' => $connection->major->faculty->faculty_name ?? null,
        ];
    });

    return response()->json($user);
}

    public function update(Request $request, User $userToBeEdited)
    {
        Log::channel('auth_activity')->info('User update request received', $request->all());
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$userToBeEdited->id,
            // 'password' => 'nullable|string|min:8|confirmed',
            // 'faculty' => 'sometimes|string|max:255',
            'major_id' => 'sometimes|integer|max:255',
            // 'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'role' => 'sometimes|string|in:student,alumni',
        ]);
        $user = Auth::guard('sanctum')->user();
        if ($user->id !== $userToBeEdited->id && !$user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        // Log::channel('auth_activity')->info('User to be edited: ', ['user' => $userToBeEdited]);
        // dd($request->all());
        $photoPath = $request->image;
        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            $file = $request->file('image');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('profile_pictures'), $filename);
            $photoPath = asset('profile_pictures/'.$filename);
        }
        $data = $request->all();
        $data['first_login'] = false; // Ensure first_login is set to false
        $userToBeEdited->update($data);
        $userToBeEdited->image = $photoPath;
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
    public function suggestedConnections()
    {
        $user = Auth::guard('sanctum')->user();
        // Fetch suggested connections
        $suggestedConnections = User::where('id', '!=', $user->id)
            ->whereDoesntHave('acceptedConnections', function ($query) use ($user) {
                $query->where('accepting_user_id', $user->id);
            })
            ->whereDoesntHave('requestedConnections', function ($query) use ($user) {
                $query->where('requesting_user_id', $user->id);
            })
            ->where('major_id', $user->major_id)
            ->where('role', 'student') // Assuming you want to suggest only students
            ->orWhereHas('major', function ($query) use ($user) {
                $query->where('faculty_id', $user->major->faculty_id);
            })
            ->whereDoesntHave('acceptedConnections', function ($query) use ($user) {
                $query->where('accepting_user_id', $user->id);
            })
            ->whereDoesntHave('requestedConnections', function ($query) use ($user) {
                $query->where('requesting_user_id', $user->id);
            })
            ->where('role', 'alumni') // Or alumni
            ->get()
            ->makeHidden(['pivot', 'major']);

        return response()->json([
            'suggested_connections' => $suggestedConnections,
        ], 200);
    }
}
