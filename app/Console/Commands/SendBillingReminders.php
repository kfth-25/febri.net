<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Services\NotificationService;

class SendBillingReminders extends Command
{
    protected $signature = 'notifications:billing-reminders';
    protected $description = 'Send billing due reminders to customers (H-3 & H-1)';

    public function handle(NotificationService $notifier): int
    {
        $now = now();
        $count = 0;

        $subs = Subscription::with('user')
            ->where('status', 'active')
            ->whereNotNull('expires_at')
            ->get();

        foreach ($subs as $sub) {
            $expiresAt = $sub->expires_at;
            if (!$expiresAt) {
                continue;
            }
            $daysLeft = $expiresAt->diffInDays($now, false);
            // daysLeft > 0 means past due; for future use negative parameter? Use positive?
            // Using difference in days with false -> signed; if expiresAt > now, result positive? In Laravel, diffInDays(now,false) returns signed
            // To avoid confusion, compute as now->diffInDays(expiresAt,false)
            $daysUntil = $now->diffInDays($expiresAt, false);
            if ($daysUntil === 3 || $daysUntil === 1) {
                $dueLabel = $expiresAt->format('d M Y');
                $title = $daysUntil === 3
                    ? 'Tagihan Anda akan jatuh tempo (H-3)'
                    : 'Tagihan Anda jatuh tempo besok (H-1)';
                $body = "Tagihan paket Anda akan jatuh tempo pada {$dueLabel}. Mohon lakukan pembayaran tepat waktu.";

                $notifier->sendPushToUser(
                    $sub->user_id,
                    $title,
                    $body,
                    ['subscription_id' => $sub->id, 'due_date' => $dueLabel],
                    'billing_due'
                );
                $notifier->sendEmail($sub->user, $title, $body);
                $count++;
            }
        }

        $this->info("Billing reminders sent: {$count}");
        return Command::SUCCESS;
    }
}
