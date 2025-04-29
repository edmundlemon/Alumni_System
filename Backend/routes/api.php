<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\Api\AdminController;

Route::middleware('auth:sanctum')->get('/admins', [AdminController::class, 'index']);
Route::middleware('guest')->post('/admin_login', [LoginController::class, 'login']);
Route::middleware('auth:sanctum')->post('/admin_logout', [LoginController::class, 'logout']);