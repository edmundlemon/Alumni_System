<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

   protected $fillable = [
        'user_id',
        'event_id',
        'feedback_remarks',
        'rating',
        'feedback_date',
    ];
}
