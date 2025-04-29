<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Publication;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Publication $publication)
    {
        // Charge les commentaires avec l'auteur
        return $publication->comments()
            ->with('chercheur:id,nom,prenom,photoProfil')
            ->orderBy('created_at','desc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'publication_id' => 'required|exists:publications,id',
            'contenu'        => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'chercheur_id'   => auth()->id(),
            'publication_id' => $request->publication_id,
            'contenu'        => $request->contenu,
        ]);

        return $comment->load('chercheur');
    }

    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $request->validate(['contenu' => 'required|string|max:1000']);

        $comment->update(['contenu' => $request->contenu]);

        return $comment->fresh('chercheur');
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);
        $comment->delete();
        return response()->noContent();
    }
}
