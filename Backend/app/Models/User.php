<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use DB;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $guard = 'user';
    protected $role;
    protected $appends = [
        'major_name',
        'faculty',
        'connections_count',
        'discussions_count',
        'events_count',
        'is_connected'
        ];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getMajorNameAttribute()
    {
        return $this->major->major_name ?? null;
    }
    public function getFacultyAttribute()
    {
        return $this->major->faculty->faculty_name ?? null;
    }
    public function getConnectionsCountAttribute()
    {
        // Get all user IDs where this user is either the requesting or accepting user and status is 'accepted'
        $requesting = DB::table('connections')
            ->where('requesting_user_id', $this->id)
            ->where('status', 'accepted')
            ->pluck('accepting_user_id');

        $accepting = DB::table('connections')
            ->where('accepting_user_id', $this->id)
            ->where('status', 'accepted')
            ->pluck('requesting_user_id');

        // Merge and get unique user IDs
        $allConnections = $requesting->merge($accepting)->unique();

        return $allConnections->count();
    }
    public function getIsConnectedAttribute()
    {
        if (Auth::guard('sanctum')->user() == null) {
            return false;
        }
        $userID = Auth::guard('sanctum')->user()->id;
        $connected = DB::table('connections')
            ->where('requesting_user_id', $userID)
            ->where('accepting_user_id', $this->id)
            ->where('status', 'accepted')
            // ->pluck('accepting_user_id');
            ->orWhere('accepting_user_id', $this->id)
            ->where('requesting_user_id', $userID)
            ->where('status', 'accepted');

        // Merge and get unique user IDs
        return $connected->count() > 0;
    }
    public function getDiscussionsCountAttribute()
    {
        return $this->discussions()->count();
    }
    public function getEventsCountAttribute()
    {
        return $this->joinedEvents()->count();
    }

    public function role()
    {
        return $this->role;
    }

    public function hasRole(string $role)
    {
        return $this->role == $role;
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
    public function donationsCount()
    {
        return $this->donations()->count();
    }
    public function donationPosts()
    {
        return $this->hasMany(DonationPost::class);
    }
    public function discussions()
    {
        return $this->hasMany(Discussion::class);
    }
    public function discussionsCount()
    {
        return $this->discussions()->count();
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function commentsCount()
    {
        return $this->comments()->count();
    }
    public function hostedEvents()
    {
        return $this->hasMany(Event::class, 'user_id');
    }
    public function joinedEvents()
    {
        return $this->belongsToMany(Event::class, 'registrations')->withTimestamps();
    }
    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }
    public function major()
    {
        return $this->belongsTo(Major::class);
    }
    public function connections()
    {
        return $this->belongsToMany(User::class, 'connections', 'user_id', 'connection_id');
    }

    public function pendingConnectionsRequests()
    {
        return $this->belongstoMany(User::class, 'connections', 'requesting_user_id', 'pending_user_id')->wherePivot('status', 'pending');
    }
    public function requestedConnections()
    {
        return $this->belongsToMany(User::class, 'connections', 'requesting_user_id', 'accepting_user_id')
                    ->wherePivot('status', 'accepted');
    }
    public function acceptedConnections()
    {
        return $this->belongsToMany(User::class, 'connections', 'accepting_user_id', 'requesting_user_id')
                    ->wherePivot('status', 'accepted');
    }
    public function pendingReceivedRequests()
    {
        return $this->belongsToMany(User::class, 'connections', 'accepting_user_id', 'requesting_user_id')
                    ->wherePivot('status', 'pending');
    }
    public function isConnectedTo($userId)
    {
        $connected = DB::table('connections')
            ->where('requesting_user_id', $this->id)
            ->where('acccepting_user_id', $userId)
            ->where('status', 'accepted')
            // ->pluck('accepting_user_id');
            ->orWhere('accepting_user_id', $this->id)
            ->where('requesting_user_id', $userId)
            ->where('status', 'accepted');

        // Merge and get unique user IDs
        return $connected->count() > 0;

    }
    public function isConnected($userId)
    {
        return $this->connections()->where('connection_id', $userId)->exists();
    }
    
    public function isFriendOf($userId)
    {
        return $this->isConnectedTo($userId) && $this->isConnected($userId);
    }
    public function isBlocked($userId)
    {
        return $this->connections()->where('connection_id', $userId)->where('status', 'blocked')->exists();
    }


    public function isBlockedBy($userId)
    {
        return $this->connectedUsers()->where('user_id', $userId)->where('status', 'blocked')->exists();
    }
    public function isBlockedByMe($userId)
    {
        return $this->connections()->where('connection_id', $userId)->where('status', 'blocked')->exists();
    }
    public function isBlockedMe($userId)
    {
        return $this->connectedUsers()->where('user_id', $userId)->where('status', 'blocked')->exists();
    }
    public function createdBy()
    {
        return $this->belongsTo(Admin::class);
    }
    
}
