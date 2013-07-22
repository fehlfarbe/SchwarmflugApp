<?php
class App extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->helper(array('form', 'url'));
		$this->load->model('app_model');
	}
	
	public function _remap($method, $params = array())
	{
		$map = array();
		for( $i = 1; $i < count( $params ); $i = $i + 2 )
			$map[$params[$i-1]] = $params[$i];
		
		//echo "Method: " . $method;
		
		switch($method){
			case 'swarmlist':
				$this->swarmlist( $map );
				break;
			case 'specieslist':
				$this->specieslist( $map );
				break;
			case 'newswarm':
				$this->newswarm( $map );
				break;
			case 'newswarmform':
				$this->newswarmform( $map );
				break;
			default:
				$this->index( $map );
		}
	}
	
	public function newswarm( $args ){
		
		//upload config
		$config['upload_path'] = 'uploads/';
		$config['allowed_types'] = 'jpg';
		$config['encrypt_name'] = TRUE;
		$this->load->library('upload', $config);
		
		$swarm = Array();
		
		log_message('info', 'New swarm!');
					
		if ( $this->upload->do_upload('image') ){
			$upload = $this->upload->data();
			$swarm['image'] = $upload['file_name'];
			log_message('info', $swarm['image']);
			
			// create thumb
			$config_manip = array(
					'image_library' => 'gd2',
					'source_image' => $upload['full_path'],
					'new_image' => $upload['full_path'],
					'maintain_ratio' => TRUE,
					'create_thumb' => TRUE,
					'thumb_marker' => '-thumb',
					'width' => 180,
					'height' => 180
			);
			$this->load->library('image_lib', $config_manip);
			if (!$this->image_lib->resize()) {
				echo $this->image_lib->display_errors();
			}
			
			// clear
			$this->image_lib->clear();
		} else {
			$this->upload->display_errors();
			$photo = $this->input->post('photo', TRUE);
			log_message('info', $photo);
			
			//if base64 string
			if($photo != ""){
				//$data = base64_decode($swarm['image']);
				//$formImage = imagecreatefromstring($data);
				$photo = str_replace( "[removed]",'', $photo);
				//echo $photo;
				$this->load->helper('string');
				$filename = random_string('alnum', 24).".jpg";
				file_put_contents($config['upload_path']."/".$filename, base64_decode($photo));
				
				// create thumb
				$config_manip = array(
						'image_library' => 'gd2',
						'source_image' => $config['upload_path']."/".$filename,
						'new_image' => $config['upload_path']."/".$filename,
						'maintain_ratio' => TRUE,
						'create_thumb' => TRUE,
						'thumb_marker' => '-thumb',
						'width' => 180,
						'height' => 180
				);
				$this->load->library('image_lib', $config_manip);
				if (!$this->image_lib->resize()) {
					echo $this->image_lib->display_errors();
				}
					
				// clear
				$this->image_lib->clear();

				
				$swarm['image'] = $filename;
			}
		}
		
		// param
		$swarm['genus'] = $this->input->post('genus', TRUE);
		$swarm['species'] = $this->input->post('species', TRUE);
		$swarm['lat'] = $this->input->post('lat', TRUE);
		$swarm['lon'] = $this->input->post('lon', TRUE);
		$swarm['date'] = date("Y-m-d", strtotime($this->input->post('date', TRUE)))." ".$this->input->post('time', TRUE);
		$swarm['comment'] = $this->input->post('comment', TRUE);

		log_message('info', $swarm);
		
		$this->app_model->newSwarm($swarm);		
		
		$this->output->set_content_type('application/json');
	}

	public function newswarmform( $args )
	{
		$this->load->view('upload');
	}
	
	public function index( $args )
	{
//		$this->load->view('app/list');
		
// 		print_r($args);
				
// 		$this->output
// 		->set_content_type('application/json')
// 		->set_output(json_encode(array('foo' => 'bar')));
		
	}

	public function swarmlist( $args )
	{
		//print_r($args);
		
		$data['swarms'] = $this->app_model->getSwarms( $args );
		
		$this->output
		->set_content_type('application/json')
		->set_output(json_encode(array('swarms' => $data['swarms'])));
	}
	
	public function specieslist( $args )
	{
		$data['species'] = $this->app_model->getSpecies( $args );
		
		$this->output
		->set_content_type('application/json')
		->set_output(json_encode(array('ants' => $data['species'])));
	}
}