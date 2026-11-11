
<?php

// =====================================
// BEAN YARD CAFÉ — DATABASE CONNECTION
// =====================================

$host = "localhost";
$dbname = "bean_yard_cafe";
$username = "root";
$password = ""; // Default XAMPP password is empty

try {

    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

} catch (PDOException $e) {

    error_log("Database connection failed: " . $e->getMessage());

    http_response_code(500);

    header("Content-Type: application/json");

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);

    exit;
}
