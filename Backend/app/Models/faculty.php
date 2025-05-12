<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class faculty extends Model
{
    use HasFactory;

    protected $fillable = [
        'faculty_name',
    ];
    protected $table = 'faculties';

    public function majors()
    {
        return $this->hasMany(Major::class);
    }
    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function admins()
    {
        return $this->hasMany(Admin::class);
    }
}
