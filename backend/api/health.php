<?php

/**
 * Health Check API Endpoint
 * Verifies system status and configuration
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../DynamoDBClient.php';

$status = [
    'status' => 'healthy',
    'timestamp' => date('c'),
    'services' => [
        'php' => [
            'status' => 'ok',
            'version' => PHP_VERSION
        ],
        'dynamodb' => [
            'status' => 'unknown',
            'configured' => false
        ]
    ]
];

// Check DynamoDB configuration
if (isAwsConfigured()) {
    $status['services']['dynamodb']['configured'] = true;

    try {
        $dynamodb = new DynamoDBClient();
        $tableInfo = $dynamodb->describeTable(DYNAMODB_TABLE);
        $status['services']['dynamodb']['status'] = 'ok';
        $status['services']['dynamodb']['table'] = DYNAMODB_TABLE;
        $status['services']['dynamodb']['itemCount'] = $tableInfo['Table']['ItemCount'] ?? 'unknown';
    } catch (Exception $e) {
        $status['services']['dynamodb']['status'] = 'error';
        $status['services']['dynamodb']['error'] = $e->getMessage();
    }
} else {
    $status['services']['dynamodb']['status'] = 'not_configured';
    $status['services']['dynamodb']['message'] = 'AWS credentials not set. Running in demo mode.';
}

sendJsonResponse($status);
