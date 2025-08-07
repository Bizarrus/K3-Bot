<?php
	namespace AF;
	
	use \AF\Database;
	
	class Knuddels {
		public static function escapeNickname($nickname) : string {
			$result = '';
			$asciiDecimalForA = 97; // 'a'
			$nickname = mb_strtolower($nickname, 'UTF-8');

			for ($i = 0; $i < mb_strlen($nickname, 'UTF-8'); $i++) {
				$char = mb_substr($nickname, $i, 1, 'UTF-8');
				$code = mb_ord($char, 'UTF-8');

				if (($code >= 97 && $code <= 122) || ($code >= 65 && $code <= 90) || ($code >= 48 && $code <= 57)) {
					$result .= chr($code);
				} elseif ($code === 32) {
					$result .= '_-';
				} elseif ($code < 256) {
					$result .= '_' . chr((($code >> 4) & 15) + $asciiDecimalForA) . chr(($code & 15) + $asciiDecimalForA);
				} else {
					$result .= '__'
						. chr((($code >> 12) & 15) + $asciiDecimalForA)
						. chr((($code >> 8) & 15) + $asciiDecimalForA)
						. chr((($code >> 4) & 15) + $asciiDecimalForA)
						. chr(($code & 15) + $asciiDecimalForA);
				}
			}

			return $result;
		}
		
		public static function getUserID($nickname) {
			$user = Database::single('SELECT `id` FROM `users` WHERE `nickname`=:nickname LIMIT 1', [
				'nickname'	=> $nickname
			]);
			
			if($user) {
				return $user->id;
			}
			
			return null;
		}
		
		public static function getUser($id) {
			$user = Database::single('SELECT * FROM `users` WHERE `id`=:id LIMIT 1', [
				'id'	=> $id
			]);
			
			if($user) {
				$user->nickname_escaped = self::escapeNickname($user->nickname);
				
				return $user;
			}
			
			return null;
		}
	}
?>