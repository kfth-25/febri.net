<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminNotificationController;

Route::get('/', function () {
    return view('welcome');
});

// Admin notification panel (no auth guard for now - can add later)
Route::get('/admin/notifications', [AdminNotificationController::class, 'index']);
Route::post('/admin/notifications/send', [AdminNotificationController::class, 'send']);
