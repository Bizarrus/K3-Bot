<div class="card">
	<div class="card-header">
		Statistik: Besuche
	</div>
	<div class="card-body p-0">
		<ul class="list-group list-group-flush rounded-bottom-4">
			<?php
				foreach($visits AS $entry) { 
					?>
						<li class="list-group-item d-flex justify-content-between align-items-start">
							<span class="ms-2">
								<?php print date('d.m.Y', strtotime($entry->date)); ?>
							</span>
						</li>
					<?php
				}
			?>
		</ul>
	</div>
</div>