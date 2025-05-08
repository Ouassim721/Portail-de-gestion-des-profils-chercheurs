<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Chercheur;

class FollowController extends Controller
{

    public function follow(Chercheur $userToFollow)
    {
        $user = JWTAuth::user();
        if ($user->id === $userToFollow->id) {
            return response()->json(['message' => 'Vous ne pouvez pas vous suivre vous-même.'], 400);
        }

        $user->following()->syncWithoutDetaching([$userToFollow->id]);

        return response()->json(['message' => 'Suivi avec succès.']);
    }

    public function unfollow(Chercheur $userToUnfollow)
    {
        $user = JWTAuth::user();
        $user->following()->detach($userToUnfollow->id);

        return response()->json(['message' => 'Désabonné avec succès.']);
    }

    public function isFollowing(Chercheur $user)
    {
        $isFollowing = auth()->guard()->user()->following->contains($user->id);
        return response()->json(['isFollowing' => $isFollowing]);
    }
}
