<div class="card">
	<div class="card-header pb-<?php print (empty($channel->info) ? 2 : 0); ?>">
		Info
		<?php
			if(!empty($channel->info)) {
				?>
					<ul class="nav nav-pills" id="pills-tab" role="tablist">
						<li class="nav-item" role="presentation">
							<button class="nav-link active" id="pills-preview-tab" data-bs-toggle="pill" data-bs-target="#pills-preview" type="button" role="tab" aria-controls="pills-preview" aria-selected="true">Vorschau</button>
						</li>
						<li class="nav-item" role="presentation">
							<button class="nav-link" id="pills-source-tab" data-bs-toggle="pill" data-bs-target="#pills-source" type="button" role="tab" aria-controls="pills-source" aria-selected="false">Code</button>
						</li>
					</ul>
				<?php
			}
		?>
	</div>
	<div class="card-body">
		<?php
			if(empty($channel->info)) {
				print('Nicht vorhanden.');
			} else {
				?>
				
				<div class="tab-content" id="pills-tabContent">
					<div class="tab-pane kcode show active" id="pills-preview" role="tabpanel" aria-labelledby="pills-preview-tab" tabindex="0"><?php print $channel->info; ?></div>
					<div class="tab-pane" id="pills-source" role="tabpanel" aria-labelledby="pills-source-tab" tabindex="0">
						<div class="grow-wrap">
							<textarea class="form-control"><?php print $channel->info; ?></textarea>
						</div>
					</div>
				</div>
				<?php
			}
		?>
	</div>
</div>