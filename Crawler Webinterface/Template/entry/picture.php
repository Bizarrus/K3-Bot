<div class="col">
	<a class="card text-decoration-none" target="_blank" href="<?php print $template->url('/user/' . $picture->id); ?>">
		<div class="card-header">
			<?php
				print htmlentities($picture->nickname); ?> (<?php
				print $picture->age;
				
				switch($picture->gender) {
					case 'MALE':
						print('<i class="bi bi-gender-male ms-1"></i>');
					break;
					case 'FEMALE':
						print('<i class="bi bi-gender-female ms-2"></i>');
					break;
					case 'NONBINARY_HE':
					case 'NONBINARY_SHE':
						print('<i class="bi bi-gender-trans ms-2"></i>');
					break;
				}
			?>)
		</div>
		<div class="card-body text-bg-dark p-0 rounded-bottom-4 overflow-hidden">
			<img src="<?php print $picture->url; ?>" class="img-fluid object-fit-contain" style="height: 250px; width: 100%;" title="<?php print htmlentities($picture->nickname); ?>">
		</div>
	</a>
</div>