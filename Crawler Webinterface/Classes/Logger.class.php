<?php
	namespace AF;
	
	class LoggerFactory {
		private static ?LoggerFactory $instance	= null;
		private $logger							= null;
		
		public function __construct() {
			
		}
		
		public static function getInstance() : LoggerFactory {
			if(self::$instance === null) {
				self::$instance = new self();
			}
			
			return self::$instance;
		}
		
		public function error(string $message, mixed ...$args) : void {
			
		}
		
		public function debug(string $message, mixed ...$args) : void {
			
		}
		
		public function info(string $message, mixed ...$args) : void {
		
		}
		
		public function notice(string $message, mixed ...$args) : void {
			
		}
		
		public function warning(string $message, mixed ...$args) : void {
			
		}
		
		public function critical(string $message, mixed ...$args) : void {
			
		}
		
		public function alert(string $message, mixed ...$args) : void {
			
		}
		
		public function emergency(string $message, mixed ...$args) : void {
			
		}
	}
	
	class Logger {
		public static function error(string $error, mixed ...$args) : void {
			LoggerFactory::getInstance()->error($error);
		}
		
		public static function debug(string $error, mixed ...$args) : void {
			LoggerFactory::getInstance()->debug($error);
		}
		
		public static function info(string $error, mixed ...$args) : void {
			LoggerFactory::getInstance()->info($error);
		}
		
		public static function notice(string $error, mixed ...$args) : void {
			LoggerFactory::getInstance()->notice($error);
		}
		
		public static function warning(string $error, mixed ...$args) : void {
			LoggerFactory::getInstance()->warning($error);
		}
		
		public static function critical(string $error, mixed ...$args) : void {
			LoggerFactory::getInstance()->critical($error);
		}
		
		public static function alert(string $error, mixed ...$args) : void {
			LoggerFactory::getInstance()->alert($error);
		}
		
		public static function emergency(string $error, mixed ...$args) : void {
			LoggerFactory::getInstance()->emergency($error);
		}
	}
?>