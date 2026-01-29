<?php

/**
 * Statistics API Endpoint
 * Returns dataset statistics
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../DynamoDBClient.php';

try {
    if (!isAwsConfigured()) {
        // Return demo statistics
        sendJsonResponse([
            'totalItems' => 100,
            'toxicCount' => 30,
            'nonToxicCount' => 70,
            'targetGroups' => [
                'none' => 70,
                'general' => 20,
                'identity' => 10
            ],
            'mode' => 'demo'
        ]);
    }

    $dynamodb = new DynamoDBClient();

    // Get table info
    $tableInfo = $dynamodb->describeTable(DYNAMODB_TABLE);
    $totalItems = $tableInfo['Table']['ItemCount'] ?? 0;

    // Note: For accurate counts, you would need to scan the table
    // This is simplified for demonstration
    sendJsonResponse([
        'totalItems' => $totalItems,
        'tableName' => DYNAMODB_TABLE,
        'tableStatus' => $tableInfo['Table']['TableStatus'] ?? 'unknown',
        'mode' => 'production'
    ]);
} catch (Exception $e) {
    sendErrorResponse('Failed to fetch statistics: ' . $e->getMessage());
}
