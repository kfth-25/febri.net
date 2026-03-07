<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\WifiPackage;
use App\Models\Subscription;
use Illuminate\Support\Facades\Hash;

class ActiveSubscriberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Pastikan paket WiFi tersedia
        $package = WifiPackage::firstOrCreate(
            ['name' => 'Premium Home'],
            [
                'speed' => '50 Mbps',
                'price' => 350000,
                'description' => '3-5 Perangkat, Streaming 4K, Gaming Lancar',
                'is_active' => true,
                'promo_label' => 'Best Seller'
            ]
        );

        // 2. Buat user pelanggan aktif
        $email = 'subscriber@febri.net';
        $user = User::where('email', $email)->first();

        if (!$user) {
            $user = User::create([
                'name' => 'Pelanggan Setia',
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'customer',
                'phone' => '081234567890',
                'address' => 'Jl. Merdeka No. 45, Jakarta',
                'status' => 'active'
            ]);
            $this->command->info("User created: {$email}");
        } else {
            $this->command->info("User already exists: {$email}");
            // Pastikan password direset ke 'password' jika user sudah ada
            $user->update(['password' => Hash::make('password')]);
        }

        // 3. Buat langganan aktif jika belum ada
        $subscription = Subscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if (!$subscription) {
            Subscription::create([
                'user_id' => $user->id,
                'wifi_package_id' => $package->id,
                'installation_address' => $user->address ?? 'Alamat Instalasi Default',
                'installation_date' => now()->subMonths(2),
                'activated_at' => now()->subMonths(2),
                'status' => 'active',
                'notes' => 'Langganan aktif dibuat via seeder'
            ]);
            $this->command->info("Active subscription created for {$email}");
        } else {
            $this->command->info("User {$email} already has an active subscription");
        }
    }
}
