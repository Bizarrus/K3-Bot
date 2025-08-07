<?php
	define('TAB',	"\t");
	define('BS',	'\\');
	define('PATH',	dirname(__FILE__));
	define('DS',	DIRECTORY_SEPARATOR);
	define('YES',	'YES');
	define('NO',	'NO');
	
	set_time_limit(-1);
	date_default_timezone_set('Europe/Berlin');
	putenv('PATH=/root/.nvm/versions/node/v23.5.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin');
	
	require_once(sprintf('%s/Classes/Core.class.php', PATH));
	new \AF\Core();
?>