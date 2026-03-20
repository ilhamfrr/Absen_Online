<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AttendanceController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::get('/attendance/stats', [AttendanceController::class, 'stats']);
    Route::post('/checkin', [AttendanceController::class, 'checkIn']);
    Route::post('/checkout', [AttendanceController::class, 'checkOut']);
});
