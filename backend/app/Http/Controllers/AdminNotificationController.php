<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NotificationLog;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    public function index()
    {
        $users = User::where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role']);
        return view('admin.notifications', compact('users'));
    }

    public function send(Request $request, NotificationService $notifier)
    {
        $validated = $request->validate([
            'target'  => 'required|in:user,all',
            'user_id' => 'required_if:target,user|nullable|integer|exists:users,id',
            'type'    => 'required|string',
            'title'   => 'required|string|max:100',
            'body'    => 'required|string|max:400',
            'send_email' => 'nullable|boolean',
        ]);

        $result = [];

        if ($validated['target'] === 'user') {
            $result = $notifier->sendPushToUser(
                (int) $validated['user_id'],
                $validated['title'],
                $validated['body'],
                ['type' => $validated['type']],
                $validated['type']
            );

            if (!empty($validated['send_email'])) {
                $user = User::find($validated['user_id']);
                if ($user) {
                    $notifier->sendEmail($user, $validated['title'], $validated['body']);
                    $result['email'] = 'sent';
                }
            }

            return back()->with('success', 'Notifikasi berhasil dikirim ke pengguna!');
        }

        // Broadcast to all users via FCM topic
        $result = $notifier->sendTopic(
            'all_users',
            $validated['title'],
            $validated['body'],
            ['type' => $validated['type']]
        );

        return back()->with('success', 'Notifikasi broadcast berhasil dikirim ke semua pengguna!');
    }

    /**
     * API endpoint for React admin — send notification (returns JSON).
     */
    public function sendApi(Request $request, NotificationService $notifier)
    {
        $validated = $request->validate([
            'target'     => 'required|in:user,all',
            'user_id'    => 'required_if:target,user|nullable|integer|exists:users,id',
            'type'       => 'required|string',
            'title'      => 'required|string|max:100',
            'body'       => 'required|string|max:400',
            'send_email' => 'nullable|boolean',
        ]);

        $result = [];

        if ($validated['target'] === 'user') {
            $result['push'] = $notifier->sendPushToUser(
                (int)$validated['user_id'],
                $validated['title'],
                $validated['body'],
                ['type' => $validated['type']],
                $validated['type']
            );
            if (!empty($validated['send_email'])) {
                $user = User::find($validated['user_id']);
                if ($user) { $notifier->sendEmail($user, $validated['title'], $validated['body']); }
                $result['email'] = 'sent';
            }
        } else {
            $result['push'] = $notifier->sendTopic(
                'all_users',
                $validated['title'],
                $validated['body'],
                ['type' => $validated['type']]
            );
        }

        return response()->json(['message' => 'Notifikasi berhasil dikirim', 'result' => $result]);
    }

    /**
     * Return notification logs for the React admin history tab.
     */
    public function logs()
    {
        $logs = NotificationLog::orderByDesc('created_at')->limit(100)->get();
        return response()->json($logs);
    }
}
