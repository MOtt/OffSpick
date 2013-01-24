// ***************************************************************************************************
// Daten aus LocalStorage für Listendarstellung aufbereiten
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
			ul.append('<li data-icon="grid"><a data-id="'+param[i].contactId+'" href="tel:'+param[i].contactNumber+'">'+param[i].contactName+'<p></br>'+param[i].contactDescription+'</p></a></li>');
		}
		li.append(ul);
		offSpickList.append(li);
	}
	offSpickList.listview('refresh');
}

catch(e){
		alert("Fehler: " + e);  
		}
}	


// ***************************************************************************************************
// Fügt die Event-Handler an die Ereignise an
// ***************************************************************************************************

$(document).bind('mobileinit',function(){						   

	$.mobile.page.prototype.options.addBackBtn = true;
	$.mobile.page.prototype.options.backBtnText = "Home";	

	$('#offSpickListPage').live('pageinit',function(toPage,options){	 
		checkLoginData();	
	});
	
	$('#loginForm').live('pageinit',function(toPage,options){		 
		$('#loginBtn').live('click',saveLogin);			
	});
});

/*
$(document).ready(function(){
});
 */
 
 
// ***************************************************************************************************
// Logindaten lokal auf Existenz prüfen. Falls OffUser oder OffPassword fehlt -> Loginmaske anzeigen
// ***************************************************************************************************
	
function checkLoginData() {
	
	// Prüfen ob Login im Localstorage eingetragen
	
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
			alert("Fehler: " + e);         
			}
	else {             
		alert("Fehler: Benutzername oder Passwort ist leer");
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
			alert("Fehler: LocalStorage ist voll");         
			}         
	else {             
		alert("Fehler: Speichern in LocalStorage nicht möglich");         
		}     
	}  
}


// ***************************************************************************************************
// Prüfen ob LocalStorage verfügbar ist. Sonst Fehlermeldung
// ***************************************************************************************************

function localStorageLoad() {              
	if (typeof(Storage) == "undefined" ) {             
		alert("Fehler: kein HTML5 Storage. Browser updaten!");     
	}      
	else {         
		checkLoginData();
		}
}

// ***************************************************************************************************
// Logindaten prüfen. Falls korrekt -> Session aufbauen, sonst Login-Formular anzeigen
// ***************************************************************************************************

function requestSession() {

	var loginuser = localStorage.getItem('OffUser');
	var loginpw = localStorage.getItem('OffPassword'); 
	
	$.ajax({
  	 type: 'POST',
 	 url: '../offspick/',
 	 data: {'func': 'offSpickCheckLogin', 'user': loginuser, 'pw': loginpw},
 	 success: function(data){
							if (data.success === true){
								requestOffSpickList();
								}
							else {
								alert("Fehler: Benutzer/Passwort falsch");
								$.mobile.changePage("#loginForm"); 
								}
							},
	 error: function(request, text, errorObj){							
							// entspricht dem Fall "Server nicht erreichbar" -> Lokale Daten prüfen ob vorhanden und ohne weitere Authentifizierung anzeigen
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
								localStorage.setItem("OffSpickList", JSON.stringify(data.result)); 
								showOffSpickOffline()
							}
							else {
								alert("Fehler: lokale Daten werden verwendet");
								showOffSpickOffline()
								}
							},
 	 error: function(request, text, errorObj){
		 					alert("Fehler: lokale Daten werden verwendet");
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
		alert("Fehler: keine lokale Daten vorhanden");
	}
}