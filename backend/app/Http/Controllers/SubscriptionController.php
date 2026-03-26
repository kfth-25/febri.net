<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $query = Subscription::with(['user', 'wifiPackage']);
            
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            return $query->latest()->get();
        } else {
            // Customer only sees their own subscriptions
            return Subscription::with(['wifiPackage'])
                ->where('user_id', $user->id)
                ->latest()
                ->get();
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'wifi_package_id' => 'required|exists:wifi_packages,id',
            'installation_address' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $user = $request->user();

        // If admin is creating, they might specify a user_id (future feature), 
        // for now let's assume current user or handle user_id if passed by admin
        $targetUserId = $user->id;
        if ($user->role === 'admin' && $request->has('user_id')) {
            $request->validate(['user_id' => 'exists:users,id']);
            $targetUserId = $request->user_id;
        }

        $subscription = Subscription::create([
            'user_id' => $targetUserId,
            'wifi_package_id' => $request->wifi_package_id,
            'installation_address' => $request->installation_address,
            'status' => 'pending',
            'notes' => $request->notes,
        ]);

        return response()->json($subscription->load(['wifiPackage', 'user']), 201);
    }

    /**
     * Register a new installation request from an unauthenticated user (guest).
     */
    public function registerGuest(Request $request)
    {
        $request->validate([
            'wifi_package_id' => 'required|exists:wifi_packages,id',
            'installation_address' => 'required|string',
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'notes' => 'nullable|string',
        ]);

        // Coba cari user berdasarkan email atau no HP
        $user = null;
        if ($request->email) {
            $user = \App\Models\User::where('email', $request->email)->first();
        }
        if (!$user && $request->phone) {
            $user = \App\Models\User::where('phone', $request->phone)->first();
        }

        // Jika belum ada, buatkan user baru otomatis
        if (!$user) {
            // Jika email kosong, generate email dummy dari nomor HP
            $email = $request->email ?? ($request->phone . '@customer.local');
            
            // Cek sekali lagi memastikan email ini unik
            if (\App\Models\User::where('email', $email)->exists()) {
                $email = uniqid('user_') . '@customer.local';
            }

            $user = \App\Models\User::create([
                'name' => $request->full_name,
                'email' => $email,
                'phone' => $request->phone,
                'password' => \Illuminate\Support\Facades\Hash::make('user123'), // Default password
                'role' => 'customer',
                'status' => 'active',
            ]);
        }

        $subscription = Subscription::create([
            'user_id' => $user->id,
            'wifi_package_id' => $request->wifi_package_id,
            'installation_address' => $request->installation_address,
            'status' => 'pending',
            'notes' => $request->notes,
        ]);

        return response()->json($subscription->load(['wifiPackage', 'user']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $subscription = Subscription::with(['user', 'wifiPackage'])->findOrFail($id);
        
        $user = Auth::user();
        if ($user->role !== 'admin' && $subscription->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $subscription;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id, NotificationService $notifier)
    {
        $subscription = Subscription::findOrFail($id);
        $user = $request->user();

        // Only admin can update status and dates
        if ($user->role === 'admin') {
            $validated = $request->validate([
                'status'            => 'nullable|in:pending,active,suspended,terminated',
                'installation_step' => 'nullable|in:pending,scheduled,installing,done',
                'installation_date' => 'nullable|date',
                'activated_at'      => 'nullable|date',
                'expires_at'        => 'nullable|date',
                'scheduled_at'      => 'nullable|date',
                'technician_notes'  => 'nullable|string|max:500',
                'notes'             => 'nullable|string',
            ]);

            $oldStep   = $subscription->installation_step;
            $oldStatus = $subscription->status;

            // Auto-set status=active when installation is done
            if (isset($validated['installation_step']) && $validated['installation_step'] === 'done') {
                $validated['status']       = 'active';
                $validated['activated_at'] = $validated['activated_at'] ?? now();
                if (empty($validated['expires_at'])) {
                    $validated['expires_at'] = now()->addDays(30);
                }
            }

            $subscription->update($validated);

            // Notify owner if installation_step changed
            if (isset($validated['installation_step']) && $validated['installation_step'] !== $oldStep) {
                $owner = $subscription->user;
                if ($owner) {
                    $stepLabels = [
                        'pending'    => 'Permohonan Diterima',
                        'scheduled'  => 'Dijadwalkan',
                        'installing' => 'Teknisi Dalam Pemasangan',
                        'done'       => 'Pemasangan Selesai',
                    ];
                    $newStep = $subscription->installation_step;
                    $label   = $stepLabels[$newStep] ?? $newStep;
                    $title   = 'Update Progres Pemasangan';
                    $body    = "Status pemasangan WiFi Anda: {$label}.";
                    $notifier->sendPushToUser(
                        $owner->id,
                        $title,
                        $body,
                        [
                            'subscription_id' => $subscription->id,
                            'installation_step' => $newStep,
                            'deeplink' => 'app://installation/status?id=' . $subscription->id,
                        ],
                        'request_update'
                    );
                    $notifier->sendEmail($owner, $title, $body);
                }
            }

            // Also notify if general status changed
            if (isset($validated['status']) && $validated['status'] !== $oldStatus) {
                $owner = $subscription->user;
                if ($owner) {
                    $newStatus = $subscription->status;
                    $title = 'Status Langganan Berubah';
                    $body  = 'Status langganan Anda sekarang: ' . $newStatus . '.';
                    $notifier->sendPushToUser(
                        $owner->id,
                        $title,
                        $body,
                        ['subscription_id' => $subscription->id, 'status' => $newStatus, 'deeplink' => 'app://installation/status?id='.$subscription->id],
                        'request_update'
                    );
                }
            }
        } else {
            // Customer can only update notes or address if pending
            if ($subscription->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            if ($subscription->status === 'pending') {
                $validated = $request->validate([
                    'installation_address' => 'required|string',
                    'notes' => 'nullable|string',
                ]);
                $subscription->update($validated);
            } else {
                return response()->json(['message' => 'Cannot update active subscription'], 403);
            }
        }

        return $subscription->load(['wifiPackage', 'user']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $subscription = Subscription::findOrFail($id);
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $subscription->delete();

        return response()->json(['message' => 'Subscription deleted']);
    }
}
