document.addEventListener("deviceready", onDeviceReady, false);
var prevPage = undefined;

function onDeviceReady() {
	
	//Test
	$.mobile.defaultPageTransition="none";

	$(document).bind('pagechange', function(event) {

		// grab a list of all the divs's found in the page that have the attribute "role" with a value of "page"
		var pages = $('div[data-role="page"]'),
		currentPage = pages[pages.length - 1],
		attr = currentPage.getAttribute('data-url');
		
//		alert("prev" + prevPage);
//		alert("attr" + attr);
		
//		if( prevPage == attr )
//		{ 
//			console.log("reload page");
//			return;			
//		}

		// basic conditional checks for the url we're expecting
		if (attr.indexOf('postswarm.html') !== -1) {
			
			// prevents reloading page on button click
			$("button").click(function(event) {
				event.preventDefault();
				console.log('default ' + event.type + ' prevented');
			});
			
			locate();
			getCurrentTime();
			testSpeciesDB(); //updates species DB if necessary and reloads genusList
			
			pictureSource = navigator.camera.PictureSourceType;
			destinationType = navigator.camera.DestinationType;
		} 
		else if (attr.indexOf('swarmmap.html') !== -1) {
			//do swarmmap init stuff
			loadGoogleMaps();
			//getSwarms();
		}
		
		prevPage = attr;

	});
}
