<?php
	namespace AF;

    class Response {
		public static function addHeader(string $name, string $value) : void {
			ResponseFactory::getInstance()->addHeader($name, $value);
		}
		
		public static function header() : void {
			ResponseFactory::getInstance()->header();
		}

		public static function setContentType(string $type) : void {
			ResponseFactory::getInstance()->setContentType($type);
		}
		
		public static function redirect(string $url) : void {
			ResponseFactory::getInstance()->redirect($url);
		}
	}
?>