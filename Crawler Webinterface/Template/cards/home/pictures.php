<div class="card">
	<div class="card-header">
		Bilder
	</div>
	<div class="card-body text-center">
		<h1 data-name="count:pictures"><?php print number_format($statistics->pictures, 0, ',', '.'); ?></h1>
	</div>
	<div class="card-footer text-center">
		<a href="<?php print $template->url('/users/profiles/pictures'); ?>" class="btn btn-primary">Profilbilder ansehen</a>
	</div>
</div>