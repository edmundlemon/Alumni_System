<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Connection extends Model
{
    use HasFactory;

    protected $fillable = [
        'requesting_user_id',
        'accepting_user_id',
        'status',
    ];

    public function requestingUser()
    {
        return $this->belongsTo(User::class, 'requesting_user_id');
    }
    public function acceptingUser()
    {
        return $this->belongsTo(User::class, 'accepting_user_id');
    }
    public function isPending()
    {
        return $this->status === 'pending';
    }
    public function isAccepted()
    {
        return $this->status === 'accepted';
    }
}
