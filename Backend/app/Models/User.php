<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

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
        return $this->hasMany(Event::class, 'host_id');
    }
    public function joinedEvents()
    {
        return $this->belongsToMany(Event::class, 'event_user')->withTimestamps();
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
    public function connectedUsers()
    {
        return $this->belongsToMany(User::class, 'connections', 'connection_id', 'user_id');
    }
    public function isConnected($userId)
    {
        return $this->connections()->where('connection_id', $userId)->exists();
    }
    public function isConnectedTo($userId)
    {
        return $this->connectedUsers()->where('user_id', $userId)->exists();
    }
    public function isFriend($userId)
    {
        return $this->isConnected($userId) && $this->isConnectedTo($userId);
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
