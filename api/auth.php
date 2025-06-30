<?php
// IMPORTANT: Ensure there are NO characters, spaces, or newlines before this <?php tag.
// api/auth.php
error_reporting(E_ALL); // For debugging, remove in production
ini_set('display_errors', 1); // For debugging, remove in production

include 'db_connect.php'; // This file already sets Content-Type: application/json and handles CORS

$method = $_SERVER['REQUEST_METHOD'];

$input = json_decode(file_get_contents('php://input'), true);

function generateUniqueId($prefix, $conn) {
  do {
      $id = $prefix . '_' . uniqid();
      $stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
      $stmt->bind_param("s", $id);
      $stmt->execute();
      $stmt->store_result();
      $exists = $stmt->num_rows > 0;
      $stmt->close();
  } while ($exists);
  return $id;
}

if ($method === 'POST') {
  $action = isset($input['action']) ? $input['action'] : '';

  if ($action === 'signup') {
      $name = isset($input['name']) ? $input['name'] : '';
      $email = isset($input['email']) ? $input['email'] : '';
      $password = isset($input['password']) ? $input['password'] : '';

      if (empty($name) || empty($email) || empty($password)) {
          echo json_encode(['success' => false, 'message' => 'All fields are required.']);
          exit();
      }

      // Check if email already exists
      $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
      $stmt->bind_param("s", $email);
      $stmt->execute();
      $stmt->store_result();
      if ($stmt->num_rows > 0) {
          echo json_encode(['success' => false, 'message' => 'An account with this email already exists.']);
          $stmt->close();
          exit();
      }
      $stmt->close();

      $hashed_password = password_hash($password, PASSWORD_DEFAULT);
      $user_id = generateUniqueId('USER', $conn);
      $registration_date = date('Y-m-d');

      $stmt = $conn->prepare("INSERT INTO users (id, name, email, password_hash, registration_date, status) VALUES (?, ?, ?, ?, ?, 'active')");
      $stmt->bind_param("sssss", $user_id, $name, $email, $hashed_password, $registration_date);

      if ($stmt->execute()) {
          echo json_encode(['success' => true, 'message' => 'Account created successfully!', 'user' => ['id' => $user_id, 'name' => $name, 'email' => $email]]);
      } else {
          echo json_encode(['success' => false, 'message' => 'Error creating account: ' . $stmt->error]);
      }
      $stmt->close();

  } elseif ($action === 'login') {
      $email = isset($input['email']) ? $input['email'] : '';
      $password = isset($input['password']) ? $input['password'] : '';

      if (empty($email) || empty($password)) {
          echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
          exit();
      }

      $stmt = $conn->prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?");
      $stmt->bind_param("s", $email);
      $stmt->execute();
      $stmt->store_result();
      $stmt->bind_result($user_id, $name, $email_db, $password_hash);
      $stmt->fetch();

      if ($stmt->num_rows > 0 && password_verify($password, $password_hash)) {
          echo json_encode(['success' => true, 'message' => 'Login successful!', 'user' => ['id' => $user_id, 'name' => $name, 'email' => $email_db]]);
      } else {
          echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
      }
      $stmt->close();

  } else {
      echo json_encode(['success' => false, 'message' => 'Invalid action.']);
  }
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

$conn->close();
// No closing ?> tag to prevent accidental whitespace output
