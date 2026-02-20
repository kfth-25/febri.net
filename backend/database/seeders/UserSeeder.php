<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a regular customer user
        if (!User::where('email', 'user@febri.net')->exists()) {
            User::create([
                'name' => 'Febri User',
                'email' => 'user@febri.net',
                'password' => Hash::make('user123'),
                'role' => 'customer',
                'phone' => '08123456789',
                'address' => 'Jl. Digital No. 101, Jakarta',
                'status' => 'active',
            ]);
        }

        // Create a technician user
        if (!User::where('email', 'tech@febri.net')->exists()) {
            User::create([
                'name' => 'Febri Technician',
                'email' => 'tech@febri.net',
                'password' => Hash::make('tech123'),
                'role' => 'technician',
                'phone' => '08987654321',
                'address' => 'Jl. Network No. 202, Bandung',
                'status' => 'active',
            ]);
        }
    }
}
