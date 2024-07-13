<?php

// app/Http/Middleware/AddCorsHeaders.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AddCorsHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Handle pre-flight OPTIONS requests
        if ($request->method() === 'OPTIONS') {
            $response->header('Access-Control-Allow-Origin', 'http://localhost:5173');
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization');
            $response->setStatusCode(200); // Explicitly set a 200 OK status for OPTIONS requests
        }

        return $response;
    }
}
