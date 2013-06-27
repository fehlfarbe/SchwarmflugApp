function getSwarmNews() {
	var requrl = server + '/swarmlist?image=true';
	console.log(requrl);
	$.ajax({
		url: requrl,
		success: function(data) {
			console.log('getSwarmNews success');
			var l = Math.min(5, data.swarms.length);
			for(var i=0;  i < l; i++) {
				appendNews(data.swarms[i]);
			}
			$('#swarmnews').listview('refresh');
		},
		error: function(xhRequest, ErrorText, thrownError) { console.log('getSwarms error ' +xhRequest.status+'|'+xhRequest.responseText); }
	});
}

function appendNews(swarm) {
	var ncontent = '<li id="snews"><h1>' + swarm.genus + ' ' + swarm.species + '</h1>';
	ncontent += '<p>' + swarm.date + ' &ndash; Lat: ' + runde(swarm.position[0], 3) + ' / Lng: ' + runde(swarm.position[1], 3) + '</p>';
	if(swarm.image) ncontent += '<img src="data:image/jpeg;base64,' + swarm.image + '" />';
	if(swarm.comment) ncontent += '<h3>Kommentar:' + swarm.comment;
	ncontent += '</h3></li>';
	
	$('#swarmnews').append(ncontent);
}
