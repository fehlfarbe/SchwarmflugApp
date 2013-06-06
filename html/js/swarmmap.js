// Quelle: 	http://vsnomad.com/2013/03/18/dtw-google-maps/
//			https://developers.google.com/maps/documentation/javascript/tutorial?hl=de
//			http://thingsico.de/blog/2011/11/using-google-maps-reliably-in-phonegap/
//			http://www.mobiledevelopersolutions.com/home/start/twominutetutorials/tmt4part1

var myLocation;	// coordinates
var mapOptions;
var map;
var googleMapsState = "";


function loadGoogleMaps() {
	googleMapsState = "loading";

//function initMap() {
	alert("initMap called");
	//myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	//myLoaction = new google.maps.LatLng(-34.397, 150.644);
	/*mapOptions = {	center: myLocation,
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP };
    
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);*/
    
    $('#map_canvas').gmap({'center': new google.maps.LatLng(-34.397, 150.644),
    	'zoom': 15,
    	'mapTypeControl': true,
    	'navigationControl': true,
    	'navigationControlOptions': {'position': google.maps.ControlPosition.LEFT_TOP}
    	});
    
    //google.maps.event.trigger(map, 'resize');
}