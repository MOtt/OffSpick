<?php

if(!isset($_POST['submit'])) {
	return;
}

// sind alle Felder ausgefüllt?
if(!isset($_POST['username'], $_POST['realname'], $_POST['pass'], $_POST['email']) || empty($_POST['username']) || empty($_POST['realname']) || empty($_POST['pass']) || empty($_POST['email'])) {
	$error_msg = 'Formular nicht vollständig ausgefüllt';
	return;
}

// Benutzername von Leerzeichen befreien
$_POST['username'] = trim($_POST['username']);

// ist der Benutzername zu lang?
if(strlen($_POST['username']) > 4) {
	$error_msg = "Der Benutzername ist zu lang";
	return;
}

// Passwort überprüfen und mit SHA256 verschlüsseln
if (strlen($_POST['pass'][0]) == 0) {
	$error_msg = "Passwort ist leer";
	unset($_POST['pass'][0], $_POST['pass'][1]);
	return;
}
	else if (strlen($_POST['pass'][0])<8) {
	$error_msg = "Passwort zu kurz";
	unset($_POST['pass']);
	return;
}
	else if($_POST['pass'][0] !== $_POST['pass'][1]) {
	$error_msg = " Passwörter stimmen nicht überein";
	return;
}
	else {
	$_POST['pass'] = hash('sha256', $_POST['pass'][0].$salt);
	}


// EMail-Adresse auf Gültigkeit prüfen
if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
	$error_msg = "EMail-Adresse ist ungültig";
	return;
}

// IP des Absenders auslesen
if(isset($_SERVER['HTTP_X_FORWARDED_FOR']) && $_SERVER['HTTP_X_FORWARTDED_FOR'] != '') {
    $user_ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $user_ip = $_SERVER['REMOTE_ADDR'];
}

// Benutzer in DB einfügen
$sql = 'INSERT INTO User (username, name, password, email, IP) VALUES (?, ?, ?, ?, ?)';
$stmt = $db->prepare($sql);
$stmt->bind_param('sssss', $_POST['username'], $_POST['realname'], $_POST['pass'], $_POST['email'], $user_ip);

if(!$stmt->execute()) {
	
	// Fehler beim Einfügen?
	if (strpos($db->error, 'Duplicate') !== false) {
		$error_msg = 'Benutzername/Name wurde bereits verwendet';
		unset($_POST['username']);
}
	else {
	$error_msg = " Es ist ein Fehler aufgetreten: ".$db->error;
	unset($_POST['pass']);
	}
	return;
}

$stmt->close();

// wenn Einfügen geklappt hat, Rückmeldung ausgeben
$success_msg = "Benutzer ".htmlspecialchars($_POST['username'])." wurde angelegt";
?>