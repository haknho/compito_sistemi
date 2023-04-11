<?php
$userID = null;

function get() {
    $conn = require './dbconnection.php';
    $res = $conn->query("SELECT JSON_OBJECT('id', T.id, 'title', T.title, 'description', T.description, 'status', T.status) AS json FROM tasks T WHERE T.user = $userID");
    $arr = [];
    foreach ($res->fetch_all(MYSQLI_ASSOC) as $row) {
        array_push($arr, $row['json']);
    }
    echo json_encode($arr);
    http_response_code(200);
}

function post() {
    $conn = require './dbconnection.php';
}

try {
    if (!isset($_SESSION) || !isset($_SESSION['userid'])) {
        //http_response_code(401);
        //die;
    }
    session_start();
    $userID = $_SESSION['userid'];
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
        get();
    } else if ($method == 'POST') {
        post();
    } else {
        http_response_code(405);
        die;
    }
} catch (Exception $err) {
    require_once './errorhandler.php';
    handleError($err);
}