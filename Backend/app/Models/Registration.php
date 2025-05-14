<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'event_id',
        'created_by',
        'updated_by',
    ];

    protected $appends = [
        'attendee_name',
    ];

    public function getAttendedNameAttribute()
    {
        return $this->user->name;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
    public function donation()
    {
        return $this->belongsTo(Donation::class);
    }
    public function donationPost()
    {
        return $this->belongsTo(DonationPost::class);
    }
    public function createdBy()
    {
        return $this->belongsTo(Admin::class);
    }
    public function updatedBy()
    {
        return $this->belongsTo(Admin::class);
    }
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        });
    }
    public function scopeFilterByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
    public function scopeFilterByDonation($query, $donationId)
    {
        return $query->where('donation_id', $donationId);
    }
    public function scopeFilterByDonationPost($query, $donationPostId)
    {
        return $query->where('donation_post_id', $donationPostId);
    }
    public function scopeFilterByCreatedBy($query, $createdById)
    {
        return $query->where('created_by', $createdById);
    }
    public function scopeFilterByUpdatedBy($query, $updatedById)
    {
        return $query->where('updated_by', $updatedById);
    }
    public function scopeFilterByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
    public function scopeFilterByDate($query, $date)
    {
        return $query->whereDate('created_at', $date);
    }
    public function scopeFilterByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }
    public function scopeFilterByTimeRange($query, $startTime, $endTime)
    {
        return $query->whereBetween('created_at', [$startTime, $endTime]);
    }
    public function scopeFilterByDateTimeRange($query, $startDateTime, $endDateTime)
    {
        return $query->whereBetween('created_at', [$startDateTime, $endDateTime]);
    }
    public function scopeFilterByDateTime($query, $dateTime)
    {
        return $query->where('created_at', $dateTime);
    }
}
