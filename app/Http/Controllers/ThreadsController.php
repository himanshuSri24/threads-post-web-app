<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ThreadsController extends Controller
{
    public function getUser(Request $request)
    {
        $accessToken = $request->input('access_token');

        $response = Http::get('https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url,threads_biography&access_token='.$accessToken);

        $userData = $response->json();

        return response()->json($userData);
    }
}
