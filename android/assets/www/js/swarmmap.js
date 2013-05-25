// Quelle: 	http://vsnomad.com/2013/03/18/dtw-google-maps/
//			https://developers.google.com/maps/documentation/javascript/tutorial?hl=de
//			http://thingsico.de/blog/2011/11/using-google-maps-reliably-in-phonegap/

var myLocation;	// coordinates
var mapOptions;
var map;
var googleMapsState = "";

//google.maps.event.addDomListener(window, 'load', setup);

//function setup() {
// wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);
    
function onDeviceReady() {
    // get device's geographical location and return it as a Position object (which is then passed to onSuccess)
    //navigator.geolocation.getCurrentPosition(onSuccess, onError);
	//alert("device ready fired");
	loadGoogleMaps();
}

function loadGoogleMaps() {
	googleMapsState = "loading";
	
	var script = document.createElement("script");
	script.src = "http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=googleMapsReady";
	script.type = "text/javascript";
	
	script.addEventListener("error", function(e) {
		googleMapsState = "error";
		alert("error");
	}, false);
	
	script.addEventListener("load", function(e) {
		setTimeout(function() {
			if(googleMapsState == "loading") {googleMapsState = "error"; alert("Timeout");}
		}, 5000);
	}, false);
	
	document.getElementsByTagName("head")[0].appendChild(script);
}
//}

function googleMapsReady() {
	alert("Google Map is ready");
	googleMapsState = "ready";
	initMap();
}

function initMap() {
	alert("initMap called");
	//myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	myLoaction = new google.maps.LatLng(-34.397, 150.644);
	mapOptions = {	center: myLocation,
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP };
    
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}
