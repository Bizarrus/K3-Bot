<?php
	# Channels
	$this->router->addRoute('^/channel/([\-0-9]+)$', function($id = null) {
		if(!$this->template->display('channels/show', [
			'id'	=> $id
		])) {
			$this->template->display('errors/404');
		}
	});
	
	$this->router->addRoute('/channels', function() {
		if(!$this->template->display('channels/overview')) {
			$this->template->display('errors/404');
		}
	});
	
	# Readmes
	$this->router->addRoute('/users/profiles/readmes', function() {
		if(!$this->template->display('users/profiles/readmes')) {
			$this->template->display('errors/404');
		}
	});
	
	# Pictures
	$this->router->addRoute('^/picture/([\-0-9]+)$', function($id = 1) {
		if(!$this->template->display('users/profiles/picture', [
			'id'	=> $id
		])) {
			$this->template->display('errors/404');
		}
	});
	
	$this->router->addRoute('^/users/profiles/pictures/([\-0-9]+)$', function($page = 1) {
		if(!$this->template->display('users/profiles/pictures', [
			'page'	=> $page
		])) {
			$this->template->display('errors/404');
		}
	});
	
	$this->router->addRoute('/users/profiles/pictures', function() {
		if(!$this->template->display('users/profiles/pictures', [
			'page'	=> 1
		])) {
			$this->template->display('errors/404');
		}
	});
	
	# Users	
	$this->router->addRoute('/users', function($page = 1) {
		if(!$this->template->display('users/overview', [
			'page'	=> $page
		])) {
			$this->template->display('errors/404');
		}
	});
	
	$this->router->addRoute('^/users/([\-0-9]+)$', function($page = 1) {
		if(!$this->template->display('users/overview', [
			'page'	=> $page
		])) {
			$this->template->display('errors/404');
		}
	});
	
	$this->router->addRoute('^/user/([\-0-9]+)$', function($id = null) {
		if(!$this->template->display('users/profile', [
			'id'	=> $id
		])) {
			$this->template->display('errors/404');
		}
	});
	
	# Fakecheck
	$this->router->addRoute('/fake/ai', function() {
		if(!$this->template->display('fake/ai', [
			'page'	=> 1
		])) {
			$this->template->display('errors/404');
		}
	});
	
	$this->router->addRoute('^/fake/ai/([\-0-9]+)$', function($page = 1) {
		if(!$this->template->display('fake/ai', [
			'page'	=> $page
		])) {
			$this->template->display('errors/404');
		}
	});
?>