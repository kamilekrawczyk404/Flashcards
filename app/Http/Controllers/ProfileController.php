<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'userSocialMedias' => User::getUserSocials()
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $filename = $request->avatar;

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');


            if ($file !== 'default.jpg' && Storage::fileExists('public/users_avatars/' . User::getAvatarName())) {
                Storage::delete('public/users_avatars/' . User::getAvatarName());
            }

            $filename = 'avatar_user_' . Auth::id() . '_' . $file->getClientOriginalName();

            $file->storeAs('public/users_avatars', $filename);

        }

        User::find(Auth::id())->update([
            'name' => $request->name,
            'email' => $request->email,
            'avatar' => $filename
        ]);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('success', 'Your profile has been updated successfully');
    }

    public function updateSocials(Request $request): RedirectResponse {
        foreach ($request->all() as $key => $value) {
            User::where('id', Auth::id())->update([
                $key => $value
            ]);
        }


        return Redirect::route('profile.edit')->with('success', 'Your social medias have been updated successfully');
    }

    public function deleteSocial(Request $request): RedirectResponse{
        User::where('id', Auth::id())->update([
            $request->get('name') => ""
        ]);

        return Redirect::route('profile.edit')->with('success', 'Your social medias have been updated successfully');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

}