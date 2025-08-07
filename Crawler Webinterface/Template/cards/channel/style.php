<?php
	use \AF\Utils;
?>
<div class="card">
	<div class="card-header">
		Style
	</div>
	<div class="card-body p-0">
		<ul class="list-group list-group-flush rounded-bottom-4">
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-highlighter ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Highlight-Farbe
						</strong>
						<span class="col">
							<?php
								if(!empty($channel->color_highlight)) {
									$color = $channel->color_highlight;
									
									?>
										<div class="input-group">
											<input type="color" class="form-control form-control-color" value="<?php print Utils::RGBtoHex($color); ?>" />
											<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
												<i class="bi bi-eyedropper"></i>
											</button>
											<ul class="dropdown-menu dropdown-menu-end">
												<li><a class="dropdown-item" href="#">HEX: <?php print Utils::RGBtoHex($color); ?></a></li>
												<li><a class="dropdown-item" href="#">RGB: <?php print Utils::RGBtoCSS($color); ?></a></li>
											</ul>
										</div>
									<?php
								} else {
									print('&nbsp;');
								}
							?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-palette ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Hintergrund-Farbe
						</strong>
						<span class="col">
							<?php
								if(!empty($channel->color_background)) {
									$color = $channel->color_background;
									
									?>
										<div class="input-group">
											<input type="color" class="form-control form-control-color" value="<?php print Utils::RGBtoHex($color); ?>" />
											<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
												<i class="bi bi-eyedropper"></i>
											</button>
											<ul class="dropdown-menu dropdown-menu-end">
												<li><a class="dropdown-item" href="#">HEX: <?php print Utils::RGBtoHex($color); ?></a></li>
												<li><a class="dropdown-item" href="#">RGB: <?php print Utils::RGBtoCSS($color); ?></a></li>
											</ul>
										</div>
									<?php
								} else {
									print('&nbsp;');
								}
							?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-image ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Hintergrund-Bild
						</strong>
						<span class="col">
							<?php
								if(!empty($channel->background) && $channel->background !== 'null') {
									?>
										<span class="me-auto">
											<a href="<?php print $channel->background->url; ?>" target="_blank" class="btn btn-primary">URL öffnen <i class="bi bi-box-arrow-up-right"></i></a>
										</span>
									<?php
								} else {
									?>
										<span class="me-auto ps-4">Keins</span>
									<?php
								}
							?>
						</span>
					</div>
				</div>
			</li>
		</ul>
	</div>
</div>