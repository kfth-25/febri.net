<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
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
    public function update(Request $request, string $id)
    {
        $subscription = Subscription::findOrFail($id);
        $user = $request->user();

        // Only admin can update status and dates
        if ($user->role === 'admin') {
            $validated = $request->validate([
                'status' => 'in:pending,active,suspended,terminated',
                'installation_date' => 'nullable|date',
                'activated_at' => 'nullable|date',
                'expires_at' => 'nullable|date',
                'notes' => 'nullable|string',
            ]);
            
            $subscription->update($validated);
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
