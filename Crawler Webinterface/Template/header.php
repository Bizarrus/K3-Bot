<?php
	use \AF\Discord;
	use \AF\Request;
	use \AF\Session;
?>
<!DOCTYPE html>
<html lang="de" class="vh-100" data-bs-theme="light">
	<head>
		<title>Knuddels</title>
		<meta charset="UTF-8" />
		<meta name="robots" content="index,follow,noodp" />
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no" />
		
		<link rel="icon" href="<?php print $template->url('/images/icon.svg'); ?>" type="image/svg" />
		<link rel="manifest" href="<?php print $template->url('/manifest.json'); ?>" />
		<link rel="mask-icon" href="<?php print $template->url('/images/icon.svg'); ?>" color="#444444" />
		<link rel="icon" href="<?php print $template->url('/images/icon.ico'); ?>" />
		<meta name="theme-color" content="#444444" />
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

		<?php
			$stylesheets = [
				'bootstrap/bootstrap.min.css',
				'bootstrap/bootstrap-icons.min.css',
				'https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap',
				'global.css',
				'ai.css',
				'knuddels.css',
			];
			
			foreach($stylesheets AS $stylesheet) {
				if(str_starts_with($stylesheet, 'http://') || str_starts_with($stylesheet, 'https://')) {
					printf('<link rel="stylesheet" type="text/css" href="%s" />', $stylesheet);
				} else {
					printf('<link rel="stylesheet" type="text/css" href="%s" />', $template->url(sprintf('/css/%s?v=%d', $stylesheet, time())));
				}
			}
		?>
	</head>
	<body class="vh-100">
		<main class="d-flex flex-column vh-100">