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
 
 
function localStorageSave(user, pass) {                

	try {         
		localStorage.setItem("LoginUser", user); 
		localStorage.setItem("LoginPassword", pass);      
		}      
	catch (e) {        
		if (e == 'QUOTA_EXCEEDED_ERR') {             
			console.log("Error: Local Storage limit exceeds.");         
			}         
	else {             
		console.log("Error: Saving to local storage.");         
		}     
	}  
}   

function localStorageGet() {     
	console.log("Getting your data from local storage.");    
	var username = document.getElementById("name");     
	var age = document.getElementById("age");     
	username.value = localStorage.getItem("name");     
	age.value = localStorage.getItem("age");      
}   

function localStorageRemoveUser() {     
	console.log("Removing data from local storage.");     
	localStorage.removeItem("LoginUser");     
	localStorage.removeItem("LoginPassword");      
}   

function localStorageClear() {     
	console.log("Clearing local storage.");      
	localStorage.clear();      
}   

function localStorageSaveJSON() {     
	console.log("Saving complex data to local storage.");     
	var username = document.getElementById("name");     
	var age = document.getElementById("age");     
	var personObject = new Object();     
	personObject.name = username.value;     
	personObject.age = age.value;     
	localStorage.setItem("person", JSON.stringify(personObject));     
}   

function localStorageRestoreJSON() {     
	console.log("Restoring complex data from local storage.");     
	var username = document.getElementById("name");     
	var age = document.getElementById("age");     
	var personObject = JSON.parse(localStorage.getItem("person"));     
	username.value = personObject.name;     
	age.value = personObject.age; }     

function localStorageLoad() {          
	console.log("Page load finished");     
	if (typeof(Storage) == "undefined" ) {             
		alert("Your browser does not support HTML5 localStorage. Try upgrading.");     
	}      
	else {         
		console.log("Both localStorage and sessionStorage support is there.");     
		}
}