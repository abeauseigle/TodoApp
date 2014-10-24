<?php
// Name   : loginCheck.php - called by webSqlSyncAdapter.php
// Goal   : To get the autorization to access data in MySQL
// Version: 2014-02-27
// It uses: connections/connDbUP.php;
// To do  : Niet
// To test: http://www.mywebsite.com/todoapp/loginCheck.php?username=myusername&password=mypassword

require_once('connections/connDbUP.php');
$CLnum_rows = 0;
$strUname = "";
$strPword = "";
$strUname = stripslashes($username);
$strPword = stripslashes($password);

// CL is for Check Login
$CLquery = "SELECT RessourceID, UsagerNom, UsagerID, NiveauID, OrganisationID FROM EX_Usager"
				 	 ." WHERE UsagerActif = 1 AND UsagerNom = '".$strUname."'"
					 ." AND UsagerPassword = PASSWORD('".$strPword."') "
					 ." ORDER BY UsagerID DESC";

$CLresult = mysql_query($CLquery) or die(mysql_error());
$row_getLoginInfos = mysql_fetch_assoc($CLresult);

$userRessourceID = $row_getLoginInfos['RessourceID'];
$userUsagerID = $row_getLoginInfos['UsagerID'];
$userOrganisationID = $row_getLoginInfos['OrganisationID'];
$userNiveauID = $row_getLoginInfos['NiveauID'];
$CLnum_rows = mysql_num_rows($CLresult);

//echo "Line 31 RessourceID: ", $userRessourceID, "$userUsagerID: ", $userUsagerID, "$userOrganisationID: ", $userOrganisationID, "$userNiveauID: ", $userNiveauID, " CLnum_rows : ", $CLnum_rows; 

?>


