// Quelle: 	http://vsnomad.com/2013/03/18/dtw-google-maps/
//			https://developers.google.com/maps/documentation/javascript/tutorial?hl=de
//			http://thingsico.de/blog/2011/11/using-google-maps-reliably-in-phonegap/
//			http://www.mobiledevelopersolutions.com/home/start/twominutetutorials/tmt4part1

var myLocation;		// coordinates
var swarmdata;		// 
var mIconSwarm;		// icon for marker
var mradius = 1000;
var mtime = 31;

function loadGoogleMaps() {
	
	console.log('loadGoogleMaps() called');
	
	//myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	myLocation = new Object();
	myLocation.lat = 51.042;
	myLocation.lng = 13.727;
	
	try {
		
		$('#map_canvas').gmap({
    		'center': new google.maps.LatLng(51.042, 13.727),
    		'zoom': 10,
    		'mapTypeControl': true,
    		'callback': function(){console.log('gmap callback');}
    	});
		
		$('#map_canvas').gmap('option', 'streetViewControl', 'false');
		$('#map_canvas').gmap('option', 'zoomControl', 'true');
		$('#map_canvas').gmap('option', 'zoomControlOptions', {'style': google.maps.ZoomControlStyle.SMALL, 'position': google.maps.ControlPosition.TOP_LEFT});
		
		addUserMarker();
		
		mIconSwarm = new google.maps.MarkerImage('img/antmarker.png', new google.maps.Size(64,64), null, new google.maps.Point(32,32));
		
		getSwarms();
		
	} catch(e) {
		console.log('error occured with google maps' + e);
	}
}

function addUserMarker() {
	var mUser = $('#map_canvas').gmap('addMarker', {
		'position': new google.maps.LatLng(myLocation.lat, myLocation.lng), 
		'bounds': false, 
		'title': 'User',
		'animation': google.maps.Animation.DROP,
		'fillColor': '#6EBB00',
	});
	
	var mUserContent = 'Hier bist du!<br/>';
	mUserContent += 'Lat: ' + myLocation.lat + '<br/>';
	mUserContent += 'Lng: ' + myLocation.lng + '<br/>';
	
	mUser.click(function(){
		$('#map_canvas').gmap('openInfoWindow', {'content': mUserContent}, mUser);
	});
}

function addSwarmMarker(swarm, micon) {
	// Zeitdifferenz
	var tuser = new Date();
	var tswarm = new Date(swarm.date);
	var tdiff = parseInt((tuser.getTime() - tswarm.getTime())/(24*3600*1000)) + 1;
	if(tdiff > mtime) return;
	
	var mark = $('#map_canvas').gmap('addMarker', {
		'position': new google.maps.LatLng(swarm.position[0], swarm.position[1]),
		'bounds': false,
		'animation': google.maps.Animation.DROP,
		'icon': micon
	});
	
	var mcontent = '<span class="mark_art">' + swarm.genus + ' ' + swarm.species + '</span><br/>';
	mcontent += '<span class="mark_date">' + swarm.date + '</span><br/>';
	mcontent += 'Entfernung: ' + runde(swarm.distance, 1) + ' km<br/>';
	mcontent += '<span class="mark_comm_head">Kommentar:</span><br/>' + swarm.comment;
	
	mark.click(function(){
		$('#map_canvas').gmap('openInfoWindow', {'content': mcontent}, mark);
	});
}

function addMarkers() {
	for(var i=0; i<swarmdata.length; i++) {
		addSwarmMarker(swarmdata[i], mIconSwarm);
	}
}

function getSwarms() {
	console.log(server + '/swarmlist' + '?lat=' + myLocation.lat + '&lon=' + myLocation.lng + '&radius=' + mradius);
	$.ajax({
		url: server + '/swarmlist' + '?lat=' + myLocation.lat + '&lon=' + myLocation.lng + '&radius=' + mradius,
		success: function(data) {
			console.log('getSwarms success');
			swarmdata = data.swarms;
			addMarkers();			
		},
		error: function(xhRequest, ErrorText, thrownError) { console.log('getSwarms error ' +xhRequest.status+'|'+xhRequest.responseText); }
	});
}

function runde(x, n) {
	if (n < 1 || n > 14) return false;
	var e = Math.pow(10, n);
	var k = (Math.round(x * e) / e).toString();
	if (k.indexOf('.') == -1) k += '.';
	k += e.toString().substring(1);
	return k.substring(0, k.indexOf('.') + n+1);
}

function onAmbitChange(value) {
	console.log('onAmbitChange called with value = ' + value);
	$('#map_canvas').gmap('clear', 'markers');
	addUserMarker();
	
	var radius = value.split(' ');
	//isNumber?
	if(/^\d+$/.test(radius[0]))	mradius = radius[0];
	else mradius = 1000;
	getSwarms();
}

function onTimeChange(value) {
	console.log('onTimeChange called with value = ' + value);
	$('#map_canvas').gmap('clear', 'markers');
	addUserMarker();
	
	switch(value) {
	case '1 Tag': mtime = 1; break;
	case '3 Tage': mtime = 3; break;
	case '1 Woche': mtime = 7; break;
	case '1 Monat': mtime = 31; break;
	}
	addMarkers();
}