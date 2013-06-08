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
    		'zoom': 10,
    		'mapTypeControl': true,
    		'callback': function(){console.log("callback klappt?");}
    	});
		
		$('#map_canvas').gmap('option', 'streetViewControl', 'false');
		$('#map_canvas').gmap('option', 'zoomControl', 'true');
		$('#map_canvas').gmap('option', 'zoomControlOptions', {'style': google.maps.ZoomControlStyle.SMALL, 'position': google.maps.ControlPosition.TOP_LEFT});
		
		var markUser = $('#map_canvas').gmap('addMarker', {
			'position': '51.042,13.727', 
			'bounds': false, 
			'title': 'User',
			'animation': google.maps.Animation.DROP,
			'fillColor': '#6EBB00',
		});
		markUser.click(function(){
			$('#map_canvas').gmap('openInfoWindow', {'content': 'Hier bist du.'}, markUser);
		});
		
		var mImageSchwarm = new google.maps.MarkerImage('img/antmarker.png', new google.maps.Size(64,64), null, new google.maps.Point(32,32));
		
		/* Testarray */
		var schwaerme = new Array();
		schwaerme[0] = new Object();
		schwaerme[0].position = '51.133,14.016';
		schwaerme[0].title = 'Ameise1';
		schwaerme[0].infotext = 'Bothriomyrmex menozzii';
		
		schwaerme[1] = new Object();
		schwaerme[1].position = '51.173,13.643';
		schwaerme[1].title = 'Ameise2';
		schwaerme[1].infotext = 'Crematogaster scutellaris';
		
		schwaerme[2] = new Object();
		schwaerme[2].position = '50.941,13.482';
		schwaerme[2].title = 'Ameise2';
		schwaerme[2].infotext = 'Lasius platythorax';
		
		var markers = new Array();
		
		for(var i=0; i<schwaerme.length; i++) {
			markers[i] = new Object();
			markers[i] = $('#map_canvas').gmap('addMarker', {
				'position': schwaerme[i].position, 
				'bounds': false, 
				'title': schwaerme[i].title,
				'animation': google.maps.Animation.DROP,
				'icon': mImageSchwarm
			});
			markers[i].click(function(){
				//$('#map_canvas').gmap('openInfoWindow', {'content': schwaerme[i].infotext}, marker);
				$('#map_canvas').gmap('openInfoWindow', {'content': 'Lasius platythorax'}, markers[i]);
			});
			//markers.push(marker);
		}
		
	} catch(e) {
		console.log("error occured with google maps" + e);
	}
	
}