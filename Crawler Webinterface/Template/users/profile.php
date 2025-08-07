<?php
	use \AF\Bootstrap;
	
	$template->header();
?>
<div class="container-fluid">
	<div>
		<a class="icon-link my-3" href="<?php print $template->url('/'); ?>">
			<i class="bi bi-arrow-left"></i> Zurück
		</a>
	</div>
	<?php
		if(!$user) {
			Bootstrap::warn('Der angegebene Benutzer konnte nicht gefunden werden.');
		} else {
			?>
				<div class="pb-3 row">
					<div class="col">
						<?php
							$template->display('cards/profile/user');
						?>
					</div>
					<div class="col">
						<?php
							$template->display('cards/profile/profile');
						?>
					</div>
					<div class="col">
						<?php
							$template->display('cards/profile/picture');
						?>
					</div>
				</div>
				<div class="pb-3 row mt-3">
					<div class="col">
						<?php
							$template->display('cards/profile/readme');
						?>
					</div>
					<div class="col">
						<?php
							$template->display('cards/profile/visits');
						?>
					</div>
				</div>
				<div class="pb-3 row">
					<div class="col">
						<?php
							$template->display('cards/profile/comments');
						?>
					</div>
				</div>
			<?php
		}
	?>
</div>
<?php
	$template->footer();
?>