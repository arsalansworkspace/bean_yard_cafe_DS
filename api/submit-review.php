
<?php

// =====================================
// BEAN YARD CAFÉ — SUBMIT REVIEW API
// =====================================

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

// Only accept POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
    ]);

    exit;
}

// Read JSON sent by JavaScript
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid request data."
    ]);

    exit;
}

// Get customer information
$name = trim($data["name"] ?? "");
$rating = filter_var(
    $data["rating"] ?? null,
    FILTER_VALIDATE_INT
);
$message = trim($data["message"] ?? "");

// Validate input
if (
    $name === "" ||
    $message === "" ||
    mb_strlen($name, "UTF-8") > 40 ||
    mb_strlen($message, "UTF-8") > 500 ||
    $rating === false ||
    $rating < 1 ||
    $rating > 5
) {
    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Please provide valid review details."
    ]);

    exit;
}

try {

    // Automatically publish every submitted review
    $sql = "INSERT INTO reviews
            (customer_name, rating, review_message, status)
            VALUES
            (:name, :rating, :message, 'approved')";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":name" => $name,
        ":rating" => $rating,
        ":message" => $message
    ]);

    // Get the newly saved review
    $reviewId = $pdo->lastInsertId();

    $fetch = $pdo->prepare(
        "SELECT
            id,
            customer_name AS name,
            rating,
            review_message AS message,
            created_at
         FROM reviews
         WHERE id = :id"
    );

    $fetch->execute([":id" => $reviewId]);

    $review = $fetch->fetch();

    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Thank you! Your review is now published.",
        "review" => $review
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    error_log("Review submission error: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to submit your review. Please try again."
    ]);

}
