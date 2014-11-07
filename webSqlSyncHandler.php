<?php
/**
 * Name   : webSqlSyncHandler.php for WebSqlSync.js code
 * Creator: sg4r3z 20/05/2013
 * Modified by abeauseigle 2013-10-08 to add the tableName in the JSON
 * This class allow to manage the json flow sended by the client (with the WebSqlSync script by orbitaloop), and make a reply.
 * ToDo: Niet
*/
	 
final class SqlSyncHandler{
	public $clientData;
	private $jsonData;
	// well formatted Answer for WebSqlSync.js Script
	private $serverAnswer = array("result"=> '',"message" => '', "syncDate" => '',"data" => array());
		
	/*
	 * __construct 
	 * Capture the input stream and creates 
	 * an array with the same structure
	 */
/*
	public function __construct($dataFlow = NULL){					
		if($dataFlow == NULL)
			{$this -> jsonData = file_get_contents('php://input');}	// json file => string 
		else 
			{$this -> jsonData = file_get_contents($dataFlow);}		// json file => string. On failure, file_get_contents() will return FALSE.
		//$this -> clientData = json_decode($this -> jsonData);		 
		$clientData = json_decode($this -> jsonData);		// string => array 
	}
*/
	public function __construct(){					
		$this -> jsonData = file_get_contents('php://input');		// json file => string 
		$this -> clientData = json_decode($this -> jsonData,true);	// json string => array, $this -> clientData is used by the Adapter, then by setContact.php 
	}
	/*
	 * reply (Server -> JSON  -> Client)
	 * This method create a well-structred reply for Client in JSON
	 * This method accept status,message,data
	 * STATUS = boolean value (TRUE for OK, FALSE for ERROR)
	 * MESSAGE = string value for message
	 * DATA = array of data for client
	 */
// $data come from the query getAllServerData() from sqlSyncHandlerTest.php
	public function reply($replyStatus,$message,$serverData){
		if($replyStatus)
			$this -> serverAnswer['result'] = 'OK';
		else
			$this -> serverAnswer['result'] = 'ERROR';
		$this -> serverAnswer['message'] = $message;
		$this -> serverAnswer['data'] = $serverData;
// 		$this -> serverAnswer['syncDate'] = strtotime("now")*1000;	// return sync_date: "1372365079000",
		$this -> serverAnswer['syncDate'] = round(microtime(true) * 1000); // return sync_date: in milliseconds: 1000 times more unique
		//echo $serverAnswer;
		//echo json_encode("R");

		//To experiment: ob_start('ob_gzhandler'); // To send a gziped json. Turn on output buffering with the gzhandler. Ref: geekality.net/2011/10/31/php-simple-compression-of-json-data/
		echo json_encode($this -> serverAnswer);
		//To experiment: ob_end_flush();	// Turn off output buffering.

		// $myObject = '{"result":"OK","message":"this is a positive reply","syncDate":"1371753757","data":[{"UniteID":"0","UniteSymbol":"h"},{"UniteID":"1","UniteSymbol":"km"},{"UniteID":"2","UniteSymbol":"$"},{"UniteID":"3","UniteSymbol":"U$"},{"UniteID":"4","UniteSymbol":"\u20ac"},{"UniteID":"5","UniteSymbol":"$P"}]}';
		// echo $myObject;
	}

	/*
	* call 
	* This method allows class to call an
	* external functon to make a custom job
	*/
	public function call($function,SqlSyncHandler $param = NULL){
		call_user_func($function,$param);
	}
		
	/*
	* getter clientData 
	* get a clientData property
	*/
	public function get_clientData(){
		return $this -> clientData;
	}
		
	/*
	* get serverAnswer 
	* get a serverAnswer property
	*/
	public function get_serverAnswer(){
		return $this -> serverAnswer;
	}
		
	/*
	* get jsonData
	* get a jsonData property
	*/
	public function get_jsonData(){
		return $this -> jsonData;
	}

}
?>
