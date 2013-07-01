function getSwarmNews() {
	
	$('#swarmnews').block({message: "<img src='img/antload32.gif' />"});
	
	var requrl = server + '/swarmlist?image=true&limit=10';
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
			
			$('#swarmnews').on('click', 'li a', function () {
				console.log("click on listview element");
			    //var text = $(this).closest('li').html();
			    $('#dlgmsg').empty();
			    $('#dlgmsg').append("123");
			    $.mobile.changePage("#newsdialog", {
			        role: "dialog"
			    });
			});
			
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
		ncontent += '<img src="data:image/jpeg;base64,' + swarm.image + '" style="left: 5px; top: 5px;"/>';
	ncontent +=  '<h2>' + swarm.genus + ' ' + swarm.species + '</h2>';	
	ncontent += '<p>' + swarm.date + ' &ndash; Lat: ' + runde(swarm.position[0], 3) + ' / Lon: ' + runde(swarm.position[1], 3) + '</p>';
	if(swarm.comment)
		ncontent += '<p>' + swarm.comment + '<p>';
	ncontent += '</a></li>';
	
	$('#swarmnews').append(ncontent);
}
