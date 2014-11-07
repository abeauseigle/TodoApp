<?php
// Name   : getModifiedCategorie.php - called by webSqlSyncAdapter.php
// Goal   : To communicate data from a MySQL query to a webSqlSync json format. 
// By (c) : Alain Beauseigle de AffairesUP inc.
// Version: 2014-10-11

//To test with http://www.mydomain.com/todoapp/getModifiedCategorie.php
/*
$BDBid == 0;
$userNiveauID = 1; 
$userOrganisationID = 1;
$CLnum_rows = 1; //To bypass loginCheck (for debug use)
*/

if ($CLnum_rows){

	/*** Access management based on the user level */
	switch ($userNiveauID) {
	case '0': // Level 0 = Grand admin (can see all todo of all organisations)
		$accesNiveauSQLCategories = "1=1";
		break;
	case '1': // Level 1 = Administrator  (can see all todo of the organisation)
		$accesNiveauSQLCategories = " (EX_Categorie.OrganisationID = 0 OR EX_Categorie.OrganisationID = '".$userOrganisationID. "')";
		break;
	case '2': // Level 2 = Manager (can see all todo of the organisation)
		$accesNiveauSQLCategories = " (EX_Categorie.OrganisationID = 0 OR EX_Categorie.OrganisationID = '".$userOrganisationID. "')";
		break;
	case '3': // Niveau 3 = Employee (can see his todo only)
		$accesNiveauSQLCategories = " (EX_Categorie.OrganisationID = 0 OR EX_Categorie.OrganisationID = '".$userOrganisationID. "')";
		//WHERE EX_Ressource.RessourceID=EX_Usager.RessourceID AND EX_Usager.UsagerID=50 AND RessourceActive = 1
		break;	
	case '4':	// Niveau 4 = Visitor (not allowed)
		$accesNiveauSQLCategories = " EX_Categorie.CategorieID = 'interdit'";
		break;
	default: // Niveau 4
		$accesNiveauSQLCategories = " EX_Categorie.CategorieID = 'interdit'";
	}
	/*** END Access management based on the employee level */

	if ($BDBid == 0){	//If first sync
		$query = sprintf("SELECT CategorieID, CategorieNom, UniteID FROM EX_Categorie 
					WHERE %s 
					AND CategorieActive = 1  
					ORDER BY CategorieID ASC ", $accesNiveauSQLCategories);
	}
	else{				//get updated records from the last sync date
		$query = sprintf("SELECT CategorieID, CategorieNom, UniteID FROM EX_Categorie 
					WHERE %s 
					AND CategorieActive = 1 AND last_sync_date > '". $clientLastSyncDate ."' 
					ORDER BY CategorieID ASC ", $accesNiveauSQLCategories);
	}
//echo $query;

	$sql_result = array();
	$sql = mysql_query($query);
	if (mysql_num_rows($sql)>0) { //lp 20141024: to avoid error in case of empty table
		while($row = mysql_fetch_object($sql)){
			$sql_result[] = $row;
		}
	}
	return $sql_result;
} //end if ($CLnum_rows)
?>
