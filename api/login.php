<?php
try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if (!isset($data['username']) || !isset($data['password'])) {
        http_response_code(400);
        die;
    }
    $usr = $data['username'];
    $psw = hash('SHA256', $data['password']);
    $conn = require './dbconnection.php';
    $res = $conn->query("SELECT id FROM users U WHERE U.username = '$usr' AND U.password = '$psw'");
    if ($res->num_rows != 1) {
        http_response_code(401);
        die;
    }
    $id = $res->fetch_assoc()['id'];
    session_start();
    $_SESSION['userid'] = $id;
} catch (Exception $err) {
    require_once './errorhandler.php';
    handleError($err);
}