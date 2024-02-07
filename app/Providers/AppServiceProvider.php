<?php

namespace App\Providers;

use Inertia\Inertia;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Session;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([ 'errorsFromController' => function () { return Session::get('errors') ? Session::get('errors')->getBag('default')->getMessages() : (object) []; }, 'base_url' => env('APP_URL') ]);
    }
    
}