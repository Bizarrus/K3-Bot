<div class="card mt-3">
	<div class="card-header pb-<?php print (empty($profile->readme) || empty($profile->readme->list->items) ? 2 : 0); ?>">
		Readme
		<?php
			if(!(empty($profile->readme) || empty($profile->readme->list->items))) {
				?>
					<ul class="nav nav-pills" id="pills-tab" role="tablist">
						<li class="nav-item" role="presentation">
							<button class="nav-link active" id="pills-preview-topic-tab" data-bs-toggle="pill" data-bs-target="#pills-preview-topic" type="button" role="tab" aria-controls="pills-preview-topic" aria-selected="true">Vorschau</button>
						</li>
						<li class="nav-item" role="presentation">
							<button class="nav-link" id="pills-source-topic-tab" data-bs-toggle="pill" data-bs-target="#pills-source-topic" type="button" role="tab" aria-controls="pills-source-topic" aria-selected="false">Code</button>
						</li>
					</ul>
				<?php
			}
		?>
	</div>
	<div class="card-body">
		<?php
			if(empty($profile->readme) || empty($profile->readme->list->items)) {
				print('Nicht vorhanden.');
			} else {
				?>
				
				<div class="tab-content" id="pills-tabContent">
					<div class="tab-pane jsonformat show active" id="pills-preview-topic" role="tabpanel" aria-labelledby="pills-preview-topic-tab" tabindex="0"><?php print json_encode($profile->readme); ?></div>
					<div class="tab-pane" id="pills-source-topic" role="tabpanel" aria-labelledby="pills-source-topic-tab" tabindex="0">
						<div class="grow-wrap">
							<textarea class="form-control"></textarea>
						</div>
					</div>
				</div>
				<?php
			}
		?>
	</div>
</div>