<?php

namespace App\Http\Middleware;

use App\Models\FlashcardSets;
use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ValidateUserCanEditSet
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
//        dd($request->set_id);

        if (Auth::id() === FlashcardSets::where(['user_id' => Auth::id(), 'id' => $request->set_id])->value('user_id'))
            return $next($request);

        return redirect(RouteServiceProvider::HOME);
    }
}