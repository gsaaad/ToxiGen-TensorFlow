<?php

/**
 * Dataset API Endpoint
 * Retrieves toxicity dataset from DynamoDB
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/DynamoDBClient.php';

// Get query parameters
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$limit = isset($_GET['limit']) ? min(100, max(1, intval($_GET['limit']))) : 20;
$filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';
$search = isset($_GET['search']) ? $_GET['search'] : '';

try {
    // Check if AWS is configured
    if (!isAwsConfigured()) {
        // Return demo data if AWS is not configured
        sendJsonResponse([
            'items' => getDemoData($filter, $search, $page, $limit),
            'currentPage' => $page,
            'totalPages' => 5,
            'totalItems' => 100,
            'message' => 'Demo mode - Configure AWS credentials for real data'
        ]);
    }

    $dynamodb = new DynamoDBClient();

    // Build filter expression
    $filterExpression = null;
    $expressionValues = null;

    if ($filter === 'toxic') {
        $filterExpression = 'toxicity_label = :label';
        $expressionValues = [':label' => ['N' => '1']];
    } elseif ($filter === 'non-toxic') {
        $filterExpression = 'toxicity_label = :label';
        $expressionValues = [':label' => ['N' => '0']];
    }

    if (!empty($search)) {
        $searchFilter = 'contains(#text, :search)';
        if ($filterExpression) {
            $filterExpression .= ' AND ' . $searchFilter;
        } else {
            $filterExpression = $searchFilter;
        }
        $expressionValues = $expressionValues ?? [];
        $expressionValues[':search'] = ['S' => $search];
    }

    // Scan table
    $result = $dynamodb->scan(DYNAMODB_TABLE, $limit, null, $filterExpression, $expressionValues);

    // Convert items to standard format
    $items = [];
    if (isset($result['Items'])) {
        foreach ($result['Items'] as $item) {
            $items[] = dynamoToStandard($item);
        }
    }

    // Calculate pagination (simplified for DynamoDB)
    $totalItems = $result['Count'] ?? count($items);
    $totalPages = max(1, ceil($totalItems / $limit));

    sendJsonResponse([
        'items' => $items,
        'currentPage' => $page,
        'totalPages' => $totalPages,
        'totalItems' => $totalItems,
        'hasMore' => isset($result['LastEvaluatedKey'])
    ]);
} catch (Exception $e) {
    sendErrorResponse('Failed to fetch dataset: ' . $e->getMessage());
}

/**
 * Generate demo data when AWS is not configured
 */
function getDemoData($filter, $search, $page, $limit)
{
    $demoItems = [
        ['id' => '1', 'text' => 'This is a wonderful and positive message about community building.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '2', 'text' => 'I really appreciate the diverse perspectives shared in this discussion.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '3', 'text' => 'Everyone deserves to be treated with respect and dignity.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '4', 'text' => 'Sample toxic content - This text would contain harmful stereotypes.', 'toxicity_label' => 1, 'target_group' => 'general'],
        ['id' => '5', 'text' => 'The weather today is absolutely beautiful for outdoor activities.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '6', 'text' => 'Sample toxic content - Derogatory language placeholder.', 'toxicity_label' => 1, 'target_group' => 'general'],
        ['id' => '7', 'text' => 'Learning new things every day makes life more interesting.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '8', 'text' => 'Collaboration and teamwork lead to better outcomes for everyone.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '9', 'text' => 'Sample toxic content - Threatening language placeholder.', 'toxicity_label' => 1, 'target_group' => 'general'],
        ['id' => '10', 'text' => 'Music has the power to bring people together across cultures.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '11', 'text' => 'Reading books expands our understanding of different perspectives.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '12', 'text' => 'Sample toxic content - Insulting language placeholder.', 'toxicity_label' => 1, 'target_group' => 'general'],
        ['id' => '13', 'text' => 'Exercise and healthy eating contribute to overall wellbeing.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '14', 'text' => 'Technology can be a powerful tool for positive change when used responsibly.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '15', 'text' => 'Sample toxic content - Identity-based attack placeholder.', 'toxicity_label' => 1, 'target_group' => 'identity'],
        ['id' => '16', 'text' => 'Kindness and empathy make our communities stronger.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '17', 'text' => 'Education opens doors to new opportunities and possibilities.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '18', 'text' => 'Sample toxic content - Severe toxicity placeholder.', 'toxicity_label' => 1, 'target_group' => 'general'],
        ['id' => '19', 'text' => 'Art and creativity enrich our lives in countless ways.', 'toxicity_label' => 0, 'target_group' => 'none'],
        ['id' => '20', 'text' => 'Working together we can solve complex challenges.', 'toxicity_label' => 0, 'target_group' => 'none'],
    ];

    // Apply filter
    if ($filter === 'toxic') {
        $demoItems = array_filter($demoItems, fn($item) => $item['toxicity_label'] === 1);
    } elseif ($filter === 'non-toxic') {
        $demoItems = array_filter($demoItems, fn($item) => $item['toxicity_label'] === 0);
    }

    // Apply search
    if (!empty($search)) {
        $demoItems = array_filter(
            $demoItems,
            fn($item) =>
            stripos($item['text'], $search) !== false
        );
    }

    // Reset array keys
    $demoItems = array_values($demoItems);

    // Apply pagination
    $offset = ($page - 1) * $limit;
    return array_slice($demoItems, $offset, $limit);
}
