<?php
	$template->header();
?>
<div class="container-fluid d-flex flex-column vh-100 vh-min-100 vh-max-100">
	<div>
		<a class="icon-link my-3" href="<?php print $template->url('/'); ?>">
			<i class="bi bi-arrow-left"></i> Zurück
		</a>
	</div>
	<div class="d-flex flex-column flex-grow-1 pb-3" style="height: calc(100% - 200px)">
		 <div class="card d-flex flex-column flex-grow-1 h-100">
			<div class="card-header">
				KI-Bilder mit mindestens <?php print $minimum; ?> % (<?php print number_format($total, 0, ',', '.'); ?>)
			</div>
			<div class="card-body d-flex flex-column p-0 overflow-hidden flex-grow-1 h-100">
				<div class="flex-grow-1 h-100 overflow-auto d-flex flex-column p-3 m-0">
					<?php
						if(empty($pictures)) {
							$template->display('entry/empty');
						} else {
							print('<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">');
							foreach($pictures AS $picture) {
								$template->display('entry/picture_ki', [
									'picture' => $picture
								]);
							}
							print('</div>');
						}
					?>
				</div>
			</div>
			<div class="card-footer text-center">
				<?php
					if($pages >= 2) {
						?>
							<nav>
								<ul class="pagination justify-content-center">
									<li class="page-item <?php print ($current <= 1 ? 'disabled' : ''); ?>">
										<a class="page-link" href="<?php print $this->url('/fake/ai/' . ($current - 1), $query); ?>" aria-label="Zurück">
											<span aria-hidden="true">&laquo;</span>
										</a>
									</li>
									<?php
										$displayed = [];
										
										for($i = 1; $i <= 2 && $i <= $pages; $i++) {
											$displayed[] = $i;
										}
										
										for($i = $current - 1; $i <= $current + 1; $i++) {
											if($i > 2 && $i < $pages - 1) {
												$displayed[] = $i;
											}
										}

										for($i = $pages - 1; $i <= $pages; $i++) {
											if($i > 2) {
												$displayed[] = $i;
											}
										}

										$displayed = array_unique($displayed);
										sort($displayed);

										$last = 0;
										foreach($displayed as $i) {
											if($i - $last > 1) {
												?>
													<li class="page-item disabled"><span class="page-link">…</span></li>
												<?php
											}
											?>
											<li class="page-item <?php print(($i == $current) ? 'active' : ''); ?>">
												<a class="page-link" href="<?php print $this->url('/fake/ai/' . $i, $query) ?>">
													<?php print $i ?>
												</a>
											</li>
											<?php
												$last = $i;
										}
									?>
									<li class="page-item <?php print ($current >= $pages ? 'disabled' : ''); ?>">
										<a class="page-link" href="<?php print $this->url('/fake/ai/' . ($current + 1), $query); ?>" aria-label="Weiter">
											<span aria-hidden="true">&raquo;</span>
										</a>
									</li>
								</ul>
							</nav>
						<?php
					}
				?>
			</div>
		</div>
	</div>
</div>
<?php
	$template->footer();
?>