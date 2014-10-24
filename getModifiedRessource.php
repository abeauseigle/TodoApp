<?php
// Name   : getModifiedRessource.php - called by webSqlSyncAdapter.php
// Goal   : To communicate data from a MySQL query to a webSqlSync json format. 
// By (c) : Alain Beauseigle de AffairesUP inc.
// To test: http://www.mydomain.com/todoapp/getModifiedRessource.php
// Version: 2014-10-11

/*
$BDBid == 0;
$userNiveauID = 1; 
$userOrganisationID = 1;
$CLnum_rows = 1; //To bypass loginCheck (for debug use)
*/
if ($CLnum_rows){	// for authentication

	/*** Access management based on the employee level */
	switch ($userNiveauID) {
	case '0': // Niveau 0 = Grand administrator  (can see all todo of all organisation)
		$accesNiveauSQLRessources = "1=1";
		break;
	case '1': // Niveau 1 = Administrator (can see all todo of the organisation)
		$accesNiveauSQLRessources = " EX_Ressource.OrganisationID = '".$userOrganisationID. "'";
		break;
	case '2': // Niveau 2 = Manager ((can see all todo of the organisation))
		$accesNiveauSQLRessources = " EX_Ressource.OrganisationID = '".$userOrganisationID. "'";
		break;
	case '3': // Niveau 3 = Employee (can see only his todo)
		$accesNiveauSQLRessources = " EX_Usager.UsagerID = '".$userUsagerID. "'";
		break;	
	case '4':	// Niveau 4 = Visitor (not allowed)
		$accesNiveauSQLRessources = " EX_Ressource.RessourceID = 'interdit'";
		break;
	default: // Niveau 4
		$accesNiveauSQLRessources = " EX_Ressource.RessourceID = 'interdit'";
	}
	/*** END Access management based on the emploee level */

	if ($BDBid == 0){	//If first sync
		$query = sprintf("SELECT DISTINCT EX_Ressource.RessourceID, EX_Ressource.RessourceNom, EX_Ressource.RessourceIni 
						FROM EX_Ressource, EX_Usager 
						WHERE EX_Ressource.RessourceID=EX_Usager.RessourceID AND %s AND RessourceActive = 1 
						ORDER BY RessourceNom ASC", $accesNiveauSQLRessources);
	}
	else{				//get updated records from the last sync date
		$query = sprintf("SELECT DISTINCT EX_Ressource.RessourceID, EX_Ressource.RessourceNom, EX_Ressource.RessourceIni 
						FROM EX_Ressource, EX_Usager 
						WHERE EX_Ressource.RessourceID=EX_Usager.RessourceID AND %s AND RessourceActive = 1
						AND EX_Ressource.last_sync_date > '". $clientLastSyncDate ."' 
						ORDER BY RessourceNom ASC", $accesNiveauSQLRessources);
	}
//echo $query;

	$sql_result = array();
	$sql = mysql_query($query);
	while($row = mysql_fetch_object($sql)){
		$sql_result[] = $row;
	}
	return $sql_result;
} //end if ($CLnum_rows) used for authentication
?>