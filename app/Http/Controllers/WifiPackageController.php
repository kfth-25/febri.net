<?php

namespace App\Http\Controllers;

use App\Models\WifiPackage;
use Illuminate\Http\Request;

class WifiPackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return WifiPackage::query()
            ->where('is_active', true)
            ->orderByDesc('is_recommended')
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'speed' => 'required|string|max:50',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'is_recommended' => 'boolean',
            'promo_label' => 'nullable|string|max:255',
            'original_price' => 'nullable|numeric',
            'promo_price' => 'nullable|numeric',
            'badge_new_until' => 'nullable|date',
        ]);

        $basePrice = $validated['original_price'] ?? $validated['price'] ?? null;
        if (array_key_exists('promo_price', $validated) && $validated['promo_price'] !== null) {
            if (!array_key_exists('original_price', $validated) || $validated['original_price'] === null) {
                $validated['original_price'] = $validated['price'];
                $basePrice = $validated['original_price'];
            }
            if ($validated['promo_price'] <= 0) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => ['promo_price' => ['Promo price harus lebih besar dari 0']]
                ], 422);
            }
            if ($basePrice !== null && $validated['promo_price'] >= $basePrice) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => ['promo_price' => ['Promo price harus lebih kecil dari harga dasar']]
                ], 422);
            }
        }

        $package = WifiPackage::create($validated);

        return response()->json($package, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return WifiPackage::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $package = WifiPackage::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'speed' => 'string|max:50',
            'price' => 'numeric',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'is_recommended' => 'boolean',
            'promo_label' => 'nullable|string|max:255',
            'original_price' => 'nullable|numeric',
            'promo_price' => 'nullable|numeric',
            'badge_new_until' => 'nullable|date',
        ]);

        $basePrice = $validated['original_price']
            ?? (array_key_exists('price', $validated) ? $validated['price'] : null)
            ?? $package->original_price
            ?? $package->price;
        if (array_key_exists('promo_price', $validated) && $validated['promo_price'] !== null) {
            if (!array_key_exists('original_price', $validated) || $validated['original_price'] === null) {
                $validated['original_price'] = array_key_exists('price', $validated)
                    ? $validated['price']
                    : ($package->original_price ?? $package->price);
                $basePrice = $validated['original_price'];
            }
            if ($validated['promo_price'] <= 0) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => ['promo_price' => ['Promo price harus lebih besar dari 0']]
                ], 422);
            }
            if ($basePrice !== null && $validated['promo_price'] >= $basePrice) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => ['promo_price' => ['Promo price harus lebih kecil dari harga dasar']]
                ], 422);
            }
        }

        $package->update($validated);

        return response()->json($package);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = request()->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $package = WifiPackage::findOrFail($id);
        $package->delete();

        return response()->json(['message' => 'Package deleted successfully']);
    }
}
