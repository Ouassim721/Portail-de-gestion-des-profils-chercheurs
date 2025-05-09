<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Message de contact</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
        }

        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 40px auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #333333;
            margin-bottom: 10px;
        }

        .info {
            margin: 20px 0;
        }

        .info p {
            margin: 20px 0;
            color: #555555;
        }

        .content {
            background-color: #f0f2f5;
            padding: 15px;
            border-radius: 6px;
            color: #333333;
        }

        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999999;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>📨 Nouveau message de contact</h2>

        <div class="info">
            <p><strong>Nom :</strong> {{ $user->prenom }} {{ $user->nom }}</p>
            <p><strong>Email :</strong> {{ $user->email }}</p>
            <p><strong>Sujet :</strong> {{ $sujet }}</p>
        </div>

        <div class="content">
            <p>{{ $contenu }}</p>
        </div>

        <div class="footer">
            Ce message a été envoyé via le formulaire de contact du portail des chercheurs.
        </div>
    </div>
</body>

</html>
