// Quelle: 	http://vsnomad.com/2013/03/18/dtw-google-maps/
//			https://developers.google.com/maps/documentation/javascript/tutorial?hl=de
//			http://thingsico.de/blog/2011/11/using-google-maps-reliably-in-phonegap/
//			http://www.mobiledevelopersolutions.com/home/start/twominutetutorials/tmt4part1

var myLocation;		// coordinates
var swarmdata;		// 
var mIconSwarm;		// icon for marker
var mradius = 1000;
var mtime = 31;
var mgenus = '(alle)';
var mspecies = '(alle)';

function loadGoogleMaps() {
	
	console.log('loadGoogleMaps() called');
	
	$('#map_canvas').offsetHeight = $('#map_canvas').offsetWidth; 
	
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
		getGenuswahlList();
		
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
	
	var mark = $('#map_canvas').gmap('addMarker', {
		'position': new google.maps.LatLng(swarm.position[0], swarm.position[1]),
		'bounds': false,
		'animation': google.maps.Animation.DROP,
		'icon': micon
	});
	
	var mcontent = '<span class="mark_art">' + swarm.genus + ' ' + swarm.species + '</span><br/>';
	mcontent += '<span class="mark_date">' + swarm.date + '</span><br/>';
	if(swarm.image) mcontent += '<img src="data:image/jpeg;base64,' + swarm.image + '" /> <br/>';
	console.log(swarm.image);
	mcontent += 'Entfernung: ' + runde(swarm.distance, 1) + ' km<br/>';
	mcontent += '<span class="mark_comm_head">Kommentar:</span><br/>' + swarm.comment;
	
	mark.click(function(){
		$('#map_canvas').gmap('openInfoWindow', {'content': mcontent, 'pixelOffset': new google.maps.Size(0,32,'px','px')}, mark);
	});
}

function addMarkers() {
	for(var i=0; i<swarmdata.length; i++) {
		addSwarmMarker(swarmdata[i], mIconSwarm);
	}
}

function getSwarms() {
	var requrl = server + '/swarmlist' + '?lat=' + myLocation.lat + '&lon=' + myLocation.lng + '&radius=' + mradius;
	requrl += '&startdate=' + getStartdate();
	requrl += '&image=true';
	if(mgenus != '(alle)') requrl += '&genus=' + mgenus;
	if(mspecies != '(alle)') requrl += '&species=' + mspecies;
	
	console.log(requrl);
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

function clearMarkers() {
	$('#map_canvas').gmap('clear', 'markers');
	$('#map_canvas').gmap('clear', 'overlays');
	addUserMarker();
	$('#map_canvas').gmap('refresh');
}

function onAmbitChange(value) {
	console.log('onAmbitChange called with value = ' + value);
	clearMarkers();
	
	var radius = value.split(' ');
	//isNumber?
	if(/^\d+$/.test(radius[0]))	mradius = radius[0];
	else mradius = 1000;
	getSwarms();
}

function onTimeChange(value) {
	console.log('onTimeChange called with value = ' + value);
	clearMarkers();
	
	switch(value) {
	case '1 Tag': mtime = 1; break;
	case '3 Tage': mtime = 3; break;
	case '1 Woche': mtime = 7; break;
	case '1 Monat': mtime = 31; break;
	}
	getSwarms();
}

function getStartdate() {
	var date = new Date();
	date.setDate(date.getDate() - mtime);
	var y = date.getFullYear();
	var m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	var dstr = y + '/' + m + '/' + d;
	console.log(dstr);
	return dstr;
}

/************* Get genus list *********/
function genuswahlQuerySuccess(tx, results) {
	
	console.log("getGenusList success!");
	//$('#genus').append('<option value="unknown">Unbekannt</option>');

    for (var i=0; i<results.rows.length; i++){
    	$('#genuswahl').append('<option value="'+results.rows.item(i).genus+'">'+results.rows.item(i).genus+'</option>');
    }
    $('#genuswahl').selectmenu('refresh', true);
}

function genuswahlQueryDB(tx) {
	tx.executeSql('SELECT genus FROM species GROUP BY genus', 
			[], 
			genuswahlQuerySuccess, 
			genusErrorCB);		// --> error function in species.js
}

function getGenuswahlList(){
	var db = window.openDatabase(dbName, dbVers, dbDisplayName, dbSize);
	db.transaction(genuswahlQueryDB, genusErrorCB);		// --> error function in species.js
}

function onGenusChange(genus) {
	console.log('onGenusChanged called with value = '+genus);

	$("#specieswahl").empty();
	$('#specieswahl').append('<option value="sp">(alle)</option>');
	$('#specieswahl').selectmenu('refresh', true);
	
	mgenus = genus;
		
	if(mgenus == '(alle)') {
		mspecies = '(alle)';
		clearMarkers();
		getSwarms();
		return;
	}
	
	var db = window.openDatabase(dbName, dbVers, dbDisplayName, dbSize);
	db.transaction(
			function(tx){
				tx.executeSql('SELECT species FROM species WHERE genus LIKE "'+genus+'"', 
						[], 
						function(tx, results){							
						    for (var i=0; i<results.rows.length; i++){
						    	$('#specieswahl').append('<option value="'+results.rows.item(i).species+'">'+results.rows.item(i).species+'</option>');
						    }
						    $('#specieswahl').selectmenu('refresh', true);
				},
						function(err){
							alert("Fehler bei Aktualisierung " + err.message);
						});
			}, 
			function(err){
				alert("Fehler bei Aktualisierung " + err.message);
			});
	
	clearMarkers();
	addMarkers();
}

function onSpeciesChange(species) {
	console.log('onSpeciesChanged called with value = '+species);
	
	mspecies = species;
	clearMarkers();
	getSwarms();
}