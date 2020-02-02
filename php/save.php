<?php
$text = $_POST["text"];

$file="text.html";
$pointer = fopen($file,"w");
$content = "<!DOCTYPE html>\n<html>\n<head>\n<title>Text</title>\n</head>\n<body>" . $text . "</body>\n</html>";
fputs($pointer, $content);
fclose($pointer);
?>