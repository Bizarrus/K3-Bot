<div class="card mt-3">
	<div class="card-header">
		Statistik
	</div>
	<div class="card-body p-0">
		<ul class="list-group list-group-flush rounded-bottom-4">
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Bewertung
						</strong>
						<span class="col">
							<div class="text-warning">
								<?php
									if(empty($channel->stars)) {
										$channel->stars = 0;
									}
									
									$fullStars	= floor($channel->stars);
									$halfStar	= ($channel->stars - $fullStars) >= 0.5;
									
									for($i = 0; $i < $fullStars; $i++) {
										print('<i class="bi bi-star-fill"></i>');
									}
									
									if($halfStar) {
										print('<i class="bi bi-star-half"></i>');
									}
									
									for($i = 0; $i < (5 - $fullStars - ($halfStar ? 1 : 0)); $i++) {
										print('<i class="bi bi-star"></i>');
									}
								?>
							</div>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Lieblings-Channel
						</strong>
						<span class="col">
							<?php print(empty($channel->users_lc) ? 0 : $channel->users_lc); ?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Harter Kern
						</strong>
						<span class="col">
							<?php print(empty($channel->users_hc) ? 0 : $channel->users_hc); ?>
						</span>
					</div>
				</div>
			</li>
		</ul>
	</div>
</div>