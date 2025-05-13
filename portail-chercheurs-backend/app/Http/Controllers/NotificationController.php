<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index(Request $request)
{
    if (!auth()->check()) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    try {
        $query = auth()->user()->notifications()
                    ->with('publication')
                    ->orderBy('created_at', 'desc');

        if ($request->boolean('unread')) {
           $query->where('is_read', false);
        }

        return response()->json($query->paginate(10));
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Server error',
            'details' => $e->getMessage()
        ], 500);
    }
}
    public function markAsRead(Request $request)
    {
        auth()->user()->notifications()
            ->whereIn('id', $request->ids)
            ->update(['is_read' => true]); 

        return response()->json(['message' => 'Notifications marquées comme lues']);
    }
}