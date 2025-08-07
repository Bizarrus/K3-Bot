<div class="card">
	<div class="card-header">
		Benutzer
	</div>
	<div class="card-body text-center">
		<h1 data-name="count:users"><?php print number_format($statistics->users, 0, ',', '.'); ?></h1>
	</div>
	<div class="card-footer text-center">
		<a href="<?php print $template->url('/users'); ?>" class="btn btn-primary">Ansehen</a>
	</div>
</div>