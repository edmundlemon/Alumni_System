<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class PasswordReset extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */

    public $token;
    public $email;
    public $user;
    
    public function __construct($token, $user)
    {
        $this->user = $user;
        $this->email = $user->email;
        $this->token = $token;
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Password Reset',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function build()
    {
        return $this->markdown('emails.reset-password')
            ->subject('Reset Password Notification')
            ->with([
                'url' => config('app.frontend_url').'/reset-password?token='.$this->token.'&email='.$this->email,
                'token' => $this->token,
                'email' => $this->email,
                'name' => $this->user->name,
                'subject' => 'Reset Password Notification',
                'greeting' => 'Hello '.$this->user->name,
                'expires' => config('auth.passwords.users.expire'),
            ]);
    }

}
