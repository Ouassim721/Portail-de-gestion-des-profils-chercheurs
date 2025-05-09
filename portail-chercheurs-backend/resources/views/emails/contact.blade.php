<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Message de contact</title>
</head>

<body>
    <h1>Message de {{ isset($user) ? $user->nom . ' ' . $user->prenom : 'Utilisateur inconnu' }}</h1>
    <p><strong>Sujet:</strong> {{ isset($sujet) ? $sujet : 'Pas de sujet' }}</p>
    <p><strong>Message:</strong> {{ isset($message) ? $message : 'Aucun message' }}</p>
</body>

</html>
