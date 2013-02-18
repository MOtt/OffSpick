<?php require_once "configuration.php";

session_start();

header("Content-Type: application/json; charset=utf-8");

// ***************************************************************************************************
// Verbindung zu MySQL-Server aufbauen
// ***************************************************************************************************
$db = new MySQLi(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

$db->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");


// ***************************************************************************************************
// Mögliche Parameter für die Abfrage
// ***************************************************************************************************
$func = $_REQUEST["func"];

	switch($func){
		case "offSpickList": offSpickList($_REQUEST); break;
		case "offSpickCheckLogin": offSpickCheckLogin($_REQUEST); break;
		default: doerror("hmmm* - diese Funktion wurde noch nicht definiert");
	}


// ***************************************************************************************************
// Liest Kontaktdaten aus der Datenbank aus und liefert diese als JSON zurück
// ***************************************************************************************************
function offSpickList($param){

	global $db;
	$entries = array();
	$datetoday = date("Y-m-d");

	$sqlstring = "SELECT cc.categoryID, ca.Text, ca.Description, cc.ContactID, c.Name, c.Description, cn.Phone FROM OffSpick.ContactCategory cc INNER JOIN OffSpick.Category ca ON ca.ID=cc.CategoryID INNER JOIN OffSpick.Contact c ON c.ID = cc.ContactID INNER JOIN OffSpick.ContactNumber cn ON cc.ContactID = cn.ID WHERE '".$datetoday."' BETWEEN ca.ValidFrom AND ca.ValidTo AND '".$datetoday."' BETWEEN c.ValidFrom AND c.ValidTo ORDER BY ca.Sort, c.Sort";


	$result = $db->query($sqlstring);
	
	while ($row = $result->fetch_array())  {
  	  $row_array['categoryId'] = (int)$row[0];
	  $row_array['categoryName'] = $row[1];
  	  $row_array['categoryDescription'] = $row[2];
	  $row_array['contactId'] = (int)$row[3];
  	  $row_array['contactName'] = $row[4];
   	  $row_array['contactDescription'] = $row[5];
	  $row_array['contactNumber'] = $row[6];
	  array_push($entries,$row_array);
	}

	doOutput($entries);

}

// ***************************************************************************************************
// Login-Daten gem. Login-Tabelle prüfen. Falls i.O. -> SessionID zurückliefern, sonst Fehler
// ***************************************************************************************************
function offSpickCheckLogin($param) {
	global $db;
	$password = hash('sha256', $param['pw'].SECURITYSALT);
	
	$sql = 'SELECT COUNT(*) FROM User WHERE Username = ? AND Password = ?';
	
	$stmt = $db->prepare($sql);
	$stmt->bind_param('ss', $param['user'], $password);
	$stmt->execute();
	$stmt->bind_result($result);
	$stmt->fetch();
	$stmt->close();

	// logged_in auf false initialisieren
	$_SESSION['logged_in'] = false;
	
	if($result == 1){
				
		$_SESSION['logged_in'] = true;
						
		doOutput(array('sessionID' => session_id()),true);
	} else {
		doOutput(null,false,'Login fehlerhaft');
	}
}


// ***************************************************************************************************
// Fehler ausgeben
// ***************************************************************************************************
function doError($msg){
	doOutput(null,false,$msg);
}


// ***************************************************************************************************
// 
// ***************************************************************************************************
function doOutput($result,$success=true,$msg=null){

	header ("Content-Type: application/json");

	$result = array(
				'success' => $success,
				'error' => $msg,
				'result' => $result
				);

	echo (json_encode($result));
}

?>