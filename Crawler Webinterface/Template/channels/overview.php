<?php
	$template->header();
?>
<div class="container-fluid d-flex flex-column vh-100 vh-min-100 vh-max-100">
	<div>
		<a class="icon-link my-3" href="<?php print $template->url('/'); ?>">
			<i class="bi bi-arrow-left"></i> Zurück
		</a>
	</div>
	<div class="d-flex flex-column flex-grow-1 pb-3" style="height: calc(100% - 130px)">
		 <div class="card d-flex flex-column flex-grow-1 h-100">
			<div class="card-header">
				Channels (<span><?php print number_format(count($channels), 0, ',', '.'); ?></span>)
			</div>
			<div class="card-body d-flex flex-column p-0 overflow-hidden flex-grow-1 h-100">
				<div class="flex-grow-1 h-100 overflow-auto d-flex flex-column p-3 m-0">
					<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
						<?php
							foreach($channels AS $channel) {
								$template->display('entry/channel', [
									'channel' => $channel
								]);
							}
						?>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<?php
	$template->footer();
?>