<?php
	use \AF\Knuddels;
?>
<div class="card mt-3">
	<div class="card-header pb-<?php print (!(empty($comments->self) || empty($comments->others)) ? 2 : 0); ?>">
		Foto-Kommentare
		<?php
			if(!(empty($comments->self) && empty($comments->others))) {
				?>
					<ul class="nav nav-pills" id="pills-tab" role="tablist">
						<li class="nav-item" role="presentation">
							<button class="nav-link active" id="pills-comments-self-tab" data-bs-toggle="pill" data-bs-target="#pills-comments-self" type="button" role="tab" aria-controls="pills-comments-self" aria-selected="true">Bei anderen</button>
						</li>
						<li class="nav-item" role="presentation">
							<button class="nav-link" id="pills-comments-others-tab" data-bs-toggle="pill" data-bs-target="#pills-comments-others" type="button" role="tab" aria-controls="pills-comments-others" aria-selected="false">Von anderen</button>
						</li>
					</ul>
				<?php
			}
		?>
	</div>
	<div class="card-body">
		<?php
			if((empty($comments->self) && empty($comments->others))) {
				print('Nicht vorhanden.');
			} else {
				?>
				<div class="tab-content" id="pills-tabContent">
					<div class="tab-pane jsonformat show active" id="pills-comments-self" role="tabpanel" aria-labelledby="pills-comments-self-tab" tabindex="0">
						<?php
							if(empty($comments->self)) {
								print('Nicht vorhanden.');
							} else {
								foreach($comments->self AS $comment) {
									?>
										<li class="list-group-item d-flex justify-content-between align-items-start">
											<div class="container-fluid">
												<div class="row">
													<strong class="col-2">
														<?php
															if($comment->type === 'PROFILE') {
																?>
																	<a href="<?php print $template->url('/user/' . $comment->author_id); ?>" target="_blank"><?php print $comment->author; ?></a> > <a href="https://photo.knuddels.de/photos-profile.html?d=knuddels.de&id=<?php print Knuddels::escapeNickname($comment->author); ?>">Profilbild</a>
																<?php
															}
														?>
													</strong>
													<span class="col-2">
														<?php print date('d.m.Y H:i:s', strtotime($comment->time_posted)); ?>
													</span>
													<span class="col-8 kcode">
														<?php print $comment->text ?>
													</span>
												</div>
											</div>
										</li>
									<?php
								}
							}
						?>
					</div>
					<div class="tab-pane" id="pills-comments-others" role="tabpanel" aria-labelledby="pills-comments-others-tab" tabindex="0">
						<?php
							if(empty($comments->other)) {
								print('Nicht vorhanden.');
							} else {
								foreach($comments->other AS $comment) {
									?>
										<li class="list-group-item d-flex justify-content-between align-items-start">
											<div class="container-fluid">
												<div class="row">
													<strong class="col-2">
														<?php
															if($comment->type === 'PROFILE') {
																?>
																	<a href="<?php print $template->url('/user/' . $comment->author_id); ?>" target="_blank"><?php print $comment->author; ?></a> > <a href="https://photo.knuddels.de/photos-profile.html?d=knuddels.de&id=<?php print Knuddels::escapeNickname($comment->author); ?>">Profilbild</a>
																<?php
															}
														?>
													</strong>
													<span class="col-2">
														<?php print date('d.m.Y H:i:s', strtotime($comment->time_posted)); ?>
													</span>
													<span class="col-8 kcode">
														<?php print $comment->text ?>
													</span>
												</div>
											</div>
										</li>
									<?php
								}
							}
						?>
					</div>
				</div>
				<?php
			}
		?>
	</div>
</div>