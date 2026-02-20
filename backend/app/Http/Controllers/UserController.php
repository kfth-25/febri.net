<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        return $query->latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,technician,customer',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone' => $request->phone,
            'address' => $request->address,
            'status' => 'active',
        ]);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);
        return $user;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $currentUser = $request->user();

        // Allow Admin to update anyone
        // Allow User to update themselves
        if ($currentUser->role !== 'admin' && $currentUser->id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            // Only Admin can change role and status
            'role' => $currentUser->role === 'admin' ? 'sometimes|in:admin,technician,customer' : 'prohibited',
            'status' => $currentUser->role === 'admin' ? 'sometimes|in:active,inactive' : 'prohibited',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        // Prevent password update via this endpoint to enforce validation
        if ($request->has('password')) {
             return response()->json(['message' => 'Please use the change-password endpoint.'], 422);
        }

        $user->update($request->all());

        return $user;
    }

    /**
     * Change user password with validation.
     */
    public function changePassword(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $currentUser = $request->user();

        if ($currentUser->id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Password saat ini salah.'], 422);
        }

        $user->password = $request->new_password; // Model cast will hash it
        $user->save();

        return response()->json(['message' => 'Password berhasil diubah.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }
}
