<?php
	use \AF\Knuddels;
?>
<div class="card mt-3">
	<div class="card-header">
		Administration
	</div>
	<div class="card-body p-0">
		<ul class="list-group list-group-flush rounded-bottom-4">
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto container">
					<div class="row">
						<strong class="col">
							Moderatoren
						</strong>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto container">
					<div class="row">
						<span class="col">
							<?php
								if(empty($channel->moderators) || $channel->moderators === '[]') {
									print('Keine');
								} else {
									foreach($channel->moderators AS $index => $moderator) {
										$id = Knuddels::getUserID($moderator);
										
										if($id === null) {
											print($moderator);
										} else {
											printf('<a href="%s">%s</a>', $template->url('/user/' . $id), $moderator);
										}
										
										if($index + 1 < count($channel->moderators)) {
											print ', ';
										}
									}
								}
							?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto container">
					<div class="row">
						<strong class="col">
							Channel-Leitung
						</strong>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<div class="me-auto container">
					<div class="row">
						<span class="col">
							<?php
								if(empty($channel->management) || $channel->management === '[]') {
									print('Keine');
								} else {
									foreach($channel->management AS $index => $management) {
										$id = Knuddels::getUserID($management);
										
										if($id === null) {
											print($management);
										} else {
											printf('<a href="%s">%s</a>', $template->url('/user/' . $id), $management);
										}
										
										if($index + 1 < count($channel->management)) {
											print ', ';
										}
									}
								}
							?>
						</span>
					</div>
				</div>
			</li>
		</ul>
	</div>
</div>