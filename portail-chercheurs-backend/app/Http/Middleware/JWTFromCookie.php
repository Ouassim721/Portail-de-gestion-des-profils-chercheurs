<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

class JWTFromCookie
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('token');

        if ($token) {
            try {
                JWTAuth::setToken($token);
                $user = JWTAuth::authenticate();
                Auth::setUser($user);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Token invalide ou expiré'], 401);
            }
        }

        return $next($request);
    }
}
