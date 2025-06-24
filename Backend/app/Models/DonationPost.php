<?php

namespace App\Models;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DonationPost extends Model
{
    use HasFactory;
    protected $fillable = [
        'donation_title',
        'description',
        'target_amount',
        'admin_id',
        'end_date',
        'status',
        'photo',
    ];
    // protected $with = ['user', 'donations'];
    protected $appends = [
        'current_amount',
        'donation_count',
        'donation_percentage',
        // 'donation_status',
        // 'donation_status_text',
    ];
    protected $casts = [
        'target_amount' => 'float',
        'current_amount' => 'float',
    ];
    public function user()
    {
        return $this->belongsTo(Admin::class);
    }
    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
    public function getCurrentAmountAttribute()
    {
        return round($this->donations()->sum('donated_amount'),2);
    }
    public function getDonationCountAttribute()
    {
        return $this->donations()->count();
    }
    public function getDonationPercentageAttribute()
    {
        if ($this->target_amount == 0) {
            return 0;
        }
        return round(($this->current_amount / $this->target_amount) * 100, 0);
    }
    // public function getDonationStatusAttribute()
    // {
    //     return $this->current_amount >= $this->target_amount ? 'completed' : 'ongoing';
    // }
    // public function getDonationStatusTextAttribute()
    // {
    //     return $this->donation_status === 'completed' ? 'Completed' : 'Ongoing';
    // }
}
