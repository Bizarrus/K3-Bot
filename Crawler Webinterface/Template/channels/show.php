<?php
	use \AF\Utils;
	
	$template->header();
?>
<div class="container-fluid">
	<div>
		<a class="icon-link my-3" href="<?php print $template->url('/channels'); ?>">
			<i class="bi bi-arrow-left"></i> Zurück
		</a>
	</div>
	<div class="container">
		<div class="row">
			<div class="col">
				<?php
					$template->display('cards/channel/channel');
					$template->display('cards/channel/restrictions');
					$template->display('cards/channel/moderators');
				?>
			</div>
			<div class="col">
				<?php
					$template->display('cards/channel/style');
					$template->display('cards/channel/statistics');
					$template->display('cards/channel/topic');
				?>
			</div>
		</div>
		<div class="row mt-3 mb-3">
			<div class="col">
				<?php
					$template->display('cards/channel/info');
				?>
			</div>
		</div>
	</div>
</div>
<?php
	$template->footer();
?>