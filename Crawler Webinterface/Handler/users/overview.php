<?php
	use \AF\Database;
	
	$query			= (isset($_GET['search']) ? $_GET['search'] : null);
	$age			= (isset($_GET['age']) ? $_GET['age'] : null);
	$gender			= (isset($_GET['gender']) ? $_GET['gender'] : null);
	$limit			= 50;
	$pages			= 0;
	$where			= [];
	$params			= [];
	$users			= [];

	if($query) {
		$where[]			= '`users`.`nickname` LIKE :query';
		$params[':query']	= '' . str_replace('*', '%', $query) . '';
	}
	
	if(is_array($age) && isset($age['from'], $age['to'])) {
		$where[]				= '(`users`.`age`=0 OR `users`.`age` IS NULL OR (`users`.`age` BETWEEN :age_from AND :age_to))';
		$params[':age_from']	= (int) $age['from'];
		$params[':age_to']		= (int) $age['to'];
	}

	if(is_array($gender) && count($gender) > 0) {
		$allowedGenders = ['MALE', 'FEMALE', 'NONBINARY_HE', 'NONBINARY_SHE', 'UNKNOWN'];
		$genderMapped = [];
		
		foreach($gender as $g) {
			switch(strtolower($g)) {
				case 'male':
					$genderMapped[] = 'MALE';
				break;
				case 'female':
					$genderMapped[] = 'FEMALE';
				break;
				case 'trans':
					$genderMapped[] = 'NONBINARY_HE';
					$genderMapped[] = 'NONBINARY_SHE';
				break;
				case 'unknown':
					$genderMapped[] = 'UNKNOWN';
				break;
			}
		}
		
		$genderMapped = array_intersect($genderMapped, $allowedGenders);

		if(count($genderMapped) === 1) {
			$where[] = '`users`.`gender` = :gender';
			$params[':gender'] = $genderMapped[0];
		} else {
			$placeholders = [];
			
			foreach($genderMapped as $i => $val) {
				$ph					= ':gender_' . $i;
				$placeholders[]		= $ph;
				$params[$ph]		= $val;
			}
			
			if(count($placeholders) > 1) {
				$where[] = '`users`.`gender` IN (' . implode(',', $placeholders) . ')';
			}
		}
	}
	
	$whereClause = '';
	
	if(!empty($where)) {
		$whereClause = ' WHERE ' . implode(' AND ', $where);
	}

	$total			= Database::single('SELECT
		COUNT(*) AS `total`
	FROM
		`users` ' . $whereClause, $params)->total;
	
	if($total >= 1) {
		$pages		= ceil($total / $limit);
		$page		= max(1, min($page, $pages));
		$offset		= ($page - 1) * $limit;
		
		if($offset < 0) {
			$offset = 0;
		}
		
		$users = Database::fetch('SELECT 
            users.*,
			pictures_latest.url AS picture
        FROM 
            users
		LEFT JOIN (
			SELECT p.*
			FROM pictures p
			INNER JOIN (
				SELECT 
					user,
					MAX(COALESCE(time_created)) AS max_time
				FROM pictures
				GROUP BY user
			) latest
			ON p.user = latest.user 
			AND COALESCE(p.time_created) = latest.max_time
		) pictures_latest ON users.id = pictures_latest.user
        ' . $whereClause . '
        LIMIT ' . $limit . ' OFFSET ' . $offset, $params);
	}
	
	$template->assign('query',		[
		'search'	=> $query,
		'age'		=> $age,
		'gender'	=> $gender,
	]);
	
	$template->assign('search',		$query);
	$template->assign('age',		$age);
	$template->assign('gender',		$gender);
	$template->assign('users',		$users);
	$template->assign('pages',		$pages);
	$template->assign('current',	$page);
	$template->assign('total',		$total);
?>