<?php

use App\Http\Controllers\ThreadsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/greet', function () {
    return response()->json(['message' => 'hello world']);
});

// Threads Routes
Route::post('/threads/get-user', [ThreadsController::class, 'getUser'])->name('threads.getUser');
Route::post('/threads/create-post-object', [ThreadsController::class, 'createPostObject'])->name('threads.createPostObject');
Route::post('/threads/create-carousel-container', [ThreadsController::class, 'createCarouselContainer'])->name('threads.createCarouselContainer');
Route::post('/threads/create-post', [ThreadsController::class, 'createPost'])->name('threads.createPost');