<?php
	$template->header();
	
	?>
		<header class="pt-3 pb-2 px-3 border-bottom">
			<h3><i class="bi text-primary bi-exclamation-diamond"></i> Datenbankfehler</h3>
		</header>
		<section class="flex-fill px-5 py-3 overflow-y-auto overflow-x-hidden">
			<div class="alert alert-danger" role="alert">
				<strong>Fehler</strong>
				<p class="pb-0 mb-0">Leider ist ein Fehler mit der Datenbank aufgetreten.</p>
			</div>
		</section>
		<pre>
			<strong><?php print $error->getMessage(); ?></strong><p><?php print $error->getTraceAsString(); ?></p>
		</pre>
	<?php
	
	$template->footer();
?>