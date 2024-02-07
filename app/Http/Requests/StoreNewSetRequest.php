<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNewSetRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|unique:flashcard_sets|min:6|max:100',
            'description' => 'required',
            'languages' => 'required',
            'translations' => 'array|min:2'
        ];
    }

    public function messages(): array
    {
        return [
            "title.unique" => "This name of the set is already taken!\r\n",
            "title.min" => "Name of the set is too short (min length: :min chars)\r\n",
            "title.max" => "Name of the set is too long (max length: :max chars)\r\n",
            "translations.min" => "You need to create at least two translations\r\n"
        ];
    }
}