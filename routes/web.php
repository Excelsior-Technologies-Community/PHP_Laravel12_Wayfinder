<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Dashboard route accessible only for authenticated and verified users
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Routes related to user profile management (edit, update, delete)
Route::middleware('auth')->group(function () {

    // Show profile edit page
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');

    // Update profile information
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Delete user profile
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Redirect home URL to posts page
Route::get('/', function () {
    return redirect('/posts');
});

// Resource routes for Post CRUD operations (index, create, store, show, edit, update, destroy)
Route::resource('posts', PostController::class);

// Include authentication routes (login, register, logout, etc.)
require __DIR__.'/auth.php';