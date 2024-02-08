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
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $filename = "";

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');


            if ($file !== 'default.png' && Storage::fileExists('public/users_avatars/' . User::getAvatarName())) {
                Storage::delete('public/users_avatars/' . User::getAvatarName());
            }

            $filename = 'avatar_user_' . Auth::id() . '_' . $file->getClientOriginalName();

            $file->storeAs('public/users_avatars', $filename);

        }

        $request->user()->fill([
            $request->validated(),
            'avatar' => $filename
        ]);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function update_socials(Request $request): RedirectResponse {
        User::where('id', Auth::id())->update([
            'social_media_links' => $request->all()
        ]);

        return Redirect::route('profile.edit');
    }

    public function delete_social(Request $request): RedirectResponse {
        $socialLinks = Auth::user()->social_media_links;

        $socialLinks[$request->get('name')] = null;

        User::where('id', Auth::id())->update([
            'social_media_links' => $socialLinks
        ]);

        return Redirect::route('profile.edit');
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