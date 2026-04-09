<?php

namespace App\Http\Controllers;

use App\Models\NotificationPreference;
use Illuminate\Http\Request;

class NotificationPreferenceController extends Controller
{
    public function show(Request $request)
    {
        $pref = NotificationPreference::firstOrCreate(
            ['user_id' => $request->user()->id],
            []
        );
        return response()->json($pref);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'billing' => 'boolean',
            'outage' => 'boolean',
            'request' => 'boolean',
            'email_enabled' => 'boolean',
            'quiet_hours' => 'nullable|string|max:32',
        ]);

        $pref = NotificationPreference::firstOrCreate(
            ['user_id' => $request->user()->id],
            []
        );
        $pref->fill($validated);
        $pref->save();

        return response()->json($pref);
    }
}
