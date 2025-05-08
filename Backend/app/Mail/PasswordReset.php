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
    public function __construct($token)
    {
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

    public function toMail($notifiable)
    {
        $url = config('app.frontend_url').'/reset-password?token='.$this->token.'&email='.$notifiable->email;
        
        return (new MailMessage)
            ->view('emails.reset-password',[
                'url' => $url,
                'token' => $this->token,
                'email' => $notifiable->email,
                'name' => $notifiable->name,
                'subject' => 'Reset Password Notification',
                'greeting' => 'Hello '.$notifiable->name,
                'expires' => config('auth.passwords.users.expire'),
            ]);
            // ->subject('Reset Password Notification')
            // ->line('You are receiving this email because we received a password reset request for your account.')
            // ->action('Reset Password', $url)
            // ->line('This password reset link will expire in '.config('auth.passwords.users.expire').' minutes.');
    }
}
