<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // Billing reminders daily at 09:00
        $schedule->command('notifications:billing-reminders')->dailyAt('09:00');

        // Critical outage notifications hourly
        $schedule->command('notifications:critical-outages')->hourly();
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
    }
}
