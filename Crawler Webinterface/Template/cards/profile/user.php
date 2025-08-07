<?php
	use \AF\Knuddels;
?>
<div class="card">
	<div class="card-header">
		Profil
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
							<?php print $user->id; ?>
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
							<?php print $user->nickname; ?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-asterisk ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Geschlecht
						</strong>
						<span class="col">
							<?php
								switch($user->gender) {
									case 'MALE':
										print('Männlich <i class="bi bi-gender-male"></i>');
									break;
									case 'FEMALE':
										print('Weiblich <i class="bi bi-gender-female"></i>');
									break;
									case 'NONBINARY_HE':
										print('<i class="bi bi-gender-trans ms-2"></i> nicht-binär (Er)');
									break;
									case 'NONBINARY_SHE':
										print('<i class="bi bi-gender-trans ms-2"></i> nicht-binär (Sie)');
									break;
									case 'UNKNOWN':
										print('Unbekannt <i class="bi bi-question"></i>');
									break;
								}
							?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-calendar ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Alter
						</strong>
						<span class="col">
							<?php print $user->age; ?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-cake ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Geburtsdatum
						</strong>
						<span class="col">
							<?php
								if(empty($profile->birthday) || $profile->birthday === '1970-01-01') {
									print('Nicht angegeben');
								} else {
									print date('d.m.Y', strtotime($profile->birthday));
								}
							?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-asterisk ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Status
						</strong>
						<span class="col">
							<?php
								if(!$profile) {
									print('Unbekannt');
								} else {
									switch($profile->status) {
										case 'SYSADMIN':
											print('Sysadmin');
										break;
										case 'ADMIN':
											print('Admin');
										break;
										case 'HONOR':
											print('Ehrenz');
										break;
										case 'STAMMI':
											print('Stammi');
										break;
										case 'Family':
											print('Family');
										break;
									}
								}
							?>
						</span>
					</div>
				</div>
			</li>
			<?php
				if(!empty($user->time_updated)) {
					?>
						<li class="list-group-item d-flex justify-content-between align-items-start">
							<i class="bi bi-clock ms-2"></i>
							<div class="me-auto ps-4 container">
								<div class="row">
									<strong class="col">
										Zuletzt aktualisiert
									</strong>
									<span class="col">
										Am <?php print date('d.m.Y', strtotime($user->time_updated)); ?> um <?php print date('H:i', strtotime($user->time_updated)); ?> Uhr
									</span>
								</div>
							</div>
						</li>
					<?php
				}
			?>
		</ul>
	</div>
</div>