<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WifiPackageController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NetworkScanController;
use App\Http\Controllers\VoucherTransactionController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/packages', [WifiPackageController::class, 'index']);
Route::get('/packages/{id}', [WifiPackageController::class, 'show']);

// Speed Test Routes
Route::get('/speedtest/download', function () {
    // Generate 10MB of dummy data
    return response()->stream(function () {
        $chunk = str_repeat('0', 1024 * 1024); // 1MB chunk
        for ($i = 0; $i < 10; $i++) {
            echo $chunk;
            flush();
        }
    }, 200, [
        'Content-Type' => 'application/octet-stream',
        'Content-Disposition' => 'attachment; filename="speedtest.bin"',
        'Cache-Control' => 'no-cache, no-store, must-revalidate',
        'Pragma' => 'no-cache',
        'Expires' => '0',
    ]);
});
Route::post('/speedtest/upload', function () {
    return response()->json(['status' => 'success']);
})->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class]);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // User Routes
    Route::put('/users/{id}/change-password', [UserController::class, 'changePassword']);
    Route::apiResource('users', UserController::class);

    // Wifi Package Routes
    Route::apiResource('packages', WifiPackageController::class);
    
    // Subscription Routes
    Route::apiResource('subscriptions', SubscriptionController::class);

    // Voucher Transactions
    Route::get('/voucher-transactions', [VoucherTransactionController::class, 'index']);
    Route::post('/voucher-transactions', [VoucherTransactionController::class, 'store']);

    // Issue Routes
    Route::apiResource('issues', \App\Http\Controllers\IssueController::class);

    Route::post('/network-scans', [NetworkScanController::class, 'store']);
});
