<div class="card">
	<div class="card-header">
		Statistik: Sonstige
	</div>
	<div class="card-body p-0">
		<ul class="list-group list-group-flush rounded-bottom-4">
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Profil-Bilder
						</strong>
						<span class="col" data-name="count:pictures">
							<?php print number_format($statistics->pictures, 0, ',', '.'); ?>
						</span>
					</div>
				</div>
			</li>
			<!--<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Alben-Bilder
						</strong>
						<span class="col" data-name="count:album_pictures">
							0
						</span>
					</div>
				</div>
			</li>-->
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Alben
						</strong>
						<span class="col" data-name="count:albums">
							<?php print number_format($statistics->albums, 0, ',', '.'); ?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Foto-Kommentare
						</strong>
						<span class="col" data-name="count:comments_photo">
							<?php print number_format($statistics->comments_photo, 0, ',', '.'); ?>
						</span>
					</div>
				</div>
			</li>
			<!--<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Alben-Kommentare
						</strong>
						<span class="col" data-name="count:comments_albums">
							0
						</span>
					</div>
				</div>
			</li>-->
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Bilder auf KI geprüft
						</strong>
						<span class="col">
							<a target="_blank" class="icon-link icon-link-hover" href="<?php print $template->url('/fake/ai/'); ?>">
								<span data-name="count:ai_checked"><?php print number_format($statistics->ai_checked, 0, ',', '.'); ?></span>
								<i class="bi bi-box-arrow-up-right m-0 mb-2"></i>
							</a>
						</span>
					</div>
				</div>
			</li>
		</ul>
	</div>
</div>