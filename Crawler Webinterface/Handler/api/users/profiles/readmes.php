<?php
	use \AF\Discord;
	use \AF\Session;
	use \AF\Database;

	$data	= (object) [];
	$status	= false;
	$error	= null;
	
	if(!isset($_SERVER['REQUEST_METHOD'])) {
		print json_encode([
			'status'	=> $status,
			'code'		=> 'ACTION_EMPTY',
			'message'	=> 'Unknown action.'
		]);
		exit();
	}
	
	switch($_SERVER['REQUEST_METHOD']) {
		case 'GET':
			$readmes	= [];
			$limit		= 100;
			$page		= (isset($_GET['page']) ? $_GET['page'] : 1);
			$offset 	= ($page - 1) * $limit;
			
			foreach(Database::fetch('SELECT
				`users`.`id` AS `id`,
				`users`.`age` AS `age`,
				`users`.`gender` AS `gender`,
				`users`.`nickname` AS `nickname`,
				JSON_UNQUOTE(JSON_EXTRACT(`profiles`.`readme`, \'$.text.text\')) AS `readme`,
				`profiles`.`time_updated` AS `updated`,
				`profiles`.`time_created` AS `created`
			FROM (`users` JOIN `profiles`)
			WHERE
				`users`.`id`=`profiles`.`id` AND `profiles`.`readme` IS NOT NULL
			AND
				TRIM(JSON_UNQUOTE(JSON_EXTRACT(`profiles`.`readme`, \'$.text.text\')))!=\'\'
			LIMIT ' . $offset . ', ' . $limit) AS $readme) {
				$marks	= [];
				
				/* TeleGuard ID */
				if(preg_match('/(?<![A-Z0-9])(?=[A-Z0-9]{8,9}(?![A-Z0-9]))(?=[A-Z0-9]*\d)[A-Z0-9]{8,9}/', $readme->readme)) {
					$marks[] = 'messenger:teleguard';
				}
				
				if(preg_match('/(?<![A-Z0-9])(?=[A-Z0-9]{8,9}(?![A-Z0-9]))(?=[A-Z0-9]*\d)[A-Z0-9]{8,9}/', $readme->readme)) {
					$marks[] = 'messenger:teleguard';
				}
				
				/* Messengers */
				if(preg_match('/\b(' . implode('|', [
					'sc',
					'snap',
					'snapchat',
					'S?4p',
					'Sn4p',
					'👻',
				]) . ')\b/i', $readme->readme) === 1) {
					$marks[] = 'messenger:snapchat';
				}
				
				if(mb_strpos($readme->readme, '👻') !== false) {
					$marks[] = 'messenger:snapchat';
				}
				
				if(preg_match('/\b(' . implode('|', [
					'telegram',
					'txlxgram',
					'telkrammm',
					'telkrammm',
					't3kegkkramm',
					'TeläIgIr',
					'Te1geram',
					'telklgram'
				]) . ')\b/i', $readme->readme) === 1) {
					$marks[] = 'messenger:telegram';
				}
				
				if(preg_match('/\b(' . implode('|', [
					'insta',
					'ig',
					'inst',
				]) . ')\b/i', $readme->readme) === 1) {
					$marks[] = 'messenger:instagram';
				}
				
				if(preg_match('/(' . implode('|', [
					'𝐼𝓃𝓈𝓉𝒶',
					'𝙞𝙣𝙨𝙩𝙖',
					'𝕚𝕟𝕤𝕥𝕒',
					'🅘🅝🅢🅣🅐'
				]) . ')/i', $readme->readme) === 1) {
					$marks[] = 'messenger:instagram';
				}
				
				if(preg_match('/(' . implode('|', [
					'KIK',
					'k1k',
					'k!k'
				]) . ')/Uis', $readme->readme) === 1) {
					$marks[] = 'messenger:kik';
				}
				
				if(preg_match('/\b(' . implode('|', [
					'tellonym',
					'OOCAM'
				]) . ')\b/i', $readme->readme) === 1) {
					$marks[] = 'messenger:other';
				}
				
				/* Sexual */
				if(preg_match('/\b(' . implode('|', [
					'anal',
					'an*l',
					'einpinkeln',
					'cnc',
					'c2c',
					'bbc',
					'slut',
					'G*ngb*ng',
					'c----old',
					'slvt',
					'Schwänze',
					'pusy',
					'benutzbar',
					'pussy',
					'telesex',
					'selbstbefriedigung',
					'Fotz3ngeil',
					'Porxx',
					'T6',
					'Sperm',
					'zeige ihn',
					'Bildertrade',
					'c0ck0ld',
				]) . ')\b/i', $readme->readme) === 1) {
					$marks[] = 'sexual';
				}
				if(preg_match('/\b(' . implode('|', [
					'(\d)inch',
					'(\d)cm',
					'ns',
				]) . ')\b/i', $readme->readme) === 1) {
					$marks[] = 'sexual';
				}
				
				if(
					mb_strpos(strtolower($readme->readme), 'sperm') !== false ||
					mb_strpos($readme->readme, '💦') !== false ||
					mb_strpos($readme->readme, '🍆') !== false ||
					mb_strpos($readme->readme, '<=3') !== false
				) {
					$marks[] = 'sexual';
				}
				
				/* Fetish */
				if(preg_match('/\b(' . implode('|', [
					'pampers',
					'windel'
				]) . ')\b/i', $readme->readme) === 1) {
					$marks[] = 'fetish';
				}
				
				/* Financial */
				if(preg_match('/\b(' . implode('|', [
					'sugardaddy',
					'finanziell',
					'geld',
					'sell',
					'paypig',
					'💸'
				]) . ')\b/i', $readme->readme) === 1) {
					$marks[] = 'financial';
				}
				
				if(mb_strpos($readme->readme, '💸') !== false) {
					$marks[] = 'financial';
				}
				
				$readme->flags		= array_unique($marks);
				$readmes[] 			= $readme;
			}
			
			$status	= true;
			$data	= $readmes;
		break;
		default:
			print json_encode([
				'status'	=> $status,
				'code'		=> 'ACTION_EMPTY',
				'message'	=> 'Unknown action.'
			]);
			exit();
		break;
	}
	
	if(!empty($error)) {
		print json_encode([
			'status'	=> $status,
			'code'		=> $error->code,
			'message'	=> $error->message
		]);
		exit();
	}
	
	print json_encode([
		'status'	=> $status,
		'data'		=> $data
	]);
?>