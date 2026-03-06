<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $data = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => $request->user()->id
        ]);

        return response()->json([
            'data' => $data
        ], 201);
    }

    public function index() {
        $projects = Project::all();

        return response()->json([
            'data' => $projects
        ]);
    }

    public function show($id) {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        return response()->json([
            'data' => $project
        ]);
    }

    public function update(Request $request, $id) {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:active,archived'
        ]);

        $project->update($request->only('name', 'description', 'status'));

        return response()->json([
            'data' => $project
        ]);
    }
}
