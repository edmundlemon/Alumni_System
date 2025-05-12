<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Major;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $predeterminedMajorNames = [
        ['major_name' => 'Computer Science'],
        ['major_name' => 'Information Technology'],
        ['major_name' => 'Software Engineering'],
        ['major_name' => 'Data Science'],
        ['major_name' => 'Cybersecurity'],
        ['major_name' => 'Network Engineering'],
        ['major_name' => 'Web Development'],
        ['major_name' => 'Mobile App Development'],
        ['major_name' => 'Artificial Intelligence'],
        ['major_name' => 'Machine Learning'],
        ];

        Major::insert($predeterminedMajorNames);

        // Create a user with a specific name and email
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory()->count(10)->withConnections(2)->create();

        Admin::create([
            'name' => 'Test Admin',
            'email' => 'test123@gmail.com',
            'password' => bcrypt('password123'),
            'phone' => '1234567890',
        ]);

        
    }
}
