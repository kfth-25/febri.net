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
        return WifiPackage::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'speed' => 'required|string|max:50',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

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
        $package = WifiPackage::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'speed' => 'string|max:50',
            'price' => 'numeric',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $package->update($validated);

        return response()->json($package);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $package = WifiPackage::findOrFail($id);
        $package->delete();

        return response()->json(['message' => 'Package deleted successfully']);
    }
}
