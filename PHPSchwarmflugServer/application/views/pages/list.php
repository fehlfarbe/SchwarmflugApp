<?php 

if( $swarms )
	foreach( $swarms as &$swarm)
	{
		if($swarm->genus == 'unknown')
			$swarm->genus = 'Unbekannt';
		
		echo '<div class="swarm"><h2>'.$swarm->genus.' '.$swarm->species.'</h2>';
		echo 'Datum: '.$swarm->date.'<br />';
		echo 'Ort: <a href="https://maps.google.com/maps?q='.$swarm->lat.','.$swarm->lon.'" target="_blank">'.$swarm->lat.','.$swarm->lon.'</a><br />';
		echo 'Kommentar: '.$swarm->comment.'<br />';
		
		if($swarm->image)
		{
			$thumb = basename($swarm->image, '.jpg').'-thumb.jpg';
			echo '<a href="/uploads/'.$swarm->image.'" target="_blank">
					<img src="/uploads/'.$thumb.'" />
				</a>';
		}
		
		echo "</div>\n";
	}
else
	echo "Keine Schwärme gemeldet!";

?>