<?php

namespace App\Http\Controllers;

use App\Services\NetworkScannerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Subscription;

class NetworkScanController extends Controller
{
    public function store(Request $request, NetworkScannerService $scanner): JsonResponse
    {
        $user = $request->user();

        $hasActiveSubscription = Subscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->exists();

        if (!$hasActiveSubscription) {
            return response()->json([
                'success' => false,
                'message' => 'Fitur ini hanya tersedia untuk pelanggan dengan langganan aktif.',
            ], 403);
        }

        $start = microtime(true);
        $devices = $scanner->runArpScan();
        $serverIp = $scanner->getServerIp();

        $enriched = [];
        foreach ($devices as $device) {
            $ip = $device['ip_address'] ?? null;
            $mac = $device['mac_address'] ?? null;

            $vendor = $mac ? $scanner->lookupVendor($mac) : null;
            $isGateway = $ip ? $scanner->isGateway($ip) : false;

            $enriched[] = [
                'ip_address' => $ip,
                'mac_address' => $mac,
                'hostname' => $device['hostname'] ?? null,
                'vendor' => $vendor,
                'is_gateway' => $isGateway,
            ];
        }

        $duration = microtime(true) - $start;

        return response()->json([
            'success' => true,
            'scan_id' => null,
            'total_devices' => count($enriched),
            'scan_duration' => number_format($duration, 2) . 's',
            'scanned_at' => now()->toIso8601String(),
            'server_ip' => $serverIp,
            'devices' => $enriched,
        ]);
    }
}
