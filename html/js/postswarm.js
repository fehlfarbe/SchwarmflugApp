var photo;
var pictureSource; // picture source
var destinationType; // sets the format of returned value
//var imgURI;
//var comment;



/************* geolocation *****************/

var onGeoSuccess = function(position) {
	/*
	alert('Latitude: '          + position.coords.latitude          + '\n' +
	     'Longitude: '         + position.coords.longitude         + '\n' +
	     'Altitude: '          + position.coords.altitude          + '\n' +
	     'Accuracy: '          + position.coords.accuracy          + '\n' +
	     'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	     'Heading: '           + position.coords.heading           + '\n' +
	     'Speed: '             + position.coords.speed             + '\n' +
	     'Timestamp: '         + position.timestamp                + '\n');
     */
	$('#lat').val(position.coords.latitude);
	$('#lon').val(position.coords.longitude);
	
	$("#geomsg").html("Breite: " + $('#lat').val() + "<br />"
			+ "Länge: " + $('#lon').val() );
	
	$.mobile.hidePageLoadingMsg();
	$.unblockUI(); 
};


function onGeoError(error) {
	$("#geomsg").html("Fehler " + error.code + "<br />" + error.message);
	
	switch(error.code){
	case 2:
		alert("Standort kann nicht ermittelt werden. Überprüfen Sie Ihre Lokalisierungseinstellungen und -berechtigungen");
		break;
	default:
		alert("Unbekannter Fehler bei Lokalisation (Code " + error.code + ", Beschreibung: " + error.message);
	}
	
	$.mobile.hidePageLoadingMsg();
	$.unblockUI(); 
}

function locate()
{
	$.mobile.showPageLoadingMsg("a", 'Bestimme Standort...', false);
	$.blockUI({message: null}); 
	navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
}


/************* Time ***************************/
function getCurrentTime(){
	
	var d = new Date();
	$('#date').val(d.getFullYear()+"/"+(d.getMonth()+1 < 10 ? '0' + (d.getMonth()+1) : d.getMonth()+1)+"/"+d.getDate());
	$("#time").val(d.getHours()+":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) );
}

/************* Submit data ********************/
function sumbitData(){
	
	if( $('#lat').val() == '' || $('#lon').val() == ''){
		alert("Unbekannte Position! Melden nicht möglich.");
		return;
	}
	
	$.mobile.showPageLoadingMsg("a", "Übermittle Daten", false);
	$.blockUI({message: null}); 
	
	url = server + "/newswarm";
	var imageURI = $('#smallImage').attr('src');


	var options = new FileUploadOptions();
	var params = new Object();
	params.lat = $('#lat').val();
	params.lon = $('#lon').val();
	params.time = $('#time').val();
	params.date = $('#date').val();
	params.genus = $('#genus option:selected').val();
	params.species = $('#species option:selected').val() || "";
	params.comment = $('#comment').val();
	
	//image
	options.fileKey = "file";
	options.fileName = "";
	options.mimeType = "";
	options.chunkedMode = "";
	
	if(imageURI != ''){
		if (imageURI.indexOf('data:image/jpeg;base64') !== -1){
			params.photo = imageURI;
			imageURI = "";
		} else {
			options.fileKey = "file";
			options.fileName = "image";
			options.mimeType = "image/jpeg";
			options.chunkedMode = false;			
		}
	} else {
		console.log("no image!");
	}

	
	options.params = params;

	// Transfer picture to server
	var ft = new FileTransfer();
	ft.upload(imageURI,
			url, 
			function(r){
				alert("Meldung erfolgreich!\n");
						//+r.bytesSent+" bytes gesendet.");
				$.mobile.hidePageLoadingMsg();
				$.unblockUI();
				$.mobile.navigate("#index");
			},
			function(error) {
				
				switch(error.code)
				{
//				case 0:
				case 1: alert("Server oder Netzwerk nicht erreichbar!"); break;
//				case 2:
				case 3: alert("Konnte keine Verbindung zu Server aufbauen. Timeout"); break;
				default: alert("Serverfehler " + error.code + "\n" + error.message);
				
				}
				
				$.mobile.hidePageLoadingMsg();
				$.unblockUI();
			},
			options);

	console.log("Sent data");
}



/** *********** Camera handling / picture from album **************** */

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
	// Uncomment to view the base64 encoded image data
	console.log("PhotoDataSuccess");
	//console.log("Image: " + imageData);

	// Get image handle
	//
	var smallImage = document.getElementById('smallImage');
	smallImage.src = "";

	// Unhide image elements
	//
	smallImage.style.display = 'block';

	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	smallImage.src = "data:image/jpeg;base64," + imageData;
	
	photo = imageData;
	//scroll to image label
	$('html, body').animate({scrollTop: $('#lblphoto').offset().top}, 2500);
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
	// Uncomment to view the image file URI 
	console.log(imageURI);

	// Get image handle
	//
	//var largeImage = document.getElementById('largeImage');
	var smallImage = document.getElementById('smallImage');
	smallImage.src = "";
	// Unhide image elements
	//
	smallImage.style.display = 'block';

	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	smallImage.src = imageURI;
	
	//load data
	//loadData();
	
	//scroll to image label
	$('html, body').animate({scrollTop: $('#lblphoto').offset().top}, 2500);
}

// A button will call this function
//
function capturePhoto() {
	// Take picture using device camera and retrieve image as base64-encoded string
	console.log("Capture Photo");
	
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
		quality : 50,
		destinationType : destinationType.DATA_URL
	});
	console.log("Captured Photo");
}

// A button will call this function
//
function capturePhotoEdit() {
	// Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
		quality : 20,
		allowEdit : true,
		destinationType : destinationType.DATA_URL
	});
}

// A button will call this function
//
function getPhoto(source) {
	
	// Retrieve image file location from specified source
	navigator.camera.getPicture(onPhotoURISuccess, onFail, {
		quality : 50,
		destinationType : destinationType.FILE_URI,
		sourceType : source
	});
}

// Called if something bad happens.
// 
function onFail(message) {
	console.log("failed! " + message);
	//alert('Failed because: ' + message);
}