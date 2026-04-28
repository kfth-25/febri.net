<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\WifiPackage;
use App\Models\Subscription;
use Carbon\Carbon;

class UserSubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cari user Febri User
        $user = User::where('email', 'user@febri.net')->first();
        
        // Cari paket Family Entertainment
        $package = WifiPackage::where('name', 'Family Entertainment')->first();

        if ($user && $package) {
            // Hapus data pemasangan lama jika ada agar bersih
            Subscription::where('user_id', $user->id)->delete();

            // Buat data langganan aktif
            Subscription::create([
                'user_id' => $user->id,
                'wifi_package_id' => $package->id,
                'status' => 'active',
                'installation_step' => 'done',
                'installation_address' => $user->address ?? 'Jl. Digital No. 101, Jakarta',
                'activated_at' => Carbon::now(),
                'expires_at' => Carbon::now()->addMonth(),
                'notes' => 'Status otomatis diaktifkan oleh sistem.',
            ]);

            // Update status user jadi active jika belum
            $user->update(['status' => 'active']);
            
            echo "Berhasil! User user@febri.net sekarang sudah berlangganan paket Family.\n";
        } else {
            echo "Gagal: User atau Paket tidak ditemukan.\n";
        }
    }
}
