<?php
	use \AF\Bootstrap;
	
	$template->header();
	?>
		<div class="position-fixed" style="z-index:100000">
			<header class="pt-3 pb-2 px-3 border-bottom">
				<h3><i class="bi text-primary bi-exclamation-diamond"></i> Fehler</h3>
			</header>
			<section class="flex-fill px-5 py-3 overflow-y-auto overflow-x-hidden">
				<div class="alert alert-danger" role="alert">
					<?php
						Bootstrap::formEntry('Meldung', 'message', $exception->getMessage());
						Bootstrap::formEntry('Datei', 'file', $exception->getFile());
						Bootstrap::formEntry('Zeile', 'line', $exception->getLine());
					?>
					<p class="pb-0"><strong>Stacktrace:</strong></p>
					<pre><?php print $exception->getTraceAsString(); ?></pre>
				</div>
			</section>
		</div>
	<?php
	
	$template->footer();
?>