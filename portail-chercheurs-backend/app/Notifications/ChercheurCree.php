<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ChercheurCree extends Notification
{
    private $password;

    public function __construct($password)
    {
        $this->password = $password;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Bienvenue sur le Portail des Chercheurs')
            ->greeting('Bonjour ' . $notifiable->name . ' 👋')
            ->line('Votre compte a été créé avec succès.')
            ->line('Email : ' . $notifiable->email)
            ->line('Mot de passe : ' . $this->password)
            ->line('Merci de vous connecter et de mettre à jour votre mot de passe.')
            ->action('Accéder au portail', 'http://localhost:5173/connexion')
            ->salutation('Cordialement, l’équipe du Portail');
    }
}
