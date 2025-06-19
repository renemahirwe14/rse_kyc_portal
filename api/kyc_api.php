<?php
// api/kyc_api.php
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

function generateUniqueId($prefix, $conn) {
    do {
        $id = $prefix . '_' . uniqid();
        $stmt = $conn->prepare("SELECT id FROM applications WHERE id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $stmt->store_result();
        $exists = $stmt->num_rows > 0;
        $stmt->close();
    } while ($exists);
    return $id;
}

if ($method === 'POST') {
    $action = $input['action'] ?? '';

    if ($action === 'submit_kyc') {
        $user_id = $input['user_id'] ?? '';
        $broker_id = $input['broker_id'] ?? null;
        $personal_info = json_encode($input['personal_info'] ?? []);
        $identity_info = json_encode($input['identity_info'] ?? []);
        $financial_info = json_encode($input['financial_info'] ?? []);
        $submitted_date = date('Y-m-d');
        $status = 'pending';

        if (empty($user_id)) {
            echo json_encode(['success' => false, 'message' => 'User ID is required.']);
            exit();
        }

        $application_id = generateUniqueId('APP', $conn);

        $stmt = $conn->prepare("INSERT INTO applications (id, user_id, broker_id, submitted_date, status, personal_info, identity_info, financial_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssss", $application_id, $user_id, $broker_id, $submitted_date, $status, $personal_info, $identity_info, $financial_info);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'KYC application submitted successfully!', 'application_id' => $application_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error submitting application: ' . $stmt->error]);
        }
        $stmt->close();

    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
    }
} elseif ($method === 'GET') {
    $action = $_GET['action'] ?? '';

    if ($action === 'get_user_applications') {
        $user_id = $_GET['user_id'] ?? '';

        if (empty($user_id)) {
            echo json_encode(['success' => false, 'message' => 'User ID is required.']);
            exit();
        }

        $stmt = $conn->prepare("SELECT a.*, b.name as broker_name FROM applications a LEFT JOIN brokers b ON a.broker_id = b.id WHERE a.user_id = ? ORDER BY a.submitted_date DESC");
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $applications = [];
        while ($row = $result->fetch_assoc()) {
            // Decode JSON fields
            $row['personal_info'] = json_decode($row['personal_info'], true);
            $row['identity_info'] = json_decode($row['identity_info'], true);
            $row['financial_info'] = json_decode($row['financial_info'], true);
            $applications[] = $row;
        }
        echo json_encode(['success' => true, 'applications' => $applications]);
        $stmt->close();

    } elseif ($action === 'get_brokers') {
        $result = $conn->query("SELECT id, name FROM brokers WHERE status = 'active'");
        $brokers = [];
        while ($row = $result->fetch_assoc()) {
            $brokers[] = $row;
        }
        echo json_encode(['success' => true, 'brokers' => $brokers]);

    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

$conn->close();
?>
