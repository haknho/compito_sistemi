<?php
function handleError(Exception $err) {
    $code = $err->getCode();
    $msg = $err->getMessage();
    $file = $err->getFile();
    $line = $err->getLine();
    echo "Error $msg (code $code) in script $file at line $line.";
    echo $err->getTraceAsString();
    http_response_code(500);
    die;
}