<div class="card">
	<div class="card-header">
		Channels
	</div>
	<div class="card-body text-center">
		<h1 data-name="count:channels"><?php print number_format($statistics->channels, 0, ',', '.'); ?></h1>
	</div>
	<div class="card-footer text-center">
		<a href="<?php print $template->url('/channels'); ?>" class="btn btn-primary">Ansehen</a>
	</div>
</div>