<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'title'        => $this->faker->sentence,
            'description'  => $this->faker->paragraph,
            'is_completed' => $this->faker->boolean,
            'priority'     => $this->faker->randomElement(['Low', 'Medium', 'High']),
            'deadline'     => $this->faker->optional()->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
        ];
    }
}