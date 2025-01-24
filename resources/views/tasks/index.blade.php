<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harian</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-blue-100 min-h-screen flex items-center justify-center">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h1 class="text-2xl font-bold text-center text-blue-700 mb-4">Todo List</h1>

        <!-- Display -->
        <ul class="space-y-2 mb-4">
            @foreach ($tasks as $task)
                <li class="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div>
                        <h3 class="font-semibold {{ $task->is_completed ? 'line-through text-gray-500' : 'text-blue-900' }}">{{ $task->title }}</h3>
                        <p class="text-sm text-gray-600">{{ $task->description }}</p>
                    </div>
                    <form action="{{ route('tasks.update', $task) }}" method="POST" class="inline">
                        @csrf
                        @method('PUT')
                        <input type="hidden" name="is_completed" value="{{ $task->is_completed ? 0 : 1 }}">
                        <button type="submit" class="text-sm text-blue-500 hover:underline">Mark as {{ $task->is_completed ? 'Incomplete' : 'Complete' }}</button>
                    </form>
                    <form action="{{ route('tasks.destroy', $task) }}" method="POST" class="inline">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-sm text-red-500 hover:underline">Delete</button>
                    </form>
                </li>
            @endforeach
        </ul>

        <!-- Tambah task baru -->
        <form action="{{ route('tasks.store') }}" method="POST" class="space-y-4">
            @csrf
            <div>
                <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" id="title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
            </div>
            <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Add Task</button>
        </form>
    </div>
</body>
</html>