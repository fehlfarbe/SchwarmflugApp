function getSwarmNews() {
	
	$('#swarmnews').block({message: "<img src='img/antload32.gif' />"});
	$('#swarmnews').empty();
	
	var requrl = server + '/swarmlist/image/true/limit/5';
	console.log(requrl);
	$.ajax({
		url: requrl,
		cache: false,
		success: function(data) {
			console.log('getSwarmNews success');
			var l = Math.min(5, data.swarms.length);
			console.log(l + ' swarms');
			//console.log(data.swarms);
			
			for(var i=0;  i < l; i++) {
				console.log(data.swarms[i]);
				appendNews(data.swarms[i]);
			}
			$('#swarmnews').listview('refresh');
			
//			$('#swarmnews').on('click', 'li a', function () {
//				console.log("click on listview element");
//			    //var text = $(this).closest('li').html();
////			    $('#dlgmsg').empty();
////			    $('#dlgmsg').append("123");
//			    $.mobile.changePage("#newsdialog", {
//			        role: "dialog"
//			    });
//			});
			
			$('#swarmnews').unblock();
		},
		error: function(xhRequest, ErrorText, thrownError) {
			$('#swarmnews').unblock();
			console.log('getSwarms error ' +xhRequest.status+'|'+xhRequest.responseText);
		}
	});
}

function appendNews(swarm) {
	var ncontent = '<li id="swarm' + swarm.id + '"><a href="#">';
	if(swarm.image)
		ncontent += '<img src="' + swarm.image + '" style="left: 5px; top: 5px;"/>';
	ncontent +=  '<h2>' + swarm.genus + ' ' + swarm.species + '</h2>';	
	ncontent += '<p>' + swarm.date + ' &ndash; Lat: ' + runde(swarm.lat, 3) + ' / Lon: ' + runde(swarm.lon, 3) + '</p>';
	if(swarm.comment)
		ncontent += '<p>' + swarm.comment + '<p>';
	ncontent += '</a></li>';
	
	$('#swarmnews').append(ncontent);
}
