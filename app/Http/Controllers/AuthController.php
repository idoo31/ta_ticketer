<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Show the user registration form.
     *
     * @return \Illuminate\View\View
     */
    public function showRegistrationForm(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:150', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'customer', // Hardcoded role to prevent privilege escalation
        ]);

        Auth::login($user);

        return redirect()->route('home')->with('success', 'Registration successful! Welcome to TICKETER.');
    }

    /**
     * Handle an authentication attempt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function showLoginForm(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function authenticate(Request $request): RedirectResponse
    {
        // Validate the incoming request
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Attempt to authenticate the user
        if (Auth::attempt($credentials)) {
            // Prevent session fixation attacks
            $request->session()->regenerate();

            // Redirect based on role
            if (Auth::user()->isAdmin()) {
                return redirect()->route('admin.dashboard');
            }

            return redirect()->intended(route('home'));
        }

        // Authentication failed, redirect back with error
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        // Invalidate the session
        $request->session()->invalidate();

        // Regenerate the CSRF token
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
