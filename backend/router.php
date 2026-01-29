<?php

/**
 * PHP Router for Development Server
 * Run with: php -S localhost:8000 router.php
 */

// Get the request URI
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Route API requests
if (strpos($path, '/api/') === 0) {
    $apiPath = substr($path, 4); // Remove '/api' prefix
    $apiFile = __DIR__ . '/api' . $apiPath;

    // Check if file exists
    if (file_exists($apiFile)) {
        require $apiFile;
        return true;
    }

    // Check with .php extension
    if (file_exists($apiFile . '.php')) {
        require $apiFile . '.php';
        return true;
    }

    // 404 for API routes
    header("Content-Type: application/json");
    http_response_code(404);
    echo json_encode(['error' => 'API endpoint not found']);
    return true;
}

// Serve static files or let PHP's built-in server handle it
return false;
