<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Auth\Notifications\ResetPassword;

class ResetPasswordNotification extends ResetPassword
{
    public function toMail($notifiable)
    {
        $url = config('app.frontend_url', 'http://localhost:5173') . '/reset-password/' . $this->token;

        return (new MailMessage)
            ->subject('Réinitialisation de mot de passe')
            ->line('Vous avez demandé une réinitialisation de votre mot de passe.')
            ->action('Réinitialiser le mot de passe', $url)
            ->line('Si vous n’avez pas fait cette demande, ignorez simplement cet e-mail.');
    }
}
