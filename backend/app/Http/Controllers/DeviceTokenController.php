<?php

namespace App\Http\Controllers;

use App\Models\DeviceToken;
use Illuminate\Http\Request;

class DeviceTokenController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'platform' => 'nullable|string',
        ]);

        $dt = DeviceToken::updateOrCreate(
            ['token' => $validated['token']],
            [
                'user_id' => $request->user()->id,
                'platform' => $validated['platform'] ?? null,
                'last_seen_at' => now(),
            ]
        );

        return response()->json($dt, 201);
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
        ]);

        DeviceToken::where('token', $validated['token'])
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json(['status' => 'ok']);
    }
}
