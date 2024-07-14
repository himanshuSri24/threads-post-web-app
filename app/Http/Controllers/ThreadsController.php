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

    public function createSinglePost($access_token, $user_id, $text, $media_type, $media_url) {

        // https://graph.threads.net/v1.0/{{threads-user-id}}/threads?media_type=TEXT&text=Test-001

        $response = null;

        if ($media_type === 'IMAGE') {
            $response = Http::post('https://graph.threads.net/v1.0/'.$user_id.'/threads?media_type='.$media_type.'&image_url='.urlencode($media_url).'&text='.$text, [
                'access_token' => $access_token,
            ]);
        } else if ($media_type === 'VIDEO') {
            $response = Http::post('https://graph.threads.net/v1.0/'.$user_id.'/threads?media_type='.$media_type.'&video_url='.$media_url.'&text='.$text, [
                'access_token' => $access_token,
            ]);
        } else if ($media_type === 'TEXT') {
            $response = Http::post('https://graph.threads.net/v1.0/'.$user_id.'/threads?media_type=TEXT&text='.$text, [
                'access_token' => $access_token,
            ]);
        }

        $threadData = $response->json();
        Log::info('Thread Data: '.json_encode($threadData));
        return $threadData;
    }

    public function postThread(Request $request)
    {
        $access_token = $request->input('access_token');
        $user_id = $request->input('user_id');
        $text = $request->input('text');
        $media_type = $request->input('media_type');
        $is_carousel_item = $request->input('is_carousel_item');
        $media_url = $request->input('media_url');

        $threadData = null;
        if (!$is_carousel_item) {
            $threadData = ThreadsController::createSinglePost($access_token, $user_id, $text, $media_type, $media_url);
        
        // https://graph.threads.net/v1.0/{{threads-user-id}}/threads?media_type=TEXT&text=Test-001

            $postId = $threadData['id'];

            // https://graph.threads.net/v1.0/{{threads-user-id}}/threads_publish?creation_id=17983446647700941&access_token={{access_token}}
            $response = Http::post('https://graph.threads.net/v1.0/'.$user_id.'/threads_publish?creation_id='.$postId, [
                'access_token' => $access_token,
            ]);  

            $final_data = $response->json();
            return response()->json($final_data);
        } else if ($is_carousel_item) {
            return response()->json([
                'message'=> 'Error: Carousel Item not supported yet',
            ]);
        }
    }
}