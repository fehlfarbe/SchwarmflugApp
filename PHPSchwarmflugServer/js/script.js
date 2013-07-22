/************************************************************
 * 
 * GEOLOCATION
 * 
 **************************************************************/

function loadGoogleMaps() {
	
	console.log('loadGoogleMaps() called');
	
	console.log('offsetWidth: ' + document.getElementById('map_canvas').offsetWidth);
	//document.getElementById('map_canvas').style.height = document.getElementById('map_canvas').offsetWidth + 'px';
	
	try {
		
		$('#map_canvas').gmap({
    		'center': new google.maps.LatLng(51.163375, 10.447683333333),
    		'zoom': 6,
    		'mapTypeControl': true,
    		'callback': function(){console.log('gmap callback');}
    	});
		
		$('#map_canvas').gmap('option', 'streetViewControl', 'false');
		$('#map_canvas').gmap('option', 'zoomControl', 'true');
		$('#map_canvas').gmap('option', 'zoomControlOptions', {'style': google.maps.ZoomControlStyle.SMALL, 'position': google.maps.ControlPosition.TOP_LEFT});
		
//		addUserMarker();
		
		mIconSwarm = new google.maps.MarkerImage('img/antmarker.png', new google.maps.Size(64,64), null, new google.maps.Point(32,32));
		
//		getSwarms();
//		getGenuswahlList();
		
	} catch(e) {
		console.log('error occured with google maps' + e);
	}
}