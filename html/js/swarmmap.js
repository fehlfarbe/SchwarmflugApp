// Quelle: 	http://vsnomad.com/2013/03/18/dtw-google-maps/
//			https://developers.google.com/maps/documentation/javascript/tutorial?hl=de
//			http://thingsico.de/blog/2011/11/using-google-maps-reliably-in-phonegap/
//			http://www.mobiledevelopersolutions.com/home/start/twominutetutorials/tmt4part1

var myLocation;	// coordinates
var mapOptions;
var map;


function loadGoogleMaps() {
	
	console.log("loadGoogleMaps() called");
	
	//myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	try {
		
		$('#map_canvas').gmap({
    		'center': new google.maps.LatLng(51.042, 13.727),
    		'zoom': 15,
    		'mapTypeControl': true,
    		'callback': function(){console.log("callback klappt?");}
    	});
		
		$('#map_canvas').gmap('option', 'streetViewControl', 'false');
		$('#map_canvas').gmap('option', 'zoomControl', 'true');
		$('#map_canvas').gmap('option', 'zoomControlOptions', {'style': google.maps.ZoomControlStyle.SMALL, 'position': google.maps.ControlPosition.TOP_LEFT});
		
		var marker = $('#map_canvas').gmap('addMarker', {'position': '51.042,13.727', 'bounds': false, 'title': 'Ameisen','animation': google.maps.Animation.DROP});
		marker.click(function(){
			$('#map_canvas').gmap('openInfoWindow', {'content': 'Hier gibt es grad nen Ameisenschwarmflug!'}, marker);
		});
		
		
	} catch(e) {
		console.log("error occured with google maps" + e);
	}
	
}