<?php
	use \AF\Auth;
	use \AF\Session;
	use \AF\Response;
	use \AF\StringBuffer;
	use \AF\Template;
	
	$this->router->addRoute('/index.php', function() {
		Response::redirect('/');
	});
	
	$this->router->addRoute('/', function() {
		if(!$this->template->display('home')) {
			$this->template->display('errors/404');
		}
	});
	
	require_once('Routes/api.php');
	require_once('Routes/site.php');
		
	// Default
	#$this->router->redirectTo('/');
?>