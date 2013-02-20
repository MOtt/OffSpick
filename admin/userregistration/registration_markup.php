<!DOCTYPE html>
<head>
<meta charset="utf-8">
<meta content="text/html">
<title>Registrierung</title>
</head>
<body>
<form method="POST">
  <fieldset>
    <label for="username">Benutzername:</label>
    <br/>
    <input type="text" name="username" maxlength="4" id="username" value="<?php echo (isset($_POST['username'])) ? htmlspecialchars($_POST['username']) : '' ?>"/>
    <br/>
    
	<label for="realname">Vorname Name:</label>
    <br/>
    <input type="text" name="realname" maxlength="40" id="realname"value="<?php echo (isset($_POST['realname'])) ? htmlspecialchars($_POST['realname']) : '' ?>"/>
    <br/>
    
    <label for="pass1">Passwort (2x):</label>
    <br/>
    <input type="password" name="pass[]" id="pass1" value=""/>
    <br/>
    <input type="password" name="pass[]" id="pass2" value=""/>
    <br/>
    
    <label for="email">EMail-Adresse:</label>
    <br/>
    <input type="text" name="email" id="email" value="<?php echo (isset($_POST['email'])) ? htmlspecialchars($_POST['email']) : '' ?>"/>
    <br/>
    
    <input type="submit" name="submit" value="Registrieren"/> <input type="reset" name="reset" value="Reset"/>
    
  </fieldset>
</form>

<?php if(isset($error_msg) && !empty($error_msg)) : ?>
	<div style="border:2px solid red; padding: 10px"> 
		<?php echo $error_msg; ?> 
	</div>
<?php endif; ?>

<?php if(isset($success_msg) && !empty($success_msg)) : ?>
	<div style="border:2px solid green; padding: 10px">
		<?php echo $success_msg; ?> 
	</div>
<?php endif; ?>

</body>
</html>