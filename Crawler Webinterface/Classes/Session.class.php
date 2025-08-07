<?php
    namespace AF;

	class Session {
		public static function init() : void {
			@ini_set('session.gc_maxlifetime', 604800);
			
			if(session_status() !== PHP_SESSION_ACTIVE) {
				session_set_cookie_params([
					'lifetime'	=> 604800,
					'secure'	=> true,
					'httponly'	=> true
				]);
				
				@session_start();
			}
		}
		
		public static function timeout() {				
			if(defined('SESSION_TIME')) {
				if(self::has('LAST_ACTIVITY') && (time() - self::get('LAST_ACTIVITY')) > SESSION_TIME) {
					
				}
				
				self::set('LAST_ACTIVITY', time());
			}
		}
		
		public static function debug() : void {
			var_dump([
				'HTTP_COOKIE'	=> $_SERVER['HTTP_COOKIE'],
				'COOKIE'		=> $_COOKIE,
				'session_id'	=> session_id(),
				'data'			=> $_SESSION
			]);
		}
				
		public static function getID() : string | false {
			return session_id();
		}
		
		public static function has(string $name) : bool {
			self::init();
			
			if(isset($_SESSION[$name])) {
				return true;
			}
			
			return false;
		}
		
		public static function get(string $name, $default = null) : mixed  {
			self::init();
			
			if(isset($_SESSION[$name])) {
				return $_SESSION[$name];
			}
			
			return $default;
		}
		
		public static function set(string $name, mixed $value) : void {
			self::init();
			
			$_SESSION[$name] = $value;
		}
		
		public static function remove(string $name) : void {
			self::init();
			
			$_SESSION[$name] = null;
			unset($_SESSION[$name]);
		}
	}
?>