<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonationPost extends Model
{
    use HasFactory;
    protected $fillable = [
        'donation_title',
        'description',
        'target_amount',
        // 'current_amount',
        'user_id',
        'status',
    ];
    protected $casts = [
        'goal_amount' => 'float',
        'current_amount' => 'float',
    ];
    protected $with = ['user', 'donations'];
    protected $appends = [
        'current_amount',
        'donation_count',
        'donation_percentage',
        'donation_status',
        'donation_status_text',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
    public function getCurrentAmountAttribute()
    {
        return $this->donations->sum('amount');
    }
    public function getDonationCountAttribute()
    {
        return $this->donations->count();
    }
    public function getDonationPercentageAttribute()
    {
        return ($this->current_amount / $this->goal_amount) * 100;
    }
    public function getDonationStatusAttribute()
    {
        return $this->current_amount >= $this->goal_amount ? 'completed' : 'ongoing';
    }
    public function getDonationStatusTextAttribute()
    {
        return $this->donation_status === 'completed' ? 'Completed' : 'Ongoing';
    }
}
