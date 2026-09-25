<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile
Route::middleware('auth')->group(function () {

    Route::get('/profile', [
        ProfileController::class,
        'edit'
    ])->name('profile.edit');

    Route::patch('/profile', [
        ProfileController::class,
        'update'
    ])->name('profile.update');

    Route::delete('/profile', [
        ProfileController::class,
        'destroy'
    ])->name('profile.destroy');
});

// Home
Route::get('/', function () {
    return redirect()->route('posts.index');
});

// IMPORTANT: Keep statistics before resource route.
Route::get('/posts/statistics', [
    PostController::class,
    'statistics'
])->name('posts.statistics');

// Posts
Route::resource('posts', PostController::class);

// Authentication
require __DIR__ . '/auth.php';