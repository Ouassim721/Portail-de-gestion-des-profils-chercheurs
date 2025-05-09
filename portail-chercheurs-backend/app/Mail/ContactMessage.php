<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ContactMessage extends Mailable
{
    public $user;
    public $sujet;
    public $message;

    public function __construct($user, $sujet, $message)
    {
        $this->user = $user;
        $this->sujet = $sujet;
        $this->message = $message;
    }

    public function build()
    {
        return $this->to(env('MAIL_FROM_ADDRESS'))
            ->subject('Nouveau message de contact')
            ->view('emails.contact')
            ->with([
                'user' => $this->user,
                'sujet' => $this->sujet,
                'message' => $this->message,
            ]);
    }
}
