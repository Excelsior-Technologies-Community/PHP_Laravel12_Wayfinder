<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\RouteMapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Interactive Route Map & Wayfinder TypeScript Studio
|--------------------------------------------------------------------------
*/

Route::get('/route-map', [
    RouteMapController::class,
    'index',
])->name('route-map.index');

Route::get('/route-map/export-ts', [
    RouteMapController::class,
    'exportTypescript',
])->name('route-map.export-ts');

Route::post('/route-map/benchmark', [
    RouteMapController::class,
    'benchmark',
])->name('route-map.benchmark');

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})
    ->middleware([
        'auth',
        'verified',
    ])
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::get(
        '/profile',
        [
            ProfileController::class,
            'edit',
        ]
    )->name('profile.edit');

    Route::patch(
        '/profile',
        [
            ProfileController::class,
            'update',
        ]
    )->name('profile.update');

    Route::delete(
        '/profile',
        [
            ProfileController::class,
            'destroy',
        ]
    )->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Home
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()
        ->route('posts.index');
});

/*
|--------------------------------------------------------------------------
| Post Statistics
|--------------------------------------------------------------------------
*/

Route::get(
    '/posts/statistics',
    [
        PostController::class,
        'statistics',
    ]
)->name('posts.statistics');

/*
|--------------------------------------------------------------------------
| Post Additional Features
|--------------------------------------------------------------------------
*/

Route::post(
    '/posts/bulk-delete',
    [
        PostController::class,
        'bulkDestroy',
    ]
)->name('posts.bulk-destroy');

Route::post(
    '/posts/{post}/duplicate',
    [
        PostController::class,
        'duplicate',
    ]
)->name('posts.duplicate');

Route::patch(
    '/posts/{post}/toggle-featured',
    [
        PostController::class,
        'toggleFeatured',
    ]
)->name('posts.toggle-featured');

Route::get(
    '/posts-export',
    [
        PostController::class,
        'export',
    ]
)->name('posts.export');

/*
|--------------------------------------------------------------------------
| Posts Resource
|--------------------------------------------------------------------------
*/

Route::resource(
    'posts',
    PostController::class
);

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

require __DIR__ . '/auth.php';