<?php
// api/db_connect.php

// IMPORTANT: Ensure there are NO characters, spaces, or newlines before this <?php tag.
// This function attempts to clean any accidental output buffer before headers are sent.
if (ob_get_length()) {
  ob_clean();
}

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin for local development
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json'); // Explicitly set JSON header

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

$servername = "localhost";
$username = "root"; // Default XAMPP MySQL username
$password = "";     // Default XAMPP MySQL password (empty)
$dbname = "rse_kyc_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  // Do not echo HTML here, just JSON error
  echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
  exit(); // Exit immediately on connection failure
}
// No closing ?> tag to prevent accidental whitespace output
