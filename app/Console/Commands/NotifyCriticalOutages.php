<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Issue;
use App\Services\NotificationService;

class NotifyCriticalOutages extends Command
{
    protected $signature = 'notifications:critical-outages';
    protected $description = 'Notify customers about critical open outages';

    public function handle(NotificationService $notifier): int
    {
        $since = now()->subHours(24);
        $issues = Issue::with(['subscription.user'])
            ->where('status', 'open')
            ->where('priority', 'critical')
            ->where('created_at', '>=', $since)
            ->get();

        $count = 0;
        foreach ($issues as $issue) {
            $sub = $issue->subscription;
            if (!$sub || !$sub->user) {
                continue;
            }
            $title = 'Gangguan Jaringan (Kritis)';
            $body = 'Kami mendeteksi gangguan jaringan pada area Anda. Tim sedang menangani. Terima kasih atas kesabaran Anda.';
            $notifier->sendPushToUser(
                $sub->user->id,
                $title,
                $body,
                ['issue_id' => $issue->id, 'priority' => 'critical', 'deeplink' => 'app://support/outage?issue_id='.$issue->id],
                'outage'
            );
            $notifier->sendEmail($sub->user, $title, $body);
            $count++;
        }
        $this->info("Critical outage notifications sent: {$count}");
        return Command::SUCCESS;
    }
}
