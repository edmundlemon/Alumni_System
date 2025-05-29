<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendEventCancelledEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */

    public $event;
    public $users;
    public function __construct($users, $event)
    {
        $this->users = $users;
        $this->event = $event;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        foreach ($this->users as $user) {
            Mail::to($user->email)->send(new \App\Mail\EventCancelledNotification($user, $this->event));
        }
    }
}
