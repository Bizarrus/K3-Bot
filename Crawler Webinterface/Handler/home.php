<?php
	use \AF\Database;
	
	$template->assign('statistics',	Database::single('SELECT * FROM Statistics'));
	$template->assign('visits',		Database::fetch('SELECT
		DATE_FORMAT(`date`, \'%Y-%m\') AS `month`,
		COUNT(DISTINCT `user`) AS `users`
	FROM
		`visits`
	GROUP BY
		`month`
	ORDER BY
		`month` DESC'));
?>