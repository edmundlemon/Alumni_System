<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use App\Models\Event;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Major;
use App\Models\Comment;
use App\Models\Donation;
use App\Models\Discussion;
use App\Models\DonationPost;
use App\Models\Connection;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $predeterminedFaculties = [
            ['faculty_name' => 'Faculty of Computing and Informatics'],
            ['faculty_name' => 'Faculty of Cinematic Arts'],
            ['faculty_name' => 'Faculty of Business'],
            ['faculty_name' => 'Faculty of Education'],
            ['faculty_name' => 'Faculty of Law'],
            ['faculty_name' => 'Faculty of Medicine'],
            ['faculty_name' => 'Faculty of Social Sciences'],
            ['faculty_name' => 'Faculty of Agriculture'],
            ['faculty_name' => 'Faculty of Architecture'],
        ];
        // Insert the predetermined faculties into the database
        foreach ($predeterminedFaculties as $faculty) {
            \App\Models\Faculty::create($faculty);
        }

        $predeterminedMajorNames = [
        ['major_name' => 'Computer Science', 'faculty_id' => 1],
        ['major_name' => 'Information Systems', 'faculty_id' => 1],
        ['major_name' => 'Computer Engineering', 'faculty_id' => 1],
        ['major_name' => 'Software Engineering', 'faculty_id' => 1],
        ['major_name' => 'Data Science', 'faculty_id' => 1],
        ['major_name' => 'Cybersecurity', 'faculty_id' => 1],
        ['major_name' => 'Network Engineering', 'faculty_id' => 1],
        ['major_name' => 'Web Development', 'faculty_id' => 1],
        ['major_name' => 'Mobile App Development', 'faculty_id' => 1],
        ['major_name' => 'Artificial Intelligence', 'faculty_id' => 1],
        ['major_name' => 'Machine Learning', 'faculty_id' => 1],
        ['major_name' => 'Digital Media', 'faculty_id' => 2],
        ['major_name' => 'Film Production', 'faculty_id' => 2],
        ['major_name' => 'Business Administration', 'faculty_id' => 3],
        ['major_name' => 'Marketing', 'faculty_id' => 3],
        ['major_name' => 'Finance', 'faculty_id' => 3],
        ['major_name' => 'Education Technology', 'faculty_id' => 4],
        ['major_name' => 'Curriculum and Instruction', 'faculty_id' => 4],
        ['major_name' => 'Law and Society', 'faculty_id' => 5],
        ['major_name' => 'Criminal Justice', 'faculty_id' => 5],
        ['major_name' => 'Medicine and Health Sciences', 'faculty_id' => 6],
        ['major_name' => 'Public Health', 'faculty_id' => 6],
        ['major_name' => 'Sociology', 'faculty_id' => 7],
        ['major_name' => 'Psychology', 'faculty_id' => 7],
        ['major_name' => 'Agricultural Science', 'faculty_id' => 8],
        ['major_name' => 'Environmental Science', 'faculty_id' => 8],
        ['major_name' => 'Architecture and Design', 'faculty_id' => 9],
        ['major_name' => 'Urban Planning', 'faculty_id' => 9],
        ];

        Major::insert($predeterminedMajorNames);


        // Create a user with a specific name and email
        User::factory()->withConnections(2)->withDiscussions(2)->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory()->count(10)->withConnections(2)->create();

        Admin::create([
            'name' => 'Test Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
            'phone' => '1234567890',
        ]);
        Discussion::create([
            'user_id' => 1221,
            'subject' => 'Test Discussion',
            'content' => 'This is a test discussion content.',
        ]);
        Discussion::factory()->count(10)->create([
            'user_id' => User::inRandomOrder()->first()->id,
        ]);

        Comment::factory()->count(250)->create([
            'user_id' => User::inRandomOrder()->first()->id,
            'discussion_id' => Discussion::inRandomOrder()->value('id'),
        ]);
        Event::factory()->count(5)->withRegistrations(2)->create([
            'user_id' => 1221, // Admin user
            // Seed date where its past events
            'event_date' => now()->subDays(rand(1, 30)),
        ]);
        Event::factory()->count(10)->withRegistrations(2)->create([
            'user_id' => User::inRandomOrder()->value('id'),
        ]);

        DonationPost::factory()->count(2)->create();
        Donation::factory()->count(5)->create();
        Connection::factory()->count(20)->create([
            'requesting_user_id' => fn() => User::inRandomOrder()->value('id'),
            'accepting_user_id' => fn() => User::inRandomOrder()->value('id'),
        ]);
        
    }
}
