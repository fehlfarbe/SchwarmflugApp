document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

	$(document).bind('pagechange', function(event) {

		// grab a list of all the divs's found in the page that have the attribute "role" with a value of "page"
		var pages = $('div[data-role="page"]'),
		currentPage = pages[pages.length - 1],
		attr = currentPage.getAttribute('data-url');

		// basic conditional checks for the url we're expecting
		if (attr.indexOf('postswarm.html') !== -1) {
			pictureSource = navigator.camera.PictureSourceType;
			destinationType = navigator.camera.DestinationType;
			locate();
			testSpeciesDB(); //updates species DB if necessary and reloads genusList
			getCurrentTime();
		} 
		else if (attr.indexOf('swarmmap.html') !== -1) {
			//do swarmmap init stuff
			loadGoogleMaps();
		}

	});
}
