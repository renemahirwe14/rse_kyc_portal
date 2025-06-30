<?php
// api/admin_api.php
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Helper function to generate unique IDs (similar to auth.php)
function generateUniqueId($prefix, $conn, $table) {
    do {
        $id = $prefix . '_' . uniqid();
        $stmt = $conn->prepare("SELECT id FROM $table WHERE id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $stmt->store_result();
        $exists = $stmt->num_rows > 0;
        $stmt->close();
    } while ($exists);
    return $id;
}

if ($method === 'GET') {
    $action = $_GET['action'] ?? '';

    if ($action === 'get_stats') {
        $totalUsers = $conn->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
        $pendingApplications = $conn->query("SELECT COUNT(*) FROM applications WHERE status = 'pending'")->fetch_row()[0];
        $approvedApplications = $conn->query("SELECT COUNT(*) FROM applications WHERE status = 'approved'")->fetch_row()[0];
        $activeBrokers = $conn->query("SELECT COUNT(*) FROM brokers WHERE status = 'active'")->fetch_row()[0];

        echo json_encode([
            'success' => true,
            'stats' => [
                'totalUsers' => $totalUsers,
                'pendingApplications' => $pendingApplications,
                'approvedApplications' => $approvedApplications,
                'activeBrokers' => $activeBrokers
            ]
        ]);
    } elseif ($action === 'get_applications') {
        $statusFilter = $_GET['status'] ?? '';
        $brokerFilter = $_GET['broker'] ?? '';
        $dateFilter = $_GET['date'] ?? '';
        $searchFilter = $_GET['search'] ?? '';

        $sql = "SELECT a.*, u.name as user_name, u.email as user_email, b.name as broker_name FROM applications a JOIN users u ON a.user_id = u.id LEFT JOIN brokers b ON a.broker_id = b.id WHERE 1=1";
        $params = [];
        $types = "";

        if (!empty($statusFilter)) {
            $sql .= " AND a.status = ?";
            $params[] = $statusFilter;
            $types .= "s";
        }
        if (!empty($brokerFilter)) {
            $sql .= " AND a.broker_id = ?";
            $params[] = $brokerFilter;
            $types .= "s";
        }
        if (!empty($dateFilter)) {
            $sql .= " AND a.submitted_date = ?";
            $params[] = $dateFilter;
            $types .= "s";
        }
        if (!empty($searchFilter)) {
            $sql .= " AND u.name LIKE ?";
            $params[] = '%' . $searchFilter . '%';
            $types .= "s";
        }

        $sql .= " ORDER BY a.submitted_date DESC";

        $stmt = $conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $applications = [];
        while ($row = $result->fetch_assoc()) {
            $row['personal_info'] = json_decode($row['personal_info'], true);
            $row['identity_info'] = json_decode($row['identity_info'], true);
            $row['financial_info'] = json_decode($row['financial_info'], true);
            $applications[] = $row;
        }
        echo json_encode(['success' => true, 'applications' => $applications]);
        $stmt->close();

    } elseif ($action === 'get_users') {
        $result = $conn->query("SELECT id, name, email, registration_date, status FROM users ORDER BY registration_date DESC");
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        echo json_encode(['success' => true, 'users' => $users]);

    } elseif ($action === 'get_brokers') {
        $result = $conn->query("SELECT id, name, contact_email, phone, status FROM brokers ORDER BY name ASC");
        $brokers = [];
        while ($row = $result->fetch_assoc()) {
            $brokers[] = $row;
        }
        echo json_encode(['success' => true, 'brokers' => $brokers]);

    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
    }
} elseif ($method === 'POST') {
    $action = $input['action'] ?? '';

    if ($action === 'update_application_status') {
        $app_id = $input['app_id'] ?? '';
        $status = $input['status'] ?? '';

        if (empty($app_id) || empty($status)) {
            echo json_encode(['success' => false, 'message' => 'Application ID and status are required.']);
            exit();
        }

        $stmt = $conn->prepare("UPDATE applications SET status = ? WHERE id = ?");
        $stmt->bind_param("ss", $status, $app_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Application status updated.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error updating status: ' . $stmt->error]);
        }
        $stmt->close();

    } elseif ($action === 'add_user') {
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($name) || empty($email) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'All fields are required.']);
            exit();
        }

        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'User with this email already exists.']);
            $stmt->close();
            exit();
        }
        $stmt->close();

        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $user_id = generateUniqueId('USER', $conn, 'users');
        $registration_date = date('Y-m-d');

        $stmt = $conn->prepare("INSERT INTO users (id, name, email, password_hash, registration_date, status) VALUES (?, ?, ?, ?, ?, 'active')");
        $stmt->bind_param("sssss", $user_id, $name, $email, $hashed_password, $registration_date);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'User added successfully!', 'user_id' => $user_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error adding user: ' . $stmt->error]);
        }
        $stmt->close();

    } elseif ($action === 'add_broker') {
        $name = $input['name'] ?? '';
        $contact_email = $input['contact_email'] ?? '';
        $phone = $input['phone'] ?? '';

        if (empty($name)) {
            echo json_encode(['success' => false, 'message' => 'Broker name is required.']);
            exit();
        }

        $broker_id = generateUniqueId('BROKER', $conn, 'brokers');

        $stmt = $conn->prepare("INSERT INTO brokers (id, name, contact_email, phone, status) VALUES (?, ?, ?, ?, 'active')");
        $stmt->bind_param("ssss", $broker_id, $name, $contact_email, $phone);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Broker added successfully!', 'broker_id' => $broker_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error adding broker: ' . $stmt->error]);
        }
        $stmt->close();

    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
    }
} elseif ($method === 'PUT') {
    $action = $input['action'] ?? '';

    if ($action === 'update_user_status') {
        $user_id = $input['user_id'] ?? '';
        $status = $input['status'] ?? '';

        if (empty($user_id) || empty($status)) {
            echo json_encode(['success' => false, 'message' => 'User ID and status are required.']);
            exit();
        }

        $stmt = $conn->prepare("UPDATE users SET status = ? WHERE id = ?");
        $stmt->bind_param("ss", $status, $user_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'User status updated.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error updating user status: ' . $stmt->error]);
        }
        $stmt->close();
    } elseif ($action === 'update_broker_status') {
        $broker_id = $input['broker_id'] ?? '';
        $status = $input['status'] ?? '';

        if (empty($broker_id) || empty($status)) {
            echo json_encode(['success' => false, 'message' => 'Broker ID and status are required.']);
            exit();
        }

        $stmt = $conn->prepare("UPDATE brokers SET status = ? WHERE id = ?");
        $stmt->bind_param("ss", $status, $broker_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Broker status updated.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error updating broker status: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
    }
} elseif ($method === 'DELETE') {
    $action = $_GET['action'] ?? ''; // For DELETE, parameters are often in query string or body

    if ($action === 'delete_user') {
        $user_id = $_GET['user_id'] ?? '';

        if (empty($user_id)) {
            echo json_encode(['success' => false, 'message' => 'User ID is required.']);
            exit();
        }

        // First, delete related applications
        $stmt = $conn->prepare("DELETE FROM applications WHERE user_id = ?");
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $stmt->close();

        // Then delete the user
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("s", $user_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'User and related applications deleted.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error deleting user: ' . $stmt->error]);
        }
        $stmt->close();
    } elseif ($action === 'delete_broker') {
        $broker_id = $_GET['broker_id'] ?? '';

        if (empty($broker_id)) {
            echo json_encode(['success' => false, 'message' => 'Broker ID is required.']);
            exit();
        }

        // Set broker_id to NULL for applications associated with this broker
        $stmt = $conn->prepare("UPDATE applications SET broker_id = NULL WHERE broker_id = ?");
        $stmt->bind_param("s", $broker_id);
        $stmt->execute();
        $stmt->close();

        // Then delete the broker
        $stmt = $conn->prepare("DELETE FROM brokers WHERE id = ?");
        $stmt->bind_param("s", $broker_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Broker deleted. Applications updated.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error deleting broker: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

$conn->close();
?>
