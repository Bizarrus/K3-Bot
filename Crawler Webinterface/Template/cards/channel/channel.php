<?php
	use \AF\Knuddels;
?>
<div class="card">
	<div class="card-header">
		Channel
	</div>
	<div class="card-body p-0">
		<ul class="list-group list-group-flush rounded-bottom-4">
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-hash ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							ID
						</strong>
						<span class="col">
							<?php print $channel->channel; ?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-alphabet ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Name
						</strong>
						<span class="col">
							<?php print $channel->name; ?>
						</span>
					</div>
				</div>
			</li>
			<?php
				if(!empty($channel->type)) {
					?>
						<li class="list-group-item d-flex justify-content-between align-items-start">
							<i class="bi bi-asterisk ms-2"></i>
							<div class="me-auto ps-4 container">
								<div class="row">
									<strong class="col">
										Typ
									</strong>
									<span class="col">
										<?php
											switch($channel->type) {
												case 'USER':
													print('MyChannel');
												break;
												case 'SYSTEM':
													print('Systemchannel');
												break;
												case 'TEMP':
													print('Temporärer Channel');
												break;
											}
										?>
									</span>
								</div>
							</div>
						</li>
					<?php
				}
			?>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-alphabet ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Erotikchannel
						</strong>
						<span class="col">
							<?php print $channel->erotic; ?>
						</span>
					</div>
				</div>
			</li>
			<?php
				if(!empty($channel->owner)) {
					?>
						<li class="list-group-item d-flex justify-content-between align-items-start">
							<i class="bi bi-alphabet ms-2"></i>
							<div class="me-auto ps-4 container">
								<div class="row">
									<strong class="col">
										Besitzer
									</strong>
									<span class="col">
										<?php
											$id = Knuddels::getUserID($channel->owner);
													
											if($id === null) {
												print($channel->owner);
											} else {
												printf('<a href="%s">%s</a>', $template->url('/user/' . $id), $channel->owner);
											}							
										?>
									</span>
								</div>
							</div>
						</li>
					<?php
				}
				
				if(!empty($channel->time_registred)) {
					?>
						<li class="list-group-item d-flex justify-content-between align-items-start">
							<i class="bi bi-calendar-plus ms-2"></i>
							<div class="me-auto ps-4 container">
								<div class="row">
									<strong class="col">
										MyChannel erstellt
									</strong>
									<span class="col">
										Am <?php print date('d.m.Y', strtotime($channel->time_registred)); ?> um <?php print date('H:i', strtotime($channel->time_registred)); ?> Uhr
									</span>
								</div>
							</div>
						</li>
					<?php
				}
			?>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-clock ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Zuletzt aktualisiert
						</strong>
						<span class="col">
							Am <?php print date('d.m.Y', strtotime($channel->time_updated)); ?> um <?php print date('H:i', strtotime($channel->time_updated)); ?> Uhr
						</span>
					</div>
				</div>
			</li>
		</ul>
	</div>
</div>