<?php
// Name   : getModifiedTodo.php - called by webSqlSyncAdapter.php
// Goal   : To communicate data from a MySQL query to a webSqlSync json format. 
// By (c) : Alain Beauseigle de AffairesUP inc.
// Version: 2014-02-25
// To test: http://www.mydomain.com/todoapp/getModifiedTodo.php

/*
$BDBid == 0;
$userNiveauID = 1; 
$userOrganisationID = 1;
$CLnum_rows = 1; //To bypass loginCheck (for debug use)
*/
if ($CLnum_rows){

	/*** Access management based on the employee level */
	switch ($userNiveauID) {
	case '0': // Niveau 0 = Grand administrator (can see all todo of all organisation)
		$accesNiveauSQLTodos = " AND 1=1";
		break;
	case '1': // Niveau 1 = Administrateur (can see all todo of the organisation)
		$accesNiveauSQLTodos = "  AND EX_Todo.RessourceID = EX_Ressource.RessourceID AND EX_Ressource.OrganisationID = '".$userOrganisationID. "'";
		break;
	case '2': // Niveau 2 = Manager (can see all todo of the organisation)
		$accesNiveauSQLTodos = "  AND EX_Todo.RessourceID = EX_Ressource.RessourceID AND EX_Ressource.OrganisationID = '".$userOrganisationID. "'";
		break;
	case '3': // Niveau 3 = Employee (can see only his todo)
		$accesNiveauSQLTodos = " AND EX_Todo.RessourceID=EX_Usager.RessourceID AND EX_Ressource.RessourceID = '".$userRessourceID. "'";
		break;
	case '4':	// Niveau 4 = Visiteur (not allowed)
		$accesNiveauSQLTodos = " AND EX_Todo.TodoID = 'interdit'";
		break;
	default: // Niveau 4
		$accesNiveauSQLTodos = " AND EX_Todo.TodoID = 'interdit'";
	}
	/*** END Access management based on the employee level */

	if ($BDBid == 0){	//If first sync
		$query = sprintf("SELECT DISTINCT TodoID, EX_Todo.id, TodoDesc, TodoDate, EX_Todo.RessourceID, EX_Todo.CategorieID, EX_Todo.last_sync_date, EX_Todo.BDBid 
					FROM EX_Todo, EX_Ressource, EX_Usager 
					WHERE EX_Todo.RessourceID = EX_Ressource.RessourceID
						%s   
					ORDER BY TodoID DESC", $accesNiveauSQLTodos);
	}
	else{	//get updated records from the last sync date
		$query = sprintf("SELECT DISTINCT TodoID, EX_Todo.id, TodoDesc, TodoDate, EX_Todo.RessourceID, EX_Todo.CategorieID, EX_Todo.last_sync_date, EX_Todo.BDBid 
					FROM EX_Todo, EX_Ressource, EX_Usager 
					WHERE EX_Todo.RessourceID = EX_Ressource.RessourceID
						%s AND EX_Todo.last_sync_date > '" .$clientLastSyncDate. "' 
					ORDER BY TodoID DESC", $accesNiveauSQLTodos);
	}
//echo $query; //To help debogging, see in console log in the server answer

	$sql_result = array();
	$sql = mysql_query($query);
	while($row = mysql_fetch_object($sql)){
		$sql_result[] = $row;
	}
	//print_r ($sql_result);
	return $sql_result;
	//echo $sql_result;
} //end if ($CLnum_rows) used for authentication
?>
