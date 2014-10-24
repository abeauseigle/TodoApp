/*******************************************************************
 * javaScript for CRUD webSQL App supporting a Sync with a MySQL server via webSqlSync.js (modified).
 * Created by Alain Beauseigle to be a CRUD webSQL App
 * Rev.: 2014-10-15
 * ToDo: Download Progress bar 
 * ToDo: Password encryption 
 * ToDo: DELETE are not handled. But an easy workaround is to do a logic delete with an update (ex. UPDATE elm SET flag='DELETED')
 ******************************************************************/
/*
 Copyright (c) 2014, Alain Berauseigle, AffairesUP inc.
 Permission is hereby granted, free of charge, to any person obtaining a
 copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the Software
 is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

window.onload = function() {
	if (!window.openDatabase) {
		err("WebSQL database is not supported by this browser, try with Chrome, Safari, Opera or Next");
		return;
	}

	window.myweb = {
		db: window.openDatabase("TodoApp", "1.0", "TodoApp", 2 * 1024 * 1024), // 2MB
		dataset: null,
		syncSuccess: false, //to define the syncSuccess for line 288
		dbAlreadyExist: 0,
		sqlSelectFilteredTodos: ''
	}

	document.getElementById("TodoDateAdd").value = getCurrentDateISO(); // populate le HTML5 INPUT date de Ajout avec la date d'aujourd'hui


	// Add here a check of browser support webSql   
	createTable();	// To create all tables for the web app and run initSync of webSyncSql.js to add the tables required for sync 
	if (myweb.dbAlreadyExist){
		console.log("Line 48 before showFilteredRecords");
		showFilteredRecords(); 
		console.log("Line 50 after showFilteredRecords");
		showHide('Liste','Filtre');
		showHide('Liste','Ajout');
		showHide('Liste','Edit');
	} else {
		showHide('LoginParamEdit','Liste'); // Go to LoginParamEdit to enter ID & PW, then syncWithServer
	}
};

//---- FUNCTIONS ----
function createTable() { 
	if (!window.openDatabase) {
		err("WebSQL database not supported");
		return;
	} else {
		myweb.dbAlreadyExist = 1;
	}
	myweb.db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS Todos (id INTEGER PRIMARY KEY AUTOINCREMENT, TodoID INTEGER, TodoDesc TEXT, TodoDate TEXT, TodoFait INTEGER, RessourceID INTEGER, CategorieID INTEGER, BDBid TEXT, last_sync_date TEXT, last_sync INTEGER)", []);
		//tx.executeSql('CREATE INDEX IF NOT EXISTS index_Todos ON Todos', []);
		tx.executeSql("CREATE TABLE IF NOT EXISTS Ressources (id INTEGER PRIMARY KEY AUTOINCREMENT, RessourceID INTEGER, RessourceNom TEXT, RessourceIni TEXT, BDBid TEXT, last_sync_date TEXT, last_sync INTEGER)", []);
		tx.executeSql("CREATE TABLE IF NOT EXISTS Categories (id INTEGER PRIMARY KEY AUTOINCREMENT, CategorieID INTEGER, CategorieNom TEXT, UniteID INTEGER, BDBid TEXT, last_sync_date TEXT, last_sync INTEGER)", []);

		tx.executeSql("CREATE TABLE IF NOT EXISTS FiltreParam (id INTEGER PRIMARY KEY AUTOINCREMENT, TodoDescFP TEXT, TodoDate1FP TEXT, TodoDate2FP TEXT, TodoFaitFP TEXT, RessourceIdFP INTEGER, CategorieIdFP INTEGER)", []); // Create FiltreParam to record the parameters to filter the Todos
		tx.executeSql("CREATE TABLE IF NOT EXISTS UserParam (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)", []); // Create UserParam to record the connection parameters to the Php-MySQL server

		tx.executeSql("INSERT INTO FiltreParam (TodoDescFP, TodoDate1FP, TodoDate2FP, TodoFaitFP, RessourceIdFP, CategorieIdFP) VALUES (?, ?, ?, ?, ?, ?);", ['', '1901-01-01', '1901-01-01', '', '', '']); //1901-01-01 is the NULL date in SQLite
		tx.executeSql("INSERT INTO UserParam (username, password) VALUES (?, ?)", ['', '']); 
		/*tx.executeSql("INSERT INTO Todos (TodoID,TodoDesc,TodoNote,TodoDate,TodoQte,MandatID,RessourceID,CategorieID,UniteID,last_sync_date,BDBid,last_sync)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", ["2740", "Médicus entrevue", "", "2014-02-13", "44.02", "507", "2", "4", "1", "2014-03-03 10:24:21", "", 1394629402000]);*/

	});	//end myweb.db.transaction

	tableToSync = [
	{tableName: 'Todos',  idName: 'id', tableNameID: 'TodoID'},
	{tableName: 'Ressources', idName: 'id', tableNameID: 'RessourceID'},
	{tableName: 'Categories', idName: 'id', tableNameID: 'CategorieID'}
	];
	mySyncURL = 'webSqlSyncAdapter.php';
	DBSYNC.initSync(tableToSync, myweb.db, SYNCDATA.sync_info, mySyncURL, callBackInitSync);	//Parameters are defined in mySyncData.js
	function callBackInitSync() {
		document.getElementById("uiProgress").value="InitSync Done"; // 
	}
}

function dropTables() {
	myweb.db.transaction(function(tx) {
		tx.executeSql("DROP TABLE Todos", []);
		tx.executeSql("DROP TABLE Ressources", []);
		tx.executeSql("DROP TABLE Categories", []);
		tx.executeSql("DROP TABLE FiltreParam", []);
		tx.executeSql("DROP TABLE UserParam", []);
		tx.executeSql("DROP TABLE new_elem", []);
		tx.executeSql("DROP TABLE sync_info", []);
	});
	resetForm();
}

function NEXTsyncWithServer() {	//called by list button SYNC
	syncWithServer(function(syncSuccess){		// callback is used to wait the server query result.  The data is received from the server when syncSuccess is true.
	});
}

function syncWithServer(callback){	// First sync: It downloads server data (Todos, unites, categories, ressources, mandats, clients, etc.) 
	mySyncURL ='webSqlSyncAdapter.php';
	// Take username & password from LoginParamEdit form
	username = "";
	password = "";
	var username = document.getElementById("usernameEdit").value; 
	var password = document.getElementById("passwordEdit").value; 
	//console.log("Line 270 ID:", username, " PW:" , password);
	DBSYNC.syncInfo.username = username;
	DBSYNC.syncInfo.password = password;
	//console.log("Line 123 DBSYNC.syncInfo.username:", DBSYNC.syncInfo.username, " DBSYNC.syncInfo.password:" , DBSYNC.syncInfo.password);
	saveBandwidth = false; //optional 3e argument de syncNow dans la version 130808 de webSqlSync. Do not use because, we can not get the initial data of the server
	callBackUploadProgress = 0; //
	callBackDownloadProgress = 0; //

	DBSYNC.syncNow(callBackProgress, callBackUploadProgress, callBackDownloadProgress, function(result) {
		// DBSYNC.syncNow(callBackProgress, function(result) {	//Original line of the pseudo progress
		myweb.syncSuccess = true;	//response sent as a callback by syncNow if the sync is a success, see line 115 & 125 in webSqlSync.js 
		callback(myweb.syncSuccess);
		console.log("Line 132 syncSuccess after syncNow:", myweb.syncSuccess);
		// To experiment... show_callBackDownloadProgress(message, percent, msgKey);
		// To experiment... console.log("callBackDownloadProgress:", callBackDownloadProgress(evt)); // do ???
		if (result.syncOK === true) {
			myweb.syncSuccess = true;
		}
		else {
			alert("first SyncNow failed, line 474 of index.html"); //Synchronized error
		}
		showFilteredRecords();
	},saveBandwidth); // End syncNow
	}

	// message, percent and msgKey comes from syncNow of webSqlSync.js line 128 and 136
	// Ex: message= "my message", percent= 20, msgKey= "sendData"  
	function callBackProgress (message, percent, msgKey) {
		messageAndPercent = message + percent + "%";
		document.getElementById("uiProgress").innerHTML = messageAndPercent;
	}

	function callBackDownloadProgress(evt) {
		if (evt.lengthComputable) {
			var percentComplete = Math.round(evt.loaded * 100 / evt.total);
			document.getElementById('downloadProgressNumber').innerHTML = percentComplete.toString() + '%';
			document.getElementById('downloadProgressNumber').value = percentComplete.toString() + '%';
		}
		else {
			document.getElementById('downloadProgressNumber').innerHTML = 'unable to compute';
		}
	}

/* To experiment if you want to contribute
	
	   function callBackDownloadProgress (message, percent, msgKey) {
	   console.log("percent line 481");
	   messageAndPercent = message + percent + "%";
	   document.getElementById("uiProgress").value=messageAndPercent; // 

	//console.log(message, ' (' , percent , '%)');
	//$('#uiProgress').html(message+' ('+percent+'%)');
}
*/
/*
function callBackDownloadProgress(message, percent, msgKey) {
messageAndPercent = message + percent + "%";
document.getElementById("uiProgress").innerHTML = messageAndPercent;
}

function callBackDownloadProgress(evt) {
if (evt.lengthComputable) {
var percentComplete = Math.round(evt.loaded * 100 / evt.total);
document.getElementById('downloadProgressNumber').innerHTML = percentComplete.toString() + '%';
}
else {
document.getElementById('progressNumber').innerHTML = 'unable to compute';
}
}

function callBackUploadProgress(evt) {
if (evt.lengthComputable) {
var percentComplete = Math.round(evt.loaded * 100 / evt.total);
document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
}
else {
document.getElementById('progressNumber').innerHTML = 'unable to compute';
}
}
*/
/* See: http://www.matlus.com/html5-file-upload-with-progress/
function uploadComplete(evt) {
// This event is raised when the server send back a response 
alert(evt.target.responseText);
}

function uploadFailed(evt) {
alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
alert("The upload has been canceled by the user or the browser dropped the connection.");
} 
*/

//Populate all Ressources selectbox with Unites from webDB, use a callback to force waiting for the webDB result
function loadRessourcesSelect(callback) {
myweb.db.transaction(function (tx) {
	tx.executeSql('SELECT * FROM Ressources', [], function(tx, results) {
		RessourcesArray = [];
		var dataset = results.rows; 
		var selectRess = document.getElementById('RessourceSelectAdd');
		selectRess.options.length = 0; // clear out existing items
		//console.log("length:", dataset.length);	//R: 
		for(var i = 0; i < dataset.length; i++){
			var element=new Object();
			element.RessourceID = dataset.item(i).RessourceID;
			element.RessourceNom = dataset.item(i).RessourceNom;
			RessourcesArray[i]=element;
		}
		callback(RessourcesArray);
	}); // for tx.executeSql
});	//for myweb.db.transaction
}

//Populate all Categories selectbox with Categories from webDB, use a callback to force waiting for the webDB result
function loadCategoriesSelect(callback) {
myweb.db.transaction(function (tx) {
	tx.executeSql('SELECT * FROM Categories', [], function(tx, results) {
		CategoriesArray = [];
		var dataset = results.rows; 
		//console.log("length:", dataset.length);	//R: 
		for(var i = 0; i < dataset.length; i++){
			var element = new Object();
			element.CategorieID = dataset.item(i).CategorieID;
			element.CategorieNom = dataset.item(i).CategorieNom;
			element.CategorieUniteID = dataset.item(i).UniteID;
			CategoriesArray[i]=element;
		}
		//console.log(CategoriesArray);
		callback(CategoriesArray);
	}); // for tx.executeSql
});	//for myweb.db.transaction
}
// end FUNCTIONS related to load select boxes

// begin FUNCTIONS related to SHOW FILTERED Todos
function loadFiltreParam() {	//Utile ???
myweb.db.transaction(function (tx) {
	tx.executeSql('SELECT * FROM FiltreParam WHERE id=?', [1], function (tx, FPresult) {
		var lenFParam = FPresult.rows.length;
		FPdataset = FPresult.rows;
		FPitem = FPdataset.item(0);

		if ((FPitem['TodoDate1FP']!="" || FPitem['TodoDate1FP']!="1901-01-01" ) || (FPitem['TodoDate2FP']!="" || FPitem['TodoDate2FP']!="1901-01-01" )){    // 1901-01-01 is to NOT filter on date
			TodoDateFiltre1String = FPitem['TodoDate1FP']; //The yyyy-mm-dd (ISO 8601) date format is not supported in Safari and IE.
			TodoDateFiltre2String = FPitem['TodoDate2FP']; //The yyyy-mm-dd (ISO 8601) date format is not supported in Safari and IE.
			TodoDateFiltre1Parsed = parseDate(TodoDateFiltre1String); // 2012-12-31 -> Mon Dec 31 2012 00:00:00
			TodoDateFiltre2Parsed = parseDate(TodoDateFiltre2String); // 2012-12-31 -> Mon Dec 31 2012 00:00:00
			TodoDateFiltre1ISO = TodoDateFiltre1Parsed.toISOString().substring(0, 10);  //Mon Dec 31 2012 00:00:00 -> console.log -> 2012-12-31
			TodoDateFiltre2ISO = TodoDateFiltre2Parsed.toISOString().substring(0, 10);  //Mon Dec 31 2012 00:00:00 -> console.log -> 2012-12-31
			document.getElementById("TodoDateFiltre1").value = TodoDateFiltre1ISO;
			document.getElementById("TodoDateFiltre2").value = TodoDateFiltre2ISO;
		}
		else { 
			document.getElementById("TodoDateFiltre1").value = "";
			document.getElementById("TodoDateFiltre2").value = "";
		}
		TodoDescFiltre.value = FPitem['TodoDescFP'];

		document.getElementById('Filtre').style.display='block';
		document.getElementById('Liste').style.display='none';
	}) // for tx.executeSql
	}) // for myweb.db.transaction
}

function updateFiltreParam() {
	var TodoDateFiltre1New = document.getElementById("TodoDateFiltre1").value; // It records the new date in string format like "2013-05-01"
	var TodoDateFiltre2New = document.getElementById("TodoDateFiltre2").value; // It records the new date in string format like "2013-05-01"
	// If we erase the date to not filter on the date.
	if (document.getElementById("TodoDateFiltre1").value=="") {
		TodoDateFiltre1New = "1901-01-01";
	} else {
		TodoDateFiltre1New = document.getElementById("TodoDateFiltre1").value;
	}
	if (document.getElementById("TodoDateFiltre2").value=="") {
		TodoDateFiltre2New = "1901-01-01";
	} else {
		TodoDateFiltre2New = document.getElementById("TodoDateFiltre2").value;
	}

	var RessourceIdFiltre = document.getElementById("RessourceSelectFiltre").value;
	var CategorieIdFiltre = document.getElementById("CategorieSelectFiltre").value;

	myweb.db.transaction(function(tx) {
		tx.executeSql("UPDATE FiltreParam SET TodoDescFP = ?, TodoDate1FP = ?, TodoDate2FP = ?, RessourceIdFP = ?, CategorieIdFP = ? WHERE id = 1",
			[TodoDescFiltre.value, TodoDateFiltre1New, TodoDateFiltre2New, RessourceIdFiltre, CategorieIdFiltre]);
	}); 
	showFilteredRecords(); 
	showHide('Liste','Filtre');
	showHide('Liste','Ajout');
	showHide('Liste','Edit');
}


function showFilteredRecords() {	//Called by updateFiltreParam and syncWithServer
	getFilterParam(function(myFilterParam) {
		//Concatenation of the App record filter usable for Filter, Ajout and Edit 
		sqlSelectFilteredTodos = 'SELECT Todos.id, TodoID, TodoDate, Todos.RessourceID, RessourceNom, TodoDesc, Todos.CategorieID, CategorieNom FROM Todos, Ressources, Categories WHERE Todos.RessourceID = Ressources.RessourceID AND Todos.CategorieID = Categories.CategorieID';

		if (myFilterParam['TodoDescFP']==""){ sqlSelectFilteredTodos += " AND 1 = 1 ";}
		else{sqlSelectFilteredTodos += " AND TodoDesc LIKE '%" + myFilterParam['TodoDescFP'] +"%'";}    //see http://www.tutorialspoint.com/sqlite/sqlite_like_clause.htm

		if (myFilterParam['TodoDate1FP']=="1901-01-01"){ sqlSelectFilteredTodos += " AND 1 = 1 ";}
		else{sqlSelectFilteredTodos += ' AND TodoDate > "' + myFilterParam['TodoDate1FP'] +'"';}
		if (myFilterParam['TodoDate2FP']=="1901-01-01"){ sqlSelectFilteredTodos += " AND 1 = 1 ";}
		else{sqlSelectFilteredTodos += ' AND TodoDate < "' + myFilterParam['TodoDate2FP'] +'"';}

		if (myFilterParam['RessourceIdFP']==0 || myFilterParam['RessourceIdFP']=="" ){ sqlSelectFilteredTodos += " AND 1 = 1 ";}
		else{sqlSelectFilteredTodos += " AND Todos.RessourceID = " + myFilterParam['RessourceIdFP'];}

		if (myFilterParam['CategorieIdFP']==0 || myFilterParam['CategorieIdFP']=="" ){ sqlSelectFilteredTodos += " AND 1 = 1 ";}
		else{sqlSelectFilteredTodos += " AND Todos.CategorieID = " + myFilterParam['CategorieIdFP'];}	

		sqlSelectFilteredTodos += " ORDER BY TodoDate DESC ";	// To have the more recent at the top of the list


		console.log('Line 725 sqlSelectFilteredTodos :', sqlSelectFilteredTodos); // R: GOOD
		listeItem.innerHTML = '';
		//console.log("sqlSelectFilteredTodos :", sqlSelectFilteredTodos);

		myweb.db.transaction(function(tx) {
			tx.executeSql(sqlSelectFilteredTodos, [], function(tx, result) {		//sqlSelectFilteredTodos = 'SELECT * FROM Todos WHERE 1 = 1' + ... from filterQuery()
				console.log(result);
				myweb.dataset = result.rows;
				for (var i = 0, item = null; i < myweb.dataset.length; i++) {
					item = myweb.dataset.item(i);
					var Act_id = item['id'];
					listeItem.innerHTML += 
				'<tr>' 
				//						+ '<td><button type="button" onclick="loadTodo(' + Act_id + ')"><img src="images/edit-white.png" alt="Edit"/></button></td>'
				+ '<td><button type="button" onclick="loadTodo(' + i + ')" ><img src="images/edit-white.png" alt="Edit"/></button></td>'
				+ '<td>' + i + '</td>' 
				//						+ '<td>' + Act_id + '</td>' 
				+ '<td>' + item['TodoID'] + '</td>' 
				+ '<td>' + item['TodoDate'] + '</td>' 
				+ '<td>' + item['RessourceNom'] + '</td>' 
				+ '<td>' + item['TodoDesc'] + '</td>' 
				+ '<td>' + item['CategorieNom'] + '</td>' 
				+ '</tr>';
				}
			});	//tx.executeSql
			showHide('Liste','Filtre');
			showHide('Liste','Ajout');
			showHide('Liste','Edit');
		});	//myweb.db.transaction
	});	//getFilterParam

	// Pour tester via SQLite Browser:
	//SELECT TodoID, TodoDate, Todos.RessourceID, Todos.MandatID, TodoDesc, Todos.CategorieID, TodoQte, Todos.UniteID, TodoNote FROM Todos WHERE 1 = 1  AND 1 = 1  AND 1 = 1  AND 1 = 1  AND Todos.MandatID = '507' AND 1 = 1  AND 1 = 1  ORDER BY TodoDate DESC
}

function getFilterParam(callback) {
	filterParamArray = [];
	myweb.db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM FiltreParam WHERE id=?', [1], function (tx, results) {
			var dataset = results.rows;
			var filterParam = dataset.item(0);
			console.log("filterParam: ", filterParam);
			callback(filterParam);	// callback to pass the filterParam eventhough it's async.
		}, null); // for tx.executeSql
	}, null, null); // for myweb.db.transac
}
// end FUNCTIONS related to SHOW FILTERED TODOS

// begin FUNCTIONS related to insertTodo()
function insertTodo() {
	var dateStringAdd = document.getElementById("TodoDateAdd").value;
	var RessourceIdAdd = document.getElementById("RessourceSelectAdd").value;
	var CategorieIdAdd = document.getElementById("CategorieSelectAdd").value;
	var TodoDescAdd = document.getElementById('TodoDescAdd').value;  

	myweb.db.transaction(function(tx) {
		tx.executeSql("INSERT INTO Todos (TodoID, TodoDesc, TodoDate, RessourceID, CategorieID) VALUES (?, ?, ?, ?, ?)", 
			['-1', TodoDescAdd, dateStringAdd, RessourceIdAdd, CategorieIdAdd], resetFormAndShow, onError);
	});
}

function resetFormAndShow() {
	resetForm();
	showFilteredRecords();
}

function resetForm() {
	document.getElementById("TodoDateAdd").value = getCurrentDateISO(); // populate the HTML5 INPUT date of Ajout with the today's date
	document.getElementById("RessourceSelectAdd").options[0].selected = true; 
	document.getElementById("CategorieSelectAdd").options[0].selected = true; 
	document.getElementById('TodoDescAdd').value = '';  
}
// end FUNCTIONS related to insertTodo()

//Function anabling Safari to read the date of the BD, because Safari don't accept the format aaaa-mm-jj , nether aaaa/mm/jj
//parseDate('2011-12-31'); // '2011-12-31' -> Mon Dec 31 2011 00:00:00
function parseDate(input) {
	var parts = input.match(/(\d+)/g);
	return new Date(parts[0], parts[1]-1, parts[2]);
}

// begin FUNCTIONS related to edit Todo
function loadTodo(iTodo) {
	var itemSel = myweb.dataset.item(iTodo); 
	idToEdit = itemSel['id'];
	console.log("idToEdit: ", idToEdit);
	TodoDateEditString = itemSel['TodoDate'];	//format '2011-12-31' accepted by Chrome, but Safari don't accept the format 2011/12/31. The yyyy-mm-dd (ISO 8601) date format is not supported in Safari and IE.
	TodoDateEditParsed = parseDate(TodoDateEditString); // 2012-12-31 -> Mon Dec 31 2012 00:00:00
	TodoDateEditISO = TodoDateEditParsed.toISOString().substring(0, 10);	//Mon Dec 31 2012 00:00:00 -> console.log -> 2012-12-31
	//console.log(TodoDateEditISO);
	document.getElementById("TodoDateEdit").value = TodoDateEditISO; // 

	var idRessourceSelectEdit = itemSel['RessourceID'];	//RessourceID 
	// load the unit selectbox to search the found idunite in the option of the unit selectbox
	var ressource = document.getElementById("RessourceSelectEdit");
	for(i=0;i<ressource.options.length;i++){
		if(ressource.options[i].value == idRessourceSelectEdit){			
			ressource.selectedIndex = i;
		}
	}

	var idCategorieSelectEdit = itemSel['CategorieID'];
	// load the unit selectbox to search the found idunite in the option of the unit selectbox
	var categorie = document.getElementById("CategorieSelectEdit");
	for(i=0;i<categorie.options.length;i++){
		if(categorie.options[i].value == idCategorieSelectEdit){			
			categorie.selectedIndex = i;
		}
	}

	TodoDescEdit.value = itemSel['TodoDesc'];

	showHide('Edit','Liste');
}

function updateTodo() {
	var TodoDateEdit = document.getElementById("TodoDateEdit").value; // It records the new date in format string "2013-05-02"
	var RessourceIdEdit = document.getElementById("RessourceSelectEdit").value;
	var CategorieIdEdit = document.getElementById("CategorieSelectEdit").value;

	myweb.db.transaction(function(tx) {
		tx.executeSql("UPDATE Todos SET TodoDesc = ?, TodoDate = ?, RessourceID = ? ,CategorieID = ? WHERE id = ?", [TodoDescEdit.value, TodoDateEdit, RessourceIdEdit, CategorieIdEdit, idToEdit], resetFormAndShow, onError);
	}); 
}
// end FUNCTIONS related to edit Todo

function getBDBid(callback) {	//called by _______ line ______
	var BDBid = "";
	myweb.db.transaction(function (tx) {
		tx.executeSql('SELECT BDBid FROM sync_info WHERE id=?', [1], function (tx, sync_infoResult) {
			syncInfoDataset = sync_infoResult.rows;
			syncInfoRow0 = syncInfoDataset.item(0);
			BDBid = syncInfoRow0['BDBid'];
			console.log("Line 601, BDBid fct: ", BDBid);	// Without callback, the result arrives to late
			callback(BDBid);	// callback to pass the filterParam eventhough it's async.
		}); // for tx.executeSql
	}); // for myweb.db.transac
	//return BDBid;
}

// begin FUNCTIONS related to edit loginParam
function loadLoginParam() {	//called by Liste form button PARAMETER
	myweb.db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM UserParam WHERE id=?', [1], function (tx, UPresult) {
			//console.log("UPresult.rows.length", UPresult.rows.length);
			myweb.dataset = UPresult.rows;
			loginParam = myweb.dataset.item(0);
			usernameEdit.value = loginParam['username'];
			passwordEdit.value = loginParam['password'];
		}); // for tx.executeSql
	}); // for myweb.db.transac
	showHide('LoginParamEdit','Liste');
}

function updateLoginParam() {	//called by loginParam form button MODIFY
	myweb.db.transaction(function(tx) {
		tx.executeSql("UPDATE UserParam SET username = ?, password = ?  WHERE id = 1", [usernameEdit.value, passwordEdit.value]);
	});
	syncWithServer(function(syncSuccess){		// callback is used to wait the server query result.  The data is received from the server when syncSuccess is true.
		if(syncSuccess == true) {
			loadRessourcesSelect(function(RessourcesArray) {	//the function is a callback to wait for the query result.
				var txt   = "";
				console.log(RessourcesArray);
				for (i=0; i < RessourcesArray.length; i++){
					txt=txt + "<option value=" + RessourcesArray[i].RessourceID + ">" + RessourcesArray[i].RessourceID + " - " + RessourcesArray[i].RessourceNom + "</option>"; // BUG: l'option 0 n'est pas selected pour Ajout et Filtre
				}
				var txtAdd    = "<option value='0'>--Choisir une ressource--</option>" + txt;
				var txtEdit   = "" + txt;
				var txtFiltre = "<option value='0'>--Toutes les ressources--</option>" + txt;
				document.getElementById("RessourceSelectAdd").innerHTML = txtAdd;
				document.getElementById("RessourceSelectEdit").innerHTML = txtEdit;
				document.getElementById("RessourceSelectFiltre").innerHTML = txtFiltre;
			});

			loadCategoriesSelect(function(CategoriesArray) {	//the function is a callback to wait for the query result.
				var txt   = "";
				for (i=0; i < CategoriesArray.length; i++){
					txt=txt + "<option value=" + CategoriesArray[i].CategorieID + ">" + CategoriesArray[i].CategorieID + " - " + CategoriesArray[i].CategorieNom + "</option>";
				}
				var txtAdd    = "<option value='0'>--Choose a category--</option>" + txt;
				var txtEdit   = "" + txt;
				var txtFiltre = "<option value='0'>--All categories--</option>" + txt;
				document.getElementById("CategorieSelectAdd").innerHTML = txtAdd;
				document.getElementById("CategorieSelectEdit").innerHTML = txtEdit;
				document.getElementById("CategorieSelectFiltre").innerHTML = txtFiltre;
			});

		}
	});
	showHide('Liste','LoginParamEdit');
}
// end FUNCTIONS related to edit loginParam

function showHide(shown, hidden) {
	document.getElementById(shown).style.display='block';
	document.getElementById(hidden).style.display='none';
	return false;
}

// converts a Date object into a string, using the ISO-8601 and the format is: YYYY-MM-DDTHH:mm:ss.sssZ
function getCurrentDateISO() {
	return new Date().toISOString().substring(0, 10);
}

function onError(tx, error) {
	err(error.message);
}

function err(message) {
	alert(message);
}

// to export/backup th WebSQL DB to do some query test with SQLite Databsse browser program.
// Ref: http://stackoverflow.com/questions/22657843/how-to-export-websql-database-to-sql-file-like-mysqldump
function backup() {
	exportSql("Todos");
	exportSql("Categories");
	exportSql("Ressources");
	exportSql("new_elem");
	exportSql("sync_info");
	exportSql("sqlite_sequence");
}

function exportSql(table) {
	var _tbl_name = table;
	var _exportSql = "";
	myweb.db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM " + _tbl_name + ";", [], function(tx, results) {
			if (results.rows) {
				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);
					var _fields = [];
					var _values = [];
					for (col in row) {
						_fields.push(col);
						_values.push('"' + row[col] + '"');
					}
					_exportSql += "\nINSERT INTO " + _tbl_name + "(" + _fields.join(",") + ") VALUES (" + _values.join(",") + ")";
				}
			}
			console.log("_exportSql: ", _exportSql);
		}); // for tx.executeSql
	}); // for myweb.db.transac
}


