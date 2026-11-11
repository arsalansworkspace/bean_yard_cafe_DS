
<?php

// =====================================
// BEAN YARD CAFÉ — GET REVIEWS API
// =====================================

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
    ]);

    exit;
}

try {

    $sql = "SELECT
                id,
                customer_name AS name,
                rating,
                review_message AS message,
                created_at
            FROM reviews
            WHERE status = 'approved'
            ORDER BY created_at DESC, id DESC
            LIMIT 100";

    $stmt = $pdo->query($sql);

    $reviews = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "count" => count($reviews),
        "reviews" => $reviews
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    error_log("Review retrieval error: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to retrieve reviews."
    ]);

}
