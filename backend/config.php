<?php

/**
 * PHP Backend Configuration
 * Text Toxicity Analyzer - DynamoDB Configuration
 */

// Enable CORS for local development
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// AWS DynamoDB Configuration
define('AWS_REGION', getenv('AWS_REGION') ?: 'us-east-1');
define('AWS_ACCESS_KEY_ID', getenv('AWS_ACCESS_KEY_ID') ?: '');
define('AWS_SECRET_ACCESS_KEY', getenv('AWS_SECRET_ACCESS_KEY') ?: '');
define('DYNAMODB_TABLE', getenv('DYNAMODB_TABLE') ?: 'toxigen_dataset');
define('DYNAMODB_ENDPOINT', getenv('DYNAMODB_ENDPOINT') ?: ''); // For local DynamoDB

// Error reporting (disable in production)
ini_set('display_errors', 0);
error_reporting(E_ALL);

/**
 * Response helper functions
 */
function sendJsonResponse($data, $statusCode = 200)
{
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

function sendErrorResponse($message, $statusCode = 500)
{
    sendJsonResponse(['error' => $message], $statusCode);
}

/**
 * Check if AWS credentials are configured
 */
function isAwsConfigured()
{
    return !empty(AWS_ACCESS_KEY_ID) && !empty(AWS_SECRET_ACCESS_KEY);
}
