<div class="card">
	<div class="card-header">
		Profile
	</div>
	<div class="card-body text-center">
		<h1 data-name="count:profiles"><?php print number_format($statistics->profiles, 0, ',', '.'); ?></h1>
	</div>
	<div class="card-footer text-center">
		<a href="<?php print $template->url('/users/profiles/readmes'); ?>" class="btn btn-primary">Readmes</a>
	</div>
</div>