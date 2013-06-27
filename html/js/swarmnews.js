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
		},
		error: function(xhRequest, ErrorText, thrownError) { console.log('getSwarms error ' +xhRequest.status+'|'+xhRequest.responseText); }
	});
}

function appendNews(swarm) {
	var ncontent = '<div id="snews"><span class="mark_art">' + swarm.genus + ' ' + swarm.species + '</span><br/>';
	ncontent += '<span class="mark_date">' + swarm.date + ' &ndash; Lat: ' + runde(swarm.position[0], 3) + ' / Lng: ' + runde(swarm.position[1], 3) + '</span><br/>';
	if(swarm.image) ncontent += '<img src="data:image/jpeg;base64,' + swarm.image + '" /> <br/>';
	if(swarm.comment) ncontent += '<span class="mark_comm_head">Kommentar:</span><br/>' + swarm.comment;
	ncontent += '</div>';
	
	$('#swarmnews').append(ncontent);
}