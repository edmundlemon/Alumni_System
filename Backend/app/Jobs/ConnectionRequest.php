<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ConnectionRequest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $acceptingUser;
    public $requestingUser;
    /**
     * Create a new job instance.
     */
    public function __construct($requestingUser, $acceptingUser)
    {
        //
        $this->acceptingUser = $acceptingUser;
        $this->requestingUser = $requestingUser;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        Mail::to($this->acceptingUser->email)->send(new \App\Mail\ConnectionRequestEmail($this->requestingUser, $this->acceptingUser));
    }
}
