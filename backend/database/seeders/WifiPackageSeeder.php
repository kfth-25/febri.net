<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WifiPackage;

class WifiPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Starter Home',
                'speed' => '20 Mbps',
                'price' => 250000,
                'description' => '1-3 Perangkat, Browsing & Social Media, Streaming HD 720p, Support 24/7',
                'is_active' => true,
            ],
            [
                'name' => 'Family Entertainment',
                'speed' => '50 Mbps',
                'price' => 350000,
                'description' => '4-7 Perangkat, Streaming 4K UHD, Zoom Meeting Lancar, Game Online Stabil',
                'is_active' => true,
            ],
            [
                'name' => 'Gamer & Creator',
                'speed' => '100 Mbps',
                'price' => 550000,
                'description' => '8-12 Perangkat, Upload Cepat (Simetris), Low Latency Gaming, Live Streaming',
                'is_active' => true,
            ],
            [
                'name' => 'Ultra Speed',
                'speed' => '200 Mbps',
                'price' => 850000,
                'description' => '15+ Perangkat, Smart Home Ready, Server Hosting Personal, Prioritas Support VIP',
                'is_active' => true,
            ],
        ];

        foreach ($packages as $pkg) {
            WifiPackage::firstOrCreate(
                ['name' => $pkg['name']],
                $pkg
            );
        }
    }
}
