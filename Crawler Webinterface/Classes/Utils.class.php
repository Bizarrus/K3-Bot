<?php
	namespace AF;
	
	use \DateTime;
	use \DateTimeZone;
	use \DateTimeImmutable;
	
	class Utils {
		public static function RGBtoHex($color) {
			return strtoupper(sprintf("#%02x%02x%02x", $color->red, $color->green, $color->blue));
		}
		
		public static function RGBtoCSS($color) {
			return sprintf("rgba(%d, %d, %d, %.2f)", $color->red, $color->green, $color->blue, $color->alpha / 255);
		}
		
		public static function convertSize($bytes, $precision = 2) {
			if($bytes <= 0) {
				return '0 B';
			}

			$units	= [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
			$base	= log($bytes, 1024);
			$suffix = $units[floor($base)];
			$size	= round(pow(1024, $base - floor($base)), $precision);

			return sprintf('%s %s', number_format($size, $precision, ',', '.'), $suffix);
		}

		public static function zeroise($number, $threshold) {
			return sprintf('%0' . $threshold . 's', $number);
		}
		
		public static function convertTimestamp($timestamp, $format = 'd.m.Y - H:i:s') {
			return date($format, (int) ($timestamp / 1000));
		}
		
		public static function stringNumber($input, $singular, $plural) {
			if($input > 1) {
				return sprintf('%d %s', $input, $plural);
			}
			
			return sprintf('%d %s', $input, $singular);
		}
		
		public static function convertUptime($timestamp) {
			$now		= new DateTime();
			$targetTime	= (new DateTime())->setTimestamp((int) ($timestamp / 1000));
			$interval	= $now->diff($targetTime);
			
			if($interval->y > 0) {
				return self::stringNumber($interval->y, 'Jahr', 'Jahre');
			} else if($interval->m > 0) {
				return self::stringNumber($interval->m, 'Monat', 'Monate');
			} else if($interval->d > 0) {
				return self::stringNumber($interval->d, 'Tag', 'Tage');
			} else if($interval->h > 0) {
				return self::stringNumber($interval->h, 'Stunde', 'Stunden');
			} else if($interval->i > 0) {
				return self::stringNumber($interval->i, 'Minute', 'Minuten');
			} else {
				return self::stringNumber($interval->s, 'Sekunde', 'Sekunden');
			}
		}
		
		public static function generateUniqueID($system = -1, $order = -1) {
			$epoch			= strtotime('2025-01-01 00:00:00'); 
			$currentTime	= floor(microtime(true) * 1000);
			$timestamp		= $currentTime - $epoch;
			$machineBits	= 16;
			$sequenceBits	= 16;
			$maxMachineId	= -1 ^ (-1 << $machineBits);
			$maxSequence	= -1 ^ (-1 << $sequenceBits);

			if($system > $maxMachineId) {
				throw new \Exception('Machine ID zu groß! Max: ' . $maxMachineId);
			}
			
			if($order > $maxSequence) {
				throw new \Exception('Order-ID zu groß! Max: ' . $maxSequence);
			}

			return ($timestamp << ($machineBits + $sequenceBits)) | ($system << $sequenceBits) | $order;
		}
	}
?>