<?php
try {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method != 'GET') {
        http_response_code(405);
        die;
    }
    $conn = require './dbconnection.php';
    $res = $conn->query("SELECT JSON_OBJECT('className', S.class, 'text', S.description) AS json FROM statuses S ORDER BY id");
    $arr = [];
    foreach ($res->fetch_all(MYSQLI_ASSOC) as $row) {
        array_push($arr, $row['json']);
    }
    echo json_encode($arr);
    http_response_code(200); 
} catch (Exception $err) {
    require_once './errorhandler.php';
    handleError($err);
}