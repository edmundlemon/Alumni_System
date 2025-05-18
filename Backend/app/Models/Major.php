<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    use HasFactory;

    protected $appends = [
        'faculty_name',
    ];

    protected $fillable = [
        'major_name',
        'faculty_id',
        'created_by',
        'updated_by',
    ];

    public function getFacultyNameAttribute()
    {
        return $this->faculty->faculty_name;
    }
    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }
}
