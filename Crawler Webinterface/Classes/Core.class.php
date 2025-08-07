<?php
	namespace AF;
	
	use \AF\Session;
	use \AF\Logger;

	class Core {
		private $router;
		private $template;
		private $ip			= null;
		
		public function __construct() {
			if(!defined('PATH')) {
				define('PATH', sprintf('%s/', dirname(__FILE__, 3)));
			}
			
			/* Load Configurations files */
			foreach([
				'mail',
				'config',
				'security',
			] AS $name) {
				if(file_exists(sprintf('.%s.php', $name))) {
					require_once(sprintf('.%s.php', $name));
				} else {
					throw new \Exception(sprintf('Missing Config-File: %s', $name));
				}
			}
			
			if(defined('DEBUG') && DEBUG) {
				@ini_set('display_errors', true);
				@ini_set('log_errors ', true);
				error_reporting(E_ALL);
			} else if(!defined('DEBUG')) {
				define('DEBUG', false);
			}
			
			if(defined('SESSION_TIME')) {
				@ini_set('session.gc_maxlifetime',	SESSION_TIME);
				@ini_set('session.cookie_lifetime', SESSION_TIME);
			}
			
			set_error_handler(function($error, $message, $file, $line) {
				if(!(error_reporting() & $error)) {
					return;
				}
				?>
					<div class="alert alert-danger m-5" role="alert">
						<strong>Fehler (<?php print $file; ?>:<?php print $line; ?>)</strong>
						<p class="pb-0 mb-0"><?php print $message; ?></p>
					</div>
				<?php
			});
			
			// Autoloading
			spl_autoload_register([ $this, 'load' ]);
			
			// Basic
			$this->template	= new Template($this);
			$this->router	= new Router($this);
			
			set_exception_handler(function($exception) {				
				$this->template->display('errors/exception', [
					'exception'	=> $exception
				]);
			});
			
			$this->init();
		}
		
		public function getTemplate() : ?Template {
			return $this->template;
		}
		
		public function getRouter() : ?Router {
			return $this->router;
		}

		public function getClientIP() {
			if(!empty($this->ip)) {
				return $this->ip;
			}
			
			$ip_address		= null;
			$ip_hostname	= null;
			$is_proxy		= false;
			$ip_data		= [];
			$headers		= [
				'HTTP_CLIENT_IP',
				'HTTP_X_FORWARDED_FOR',
				'HTTP_X_FORWARDED',
				'HTTP_FORWARDED_FOR',
				'HTTP_FORWARDED',
				'REMOTE_ADDR'
			];

			foreach($headers AS $key) {
				if(!empty($_SERVER[$key])) {
					$ip_data[$key]	= $_SERVER[$key];
					$ipList			= explode(',', $_SERVER[$key]);
					$ip_address		= trim($ipList[0]);
				}
			}
			
			if(!empty($ip_address)) {
				$ip_hostname = gethostbyaddr($ip_address);
			}
			
			// Keine private IP's => wahrscheinlich Proxy
			if(!filter_var($ip_address, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
				$is_proxy = true;
			}

			try {
				$json = @file_get_contents(sprintf('http://ip-api.com/json/%s?fields=proxy', $ip_address));
				
				if($json !== false) {
					$data		= json_decode($json, true);
					$is_proxy	= $data['proxy'] ?? false;
				}
			} catch(\Exception $e) {
				/* Do Nothing */
			}
			
			$ip = Database::single('SELECT `id` FROM `' . DATABASE_PREFIX . 'ip` WHERE `ip_address`=:ip_address AND DATE(`time_created`)=:date LIMIT 1', [
				'ip_address'	=> $ip_address,
				'date'			=> date('Y-m-d')
			]);
			
			// Update
			if($ip) {
				$this->ip = $ip->id;
				
				Database::update(DATABASE_PREFIX . 'ip', [ 'id' ], [
					'id'        	=> $this->ip,
					'time_updated'	=> 'NOW()'
				]);
				
			// Create
			} else {
				$this->ip = Database::insert(DATABASE_PREFIX . 'ip', [
					'id'			=> NULL,
					'ip_address'	=> $ip_address,
					'ip_hostname'	=> $ip_hostname,
					'is_proxy'		=> $is_proxy,
					'data'			=> json_encode($ip_data),
					'time_created'	=> 'NOW()',
					'time_updated'	=> null
				]);
			}
			
			return $this->ip;
		}
		
		public function load(string $class) : void {
			$file			= trim($class, BS);
			$file_array		= explode(BS, $file);
			
			array_shift($file_array);
			array_unshift($file_array, 'Classes');
			
			$path			= sprintf('%s%s%s.class.php', PATH, DS, implode(DS, $file_array));

			if(!file_exists($path)) {
				// Check if it's an Enum
				$enum		= sprintf('%s%s.enum.php', PATH, implode(DS, $file_array));

				if(file_exists($enum)) {
					require_once($enum);

				// Check it's a Library
				} else {
					$file_array = explode(BS, $file);
					array_unshift($file_array, 'Libraries');
					$path		= sprintf('%s%s%s.php', PATH, DS, implode(DS, $file_array));
					
					if(!is_readable($path)) {
						throw new \Exception('Error accessing Library: ' . $path);
					}

					if(file_exists($path)) {
						require_once($path);
						return;
					}
					
					throw new \Exception('Error Loading Library: ' . $path);
				}

				return;
			}

			require_once($path);
		}
		
		private function init() {
			Session::timeout();
			
			require_once(PATH . DS . 'routes.php');

			try {
				// Execute
				$this->router->run();
			} catch(\PDOException $error) {
				$this->template->display('errors/database', [
					'error'	=> $error
				]);
			}
		}
	}
?>