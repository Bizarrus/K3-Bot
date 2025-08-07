<?php
	use \AF\Database;
	
	$pictures	= [];
	$visits		= [];
	$comments	= (object) [
		'self'		=> [],
		'others'	=> []
	];
	$user		= Database::single('SELECT
			u.*,
			pr.*
		FROM users u
		LEFT JOIN profiles pr ON pr.id = u.id
		WHERE u.id = :id', [
		'id'	=> $id
	]);
	
	if($user) {
		$user->picture = null;
		
		$pictures = Database::fetch('SELECT * FROM `pictures` WHERE `user`=:id ORDER BY `time_created` ASC', [
			'id'	=> $user->id
		]);
		
		if($pictures) {
			$user->picture = $pictures[0];
		}
		
		$visits = Database::fetch('SELECT * FROM `visits` WHERE `user`=:id ORDER BY `date` DESC', [
			'id'	=> $user->id
		]);
		
		$comments->self = Database::fetch('SELECT
			c.*,
			u.id AS author_id
		FROM
			comments c
		JOIN
			users u ON c.author = u.nickname
		WHERE
			c.author = :nickname
		ORDER BY
			c.time_posted DESC', [
			'nickname'	=> $user->nickname
		]);
		
		$comments->others = Database::fetch('SELECT
			c.*,
			u.id AS author_id
		FROM
			comments c
		JOIN
			users u ON c.author = u.nickname
		WHERE
			c.author = :nickname
		AND
			c.author != :nickname
		ORDER BY
			c.time_posted DESC', [
			'nickname'	=> $user->nickname
		]);
	}
	
	$template->assign('user',		$user);
	$template->assign('profile',	$user);
	$template->assign('pictures',	$pictures);
	$template->assign('visits',		$visits);
	$template->assign('comments',	$comments);
?>