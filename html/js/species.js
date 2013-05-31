/******** download an handle specieslist ******** */
dbName = "schwarmflug";
dbVers = "1.0";
dbDisplayName = "Schwarmflug DB";
dbSize = 65536; //bytes

function updateSpeciesDB(){
	
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
				function(err){alert("Fehler beim Erstellen der Tabelle! " + err.message);},
				function(){
					alert("Artenliste erfolgreich aktualisiert!");
					$('#loading').css("display", "none");
					getGenusList();
				}
			);
		},
		error: function(e) {
			// something went wrong, handle the error and
			// display a message
			alert("Fehler beim Laden der Artenliste " + e.message);
			$('#loading').css("display", "none");
			//$('#loadingmsg').html("Artenliste wird aktualisiert...")
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
								//alert("Artenliste wird aktualisiert...");
								$('#loading').css("display", "block");
								$('#loadingmsg').html("Artenliste wird aktualisiert...");
								updateSpeciesDB();
							}
							else{
								getGenusList();
							}
						},
						function(err){
							//alert("Fehler bei Aktualisierung " + err.message);
							//alert("Artenliste wird aktualisiert...");
							$('#loading').css("display", "block");
							$('#loadingmsg').html("Artenliste wird aktualisiert...")
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
	
	var dropdown = document.getElementById('genus');
	var opt = document.createElement("option");
	dropdown.options.add(opt);
	opt.text = "Unbekannt";
	opt.value = "unknown";

    for (var i=0; i<results.rows.length; i++){
		opt = document.createElement("option");
		dropdown.options.add(opt);
		opt.text = opt.value = results.rows.item(i).genus;
//        genuslist.push(results.rows.item(i).genus);
//        console.log(results.rows.item(i).genus);
    }
    
    $('#genusload').css("display", "none");
    //alert(results.rows.length);
    //alert(genuslist);
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
							
							var opt = document.createElement("option");
							dropdown.options.add(opt);
							opt.text = "sp.";
							opt.value = "sp";
							
						    for (var i=0; i<results.rows.length; i++){
						        console.log(results.rows.item(i).species);
								opt = document.createElement("option");
								dropdown.options.add(opt);
								//opt.text = data.ants[i].species + "(" + data.ants[i].country + ")";
								opt.text = opt.value = results.rows.item(i).species;
						    }
						    
						    $('#speciesload').css("display", "none");
						    $('#species').focus();
				},
						function(err){
							alert("Fehler bei Aktualisierung " + err.message);
						});
			}, 
			function(err){
				alert("Fehler bei Aktualisierung " + err.message);
			});	
}