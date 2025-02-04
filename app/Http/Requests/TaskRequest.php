<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date'    => 'required|date|after:today',
            'priority'    => 'required|in:low,medium,high',
            'status'      => 'required|in:pending,in-progress,completed',
        ];
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'title.required'    => 'The task title is required.',
            'title.max'         => 'The task title may not be greater than 255 characters.',
            'due_date.required' => 'The due date is required.',
            'due_date.after'    => 'The due date must be a future date.',
            'priority.required' => 'The priority level is required.',
            'priority.in'       => 'The priority must be one of the following: low, medium, high.',
            'status.required'   => 'The task status is required.',
            'status.in'         => 'The status must be one of the following: pending, in-progress, completed.',
        ];
    }
}
