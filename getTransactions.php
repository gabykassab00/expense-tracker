<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

// Include the database connection
include 'db.php';

// Check if the connection was successful
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Prepare and execute the SQL query
$sql = "SELECT * FROM transactions ORDER BY created_at DESC";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . $conn->error]);
    exit;
}

// Fetch the transactions into an array
$transactions = [];
while ($row = $result->fetch_assoc()) {
    $transactions[] = $row;
}

// Return the transactions as JSON
echo json_encode($transactions);

// Close the database connection
$conn->close();
?>
