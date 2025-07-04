<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'subject',
        'content',
        'photo',
    ];
    // protected $hidden = [
        // 'created_at',
        // 'updated_at',
    // ];
    protected $appends = [
        'name',
    ];
    public function getNameAttribute()
    {
        return $this->user->name;
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
