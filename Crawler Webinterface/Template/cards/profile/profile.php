<?php
	use \AF\Knuddels;
?>
<div class="card">
	<div class="card-header">
		Einträge
	</div>
	<div class="card-body p-0">
		<ul class="list-group list-group-flush rounded-bottom-4">
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-balloon ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Hobbys
						</strong>
						<span class="col">
							<?php
								if(empty($profile->hobbies) || $profile->hobbies === '[]') {
									
								} else {
									printf('<span class="badge text-bg-secondary">%s</span>', implode('</span>, <span class="badge text-bg-secondary">', $profile->hobbies));
								}
							?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-music-note-beamed ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Musik
						</strong>
						<span class="col">
							<?php
								if(empty($profile->music) || $profile->music === '[]') {
									
								} else {
									printf('<span class="badge text-bg-secondary">%s</span>', implode('</span>, <span class="badge text-bg-secondary">', $profile->music));
								}
							?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-film ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Filme
						</strong>
						<span class="col">
							<?php
								if(empty($profile->movies) || $profile->movies === '[]') {
									
								} else {
									printf('<span class="badge text-bg-secondary">%s</span>', implode('</span>, <span class="badge text-bg-secondary">', $profile->movies));
								}
							?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-collection-play ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Serien
						</strong>
						<span class="col">
							<?php
								if(empty($profile->series) || $profile->series === '[]') {
									
								} else {
									printf('<span class="badge text-bg-secondary">%s</span>', implode('</span>, <span class="badge text-bg-secondary">', $profile->series));
								}
							?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-book ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Bücher
						</strong>
						<span class="col">
							<?php
								if(empty($profile->books) || $profile->books === '[]') {
									
								} else {
									printf('<span class="badge text-bg-secondary">%s</span>', implode('</span>, <span class="badge text-bg-secondary">', $profile->books));
								}
							?>
						</span>
					</div>
				</div>
			</li>
			<li class="list-group-item d-flex justify-content-between align-items-start">
				<i class="bi bi-flag ms-2"></i>
				<div class="me-auto ps-4 container">
					<div class="row">
						<strong class="col">
							Sprachen
						</strong>
						<span class="col">
							<?php
								if(empty($profile->languages) || $profile->languages === '[]') {
									
								} else {
									printf('<span class="badge text-bg-secondary">%s</span>', implode('</span>, <span class="badge text-bg-secondary">', $profile->languages));
								}
							?>
						</span>
					</div>
				</div>
			</li>
		</ul>
	</div>
</div>