<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MajorController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\RegistrationController;

// Guest Routes
Route::middleware('guest')->post('/admin_login', [LoginController::class, 'adminLogin']);
Route::middleware('auth:sanctum')->get('/admins', [AdminController::class, 'index']);

// Admin Routes
Route::middleware('auth:sanctum')->post('/admin_logout', [LoginController::class, 'adminLogout']);
Route::middleware('auth:sanctum')->post('/admin_change_password', [LoginController::class, 'changePassword']);
Route::middleware('auth:sanctum')->post('/register_user', [RegistrationController::class, 'create']);
Route::middleware('auth:sanctum')->get('/view_all_students', [UserController::class, 'viewAllStudents']);
Route::middleware('auth:sanctum')->get('/view_all_alumni', [UserController::class, 'viewAllAlumni']);
Route::middleware('auth:sanctum')->put('/edit_users/{userToBeEdited}', [UserController::class, 'update']);

// User Routes
Route::middleware('guest')->post('/user_login', [LoginController::class, 'userLogin']);
Route::middleware('auth:sanctum')->post('/user_logout', [LoginController::class, 'userLogout']);
Route::middleware('guest')->post('/forgot_password', [LoginController::class, 'userForgotPassword']);
Route::middleware('guest')->post('/reset_password', [LoginController::class, 'userResetPassword']);
Route::middleware('auth:sanctum')->get('/connected_users', [UserController::class, 'viewConnectedUsers']);
Route::middleware('auth:sanctum')->get('/view_connected_users_discussion', [DiscussionController::class, 'viewConnectedUsersDiscussion']);
Route::middleware('auth:sanctum')->get('/view_all_discussions', [DiscussionController::class, 'index']);

// Routes for logged in users
Route::middleware('auth:sanctum')->get('/view_all_majors', [MajorController::class, 'index']);
Route::middleware('auth:sanctum')->get('/discussions', [DiscussionController::class, 'index']);