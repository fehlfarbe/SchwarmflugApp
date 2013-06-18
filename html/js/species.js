/******** download an handle specieslist ******** */
dbName = "schwarmflug";
dbVers = "1.0";
dbDisplayName = "Schwarmflug DB";
dbSize = 65536; //bytes

function updateSpeciesDB(){
	
	$.mobile.showPageLoadingMsg("a", "Aktualisiere Artenliste...", true);
	
	$.ajax({
		url: server + "/fullspecieslist",
		success: function(data) {
			// it works, do something with the data
			// alert(data.toString());
			var db = window.openDatabase(dbName, dbVers, dbDisplayName, dbSize);

			db.transaction(
				function(tx){				
					tx.executeSql('DROP TABLE IF EXISTS species');
					tx.executeSql('CREATE TABLE IF NOT EXISTS species (id unique, genus, species, country)');
					for( var i=0; i<data.ants.length; i++)
						tx.executeSql('INSERT INTO species (id, genus, species, country) VALUES ('+i+', "'+data.ants[i].genus+'", "'+data.ants[i].species+'", "'+data.ants[i].country+'")');
				},
				function(err){
					alert("Fehler beim Erstellen der Tabelle! " + err.message);
					$.mobile.hidePageLoadingMsg();
				},
				function(){
					alert("Artenliste erfolgreich aktualisiert!");
					getGenusList();
					$.mobile.hidePageLoadingMsg();
				}
			);
		},
		error: function (xhRequest, ErrorText, thrownError) {
			// something went wrong, handle the error and
			// display a message
			alert("Fehler beim Laden der Artenliste " + xhRequest.status + " "+ xhRequest.responseText);
			$.mobile.hidePageLoadingMsg();
		}
	});
}

/************* test if database is filled *********/
function testSpeciesDB(){
	var db = window.openDatabase(dbName, dbVers, dbDisplayName, dbSize);
	db.transaction(
			function(tx){
				tx.executeSql('SELECT * FROM species', 
						[], 
						function(tx, results){
							//alert(results.rows.length);
							
							if(results.rows.length <= 0){
								updateSpeciesDB();
							}
							else{
								getGenusList();
							}
						},
						function(err){
							updateSpeciesDB();
						});
			}, 
			function(err){
				alert("Fehler bei Aktualisierung " + err.message);
			});
}


/************* Get genus list *********/
function genusErrorCB(err) {
    alert("Error processing SQL: "+ err.message);
}

function genusQuerySuccess(tx, results) {
	
	console.log("getGenusList success!");
	$('#genus').append('<option value="unknown">Unbekannt</option>');

    for (var i=0; i<results.rows.length; i++){
    	$('#genus').append('<option value="'+results.rows.item(i).genus+'">'+results.rows.item(i).genus+'</option>');
        //console.log('<option value="'+results.rows.item(i).genus+'">'+results.rows.item(i).genus+'</option>');
    }
    $('#genus').selectmenu('refresh', true);
}

function genusQueryDB(tx) {
	tx.executeSql('SELECT genus FROM species GROUP BY genus', 
			[], 
			genusQuerySuccess, 
			genusErrorCB);
}

function getGenusList(){
	$('#genusload').css("display", "inline");
	var db = window.openDatabase(dbName, dbVers, dbDisplayName, dbSize);
	db.transaction(genusQueryDB, genusErrorCB);
}

/***************** Get Species list ******************/
function getSpecies(genus){

	$('#speciesload').css("display", "inline");
	
	var dropdown = document.getElementById('species');
	$("#species").empty();
	
	if(genus == "unknown"){
		$('#speciesload').css("display", "none");
		return;
	}
		
	
	var db = window.openDatabase(dbName, dbVers, dbDisplayName, dbSize);
	db.transaction(
			function(tx){
				tx.executeSql('SELECT species FROM species WHERE genus LIKE "'+genus+'"', 
						[], 
						function(tx, results){
							//alert(results.rows.length);
							$('#species').append('<option value="sp">sp.</option>');
//							var opt = document.createElement("option");
//							dropdown.options.add(opt);
//							opt.text = "sp.";
//							opt.value = "sp";
							
						    for (var i=0; i<results.rows.length; i++){
//						        console.log(results.rows.item(i).species);
//								opt = document.createElement("option");
//								dropdown.options.add(opt);
//								opt.text = opt.value = results.rows.item(i).species;
						    	$('#species').append('<option value="'+results.rows.item(i).species+'">'+results.rows.item(i).species+'</option>');
						    }
						    $('#species').selectmenu('refresh', true);
						    $('#species').selectmenu();
				},
						function(err){
							alert("Fehler bei Aktualisierung " + err.message);
						});
			}, 
			function(err){
				alert("Fehler bei Aktualisierung " + err.message);
			});	
}