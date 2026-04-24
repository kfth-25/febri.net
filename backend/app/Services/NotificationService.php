<?php

namespace App\Services;

use App\Models\DeviceToken;
use App\Models\NotificationPreference;
use App\Models\User;
use App\Models\NotificationLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    public function sendPushToUser(int $userId, string $title, string $body, array $data = [], string $type = 'general'): array
    {
        if (!$this->isAllowedByPreference($userId, $type)) {
            $this->log($userId, null, $type, 'push', $title, $body, 'skipped', 'preference_disabled', null, null);
            return ['skipped' => true, 'reason' => 'preference_disabled'];
        }
        if ($this->isSuppressedByQuietHours($userId, $type, $data)) {
            $this->log($userId, null, $type, 'push', $title, $body, 'skipped', 'quiet_hours', null, null);
            return ['skipped' => true, 'reason' => 'quiet_hours'];
        }

        $tokens = DeviceToken::where('user_id', $userId)->pluck('token')->all();
        if (empty($tokens)) {
            $this->log($userId, null, $type, 'push', $title, $body, 'skipped', 'no_tokens', null, null);
            return ['skipped' => true, 'reason' => 'no_tokens'];
        }

        $result = $this->postFcm([
            'registration_ids' => $tokens,
            'notification' => [
                'title' => $title,
                'body' => $body,
            ],
            'data' => array_merge($data, ['type' => $type]),
        ]);

        // Broadcast to Socket.io (real-time in-app)
        $this->postSocketIo('user-' . $userId, 'announcement', [
            'title' => $title,
            'body' => $body,
            ...$data,
            'type' => $type,
        ]);

        $this->log($userId, null, $type, 'push', $title, $body, 'sent', null, $result['status'] ?? null, $result['body'] ?? null);
        return $result;
    }

    public function sendTopic(string $topic, string $title, string $body, array $data = []): array
    {
        $result = $this->postFcm([
            'to' => '/topics/' . $topic,
            'notification' => [
                'title' => $title,
                'body' => $body,
            ],
            'data' => $data,
        ]);

        // Broadcast global Socket.io if topic is all_users
        if ($topic === 'all_users') {
            $this->postSocketIo(null, 'announcement', [
                'title' => $title,
                'body' => $body,
                ...$data,
            ]);
        }

        $this->log(null, $topic, $data['type'] ?? 'general', 'push', $title, $body, 'sent', null, $result['status'] ?? null, $result['body'] ?? null);
        return $result;
    }

    public function sendEmail(User $user, string $subject, string $textBody): void
    {
        $pref = NotificationPreference::firstOrCreate(['user_id' => $user->id], []);
        if (!$pref->email_enabled) {
            $this->log($user->id, null, 'email', 'email', $subject, $textBody, 'skipped', 'email_disabled', null, null);
            return;
        }
        Mail::raw($textBody, function ($message) use ($user, $subject) {
            $message->to($user->email)->subject($subject);
        });
        $this->log($user->id, null, 'email', 'email', $subject, $textBody, 'sent', null, null, null);
    }

    protected function postFcm(array $payload): array
    {
        $key = env('FCM_SERVER_KEY');
        if (!$key) {
            return ['error' => 'FCM_SERVER_KEY missing'];
        }
        /** @var Response $resp */
        $resp = Http::withHeaders([
            'Authorization' => 'key=' . $key,
            'Content-Type' => 'application/json',
        ])->post('https://fcm.googleapis.com/fcm/send', $payload);

        $status = method_exists($resp, 'status') ? $resp->status() : null;
        $body = method_exists($resp, 'json') ? $resp->json() : json_decode($resp->body(), true);
        return ['status' => $status, 'body' => $body];
    }

    protected function postSocketIo(?string $channel, string $event, array $data): void
    {
        try {
            Http::post('http://127.0.0.1:3000/api/broadcast', [
                'channel' => $channel,
                'event' => $event,
                'data' => $data,
            ]);
        } catch (\Throwable $e) {
            // Ignore socket io failure so FCM can still proceed
        }
    }

    protected function isAllowedByPreference(int $userId, string $type): bool
    {
        $pref = NotificationPreference::firstOrCreate(['user_id' => $userId], []);
        $map = [
            'billing_due' => 'billing',
            'payment_received' => 'billing',
            'outage' => 'outage',
            'request_update' => 'request',
        ];
        $field = $map[$type] ?? null;
        if ($field === null) {
            return true;
        }
        return (bool)($pref->$field ?? true);
    }

    protected function isSuppressedByQuietHours(int $userId, string $type, array $data): bool
    {
        $pref = NotificationPreference::firstOrCreate(['user_id' => $userId], []);
        $quiet = $pref->quiet_hours;
        if (!$quiet) {
            return false;
        }
        if ($type === 'outage' && (($data['priority'] ?? null) === 'critical')) {
            return false;
        }
        $parts = explode('-', $quiet);
        if (count($parts) !== 2) {
            return false;
        }
        [$startStr, $endStr] = $parts;
        try {
            $now = Carbon::now();
            [$sh, $sm] = array_map('intval', explode(':', $startStr));
            [$eh, $em] = array_map('intval', explode(':', $endStr));
            $start = (clone $now)->setTime($sh, $sm, 0);
            $end = (clone $now)->setTime($eh, $em, 0);
            if ($start->lessThanOrEqualTo($end)) {
                return $now->betweenIncluded($start, $end);
            }
            return $now->greaterThanOrEqualTo($start) || $now->lessThanOrEqualTo($end);
        } catch (\Throwable $e) {
            return false;
        }
    }

    protected function log(?int $userId, ?string $topic, ?string $type, string $channel, ?string $title, ?string $body, string $status, ?string $reason, ?int $providerStatus, $providerBody): void
    {
        try {
            NotificationLog::create([
                'user_id' => $userId,
                'topic' => $topic,
                'type' => $type,
                'channel' => $channel,
                'title' => $title,
                'body' => $body,
                'status' => $status,
                'reason' => $reason,
                'provider_status' => $providerStatus,
                'provider_body' => $providerBody,
            ]);
        } catch (\Throwable $e) {
            // Swallow logging errors to avoid breaking notifications
        }
    }
}
