<?php
// Name   : webSqlSyncAdapter.php - called by the webSqlApp (index.html)
// Goal   : To communicate data from a MySQL query using myJob to a webSqlSync json format. Result: It works one way. All server table data to Client.
// Version: 2013-10-08
// It uses: webSqlSyncHandler.php, and loginCheck.php that uses connections/connDbUP.php;
// To do  : Get the username and the password from client side and implement a secured auth with base64

//header('content-type: application/json; charset=utf-8');	//To have a json with accent

include("webSqlSyncHandler.php");
$handler = new SqlSyncHandler();	// to initialize the json handler from 'php://input'. It put it in $clientData
$handler -> call('myJob',$handler);	// call a custom function which will make a job with parsed data
	
function myJob($handler){
	$currentDateTime =  date("Y-m-d H:i:s");
	$clientLastSyncDate = $handler -> clientData['info']['lastSyncDate']/1000;	// It gives a 10 digits unix date time

// To test with http://www.mydomain.com/todoapp/webSqlSyncAdapter.php
/*
$BDBid == 0;
$username = "somebody"; // Desactivate lines 24,25 26
$password = "It's personnal"; 
*/
	$BDBid = $handler -> clientData['info']['BDBid'];	// Browser DB unique id (attributed at the First sync). Equal to the first sync DateTime in Unix format.
	$username = $handler -> clientData['info']['username'];
	$password = $handler -> clientData['info']['password'];

	include "loginCheck.php";
	$CLnum_rows = 1; //To bypass loginCheck (for debug use)
	if ($CLnum_rows){	// if $CLnum_rows = 1, we have the OK to get the server data
		require_once('setTodo.php');	// With the JSON, it does many INSERTs or UPDATEs to MySQL following some conditions
	
		// My job is to get all the table data from the server and send a json to client
		$handler -> reply(true,"this is a positive reply",getServerData($clientLastSyncDate, $userUsagerID, $userOrganisationID, $userNiveauID, $strUname, $userRessourceID, $CLnum_rows, $BDBid));	// with a dynamic array coming from a MySQL query //function reply($status,$message,$data)
		// It return $serverAnswer from SqlSyncHandler.php:	{"result":"OK","message":"this is a positive reply","syncDate":1327075596000,"data":{"Unites":[{"UniteID":"0","UniteSymbol":"h"},{"UniteID":"1","UniteSymbol":"km"},{"UniteID":"2","UniteSymbol":"$"},{"UniteID":"3","UniteSymbol":"U$"},{"UniteID":"4","UniteSymbol":"\u20ac"},{"UniteID":"5","UniteSymbol":"$P"}]}} 
	
		// a error reply example
		//$handler -> reply(false,"this is a error reply",array('browser' => 'firefox'));
	}
	else{
		echo "Your're not authorized to get the data from this server."; 
	}
}

function getServerData($clientLastSyncDate, $userUsagerID, $userOrganisationID, $userNiveauID, $strUname, $userRessourceID, $CLnum_rows, $BDBid){		//get the modified data from the server using an associative array

	// Define here the tables to sync Server side param1 is the webSql table name and param2 is the MySQL table name
	// To try: I think that the colomn tableName_MySql is useless
	$tablesToSync = array(
		array( "tableNameWebSql" => 'Todos',	"getQueryFile" => 'getModifiedTodo.php'),
		array( "tableNameWebSql" => 'Ressources',	"getQueryFile" => 'getModifiedRessource.php'),
		array( "tableNameWebSql" => 'Categories',	"getQueryFile" => 'getModifiedCategorie.php'),
	);

	$serverDataArr = array();
	require_once('connections/connDbUP.php');
	foreach($tablesToSync as $value){
		require_once($value['getQueryFile']);
		$serverDataArr[$value['tableNameWebSql']] = $sql_result;
	}
	return $serverDataArr;
}
?>
