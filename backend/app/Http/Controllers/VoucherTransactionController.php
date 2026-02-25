<?php

namespace App\Http\Controllers;

use App\Models\VoucherTransaction;
use App\Models\WifiPackage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VoucherTransactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = VoucherTransaction::with('wifiPackage')
            ->where('user_id', $user->id)
            ->latest();

        if ($request->boolean('summary')) {
            $transactions = $query->get();

            $total = $transactions->count();

            $packages = $transactions
                ->groupBy('wifi_package_id')
                ->map(function ($items) {
                    $first = $items->first();
                    $package = $first->wifiPackage;

                    return [
                        'wifi_package_id' => $package?->id,
                        'name' => $package?->name,
                        'speed' => $package?->speed,
                        'count' => $items->count(),
                        'last_used_at' => optional($first->created_at)->toIso8601String(),
                    ];
                })
                ->values();

            $mostUsed = $packages->sortByDesc('count')->first();

            return response()->json([
                'total_transactions' => $total,
                'packages' => $packages,
                'most_used_package' => $mostUsed ?: null,
            ]);
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'wifi_package_id' => 'required|exists:wifi_packages,id',
        ]);

        $user = $request->user();

        $package = WifiPackage::find($validated['wifi_package_id']);

        $transaction = VoucherTransaction::create([
            'user_id' => $user->id,
            'wifi_package_id' => $validated['wifi_package_id'],
            'amount' => $package?->price,
            'voucher_code' => strtoupper(Str::random(8)),
        ]);

        return response()->json($transaction->load('wifiPackage'), 201);
    }
}

