<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordIsChanged
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->must_change_password) {
            $allowedRoutes = [
                'api/change-password',
                'api/logout',
                'api/me',
            ];

            $currentPath = $request->path();

            if (!in_array($currentPath, $allowedRoutes)) {
                return response()->json([
                    'message' => 'Vous devez changer votre mot de passe avant d\'accéder à cette ressource.',
                ], 403);
            }
        }

        return $next($request);
    }
}
