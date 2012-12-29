// ***************************************************************************************************
// Daten aus LocalStorage f�r Listendarstellung aufbereiten
// ***************************************************************************************************

function offSpickListInsert(param){

var offSpickList = $('#offSpickList');
var $currentCategory = null;
var i,j,li, ul;

try{	
	for (i = 0; i < param.length; i++) {
		if ($currentCategory != param[i].categoryName){
			li = $('<li></li>');
			li.append('<h3>'+param[i].categoryName+'</h3><p>'+param[i].categoryDescription+'</p>');
			$currentCategory = param[i].categoryName;
		ul = $('<ul></ul>');
		}

		if ($currentCategory == param[i].categoryName) {
			ul.append('<li data-icon="grid"><a data-id="'+param[i].contactId+'" href="tel:'+param[i].contactNumber+'">'+param[i].contactName+'<p>'+param[i].contactDescription+'</p></a></li>');
		}
		li.append(ul);
		offSpickList.append(li);
	}
	
	offSpickList.listview('refresh');
}

catch(e){
	alert(e);
		}
}	


$(document).bind('mobileinit',function(){						   
	console.log('MobileInit');
	$('#offSpickListPage').live('pageinit',function(toPage,options){	 
		checkLoginData();									 
	});
	
	$('#loginForm').live('pageinit',function(toPage,options){		 
		$('#loginBtn').live('click',saveLogin);									 
	});
});


$(document).ready(function(){
});
 
 
// ***************************************************************************************************
// Logindaten lokal auf Existenz pr�fen. Falls OffUser oder OffPassword fehlt -> Loginmaske anzeigen
// ***************************************************************************************************
	
function checkLoginData() {
	
	// Pr�fen ob Login im Localstorage eingetragen
	
	try {   
		var loginuser = localStorage.getItem('OffUser');
		var loginpassword = localStorage.getItem('OffPassword'); 
		
		if ((loginuser.length > 0) && (loginpassword.length > 0)){
			$.mobile.changePage("#offSpickListPage"); 
			requestSession()	
		}  
	}
	catch (e) {        
		if (e == 'QUOTA_EXCEEDED_ERR') {             
			console.log("Fehler" + e);         
			}
	else {             
		alert("Benutzername oder Passwort ist leer");
		$.mobile.changePage("#loginForm"); 
		}     
	}  
} 	
	
	
// ***************************************************************************************************
// Benutzerdaten im LocalStorage ablegen (Key's: OffUser resp. OffPassword
// ***************************************************************************************************	

function saveLogin() {
	                  
	try {         
		localStorage.setItem("OffUser", $("#user").val());   
		localStorage.setItem("OffPassword", $("#pw").val()); 
		$.mobile.changePage("#offSpickListPage"); 
		requestSession()
		}      
	catch (e) {        
		if (e == "QUOTA_EXCEEDED_ERR") {             
			console.log("Fehler: LocalStorage voll");         
			}         
	else {             
		console.log("Fehler: Speichern in LocalStorage nicht m�glich");         
		}     
	}  
}


// ***************************************************************************************************
// Pr�fen ob LocalStorage verf�gbar ist. Sonst Fehlermeldung
// ***************************************************************************************************

function localStorageLoad() {              
	if (typeof(Storage) == "undefined" ) {             
		alert("Dein Browser unterst�tzt den HTML5 Storage nicht. Browser updaten...");     
	}      
	else {         
		console.log("LocalStorage und SessionStorage werden unterst�tzt.");     
		checkLoginData();
		}
}

// ***************************************************************************************************
// Logindaten pr�fen. Falls korrekt -> Session aufbauen, sonst Login-Formular anzeigen
// ***************************************************************************************************

function requestSession() {

	var loginuser = localStorage.getItem('OffUser');
	var loginpw = localStorage.getItem('OffPassword'); 
	
	$.ajax({
  	 type: 'POST',
 	 url: '../offspick/',
 	 data: {'func': 'offSpickCheckLogin', 'user': loginuser, 'pw': loginpw},
 	 success: function(data){
		 					console.log(data);
							if (data.success === true){
								
							requestOffSpickList();
							
								}
								else {
									// ggf. Alert durch Popup ersetzen
									alert("Passwort falsch");
									$.mobile.changePage("#loginForm"); 
									}
							},
	 error: function(request, text, errorObj){							
							// entspricht dem Fall "Server nicht erreichbar" -> Lokale Daten pr�fen ob vorhanden und ohne weitere Authentifizierung anzeigen
							showOffSpickOffline()
							}
	 });
}


// ***************************************************************************************************
// Daten vom Server abrufen. Bei Fehler den letzten lokalen Stand anzeigen
// ***************************************************************************************************

function requestOffSpickList(){
	
	$.ajax({
  	 type: 'POST',
 	 url: '../offspick/',
 	 data: {'func': 'offSpickList'},
 	 success: function(data){
		 					if (data.success === true && data.result.length>0){
								console.log("versuche Daten abzuspeichern");
								localStorage.setItem("OffSpickList", JSON.stringify(data.result)); 
								showOffSpickOffline()
							}
							else {
								alert("Fehler - lokale Daten werden verwendet");
								showOffSpickOffline()
								}
							},
 	 error: function(request, text, errorObj){
		 					alert("Fehler - lokale Daten werden verwendet");
							showOffSpickOffline()
	 						}
	 });
}


// ***************************************************************************************************
// Wenn Daten im LocalStorage vorhanden sind, die Anzeige starten, sonst Fehler ausgeben
// ***************************************************************************************************

function showOffSpickOffline() {

	try {
		var param = JSON.parse(localStorage.getItem("OffSpickList"));
		offSpickListInsert(param);
	}
	catch (e) {
		alert("Fehler - keine lokale Daten vorhanden");
	}
}