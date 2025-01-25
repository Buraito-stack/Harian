<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::query()
            ->when($request->filter, function ($query, $filter) {
                if ($filter === 'completed') {
                    $query->where('is_completed', true);
                } elseif ($filter === 'incomplete') {
                    $query->where('is_completed', false);
                }
            })
            ->when($request->sort, function ($query, $sort) {
                if ($sort === 'priority') {
                    $query->orderByRaw("FIELD(priority, 'High', 'Medium', 'Low')");
                } elseif ($sort === 'deadline') {
                    $query->orderBy('deadline');
                }
            })
            ->get();

        return view('tasks.index', compact('tasks'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:Low,Medium,High',
            'deadline' => 'nullable|date',
        ]);

        Task::create($validated);
        return redirect()->back()->with('success', 'Task created successfully!');
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_completed' => 'required|boolean',
            'priority' => 'required|in:Low,Medium,High',
            'deadline' => 'nullable|date',
        ]);

        $task->update($validated);
        return redirect()->back()->with('success', 'Task updated successfully!');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->back()->with('success', 'Task deleted successfully!');
    }
}