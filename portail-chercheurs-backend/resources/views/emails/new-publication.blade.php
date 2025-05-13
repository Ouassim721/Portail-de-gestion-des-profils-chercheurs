@component('mail::message')
# Nouvelle publication disponible !

**{{ $chercheur->prenom }} {{ $chercheur->nom }}** a publié un nouveau travail :

**Titre :** {{ $publication->titre }}

**Date de publication :** {{ $publication->date_publication->format('d/m/Y') }}

@component('mail::button', ['url' => url("/publications/{$publication->id}")])
Voir la publication
@endcomponent

Merci de votre intérêt,<br>
L'équipe ScholarHub
@endcomponent