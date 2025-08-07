<?php
	use \AF\Database;
	
	$template->assign('channels', Database::fetch('
		SELECT
			`channels`.*,
			REPLACE(`channels`.`channel`, \':1\', \'\') AS `channel_id`,
			MIN(`channels`.`name`) AS `name`
		FROM
			`channels`
		WHERE
			`channels`.`channel` LIKE \'%:1\'
		GROUP BY
			REPLACE(`channels`.`channel`, \':1\', \'\')
		ORDER BY
			CAST(REPLACE(`channels`.`channel`, \':1\', \'\') AS UNSIGNED) ASC
	'));
?>