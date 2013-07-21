<?php
class App_model extends CI_Model {
	
	
	public function __construct() {
		$this->load->database ();
	}
	
	private function cvtImage($file){

		$pos = strpos($file, ".");
		$file = "uploads/".substr($file, 0, $pos) . "-thumb" . substr($file, $pos);
		//echo $file;
		
		if( file_exists($file) ){
			$type = pathinfo($file, PATHINFO_EXTENSION);
			$data = file_get_contents($file);
			return 'data:image/' . $type . ';base64,' . base64_encode($data);
		}
		
		return "";
	}
	
	private function getDistance($lat1, $lon1, $lat2, $lon2){
		$R = 6371;
		$dLat = deg2rad($lat2-$lat1);
		$dLon = deg2rad($lon2-$lon1);
		$lat1 = deg2rad($lat1);
		$lat2 = deg2rad($lat2);
		
		$a = sin($dLat/2) * sin($dLat/2) +
			sin($dLon/2) * sin($dLon/2) * cos($lat1) * cos($lat2);
		$c = 2 * atan2(sqrt($a), sqrt(1-$a));
		
		return $R * $c;
	}
	
	
	public function getSwarms($args = null) {
		
// 		if (!$args) {
// 			$query = $this->db->get( 'swarms' );
// 			return $query->result_array();
// 		}
		
		////// if args are given
		
		if( array_key_exists('limit', $args) )
			$limit = $args['limit'];
		else 
			$limit = null;

		
		$where = array();
		
		if( array_key_exists('genus', $args) )
		{
			$where['genus LIKE'] = $args['genus'];
			if( array_key_exists('species', $args) )
				$where['species LIKE'] = $args['species'];
		}
		if( array_key_exists('startdate', $args) )
			$where['date >='] = $args['startdate'];
				
		//print_r($where);
		$query = $this->db->order_by('date', 'desc')->get_where('swarms', $where, $limit, 0);
		
		$result = $query->result();
		
		
		////// postfilter / -processing
		$processed = array();
	
		foreach ($result as &$swarm) {
		    $dist = 0;
		    $swarm->distance = $dist;
		    
			if( array_key_exists('lat', $args) && array_key_exists('lon', $args)){
				
				$dist = $this->getDistance($swarm->lat, $swarm->lon, $args['lat'], $args['lon']);
				
				if(array_key_exists('radius', $args))			
					if( $dist > $args['radius'] )
						continue;
					
			}

			//set distance
		    $swarm->distance = $dist;
		    
		    //cvtimage if necessary		    
		    if( array_key_exists('image', $args) && $args['image'] == 'true')
		    	$swarm->image = $this->cvtImage($swarm->image);
		    else
		    	$swarm->image = "";
		    
		    $processed[] = $swarm;
		}
		
		
// 		echo "\n\n\n----- DEBUG BEGIN -----\n";
// 		print_r($result);
// 		echo "\n----- DEBUG END ------\n\n";

		return $processed;
	}
	
	public function getSpecies( $args = null)
	{
		$query = $this->db->get( 'species' );
		return $query->result_array();
	}
	
	public function newSwarm($swarm){
		$this->db->insert('swarms', $swarm); 
		print_r($swarm);
	}
}