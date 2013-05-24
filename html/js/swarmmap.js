// Quelle: 	http://vsnomad.com/2013/03/18/dtw-google-maps/
//			https://developers.google.com/maps/documentation/javascript/tutorial?hl=de

var myLocation;	// coordinates
var mapOptions;

google.maps.event.addDomListener(window, 'load', setup); 

function setup() {
    // wait for PhoneGap to load
    document.addEventListener("deviceready", onDeviceReady, false);
        
    function onDeviceReady() {
        // get device's geographical location and return it as a Position object (which is then passed to onSuccess)
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
}

function onSuccess(position) { 
    myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    mapOptions = {	center: myLocation,
    				zoom: 15,
    				mapTypeId: google.maps.MapTypeId.ROADMAP };
    
    var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions); 
}

/*var request = { location: myLocation, radius: currentRadiusValue, types: [currentPlaceType] };

var service = new google.maps.places.PlacesService(map); 
service.nearbySearch(request, callback);

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
	map: map,
	position: place.geometry.location
    }); 
}

infowindow  = new google.maps.InfoWindow();

google.maps.event.addListener(marker, 'click', function () {
	infowindow.setContent(place.name);
	infowindow.open(map, this);
});*/