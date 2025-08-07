<div class="card mt-3">
	<div class="card-header">
		Restriktionen
	</div>
	<div class="card-body p-0">
		<ul class="list-group list-group-flush rounded-bottom-4">
			<?php
				if(empty($channel->restrictions) || empty($channel->restrictions->values)) {
					?>
						<li class="list-group-item d-flex justify-content-between align-items-start">
							<span class="mx-auto text-center">
								Keine
							</span>
						</li>
					<?php
				} else {
					foreach($channel->restrictions->values AS $restriction) {
						preg_match('/^([^:]+):\s(.*)$/Uis', $restriction, $matches);
						$icon = '';
						
						switch($matches[1]) {
							case 'Alter & Geschlecht notwendig':
								$icon = 'gender-ambiguous';
							break;
							case 'Registriertage':
								$icon = 'calendar-date';
							break;
							case 'Mindestalter':
								$icon = 'cake2-fill';
							break;
							case 'Nur ein Nutzer pro IP':
								$icon = 'globe';
							break;
							case 'Onlineminuten':
								$icon = 'hourglass-split';
							break;
						}
						?>
							<li class="list-group-item d-flex justify-content-between align-items-start">
								<i class="bi bi-<?php print $icon; ?> ms-2"></i>
								<div class="me-auto ps-4 container">
									<div class="row">
										<strong class="col">
											<?php print($matches[1]); ?>
										</strong>
										<span class="col">
											<?php print($matches[2]); ?>
										</span>
									</div>
								</div>
							</li>
						<?php
					}
				}
			?>
		</ul>
	</div>
</div>