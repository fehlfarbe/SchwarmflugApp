/************************************************************
 * 
 * GEOLOCATION
 * 
 **************************************************************/
var swarmdata;

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
		
		mIconSwarm = new google.maps.MarkerImage('/img/antmarker.png', new google.maps.Size(64,64), null, new google.maps.Point(32,32));
		
		getSwarms();
//		getGenuswahlList();
		
	} catch(e) {
		console.log('error occured with google maps' + e);
	}
}

function getSwarms() {
	
	var requrl = '/index.php/app/swarmlist/image/true';// + '/lat/' + myLocation.lat + '/lon/' + myLocation.lng + '/radius/' + mradius;
//	requrl += '/startdate/' + getStartdate();
//	requrl += '/image/true';
//	if(mgenus != '(alle)') requrl += '/genus/' + mgenus;
//	if(mspecies != '(alle)') requrl += '/species/' + mspecies;
	
	console.log(requrl);
	$.ajax({
		url: requrl,
		success: function(data) {
			console.log('getSwarms success');
			swarmdata = data.swarms;
			addMarkers();
		},
		error: function(xhRequest, ErrorText, thrownError) {
			console.log('getSwarms error ' +xhRequest.status+'|'+xhRequest.responseText);
		}
	});
}

function addSwarmMarker(swarm, micon) {
	
	var mark = $('#map_canvas').gmap('addMarker', {
		'position': new google.maps.LatLng(swarm.lat, swarm.lon),
		'bounds': false,
		//'animation': google.maps.Animation.DROP,
		'icon': micon
	});
	
	var mcontent = '<span class="mark_art">' + swarm.genus + ' ' + swarm.species + '</span><br/>';
	mcontent += '<span class="mark_date">' + swarm.date + '</span><br/>';
	
	if(swarm.image)
		mcontent += '<img src="' + swarm.image + '" /> <br/>';	
	if(swarm.distance)
		mcontent += '<span class="mark_dist">Entfernung:</span> ' + runde(swarm.distance, 1) + ' km<br/>';	
	if(swarm.comment)
		mcontent += '<span class="mark_comm_head">Kommentar:</span><br/>' + swarm.comment;
	
	mark.click(function(){
		$('#map_canvas').gmap('openInfoWindow', {'content': mcontent, 'pixelOffset': new google.maps.Size(0,32,'px','px')}, mark);
	});
}

function addMarkers() {
	
	console.log("add markers...");
	
	for(var i=0; i<swarmdata.length; i++) {
		addSwarmMarker(swarmdata[i], mIconSwarm);
	}
	
	console.log("markers added!");
}