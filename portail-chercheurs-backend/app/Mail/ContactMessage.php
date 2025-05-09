<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ContactMessage extends Mailable
{
    public $user;
    public $sujet;
    public $contenu;

    public function __construct($user, $sujet, $contenu)
    {
        $this->user = $user;
        $this->sujet = $sujet;
        $this->contenu = $contenu;
    }

    public function build()
    {
        return $this->view('emails.contact')
            ->with([
                'user' => $this->user,
                'sujet' => $this->sujet,
                'contenu' => $this->contenu,
            ]);
    }
}
