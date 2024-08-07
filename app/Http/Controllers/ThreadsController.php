<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ThreadsController extends Controller
{
    // return user data
    public function getUser(Request $request)
    {
        $accessToken = $request->input('access_token');

        $response = Http::get('https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url,threads_biography&access_token='.$accessToken);

        $userData = $response->json();

        return response()->json($userData);
    }

    // create a single post object
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

    // creates a post on Threads
    public function createPost(Request $request) {
        $access_token = $request->input('access_token');
        $user_id = $request->input('user_id');
        $postId = $request->input('postId');
        $response = Http::post('https://graph.threads.net/v1.0/'.$user_id.'/threads_publish?creation_id='.$postId, [
            'access_token' => $access_token,
        ]);  

        $final_data = $response->json();
        return response()->json($final_data);
    }

    // creates a carousel container
    public function createCarouselContainer(Request $request) {
        $access_token = $request->input('access_token');
        $user_id = $request->input('user_id');
        $text = $request->input('text');
        $carouselIDsCommaSeperated = $request->input('carouselIDsCommaSeperated');

        // https://graph.threads.net/v1.0/{{threads-user-id}}/threads?is_carousel_item=true&media_type=TEXT&text=Test-001

        $response = null;
        
        $response = Http::post('https://graph.threads.net/v1.0/'.$user_id.'/threads?media_type=CAROUSEL&children='.$carouselIDsCommaSeperated.'&text='.$text, [ 
            'access_token' => $access_token,
        ]);
        
        $threadData = $response->json();
        return response()->json($threadData);
    }

    // create a single carousel post object
    public function createSingleCarouselPost($access_token, $user_id, $media_type, $media_url) {

        // https://graph.threads.net/v1.0/{{threads-user-id}}/threads?is_carousel_item=true&media_type=TEXT&text=Test-001

        $response = null;

        if ($media_type === 'IMAGE') {
            $response = Http::post('https://graph.threads.net/v1.0/'.$user_id.'/threads?is_carousel_item=true&media_type='.$media_type.'&image_url='.urlencode($media_url), [
                'access_token' => $access_token,
            ]);
        } else if ($media_type === 'VIDEO') {
            $response = Http::post('https://graph.threads.net/v1.0/'.$user_id.'/threads?is_carousel_item=true&media_type='.$media_type.'&video_url='.$media_url, [
                'access_token' => $access_token,
            ]);
        }

        $threadData = $response->json();
        Log::info('Thread Data: '.json_encode($threadData));
        return $threadData;
    }

    // create a post object
    public function createPostObject(Request $request)
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
            return response()->json($threadData);
        } else if ($is_carousel_item) {
            $threadData = ThreadsController::createSingleCarouselPost($access_token, $user_id, $media_type, $media_url);
            return response()->json($threadData);
        }
    }
}