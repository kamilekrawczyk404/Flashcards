<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSetRequest extends FormRequest
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
            'title' => 'required|min:6|max:64' . ($this->isTitleDirty ? '|unique:flashcard_sets' : ''),
            'description' => $this->isDescriptionDirty ? 'required' : '',
            'translations' => ($this->isTranslationDirty ? 'array' : '')
        ];
    }

    public function messages(): array
    {
        return [
            "title.unique" => "This name of the set is already taken!\r\n",
            "title.min" => "Name of the set is too short (min length: :min chars)\r\n",
            "title.max" => "Name of the set is too long (max length: :max chars)\r\n",
        ];
    }
}