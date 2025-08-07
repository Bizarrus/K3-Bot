<?php
	use \AF\Utils;
?>
<div class="col">
	<a class="card channel text-decoration-none" target="_blank" href="<?php print $template->url('/user/' . $user->id); ?>">
		<div class="card-body p-0 rounded-top-4 overflow-hidden">
			<div class="container">
				<div class="row">
					<?php
						$color		= null;
						$background	= [ 0, 0,0 ];
						$picture	= null;
						
						switch($user->gender) {
							case 'MALE':
								$color		= [ 99, 108, 203 ];
								$background = [ 189, 194, 239 ];
							break;
							case 'FEMALE':
								$color		= [ 203, 95, 100 ];
								$background = [ 239, 188, 189 ];
							break;
							case 'NONBINARY_HE':
							case 'NONBINARY_SHE':
								$color		= [ 138, 211, 153 ];
								$background = [ 201, 301, 216 ];
							break;
							case 'UNKNOWN':
								$color		= [ 117, 117, 117 ];
								$background = [ 198, 198, 198 ];
							break;
						}
						
						if(!empty($user->picture)) {
							$picture = $user->picture;
						}
						
						$style = [
							sprintf('background-color: rgb(%s);', implode(', ', $background))
						];
						
						if(!empty($picture)) {
							$style[] = sprintf('background-image: url(\'%s\');', $picture);
						} else {
							$style[] = sprintf('color: rgb(%s);', implode(', ', $color));
						}
						
						printf('<div class="background" style="%s">%s</div>', implode('', $style), (empty($picture) ? '<i class="bi bi-person-fill"></i>' : ''));
					?>
				</div>
				<div class="row">
					<div class="col p-2 ps-4">
						<strong>
							<?php
								print htmlentities($user->nickname);
							?>
						</strong>
					</div>
				</div>
				<div class="row p-2 pt-0">
					<div class="col">
						<?php
							switch($user->gender) {
								case 'MALE':
									print('<i class="bi bi-gender-male"></i>');
								break;
								case 'FEMALE':
									print('<i class="bi bi-gender-female"></i>');
								break;
								case 'NONBINARY_HE':
								case 'NONBINARY_SHE':
									print('<i class="bi bi-gender-trans"></i>');
								break;
							}
						?>
						<span><?php print $user->age; ?> Jahre alt</span>
					</div>
					<div class="col text-end">
						<strong>Ansehen <i class="bi bi-box-arrow-up-right"></i></strong>
					</div>
				</div>
			</div>
		</div>
	</a>
</div>