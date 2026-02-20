<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin already exists to avoid duplicates
        if (!User::where('email', 'admin@wifi.net')->exists()) {
            User::create([
                'name' => 'Administrator',
                'email' => 'admin@wifi.net',
                'password' => Hash::make('password123'),
                // Add any other required fields here based on your migration
            ]);
        }
    }
}
