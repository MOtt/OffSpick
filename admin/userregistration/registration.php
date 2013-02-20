<?php

//------------------------ Config ---------------
ini_set('include_path', 'http://www.feuerwehr-wiesendangen.ch/offapp/registrierung/');
$db = new MySQLi('localhost', 'mobapp', 'fw118', 'OffSpick');
$salt = "09.delfhkjsdfmlwsafd..324021034012041234,1234.21,34.1234.,,.231421";
//-----------------------------------------------

require_once('registration_logic.php');
require_once('registration_markup.php');

?>