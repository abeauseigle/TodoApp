TodoApp 
=====================
**TodoApp** is an HTML5 WebSql Application with CRUD (Create, Reach, Update, Delete). It uses the local SQLite database included in the browser (Safari, Chrome and many mobile browsers). It uses only HTML5 and CSS for the UI. The form contains different fields such as text, number (see webSqlApp for numbers), date (with a calendar), selectbox, checkbox (see webSqlApp for numbers) and radio button (see webSqlApp for numbers). It uses an improved webSqlSync.js to automatically synchronize the local WebSql database (SQLite of the browser) with a php-MySQL server. Thanks to Samuel for WebSqlSync.js (https://github.com/orbitaloop/WebSqlSync).

Installing
==========

- copy the files in the todoapp folder on your server.  
- change the connexion data to your server (dbhost, dbname, dbuname, dbpass) in the php file in the connexion folder.
- change mywebsite.com or mydomain.com to your server name.
- index.html is the main file of the application. Start with it in your learning.
- Click on the Auth button to authenticate to your user account.
- In the first time, I get (download) the data from the server MySQL database using webSqlSync.js. 
- I modified the webSqlSync.js to treat the data from the server with a double id (tablename_ID for the server and id for the app). When the contact id is null, it means that the record was created in MySQL first.
- The todos table is two way synced.
- The ressources and categories tables are one way sync (server to client). It's just to feed the options of the select box.

Additional functions
==========
- DBSYNC.getLastSyncDate() : return the last client sync date (in unixtime)
- DBSYNC.setSyncDate()  : it can be used to force a complete resync
- DBSYNC.setFirstSync(unixtime) : it can be used to resync data changed since a certain date

How it works
==========
I use 2 indexes (one for the client DB and one for the server DB). 
I modifyed webSqlSync.js to handle inserted records directly into MySQL that have a null client id value. + completely changed the code to be sure the sync is possible with many devices (many browsers in fact because a device may have many browsers). We you first sync, the server sent a timestamp to create a BDBid (browser DataBase unique id). Here is the tric that was not easy to implement.
I added or changed many functions to webSqlSync.js to determine if we INSERT or UPDATE the webSQL DB from the ServerJson
When I insert a record in webSQL (with the client), I use -1 in the "server" ID to inform the server adapter that's a record newly created with the app. 
"-1" means to do an INSERT INTO MySQL. It record the BDBid creator to update the creator ID (to change it from -1 to the server one).
 
I hope it will help you to create your own webSql app. You are welcome to improve the code of the 2 ways sync.

## Limitations:

 - On the table on Server the unique SERVER index MUST BE the first field, and the client one ("id") MUST BE the second field so you will have:  

     * my_ID (int11),
     * id (text),
     * fieldA (whatever),
     * fieldB (whatever),
     * ...,
     * BDBid (char(13) ),
     * last_sync_date (timestamp, on update CURRENT_TIMESTAMP, CURRENT_TIMESTAMP -OR- Datetime if you have already a timestamp column in your table)
    
 - DELETE are not handled for now in the sync process (handle with a specific value in specific field lke 'Active'.
 - There is no error handling for the server side. You're welcome to help me for it.
 - Still to do: Authentication encryption. Security improvement to avoid js injection. Gzip the JSON. Make sure that the Auth page will appear if the tables areempty to say to the new user to authenticate and do a first sync to fill the tables from the server. Improve the List page  (the todo list) using Div and CSS
 - Your help will be appreciated.
 
Have fun! 
