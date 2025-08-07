<?php
	use \AF\Database;
	
	$channel = Database::single('SELECT * FROM `channels` WHERE `channel`=CONCAT(:id, \':1\') LIMIT 1', [
		'id'	=> $id
	]);
	
	$template->assign('channel', $channel);
?>