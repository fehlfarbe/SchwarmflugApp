<?php

class Pages extends CI_Controller {

	public function view($page = 'home')
	{
		if ( ! file_exists('application/views/pages/'.$page.'.php'))
		{
			// Whoops, we don't have a page for that!
			show_404();
		}
		
		$data['title'] = ucfirst($page); // Capitalize the first letter
		
		if($page == "list"){
			$this->load->model('app_model');
			
			$args = Array();
			$args['limit'] = 50;
			$args['image'] = 'true';
			$args['imageformat'] = 'file';
			$data['swarms'] = $this->app_model->getSwarms( $args );
			$data['title'] = "Die 50 neuesten Schw�rme";
		}
		
		$this->load->view('templates/header', $data);
		$this->load->view('pages/'.$page, $data);
		$this->load->view('templates/footer', $data);
	}
}
