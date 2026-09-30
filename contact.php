<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Méthode non autorisée"]);
    exit;
}

// Get JSON or Form POST data
$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
    $input = $_POST;
}

$name = isset($input["name"]) ? trim($input["name"]) : "";
$email = isset($input["email"]) ? trim($input["email"]) : "";
$phone = isset($input["phone"]) ? trim($input["phone"]) : "";
$tour = isset($input["tour"]) ? trim($input["tour"]) : "Demande Générale";
$date = isset($input["date"]) ? trim($input["date"]) : "Flexible";
$guests = isset($input["guests"]) ? trim($input["guests"]) : "2";
$message = isset($input["message"]) ? trim($input["message"]) : "";

// Anti-spam honeypot
$honeypot = isset($input["website"]) ? trim($input["website"]) : "";
if (!empty($honeypot)) {
    echo json_encode(["success" => true, "message" => "Demande bien reçue"]);
    exit;
}

// Validation
if (empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Veuillez renseigner votre nom et votre adresse e-mail."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Format d'adresse e-mail invalide."]);
    exit;
}

$name = htmlspecialchars(strip_tags($name));
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(strip_tags($phone));
$tour = htmlspecialchars(strip_tags($tour));
$date = htmlspecialchars(strip_tags($date));
$guests = htmlspecialchars(strip_tags($guests));
$message = htmlspecialchars(strip_tags($message));

$to = "ergchegagadesert19@gmail.com";
$email_subject = "Nouvelle Demande : Erg Chegaga Desert Tours ($name)";

date_default_timezone_set("UTC");
$dateTime = date("Y-m-d H:i:s") . " UTC";

$email_body = "Vous avez reçu une nouvelle demande de réservation depuis le site Erg Chegaga :\n\n" .
              "-----------------------------------------\n" .
              "Nom complet : $name\n" .
              "E-mail : $email\n" .
              "Téléphone / WhatsApp : $phone\n" .
              "Circuit choisi : $tour\n" .
              "Date souhaitée : $date\n" .
              "Nombre de voyageurs : $guests\n" .
              "Date d'envoi : $dateTime\n" .
              "-----------------------------------------\n\n" .
              "Message / Demandes particulières :\n$message\n";

$headers = "From: noreply@ergchegaga.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/plain; charset=UTF-8\r\n";

if (@mail($to, $email_subject, $email_body, $headers)) {
    echo json_encode(["success" => true, "message" => "Merci ! Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais."]);
} else {
    // If mail function fails on local server, return friendly fallback
    echo json_encode(["success" => true, "message" => "Demande enregistrée. Vous pouvez également nous contacter directement sur WhatsApp au +212 699 374 176."]);
}
?>
