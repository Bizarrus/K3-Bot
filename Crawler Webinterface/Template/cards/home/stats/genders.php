<div class="card">
	<div class="card-header">
		Statistik: Geschlechter
	</div>
	<div class="card-body p-0">
		<ul class="list-group list-group-flush rounded-bottom-4">
			<?php
				foreach([
					(object) [
						'name'	=> 'MALE',
						'icon'	=> 'gender-male',
						'label'	=> 'Männer',
						'value'	=> $statistics->male
					],
					(object) [
						'name'	=> 'FEMALE',
						'icon'	=> 'gender-female',
						'label'	=> 'Frauen',
						'value'	=> $statistics->female
					],
					(object) [
						'name'	=> 'TRANS',
						'icon'	=> 'gender-trans',
						'label'	=> 'Trans',
						'value'	=> ($statistics->binary_he + $statistics->binary_she)
					],
					(object) [
						'name'	=> 'UNKNOWN',
						'icon'	=> 'question',
						'label'	=> 'Unbekannte',
						'value'	=> $statistics->unknown
					]
				] AS $entry) {
					?>
						<li class="list-group-item d-flex justify-content-between align-items-start">
							<i class="bi bi-<?php print $entry->icon; ?> ms-2"></i>
							<span class="me-auto ps-4">
								<strong data-name="count:<?php print $entry->name; ?>"><?php print number_format($entry->value, 0, ',', '.'); ?></strong> <?php print $entry->label; ?>
							</span>
						</li>
					<?php
				}
			?>
		</ul>
	</div>
</div>