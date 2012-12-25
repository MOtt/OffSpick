function callBack(){
	};


function offSpickListInsert(param){


var offSpickList = $('#offSpickList');
var $currentCategory = null;
var i,j,li, ul;

try{
	
	for (i = 0; i < param.result.length; i++) {
		if ($currentCategory != param.result[i].categoryName){
			li = $('<li></li>');
			li.append('<h3>'+param.result[i].categoryName+'</h3><p>'+param.result[i].categoryDescription+'</p>');
			$currentCategory = param.result[i].categoryName;
		ul = $('<ul></ul>');
		}

		if ($currentCategory == param.result[i].categoryName) {
			ul.append('<li data-icon="grid"><a data-id="'+param.result[i].contactId+'" href="tel:'+param.result[i].contactNumber+'">'+param.result[i].contactName+'<p>'+param.result[i].contactDescription+'</p></a></li>');
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



function loadData(){

// Variable muss durch PhoneGap-Funktion gelöst werden (On-/Offline)
var online = true;

if (online==true){
	
	
	$.ajax({
  	 type: 'POST',
 	 url: '../offspick/',
 	 data: {'func': 'offSpickList'},
 	 success: function(data){offSpickListInsert(data); callBack()}
	 });
	
}
else {
	
	callBack();
}

};


$(document).bind('mobileinit',function(){						   

	$('#offSpickListPage').live('pageinit',function(toPage,options){
	console.log(toPage,options);
	loadData();
	});

    $.mobile.page.prototype.options.addBackBtn = true;
	$.mobile.page.prototype.options.backBtnText = "Home";

});


$(document).ready(function(){
   
 });
 
 
// *******************************************************
// ab hier folgen die LocalStorage-Funktionen
// *******************************************************
	
function checkLogin() {
	
	try {         
		var loginuser = localStorage.getItem('OffUser');
		var loginpassword = localStorage.getItem('OffPassword'); 
		
		if ((loginuser.length > 0) && (loginpassword.length > 0)){
			console.log('User/Passwort vorhanden: '+loginuser+' / '+loginpassword);
		}  
	}
	catch (e) {        
		if (e == 'QUOTA_EXCEEDED_ERR') {             
			console.log("Fehler" + e);         
			}
	else {             
		console.log('Benutzer / Passwort unvollständig');         
		}     
	}  
} 	
	

function localStorageLoad() {              
	if (typeof(Storage) == "undefined" ) {             
		alert("Dein Browser unterstützt den HTML5 Storage nicht. Browser updaten...");     
	}      
	else {         
		console.log("LocalStorage und SessionStorage werden unterstützt.");     
		checkLogin();
		}
}

