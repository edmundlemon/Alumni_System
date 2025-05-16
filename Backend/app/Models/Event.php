<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;
    protected $fillable = [
        'event_title',
        'description',
        'location',
        'event_date',
        'event_time',
        'registration_close_date',
        'max_participants',
        'status',
        'user_id',
    ];
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];
    public function organizer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function attendees()
    {
        return $this->belongsToMany(User::class, 'Registrations', 'event_id', 'user_id');
    }
}
