<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\WifiPackage;
use App\Models\Subscription;
use Illuminate\Database\Seeder;

class QuickSubscriptionSeeder extends Seeder
{
    public function run()
    {
        // 1. Ensure a Package exists (use existing seeded package)
        $package = WifiPackage::firstOrCreate(
            ['name' => 'Starter Home'],
            [
                'speed' => '20 Mbps',
                'price' => 250000,
                'description' => '1-3 Perangkat, Browsing & Social Media, Streaming HD 720p, Support 24/7',
                'is_active' => true
            ]
        );

        // 2. Find the test user (assuming the last created customer or specific email)
        // Target: kemal@gmail.con and kemal@gmail.com
        $user = User::where('email', 'kemal@gmail.con')->first();
        if (!$user) {
            $user = User::create([
                'name' => 'Kemal',
                'email' => 'kemal@gmail.con',
                'password' => bcrypt('kemal123'),
                'role' => 'customer',
                'status' => 'active'
            ]);
        }

        // Also ensure kemal@gmail.com exists with same password
        $userCom = User::where('email', 'kemal@gmail.com')->first();
        if (!$userCom) {
            $userCom = User::create([
                'name' => 'Kemal',
                'email' => 'kemal@gmail.com',
                'password' => bcrypt('kemal123'),
                'role' => 'customer',
                'status' => 'active'
            ]);
        }
        
        if (!$user) {
            $this->command->info("Creating Kemal (customer).");
            $user = User::create([
                'name' => 'Kemal',
                'email' => 'kemal@gmail.con',
                'password' => bcrypt('kemal123'),
                'role' => 'customer',
                'status' => 'active'
            ]);
        } else {
            $this->command->info("Kemal already exists.");
        }

        // 3. Create Subscription
        $sub = Subscription::create([
            'user_id' => $user->id,
            'wifi_package_id' => $package->id,
            'installation_address' => 'Alamat pelanggan Kemal',
            'status' => 'active',
            'installation_date' => now()->subDays(10),
            'activated_at' => now()->subDays(9),
            'notes' => 'Generated for Kemal (installed)'
        ]);

        // Also create subscription for kemal@gmail.com
        Subscription::create([
            'user_id' => $userCom->id,
            'wifi_package_id' => $package->id,
            'installation_address' => 'Alamat pelanggan Kemal (email .com)',
            'status' => 'active',
            'installation_date' => now()->subDays(8),
            'activated_at' => now()->subDays(7),
            'notes' => 'Generated for Kemal (.com) (installed)'
        ]);

        $this->command->info("Subscription created for user: {$user->email}");
    }
}
