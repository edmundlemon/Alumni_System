<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    protected $fillable = [
        'discussion_id',
        'user_id',
        'content',
    ];
    protected $appends = [
        'user_name',
        'user_profile_picture',
    ];
    protected $hidden = [
        'user',
    ];

    public function getUserNameAttribute()
    {
        return $this->user->name;
    }
    public function getUserProfilePictureAttribute()
    {
        return $this->user->profile_picture;
    }
    public function discussion()
    {
        return $this->belongsTo(Discussion::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
