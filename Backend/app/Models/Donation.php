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
        'donated_amount',
        // 'status',
    ];
    protected $appends = [
        'donor_name',
        'donor_id',
        'donation_post_title',
    ];
    // protected $casts = [
    //     'donated_amount' => 'float',
    // ];
    protected $hidden = [
        'donations_post',
    ];
    // protected $with = ['user', 'donationPost'];

    public function getDonorNameAttribute()
    {
        if (!$this->user) {
            return 'Unknown Donor';
        }
        return $this->user->name;
    }
    public function getDonorIdAttribute()
    {
        if (!$this->user) {
            return null; // or handle as needed
        }
        return $this->user->id;
    }
    public function getDonationPostTitleAttribute()
    {
        return $this->donationPost->title;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function donationPost()
    {
        return $this->belongsTo(DonationPost::class);
    }
}
