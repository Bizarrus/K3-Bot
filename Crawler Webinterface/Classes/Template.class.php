<?php
	namespace AF;
	use \AF\Core;
	use \AF\Database;
	use \AF\Session;
	
	class Template {
		private Core $core;
		private array $assigns = [];
		
		public function __construct($core) {
			$this->core = $core;
			
			// gzip, deflate, br, zstd
			if(isset($_SERVER['HTTP_ACCEPT_ENCODING']) && substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) {
				//@ob_start('ob_gzhandler');
				//Response::addHeader('Content-Encoding', 'gzip');
			}
			
			if(isset($_POST['hash'])) {
				$this->assign('hash', $_POST['hash']);
			} else {
				$this->assign('hash', null);
			}
			
			if(Session::has('success')) {
				$this->assign('success', Session::get('success'));
				Session::remove('success');
			}
			
			if(Session::has('errors')) {
				$this->assign('errors', Session::get('errors'));
				Session::remove('errors');
			}
		}
		
		public function getCore() : Core {
			return $this->core;
		}
		
		public function getRouter() : Router {
			return $this->core->getRouter();
		}
		
		public function isAssigned(string $name) : bool {
			return array_key_exists($name, $this->assigns);
		}
		
		public function getAssigns() : array {
			return $this->assigns;
		}
		
		public function assign(string $name, mixed $value) : void {
			$this->assigns[$name] = $value;
		}
		
		public function display(string $file, array $arguments = []) : ?bool {
			$template	= $this;
			
			foreach($arguments AS $name => $value) {
				$this->assigns[$name] = $value;
			}
			
			foreach($this->assigns AS $name => $value) {
				${$name} = $value;
			}
			
			if(file_exists(PATH . DS . 'Handler' . DS . $file . '.php')) {
				require(PATH . DS . 'Handler' . DS . $file . '.php');
			}
			
			if(!defined('DEBUG') || !DEBUG) {
				if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
					return null;
				}
			}
			
			if(file_exists(PATH . DS . 'Template' . DS . $file . '.php')) {
				foreach($this->assigns AS $name => $value) {
					${$name} = $value;
				}
				
				if(!$this->isAssigned('success')) {
					$success = null;
				}
				
				if(!$this->isAssigned('errors')) {
					$errors = [];
				}
				
				require(PATH . DS . 'Template' . DS . $file . '.php');
				return true;
			}
			
			return false;
		}
		
		public function handler(string $file, array $arguments = []) : ?bool {
			$template	= $this;
			
			foreach($arguments AS $name => $value) {
				$this->assigns[$name] = $value;
			}
			
			foreach($this->assigns AS $name => $value) {
				${$name} = $value;
			}
			
			if(!defined('DEBUG') || !DEBUG) {
				if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
					return null;
				}
			}
			
			if(file_exists(PATH . DS . 'Handler' . DS . $file . '.php')) {
				require_once(PATH . DS . 'Handler' . DS . $file . '.php');
				return true;
			}
			
			return false;
		}
		
		public function header() {
			$template = $this;
			
			foreach($this->assigns AS $name => $value) {
				${$name} = $value;
			}
									
			if(file_exists(PATH . DS . 'Template' . DS . 'header.php')) {
				require_once(PATH . DS . 'Template' . DS . 'header.php');
			}
		}
		
		public function footer() {
			$template = $this;
			
			foreach($this->assigns AS $name => $value) {
				${$name} = $value;
			}
			
			if(file_exists(PATH . DS . 'Template' . DS . 'footer.php')) {
				require_once(PATH . DS . 'Template' . DS . 'footer.php');
			}
		}
		
		public function url(bool | string | null $path = null, array | null $parameters = null, $hash = null) : string {
			$scheme = 'http';
			
			if($parameters == null) {
				$parameters = [];
			}
			
			if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
				$scheme = 'https';
			}
			
			if($path === true || $path === null) {
				$path = $_SERVER['REQUEST_URI'];
			}
			
			if(substr($path, 0, 1) === '/') {
				$path = substr($path, 1);
			}

			if(strpos($path, '?')) {
				$parts	= explode('?', $path);
				$path	= $parts[0];
				
				parse_str($parts[1], $arguments);
				
				$parameters = array_merge($arguments, $_GET, $parameters);
			}
			
			if(count($parameters) > 0) {
				$path .= '?' . http_build_query($parameters);
			}
			
			if($hash != null) {
				$path .= '#' . $hash;
			}
			
			$hostname = $_SERVER['HTTP_HOST'];
			
			if(isset($_SERVER['MANDANTORY']) && $_SERVER['MANDANTORY'] === 'www') {
				$hostname = 'www.mein-chatserver.de';
			}
			
			return sprintf('%s://%s/%s', $scheme, $hostname, $path);
		}
	}
?>