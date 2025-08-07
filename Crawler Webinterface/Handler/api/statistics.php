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
			$visits		= [];
			$formatter	= new \IntlDateFormatter('de_DE', \IntlDateFormatter::NONE, \IntlDateFormatter::NONE, null, null, 'LLLL yyyy');
			$statistics = Database::single('SELECT * FROM Statistics');
			
			foreach(Database::fetch('SELECT
					DATE_FORMAT(`date`, \'%Y-%m\') AS `month`,
					COUNT(DISTINCT `user`) AS `users`
				FROM
					`visits`
				GROUP BY
					`month`
				ORDER BY
					`month` DESC') AS $visit) {
				$visits[] = (object) [
					'month' => ucfirst($formatter->format(strtotime($visit->month . '-01'))),
					'users'	=> $visit->users
				];
			}
			$status		= true;
			$data		= (object) [
				'users'				=> $statistics->users,
				'ai_checked'		=> $statistics->ai_checked,
				'profiles'			=> $statistics->profiles,
				'pictures'			=> $statistics->pictures,
				'albums_pictures'	=> $statistics->albums_pictures,
				'comments_photo'	=> $statistics->comments_photo,
				'comments_albums'	=> $statistics->comments_albums,
				'albums'			=> $statistics->albums,
				'channels'			=> $statistics->channels,
				'genders'			=> [
					(object) [
						'type'	=> 'MALE',
						'value'	=> $statistics->male
					],
					(object) [
						'type'	=> 'FEMALE',
						'value'	=> $statistics->female
					],
					(object) [
						'type'	=> 'TRANS',
						'value'	=> ($statistics->binary_he + $statistics->binary_she)
					],
					(object) [
						'type'	=> 'UNKNOWN',
						'value'	=> $statistics->unknown
					]
				],
				'visits'	=> $visits
			];
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