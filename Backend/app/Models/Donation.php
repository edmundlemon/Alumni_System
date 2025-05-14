<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;
    protected $fillable = [
        'donation_post_id',
        'user_id',
        'amount',
        'status',
    ];
    protected $casts = [
        'amount' => 'float',
    ];
    protected $with = ['user', 'donationPost'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function donationPost()
    {
        return $this->belongsTo(DonationPost::class);
    }
}
