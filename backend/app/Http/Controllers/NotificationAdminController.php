<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationAdminController extends Controller
{
    public function test(Request $request, NotificationService $notifier)
    {
        $validated = $request->validate([
            'type' => 'required|string', // billing_due | payment_received | outage | request_update
            'title' => 'required|string',
            'body' => 'required|string',
            'user_id' => 'nullable|integer',
            'topic' => 'nullable|string',
            'data' => 'array',
            'email' => 'boolean',
        ]);

        $data = $validated['data'] ?? [];
        $result = [];

        if (!empty($validated['user_id'])) {
            $result['push_user'] = $notifier->sendPushToUser(
                (int)$validated['user_id'],
                $validated['title'],
                $validated['body'],
                $data,
                $validated['type']
            );

            if (!empty($validated['email'])) {
                $user = User::find($validated['user_id']);
                if ($user) {
                    $notifier->sendEmail($user, $validated['title'], $validated['body']);
                    $result['email'] = 'sent';
                }
            }
        } elseif (!empty($validated['topic'])) {
            $result['push_topic'] = $notifier->sendTopic(
                $validated['topic'],
                $validated['title'],
                $validated['body'],
                $data
            );
        } else {
            return response()->json(['error' => 'Provide user_id or topic'], 422);
        }

        return response()->json($result);
    }
}
