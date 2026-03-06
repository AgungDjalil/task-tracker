<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'due_date' => 'required|date',
            'category_id' => 'required|integer|exists:categories,id',
            'project_id' => 'required|integer|exists:projects,id'
        ]);

        $data = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'category_id' => $request->category_id,
            'project_id' => $request->project_id,
            'created_by' => $request->user()->id
        ]);

        return response()->json([
            'data' => $data
        ], 201);
    }

    public function index() {
        $tasks = Task::with(['project', 'category'])->get();

        return response()->json([
            'data' => $tasks
        ]);
    }

    public function tasksByProject($projectId) {
        $tasks = Task::where('project_id', $projectId)
            ->with('category')
            ->get();

        return response()->json([
            'data' => $tasks
        ]);
    }

    public function update(Request $request, $id) {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'category_id' => 'sometimes|integer|exists:categories,id'
        ]);

        $task->update($request->only('title', 'description', 'due_date', 'category_id'));

        return response()->json([
            'data' => $task
        ]);
    }

    public function destroy(Request $request, $id) {
        $task = Task::findOrFail($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->deleted_by = $request->user()->id;
        $task->save();

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }
}
