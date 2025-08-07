<div class="card">
	<div class="card-header">
		Statistik: Besucher
	</div>
	<div class="card-body p-0">
		<ul class="list-group list-group-flush rounded-bottom-4">
			<?php
				$formatter = new \IntlDateFormatter('de_DE', \IntlDateFormatter::NONE, \IntlDateFormatter::NONE, null, null, 'LLLL yyyy');
				
				foreach($visits AS $entry) {
					$name = ucfirst($formatter->format(strtotime($entry->month . '-01'))); 
					?>
						<li class="list-group-item d-flex justify-content-between align-items-start">
							<span class="ms-2">
								<?php print $name; ?>
							</span>
							<span class="me-auto ps-4" data-name="count:<?php print $name; ?>">
								<?php print number_format($entry->users, 0, ',', '.'); ?>
							</span>
						</li>
					<?php
				}
			?>
		</ul>
	</div>
</div>