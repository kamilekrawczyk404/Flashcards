<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'social_media_links',
        'avatar'
    ];

    protected $attributes = [
        'social_media_links' => '{
            "instagram": null,
            "facebook": null,
            "x": null,
            "snapchat": null
        }'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'social_media_links' => 'json'
    ];

    public function sets(): HasMany {
        return $this->hasMany(FlashcardSets::class);
    }

    public function matchScores(): HasMany {
        return $this->hasMany(MatchScores::class);
    }
    public function setsProgress() {
        return $this->hasMany(FlashcardsSetsProgress::class);
    }

    public static function getAvatarName() {
        return User::where('id', Auth::id())->value('avatar');
    }
}