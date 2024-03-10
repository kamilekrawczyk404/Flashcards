<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;
use Laravel\SerializableClosure\UnsignedSerializableClosure;

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
        'avatar',
        'instagram',
        'twitter',
        'snapchat',
        'facebook'
    ];

    protected $attributes = [
        'instagram' => "",
        'twitter'=> "",
        'snapchat' => "",
        'facebook' => ""
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

    public static function getUserSocials(): object {
        return User::find(Auth::id())->get(['instagram', 'facebook', 'snapchat', 'twitter'])[0];
    }

}