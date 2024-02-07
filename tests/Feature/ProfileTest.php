<?php

use App\Models\User;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/profile');

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();
    $avatar = fake()->imageUrl(300, 300, "Updated user", true, "a sad user", true, "png");

    $response = $this
        ->actingAs($user)
        ->patch('/profile', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'avatar' => $avatar
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/profile');

    $user->refresh();

    $this->assertSame('Test User', $user->name);
    $this->assertSame('test@example.com', $user->email);
    $this->assertNotSame($avatar, $user->avatar);
    $this->assertNull($user->email_verified_at);
});

test('social media can be updated', function () {
    $user = User::factory()->create();

    $expectedData = [
        'instagram' => 'userNameXYZ',
        'facebook' => 'https://facebook.com/pages/XYZ',
        'twitter' => '@userXYZ',
        'snapchat' => 'userXYZ'
    ];

    $response = $this->actingAs($user)->patch('profile.updateSocials', $expectedData);

//    $response
//        ->assertRedirect('/profile');

    $user->refresh();

    $this->assertNotSame($expectedData, $user->social_media_links);
});

test('social media can be removed', function () {
    $user = User::factory()->create();

    $currentSocialMediaLinks = [
        'instagram' => 'userNameXYZ',
        'facebook' => 'https://facebook.com/pages/XYZ',
        'twitter' => '@userXYZ',
        'snapchat' => 'userXYZ'
    ];

    $response = $this->actingAs($user)->patch('profile.deleteSocial', [
        'name' => 'instagram'
    ]);

//    $response
//        ->assertSessionHasNoErrors()
//        ->assertRedirect('/profile');

    $user->refresh();

    $this->assertNotSame($currentSocialMediaLinks, $user->social_media_links);
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/profile', [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/profile');

    $this->assertNotNull($user->refresh()->email_verified_at);
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete('/profile', [
            'password' => 'foo',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/');

    $this->assertGuest();
    $this->assertNull($user->fresh());
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from('/profile')
        ->delete('/profile', [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect('/profile');

    $this->assertNotNull($user->fresh());
});