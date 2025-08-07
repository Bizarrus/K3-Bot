<?php
	use \AF\Template;

	$this->router->addRoute('^/(ajax|api)(?:/([a-zA-Z0-9\-\/_]+))?$', function($name = null, $action = null) {
		header('Content-Type: application/json; charset=utf-8');
		
		$result = $this->template->handler(sprintf('api/%s', $action));
		
		if($result === NULL) {
			print json_encode([
				'status'	=> false,
				'code'		=> 'BAD_REQUEST',
				'message'	=> 'Bad API Request.'
			]);
		} else if(!$result) {
			print json_encode([
				'status'	=> false,
				'code'		=> 'API_UNAVAILABLE',
				'message'	=> 'API Endpoint is currently not available.'
			]);
		}
	});
?>