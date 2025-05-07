<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable 
{
    use Notifiable;
    use HasFactory;
    use HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
    ];
    
    protected $guard = 'admin';
    protected $role = 'admin';

    public function role(){
        return $this->role;
    }

    public function hasRole(string $role) {
        return $this->role == $role;
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
// File: Alumni_System/Backend/database/migrations/2025_04_19_042207_create_admins_table.php