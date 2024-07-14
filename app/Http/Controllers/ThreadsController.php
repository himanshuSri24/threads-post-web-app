<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ThreadsController extends Controller
{
    public function getUser(Request $request)
    {
        $accessToken = $request->input('access_token');

        $response = Http::get('https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url,threads_biography&access_token='.$accessToken);

        $userData = $response->json();

        return response()->json($userData);
    }

    public function postThread(Request $request)
    {
        $access_token = $request->input('access_token');
        $user_id = $request->input('user_id');
        $text = $request->input('text');
        $media_type = $request->input('media_type');
        $is_carousel_item = $request->input('is_carousel_item');
        $image_url = $request->input('image_url');
        $video_url = $request->input('video_url');

        // https://graph.threads.net/v1.0/{{threads-user-id}}/threads?media_type=TEXT&text=Test-001

        $response = null;

        if($media_type === 'TEXT') {
            $response = Http::post('https://graph.threads.net/v1.0/'.$user_id.'/threads?media_type='.$media_type.'&text='.$text, [
                'access_token' => $access_token,
            ]);
        }

        $threadData = $response->json();
        return response()->json($threadData);
        $postId = $threadData['id'];

        // https://graph.threads.net/v1.0/{{threads-user-id}}/threads_publish?creation_id=17983446647700941&access_token={{access_token}}
        $response = Http::post('https://graph.threads.net/v1.0/'.$user_id.'/threads_publish?creation_id='.$postId, [
            'access_token' => $access_token,
        ]);  

        $final_data = $response->json();


        return response()->json($final_data);
    }
}
