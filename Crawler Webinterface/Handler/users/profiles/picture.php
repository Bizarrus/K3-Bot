<?php
	use \AF\Database;

	$expires = 60 * 60 * 24 * 365;
	$file    = sprintf('/var/www/knuddels/Crawler/storage/pictures/profiles/%d.img', $id);

	if(!file_exists($file) || !is_readable($file)) {
		http_response_code(404);
		echo 'Picture not found or not readable';
		exit();
	}

	$lastModified    = filemtime($file);
	$lastModifiedGMT = gmdate('D, d M Y H:i:s', $lastModified) . ' GMT';

	// Conditional GET
	if(isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])) {
		$ifModifiedSince = strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']);
		
		if($ifModifiedSince !== false && $ifModifiedSince >= $lastModified) {
			header('HTTP/1.1 304 Not Modified');
			exit();
		}
	}

	// Datenbank nur laden, wenn wirklich nötig
	$picture = Database::single('SELECT * FROM `pictures` WHERE `id`=:id LIMIT 1', ['id' => $id]);

	if(!$picture) {
		http_response_code(404);
		echo 'Picture not exists in Database';
		exit();
	}

	// MIME-Typ ermitteln
	$finfo = finfo_open(FILEINFO_MIME_TYPE);
	$mime  = finfo_file($finfo, $file);
	finfo_close($finfo);

	// Headers
	header('Content-Type: ' . $mime);
	header('Cache-Control: public, max-age=' . $expires);
	header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $expires) . ' GMT');
	header('Last-Modified: ' . $lastModifiedGMT);

	// Ausgabe
	readfile($file);
	exit();
?>