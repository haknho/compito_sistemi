<?php
$ip = "localhost";
$db_name = "todo";
$username = "admin";
$password = "admin";
$port = 3306;
$connection = new mysqli($ip, $username, $password, $db_name, $port);
if ($connection->connect_error) {
  echo 'Connection to db failed';
  http_response_code(400);
  die;
}
return $connection;
?>