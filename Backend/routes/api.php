<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AdminAccess;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MajorController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\ConnectionController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\DonationPostController;
use App\Http\Controllers\RegistrationController;

// Guest Routes
Route::middleware('guest')->post('/admin_login', [LoginController::class, 'adminLogin']);
Route::middleware('auth:sanctum')->get('/admins', [AdminController::class, 'index']);

// Admin Routes
Route::middleware('auth:sanctum')->post('/admin_logout', [LoginController::class, 'adminLogout']);
Route::middleware('auth:sanctum')->post('/admin_change_password', [LoginController::class, 'changePassword']);
Route::middleware('auth:sanctum')->post('/register_user', [UserController::class, 'create']);
Route::middleware('auth:sanctum')->get('/view_all_students', [UserController::class, 'viewAllStudents']);
Route::middleware('auth:sanctum')->get('/view_all_alumni', [UserController::class, 'viewAllAlumni']);
Route::middleware('auth:sanctum')->get('/view_all_users', [UserController::class, 'index']);
Route::middleware('auth:sanctum')->put('/edit_users/{userToBeEdited}', [UserController::class, 'update']);
Route::middleware('auth:sanctum')->put('/change_password', [UserController::class, 'changePassword']);
Route::middleware('auth_sanctum')->put('/deactivate_user/{user}', [UserController::class, 'deactivate']);
Route::middleware('auth:sanctum')->delete('/delete_user/{user}', [UserController::class, 'destroy']);
Route::middleware('auth:sanctum')->get('admin_dashboard', [AdminAccess::class, 'index']);

// User Routes
Route::middleware('guest')->post('/user_login', [LoginController::class, 'userLogin']);
Route::middleware('auth:sanctum')->post('/user_logout', [LoginController::class, 'userLogout']);
Route::middleware('guest')->post('/forgot_password', [LoginController::class, 'userForgotPassword']);
Route::middleware('guest')->post('/reset_password', [LoginController::class, 'userResetPassword']);
Route::middleware('auth:sanctum')->get('/connected_users', [UserController::class, 'viewConnectedUsers']);
Route::middleware('auth:sanctum')->get('/search_users', [UserController::class, 'search']);
// Discussion Routes
Route::middleware('auth:sanctum')->get('/view_connected_users_discussion', [DiscussionController::class, 'viewConnectedUsersDiscussion']);
Route::middleware('auth:sanctum')->get('/view_comments/{discussion}', [DiscussionController::class, 'viewComments']);
Route::middleware('auth:sanctum')->get('/view_my_own_discussion', [DiscussionController::class, 'viewMyOwnDiscussion']);
Route::middleware('auth:sanctum')->post('/create_discussion', [DiscussionController::class, 'create']);
Route::middleware('auth:sanctum')->put('/edit_discussion/{discussion}', [DiscussionController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/delete_discussion/{discussion}', [DiscussionController::class, 'destroy']);
Route::middleware('auth:sanctum')->get('/search_discussions', [DiscussionController::class, 'search']);
Route::middleware('auth:sanctum')->post('/create_comment/{discussion}', [CommentController::class, 'create']);
Route::middleware('auth:sanctum')->delete('/delete_comment/{comment}', [CommentController::class, 'destroy']);
// Donation Routes
Route::middleware('auth:sanctum')->get('/view_all_donation_posts', [DonationPostController::class, 'index']);
Route::middleware('auth:sanctum')->get('/view_all_donations', [DonationController::class, 'index']);
Route::middleware('auth:sanctum')->get('/view_donations_by_donation_post/{donationPost}', [DonationPostController::class, 'getDonationPostsByDonationId']);
Route::middleware('auth:sanctum')->get('/search_donation_posts', [DonationPostController::class, 'search']);
// Admin routes for Donation posts
Route::middleware('auth:sanctum')->post('/create_donation_post', [DonationPostController::class, 'create']);
Route::middleware('auth:sanctum')->put('/edit_donation_post/{donationPost}', [DonationPostController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/cancel_donation_post/{donationPost}', [DonationPostController::class, 'cancelDonationPost']);
// Event Routes
Route::middleware('auth:sanctum')->get('/view_all_events', [EventController::class, 'index']);
Route::middleware('auth:sanctum')->get('/view_past_events', [EventController::class, 'viewPastEvents']);
Route::middleware('auth:sanctum')->get('/view_upcoming_events', [EventController::class, 'viewUpcomingEvents']);
Route::middleware('auth:sanctum')->post('/create_event', [EventController::class, 'create']);
Route::middleware('auth:sanctum')->put('/edit_event/{event}', [EventController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/cancel_event/{event}', [EventController::class, 'destroy']);
Route::middleware('auth:sanctum')->get('/view_event/{event}', [EventController::class, 'viewSingleEvent']);
Route::middleware('auth:sanctum')->get('/view_my_upcoming_events', [EventController::class, 'myUpcomingEvents']);
Route::middleware('auth:sanctum')->get('/search_events', [EventController::class, 'search']);
// Registration Routes
Route::middleware('auth:sanctum')->get('/view_my_registrations', [RegistrationController::class, 'index']);
Route::middleware('auth:sanctum')->get('/joined_past_events', [RegistrationController::class, 'joinedPastEvents']);
Route::middleware('auth:sanctum')->post('/register_for_event/{event}', [RegistrationController::class, 'create']);
Route::middleware('auth:sanctum')->delete('/delete_registration/{registration}', [RegistrationController::class, 'destroy']);
// Feedback Routes
Route::middleware('auth:sanctum')->post('/give_feedback/{event}', [FeedbackController::class, 'create']);
Route::middleware('auth:sanctum')->get('/view_feedback/{event}', [FeedbackController::class, 'index']);
Route::middleware('auth:sanctum')->put('/edit_feedback/{feedback}', [FeedbackController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/delete_feedback/{feedback}', [FeedbackController::class, 'destroy']);
// Connection Routes
Route::middleware('auth:sanctum')->post('/connect/{acceptingUser}', [ConnectionController::class, 'create']);
Route::middleware('auth:sanctum')->get('/view_pending_connections', [ConnectionController::class, 'viewPendingConnections']);
Route::middleware('auth:sanctum')->get('/view_pending_to_accept_connections', [ConnectionController::class, 'viewPendingToAcceptConnections']);
Route::middleware('auth:sanctum')->put('/update_connection/{connection}', [ConnectionController::class, 'edit']);
// Major Routes
Route::middleware('auth:sanctum')->post('/create_major', [MajorController::class, 'create']);
Route::middleware('auth:sanctum')->put('/edit_major/{major}', [MajorController::class, 'update']);
// Faculty Routes
Route::middleware('auth:sanctum')->get('/view_all_faculties', [FacultyController::class, 'index']);
Route::middleware('auth:sanctum')->post('/create_faculty', [FacultyController::class, 'create']);
Route::middleware('auth:sanctum')->put('/edit_faculty/{faculty}', [FacultyController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/delete_faculty/{faculty}', [FacultyController::class, 'destroy']);


// Routes for logged in users
Route::middleware('auth:sanctum')->get('/view_all_majors', [MajorController::class, 'index']);
Route::middleware('auth:sanctum')->get('/discussions', [DiscussionController::class, 'index']);
Route::middleware('auth:sanctum')->get('/view_user/{user}', [UserController::class, 'show']);
Route::middleware('auth:sanctum')->get('/suggested_connections', [UserController::class, 'suggestedConnections']);

// Payment Gateway Routes
Route::prefix('donations')->group(function () {
    Route::get('/',                [DonationController::class, 'index']);
    Route::post('/create-donation/{donationPost}',   [DonationController::class, 'createOrder']);
    Route::post('/verify-payment/{donationPost}', [DonationController::class, 'verifyPayment']);
});

Route::post('/razorpay/webhook',   [DonationController::class, 'webhook']);
