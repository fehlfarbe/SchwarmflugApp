/*

var lon;
var lat;
var datetime;
var genus;
var species;
 */
var pictureSource; // picture source
var destinationType; // sets the format of returned value
//var comment;

// Wait for Cordova to connect with the device
//
//document.addEventListener("deviceready", onDeviceReady, false);
// Cordova is ready to be used!
//

/*function onDeviceReady() {
	alert("postswarm.js");
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
	locate();
	testSpeciesDB(); //updates species DB if necessary and reloads genuList
	getCurrentTime();
	

	//datetimepicker
	$.timepicker.regional['de'] = {
			  timeOnlyTitle: 'Uhrzeit auswählen',
			  timeText: 'Zeit',
			  hourText: 'Stunde',
			  minuteText: 'Minute',
			  secondText: 'Sekunde',
			  currentText: 'Jetzt',
			  closeText: 'Auswählen',
			  ampm: false
			};
	$.timepicker.setDefaults($.timepicker.regional['de']);
	$('#time').datetimepicker();
}
*/
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
};


function onGeoError(error) {
	$("#geomsg").html("Fehler " + error.code + "<br />" + error.message);
}

function locate()
{
	$("#geomsg").html('<img src="img/antload32.gif" />');
	navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
}

/************* get species / genus *************/
/*
function getGenus()
{
	//genus = Array("Lasius", "Camponotus", "Formica", "Temnothorax");
	
	$.ajax({
		url: server + "/genuslist",
		success: function(data) {
			//it works, do something with the data
			var genus = data.toString().split(',');
			
			var dropdown = document.getElementById('genus');
			var opt = document.createElement("option");
			dropdown.options.add(opt);
			opt.text = "Unbekannt";
			opt.value = "unknown";
			
			for( var i=0; i<genus.length; i++)
			{
				opt = document.createElement("option");
				dropdown.options.add(opt);
				opt.text = opt.value = genus[i];
			}
		},
		error: function() {
			//something went wrong, handle the error and display a message
			alert("Error while loading genus list");
		}
	});

}
*/
/*
function getSpecies(genus)
{	
	//clear list
	var dropdown = document.getElementById('species');
	$("#species").empty();
	

	if(genus == "unknown")
		//$('#species').attr("disabled","disabled");
		//TODO: select size etc.
		return;
	
	//from db
	
	$.ajax({
		url: server + "/specieslist?genus=" + genus,
		success: function(data) {
			//it works, do something with the data
			//alert(data.toString());
			
			var opt = document.createElement("option");
			dropdown.options.add(opt);
			opt.text = "sp.";
			opt.value = "sp";
			
			for( var i=0; i<data.ants.length; i++)
			{
				opt = document.createElement("option");
				dropdown.options.add(opt);
				opt.text = data.ants[i].species + "(" + data.ants[i].country + ")";
				opt.value = data.ants[i].species;
			}
		},
		error: function() {
			//something went wrong, handle the error and display a message
			alert("Fehler beim Laden der Artenliste");
		}
	});
//	
//	switch(genus)
//	{
//		case "Camponotus": species = Array("ligniperdus", "herculeanus"); break;
//		case "Lasius": species = Array("niger", "flavus", "fuliginosus", "emarginatus"); break;
//		case "Formica": species = Array("fusca", "rufifarbis", "rufa", "polyctena"); break;
//		default: species = Array();	
//	}
}
*/
/************* Time ***************************/
function getCurrentTime(){
	
	var d = new Date();
	$('#date').val(d.getFullYear()+"/"+(d.getMonth()+1 < 10 ? '0' + (d.getMonth()+1) : d.getMonth()+1)+"/"+d.getDate());
	$("#time").val(d.getHours()+":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) );
}

/************* Submit data ********************/
function sumbitData(){
	
	$.mobile.showPageLoadingMsg("Übermittle Daten...");
	
	url = server + "/newswarm";
	
	//var img = document.getElementById('smallImage');
	var imageURI = $('#smallImage').attr('src');
	//alert($('#smallImage').attr('src'));

	var options = new FileUploadOptions();
	if(imageURI != ''){
		options.fileKey = "file";
		options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
		options.mimeType = "image/jpeg";
		options.chunkedMode = false;		
	} else {
		options.fileKey = "file";
		options.fileName = "";
		options.mimeType = "";
		options.chunkedMode = "";
	}
	
	var params = new Object();
	params.lat = $('#lat').val();
	params.lon = $('#lon').val();
	params.datetime = $('#time').val();
	params.genus = $('#genus option:selected').val();
	params.species = $('#species option:selected').val();
	params.comment = $('#comment').val();
	
	options.params = params;

	// Transfer picture to server
	var ft = new FileTransfer();
	ft.upload(imageURI,
			url, 
			function(r){
				alert("Upload successful: "+r.bytesSent+" bytes uploaded.");
				$.mobile.hidePageLoadingMsg();
			},
			function(error) {
				
				switch(error.code)
				{
//				case 0:
//				case 1:
//				case 2:
				case 3: alert("Konnte keine Verbindung zu Server aufbauen. Timeout");
				default: alert("failed Code: " + error.code + "\n" + error.message);
				
				}
				
				$.mobile.hidePageLoadingMsg();
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
	console.log("Image: " + imageData);

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
	alert('Failed because: ' + message);
}