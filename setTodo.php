<?php
/*
 * Name  : setTodo.php	called by: webSqlSyncAdapter.php
 * Goal  : To INSERT and UPDATE in EX_Todo table in the sync process with a JSON coming from the webSqlApp 
 * By (c): Alain Beauseigle from AffairesUP inc.
 * Date  : 2014-04-11
 * ToDo  : Support the DELETE. Based on Orbitaloop: Do something like UPDATE elm SET flag='DELETED' Ref: https://github.com/orbitaloop/WebSqlSync
 * ToDo  : if (ID <> -1 AND last_sync_date > clientRecLastSyncDate) do nothing because MySQL is more recent but we should send a feedback message
 * Status: It works, it update the data
 * ToTest: Use http://www.mydomain.com/todoapp/setTodoTest.php
*/

//$CLnum_rows = 1;
if ($CLnum_rows){
	require_once('connections/connDbUP.php');
	$currentDateTime =  date("Y-m-d H:i:s");
	$clientData = $handler -> clientData;

	// $BDBid = $clientData['info']['BDBid'];	// Browser DB unique id (attributed at the First sync). Equal to the first sync DateTime in Unix format.
	$clientLastSyncDateUnix= $clientData['info']['lastSyncDate']/1000;	// It gives a 10 digits Unix dateTime format
	$clientLastSyncDate= date('Y-m-d H:i:s', $clientLastSyncDateUnix);	// to show the date in YYYY-MM-DD HH:MM:SS format (MySQL datetime format). Result: 2007-12-20 14:00:00

	$count = count($clientData['data']['Todos']);
	for ($i=0; $i < $count; $i++) {
		$newrec = $clientData['data']['Todos'][$i];  
		$TodoID = $newrec['TodoID']; $TodoID = mysql_real_escape_string($TodoID);
		$id = $newrec['id']; $id = mysql_real_escape_string($id);
		$TodoDesc = $newrec['TodoDesc']; $TodoDesc = mysql_real_escape_string($TodoDesc);
		$TodoDate = $newrec['TodoDate']; $TodoDate = mysql_real_escape_string($TodoDate);
		$RessourceID = $newrec['RessourceID']; $RessourceID = mysql_real_escape_string($RessourceID);
		$CategorieID = $newrec['CategorieID']; $CategorieID = mysql_real_escape_string($CategorieID);
		$clientRecLastSyncDate = $newrec['last_sync_date']; $clientRecLastSyncDate = mysql_real_escape_string($clientRecLastSyncDate);
	
		// Logic
		//if (ID == -1 ) do an INSERT INTO MySQL
		//if (ID <> -1 AND last_sync_date < clientRecLastSyncDate) do an UPDATE INTO MySQL
		//if (ID <> -1 AND last_sync_date > clientRecLastSyncDate) do nothing because MySQL is more recent but we should send a feedback message
		if ($TodoID == -1) {
			$insert_value 	 = "(" .$id. ", '".$TodoDesc."', '".$TodoDate."', ".$RessourceID.", ".$CategorieID.", '".$currentDateTime."', '" .$BDBid. "')";
			$sqlInsert = "INSERT INTO EX_Todo (id, TodoDesc, TodoDate, RessourceID, CategorieID, last_sync_date, BDBid) VALUES ".$insert_value;
			//echo $sqlInsert, "<br>", "<br>"; // Usefull for query debuging
			$queryInsert = mysql_query($sqlInsert) or die('setTodo line 45. '.mysql_error());
			// Note: By changing last_sync_date to the currentDateTime, the getModifiedTodo.php SELECT query will force to update todoID in webSQL db  
		}
		if ($TodoID <> -1) {
			$moreRecentSQL = "SELECT last_sync_date FROM EX_Todo WHERE TodoID = ". $TodoID;
			//echo $moreRecentSQL, "<br>", "<br>";
			$moreRecentResult = mysql_query($moreRecentSQL) or die(mysql_error());
			$row_moreRecentResult = mysql_fetch_assoc($moreRecentResult);
			$serverRec_last_sync_date = $row_moreRecentResult['last_sync_date'];
			//echo "serverRec_last_sync_date = ", $serverRec_last_sync_date, "<br>";
			//echo "clientRecLastSyncDate   = ", $clientRecLastSyncDate, "<br>";
			//echo "if serverRec_last_sync_date:", $serverRec_last_sync_date, "< clientRecLastSyncDate: ", $clientRecLastSyncDate, "<br>", "<br>";
	
			if ($serverRec_last_sync_date <= $clientLastSyncDate){
				//Ex: $sqlUpdate => UPDATE Todos SET id='15', firstName='Xavier', lastName='Xoland2', qte=1.12, MaJdate='2011-09-22', cbFait=1, rbABC='A', unitID=5, last_sync_date='2014-01-22 18:20:21' WHERE actID=5
				$sqlUpdate = "UPDATE EX_Todo SET id='". $id. "', TodoDesc='". $TodoDesc. "', TodoDate='". $TodoDate. "', RessourceID=". $RessourceID . ", CategorieID=". $CategorieID. ", last_sync_date='". $currentDateTime ."' WHERE TodoID=". $TodoID ;
				//echo  "Line 76 of setTodo.php, MySQL query: ",$sqlUpdate, "<br>", "<br>";
				$queryUpdate = mysql_query($sqlUpdate) or die('line 73. '.mysql_error());
			}
			//Else -> Do nothing because server is more recent than the client. The getTodo will send the more recent data to client. 
		}
	}	//end for
}	//end if ($CLnum_rows)
?>