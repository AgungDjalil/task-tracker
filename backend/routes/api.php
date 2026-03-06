<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::post("login", [AuthController::class, "login"]);
Route::post("logout", [AuthController::class, "logout"])->middleware('auth:sanctum');

Route::middleware("auth:sanctum")->group(function () {
    Route::get('tasks', [TaskController::class, "index"]);
    Route::post("create-task", [TaskController::class, "store"])->middleware('isAdmin');
    Route::patch('update-task/{id}', [TaskController::class, "update"])->middleware('isAdmin');
    Route::get('tasks-by-project/{projectId}', [TaskController::class, "tasksByProject"]);
    Route::delete('delete-task/{id}', [TaskController::class, "destroy"])->middleware('isAdmin');
});

Route::middleware("auth:sanctum")->group(function () {
    Route::get('projects', [ProjectController::class, "index"]);
    Route::post("create-project", [ProjectController::class, "store"])->middleware('isAdmin');
    Route::patch('update-project/{id}', [ProjectController::class, "update"])->middleware('isAdmin');
    Route::get('project/{id}', [ProjectController::class, "show"]);
});