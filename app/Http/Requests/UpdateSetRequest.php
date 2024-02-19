<?php

namespace App\Http\Requests;

use App\Models\FlashcardSets;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'title' => ['required', 'min:6', 'max:64',Rule::unique(FlashcardSets::class)->ignore($this->set_id) ],
            'description' => 'required',
            'groups' => 'array|min:1',
            'groups.translations' => 'array|min:2'
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