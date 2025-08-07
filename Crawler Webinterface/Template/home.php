<?php
	$template->header();
?>
	<div class="container mt-5">
		<div class="row">
			<div class="col">
				<?php $template->display('cards/home/channels'); ?>
			</div>
			<div class="col">
				<?php $template->display('cards/home/users'); ?>
			</div>
			<div class="col">
				<?php $template->display('cards/home/profiles'); ?>
			</div>
			<div class="col">
				<?php $template->display('cards/home/pictures'); ?>
			</div>
		</div>
		<div class="row mt-5">
			<div class="col">
				<div class="row">
					<div class="col">
						<?php $template->display('cards/home/stats/genders'); ?>
					</div>
					<div class="col">
						<?php $template->display('cards/home/stats/visits'); ?>
					</div>
				</div>
			</div>
			<div class="col">
				<div class="row">
					<div class="col">
					
					</div>
					<div class="col">
						<?php $template->display('cards/home/stats/other'); ?>
					</div>
				</div>
			</div>
		</div>
	</div>
<?php
	$template->footer();
?>