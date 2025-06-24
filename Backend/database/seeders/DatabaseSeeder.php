<?php

namespace Database\Seeders;

use DB;
use App\Models\User;
use App\Models\Admin;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Event;
use App\Models\Major;
use App\Models\Comment;
use App\Models\Donation;
use App\Models\Connection;
use App\Models\Discussion;
use App\Models\DonationPost;
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
        User::factory()->create([
            'name' => 'Sean Connolly',
            'email' => 'sean.connolly@example.com',
            'role' => 'student'
        ]);
        User::factory()->create([
            'name' => 'Jade Smith',
            'email' => 'jade.smith@example.com',
            'role' => 'student'
        ]);
        User::factory()->create([
            'name' => 'Tanya Johnson',
            'email' => 'tanya.johnson@example.com',
            'role' => 'alumni'
        ]);
        User::factory()->withExistingConnections(3)->create([
            'name' => 'Sequoia Brown',
            'email' => 'sequioa.brown@example.com',
            'role' => 'alumni'
        ]);

        User::factory()->count(10)->withConnections(2)->create();
        Event::create([
            'user_id' => 1223, // Admin user
            'event_title' => 'Alumni Networking Event',
            'description' => 'An event to connect with alumni and discuss career opportunities.',
            'event_date' => now()->subDays(10), // Future date
            'location' => 'Main Auditorium',
            'event_time' => '14:00:00',
            'max_participants' => 100,
            'registration_close_date' => now()->subDays(5), // Past date
            'status' => 'completed',
        ]);
        Admin::create([
            'name' => 'Test Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
            'phone' => '1234567890',
        ]);
        Discussion::create([
            'user_id' => 1221,
            'subject' => 'I love MMU',
            'content' => 'MMU is the best uni.',
        ]);
        Discussion::create([
            'user_id' => 1222,
            'subject' => 'I love FCI',
            'content' => 'FCI is the best faculty in MMU.',
        ]);
        Discussion::create([
            'user_id' => 1223,
            'subject' => 'MMU is pretty good university',
            'content' => 'Because I studied here.',
        ]);
        Discussion::create([
            'user_id' => 1224,
            'subject' => 'Looking for food in MMU',
            'content' => 'TBH MMU does not have good food.',
        ]);
        // Discussion::factory()->count(10)->create([
        //     'user_id' => User::inRandomOrder()->first()->id,
        // ]);

        Comment::factory()->count(4)->create([
            'user_id' => User::inRandomOrder()->first()->id,
            'discussion_id' => Discussion::inRandomOrder()->value('id'),
        ]);
        Event::factory()->count(1)->withRegistrations(2)->create([
            'user_id' => 1223, // Admin user
            // Seed date where its past events
            'event_date' => now()->subDays(3),
            'event_title' => 'MMU Student Orientation',
            'description' => 'To bond students in MMU.',
            'event_time' => '10:00:00',
            'max_participants' => 100,
            'location' => 'MPH Location',
            'registration_close_date' => now()->subDays(5), // Past date
        ]);
        Event::create([
            'user_id' => 1223, // Admin user
            'event_title' => 'Community Service Day',
            'description' => 'Join us for a day of community service and volunteering.',
            'event_date' => now()->addDays(7), // Future date
            'event_time' => '09:00:00',
            'max_participants' => 50,
            'location' => 'Community Center',
            'registration_close_date' => now()->addDays(5),
        ]);
        Event::create([
            'user_id' => 1224, // Admin user
            'event_title' => 'Career Fair',
            'description' => 'A fair to connect students with potential employers.',
            'event_date' => now()->addDays(14), // Future date
            'event_time' => '10:00:00',
            'max_participants' => 100,
            'location' => 'Main Hall',
            'registration_close_date' => now()->addDays(10),
        ]);
        Event::factory()->count(1)->withRegistrations(2)->create([
            'user_id' => 1223, // Admin user
            'event_title' => 'Guest Lecture: Innovations in Technology',
            'description' => 'A guest lecture on the latest innovations in technology.',
            'event_date' => now()->addDays(21), // Future date
            'event_time' => '15:00:00',
            'max_participants' => 50,
            'location' => 'Lecture Hall 1',
            'registration_close_date' => now()->addDays(15),
        ]);
        for ($userId = 1221; $userId <= 1224; $userId++) {
            DB::table('registrations')->insert([
                'user_id' => $userId,
                'event_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        // Event::factory()->count(10)->withRegistrations(2)->create([
        //     'user_id' => User::inRandomOrder()->value('id'),
        // ]);

        // DonationPost::factory()->count(2)->create();
        DonationPost::create([
            'admin_id' => 1001, // Admin user
            'donation_title' => 'Support Our New Library',
            'description' => 'Help us build a new library for our students.',
            'target_amount' => 50000.00,
            'end_date' => now()->addDays(30),
            'status' => 'ongoing',
        ]);
        DonationPost::factory()->count(1)->create([
            'admin_id' => Admin::inRandomOrder()->value('id'),
            'donation_title' => 'Community Health Initiative',
            'description' => 'Support our community health initiative to provide free medical care.',
            'target_amount' => fn() => fake()->randomFloat(2, 1000, 100000),
            'end_date' => fn() => fake()->dateTimeBetween('now', '+1 year'),
            'status' => fn() => fake()->randomElement(['ongoing', 'completed', 'cancelled']),
        ]);
        Donation::factory()->count(5)->create();
        Connection::factory()->count(20)->create([
            'requesting_user_id' => fn() => User::inRandomOrder()->value('id'),
            'accepting_user_id' => fn() => User::inRandomOrder()->value('id'),
        ]);
        
    }
}
