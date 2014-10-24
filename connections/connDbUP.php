<?php
	$dbhost  = "localhost";
	$dbname  = "__________";
	$dbuname = "__________";
	$dbpass  = "__________";
$connect = mysql_connect($dbhost, $dbuname, $dbpass) or die("Impossible connection to the serveur $server" + mysql_error()); 
$db= mysql_select_db($dbname) or die("Could not select database"+ mysql_error());

mysql_set_charset('utf8', $connect);		
?>