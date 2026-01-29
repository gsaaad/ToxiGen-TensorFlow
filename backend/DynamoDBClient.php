<?php

/**
 * DynamoDB Client Wrapper
 * Handles communication with AWS DynamoDB
 */

require_once __DIR__ . '/config.php';

class DynamoDBClient
{
    private $region;
    private $accessKey;
    private $secretKey;
    private $endpoint;
    private $service = 'dynamodb';

    public function __construct()
    {
        $this->region = AWS_REGION;
        $this->accessKey = AWS_ACCESS_KEY_ID;
        $this->secretKey = AWS_SECRET_ACCESS_KEY;
        $this->endpoint = DYNAMODB_ENDPOINT ?: "https://dynamodb.{$this->region}.amazonaws.com";
    }

    /**
     * Sign request using AWS Signature Version 4
     */
    private function signRequest($method, $uri, $payload, $headers)
    {
        $date = gmdate('Ymd\THis\Z');
        $dateShort = gmdate('Ymd');

        $headers['x-amz-date'] = $date;
        $headers['host'] = parse_url($this->endpoint, PHP_URL_HOST);

        // Create canonical request
        $canonicalHeaders = '';
        $signedHeaders = [];
        ksort($headers);
        foreach ($headers as $key => $value) {
            $canonicalHeaders .= strtolower($key) . ':' . trim($value) . "\n";
            $signedHeaders[] = strtolower($key);
        }
        $signedHeadersStr = implode(';', $signedHeaders);

        $payloadHash = hash('sha256', $payload);

        $canonicalRequest = implode("\n", [
            $method,
            $uri,
            '', // query string
            $canonicalHeaders,
            $signedHeadersStr,
            $payloadHash
        ]);

        // Create string to sign
        $credentialScope = "$dateShort/{$this->region}/{$this->service}/aws4_request";
        $stringToSign = implode("\n", [
            'AWS4-HMAC-SHA256',
            $date,
            $credentialScope,
            hash('sha256', $canonicalRequest)
        ]);

        // Calculate signature
        $kDate = hash_hmac('sha256', $dateShort, 'AWS4' . $this->secretKey, true);
        $kRegion = hash_hmac('sha256', $this->region, $kDate, true);
        $kService = hash_hmac('sha256', $this->service, $kRegion, true);
        $kSigning = hash_hmac('sha256', 'aws4_request', $kService, true);
        $signature = hash_hmac('sha256', $stringToSign, $kSigning);

        // Create authorization header
        $authorization = "AWS4-HMAC-SHA256 " .
            "Credential={$this->accessKey}/$credentialScope, " .
            "SignedHeaders=$signedHeadersStr, " .
            "Signature=$signature";

        $headers['Authorization'] = $authorization;

        return $headers;
    }

    /**
     * Make a request to DynamoDB
     */
    private function request($action, $payload)
    {
        $payloadJson = json_encode($payload);

        $headers = [
            'Content-Type' => 'application/x-amz-json-1.0',
            'X-Amz-Target' => "DynamoDB_20120810.$action"
        ];

        $headers = $this->signRequest('POST', '/', $payloadJson, $headers);

        $curlHeaders = [];
        foreach ($headers as $key => $value) {
            $curlHeaders[] = "$key: $value";
        }

        $ch = curl_init($this->endpoint);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payloadJson,
            CURLOPT_HTTPHEADER => $curlHeaders,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_TIMEOUT => 30
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new Exception("cURL error: $error");
        }

        $data = json_decode($response, true);

        if ($httpCode >= 400) {
            $errorMessage = $data['__type'] ?? 'Unknown error';
            throw new Exception("DynamoDB error: $errorMessage");
        }

        return $data;
    }

    /**
     * Scan table with optional filters
     */
    public function scan($tableName, $limit = 20, $lastKey = null, $filterExpression = null, $expressionValues = null)
    {
        $payload = [
            'TableName' => $tableName,
            'Limit' => $limit
        ];

        if ($lastKey) {
            $payload['ExclusiveStartKey'] = $lastKey;
        }

        if ($filterExpression && $expressionValues) {
            $payload['FilterExpression'] = $filterExpression;
            $payload['ExpressionAttributeValues'] = $expressionValues;
        }

        return $this->request('Scan', $payload);
    }

    /**
     * Get item by key
     */
    public function getItem($tableName, $key)
    {
        $payload = [
            'TableName' => $tableName,
            'Key' => $key
        ];

        return $this->request('GetItem', $payload);
    }

    /**
     * Put item
     */
    public function putItem($tableName, $item)
    {
        $payload = [
            'TableName' => $tableName,
            'Item' => $item
        ];

        return $this->request('PutItem', $payload);
    }

    /**
     * Batch write items
     */
    public function batchWriteItem($tableName, $items)
    {
        $requestItems = [];
        foreach ($items as $item) {
            $requestItems[] = [
                'PutRequest' => [
                    'Item' => $item
                ]
            ];
        }

        $payload = [
            'RequestItems' => [
                $tableName => $requestItems
            ]
        ];

        return $this->request('BatchWriteItem', $payload);
    }

    /**
     * Create table
     */
    public function createTable($tableName, $keySchema, $attributeDefinitions, $provisionedThroughput = null)
    {
        $payload = [
            'TableName' => $tableName,
            'KeySchema' => $keySchema,
            'AttributeDefinitions' => $attributeDefinitions,
            'BillingMode' => 'PAY_PER_REQUEST'
        ];

        if ($provisionedThroughput) {
            $payload['ProvisionedThroughput'] = $provisionedThroughput;
            $payload['BillingMode'] = 'PROVISIONED';
        }

        return $this->request('CreateTable', $payload);
    }

    /**
     * Describe table
     */
    public function describeTable($tableName)
    {
        return $this->request('DescribeTable', ['TableName' => $tableName]);
    }
}

/**
 * Helper function to convert DynamoDB item to standard format
 */
function dynamoToStandard($item)
{
    $result = [];
    foreach ($item as $key => $value) {
        $type = array_keys($value)[0];
        $result[$key] = $value[$type];
    }
    return $result;
}

/**
 * Helper function to convert standard format to DynamoDB item
 */
function standardToDynamo($item)
{
    $result = [];
    foreach ($item as $key => $value) {
        if (is_numeric($value)) {
            $result[$key] = ['N' => (string)$value];
        } elseif (is_bool($value)) {
            $result[$key] = ['BOOL' => $value];
        } else {
            $result[$key] = ['S' => (string)$value];
        }
    }
    return $result;
}
