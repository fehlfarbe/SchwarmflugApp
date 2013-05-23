var pictureSource; // picture source
var destinationType; // sets the format of returned value 

// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready to be used!
//
function onDeviceReady() {
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;

}

/************* Submit data ********************/
function sumbitData(){
	//TODO: test
	server = "http://192.168.100.26:5000/newswarm";
	
	var img = document.getElementById('smallImage');
	var imageURI = img.src;
	

	var options = new FileUploadOptions();
	options.fileKey = "file";
	options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
	options.mimeType = "image/jpeg";
	options.chunkedMode = false;

	// Transfer picture to server
	var ft = new FileTransfer();
	ft.upload(imageURI,server, 
			function(r) {console.log("success");},
			function(error) {console.log(error.code);}, 
			options);

	console.log("success!!!!");

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

	// Unhide image elements
	//
	smallImage.style.display = 'block';

	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	smallImage.src = "data:image/jpeg;base64," + imageData;
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
	
	// Unhide image elements
	//
	smallImage.style.display = 'block';

	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	smallImage.src = imageURI;
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