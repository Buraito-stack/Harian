<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harian</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen flex items-center justify-center" 
      style="background-image: url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1794&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); 
             background-size: cover; 
             background-position: center;">
    <div class="bg-white bg-opacity-80 shadow-lg rounded-lg px-8 pt-6 pb-8 w-full max-w-lg backdrop-blur-md">
        <h1 class="text-3xl font-bold text-center text-blue-800 mb-6">Harian Beta Todolist</h1>

        <ul class="divide-y divide-gray-300 mb-6">
            @foreach ($tasks as $task)
                <li class="py-4 flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold {{ $task->is_completed ? 'line-through text-gray-400' : 'text-blue-900' }}">{{ $task->title }}</h3>
                        <p class="text-sm text-gray-500">{{ $task->description }}</p>
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
            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Add Task</button>
        </form>
    </div>
</body>
</html>
