	</main>
	<?php
		$javascripts = [
			'bootstrap/popper.min.js',
			'bootstrap/bootstrap.min.js',
			'https://cdn.knuddelscom.de/sf/libs/kcode/1.4.0/kcode.min.js',
			'extensions.js',
			'ajax.js',
			'kcode.js'
		];
		
		if($this->getRouter()->is('/users/profiles/readmes')) {
			$javascripts[] = 'readmes.js';
		} else {
			$javascripts[] = 'home.js';
		}
		
		foreach($javascripts AS $javascript) {
			if(str_starts_with($javascript, 'http://') || str_starts_with($javascript, 'https://')) {
				printf('<script type="text/javascript" src="%s"></script>', $javascript);
			} else {
				printf('<script type="text/javascript" src="%s"></script>', $template->url(sprintf('/js/%s?v=%d', $javascript, time())));
			}
		}

		if(!empty($hash)) {
			printf('<script type="text/javascript">Extensions.showTab(\'%s\');</script>', $hash);
		}
	?>
	</body>
</html>