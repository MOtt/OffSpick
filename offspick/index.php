<?php require_once "configuration.php"

header("Content-Type: application/json; charset=utf-8");

/* Verbindzung zu SQL-Server */
mysql_connect(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT) or die('Keine Verbindung möglich: ' . mysql_error());

/* Datenbank auswählen */
mysql_select_db(MYSQL_DATENBANK);

/* Collation anpassen */
mysql_query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'") or die(mysql_error());


$func = $_REQUEST["func"];

	switch($func){
		case "offSpickList": offSpickList($_REQUEST); break;
		default: doerror("hmmm* - diese Funktion wurde noch nicht definiert");
	}


function offSpickList($param){

	$entries = array();
	$datetoday = date("Y-m-d");

	$sqlstring = "select cc.categoryID,ca.Text,ca.Description,cc.ContactID,c.Name,c.Description,cn.Phone from OffSpick.ContactCategory cc inner join OffSpick.Category ca on ca.ID=cc.CategoryID inner join OffSpick.Contact c on c.ID = cc.ContactID inner join OffSpick.ContactNumber cn on cc.ContactID = cn.ID where '".$datetoday."' between ca.ValidFrom and ca.ValidTo and '".$datetoday."' between c.ValidFrom and c.ValidTo order by ca.Sort,c.Sort";


	$result = mysql_query($sqlstring);

	while ($row = mysql_fetch_array($result, MYSQL_BOTH)) {
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


function doError($msg){
	doOutput(null,false,$msg);
}


function doOutput($result,$sucess=true,$msg=null){

	header ("Content-Type: application/json");

	$result = array(
				'sucess' => $sucess,
				'error' => $msg,
				'result' => $result
				);

	echo (json_encode($result));
}

?>