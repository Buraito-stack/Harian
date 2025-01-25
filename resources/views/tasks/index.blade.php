<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen flex items-center justify-center" 
      style="background-image: url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1794&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); 
             background-size: cover; 
             background-position: center;">
    <div class="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 w-full max-w-lg">
        <h1 class="text-3xl font-bold text-center text-blue-800 mb-6">Todo List</h1>

        <!-- Filters -->
        <div class="mb-4 flex justify-between items-center">
            <form method="GET" class="flex space-x-2">
                <select name="filter" class="border border-gray-300 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
                    <option value="">All</option>
                    <option value="completed">Completed</option>
                    <option value="incomplete">Incomplete</option>
                </select>
                <select name="sort" class="border border-gray-300 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
                    <option value="">Sort By</option>
                    <option value="priority">Priority</option>
                    <option value="deadline">Deadline</option>
                </select>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Apply</button>
            </form>
        </div>

        <!-- Display tasks -->
        <ul class="divide-y divide-gray-300 mb-6">
            @foreach ($tasks as $task)
                <li class="py-4 flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold {{ $task->is_completed ? 'line-through text-gray-400' : 'text-blue-900' }}">{{ $task->title }}</h3>
                        <p class="text-sm text-gray-500">{{ $task->description }}</p>
                        <p class="text-sm {{ $task->deadline && $task->deadline < now()->toDateString() ? 'text-red-500' : 'text-gray-500' }}">
                            Deadline: {{ $task->deadline ?? 'No deadline' }}
                        </p>
                        <p class="text-sm text-gray-500">Priority: <span class="font-bold {{ $task->priority === 'High' ? 'text-red-500' : ($task->priority === 'Medium' ? 'text-yellow-500' : 'text-green-500') }}">{{ $task->priority }}</span></p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <form action="{{ route('tasks.update', $task) }}" method="POST">
                            @csrf
                            @method('PUT')
                            <input type="hidden" name="is_completed" value="{{ $task->is_completed ? 0 : 1 }}">
                            <button type="submit" class="text-sm px-2 py-1 rounded {{ $task->is_completed ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white' }} hover:opacity-90">
                                {{ $task->is_completed ? 'Undo' : 'Complete' }}
                            </button>
                        </form>
                        <form action="{{ route('tasks.destroy', $task) }}" method="POST">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-sm px-2 py-1 rounded bg-red-500 text-white hover:opacity-90">Delete</button>
                        </form>
                    </div>
                </li>
            @endforeach
        </ul>

        <!-- Add new task -->
        <form action="{{ route('tasks.store') }}" method="POST" class="space-y-4">
            @csrf
            <div>
                <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" id="title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm" required>
            </div>
            <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm"></textarea>
            </div>
            <div>
                <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
                <select name="priority" id="priority" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <div>
                <label for="deadline" class="block text-sm font-medium text-gray-700">Deadline</label>
                <input type="date" name="deadline" id="deadline" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Add Task</button>
        </form>
    </div>
</body>
</html>
