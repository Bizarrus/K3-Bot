<?php
	use \AF\Knuddels;
?>
<div class="card">
	<div class="card-header">
		Profilbild
	</div>
	<div class="card-body p-0 overflow-hidden">
		<div class="row">
			<div class="col">
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
					
					if(!empty($pictures[0])) {
						$picture = $template->url('/picture/' . $pictures[0]->id);
					} else if(!empty($user->picture)) {
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
					
					if(empty($picture)) {
						printf('<div class="background" style="%s">%s</div>', implode('', $style), (empty($picture) ? '<i class="bi bi-person-fill"></i>' : ''));
					} else {
						printf('<div class="active"><img src="%s" class="img-fluid object-fit-contain" style="width: 100%%; height: 250px;" /></div>', $picture);
					}
				?>
			</div>
		</div>
		<div class="row">
			<div class="col p-2">
				<strong>Frühere Bilder</strong>
			</div>
		</div>
		<div class="row">
			<div class="col p-2">
				<?php
					if(count($pictures) >= 2) {
							foreach($pictures AS $subpicture) {
								?>
									<img src="<?php print $template->url('/picture/' . $subpicture->id); ?>" class="object-fit-contain" style="width: 100px; height: 100px;" />
								<?php
							}
						}
				?>
			</div>
		</div>
	</div>
	<div class="card-footer">
		<div class="container">
			<div class="row">
				<div class="col">
					<a href="https://photo.knuddels.de/photos-profile.html?d=knuddels.de&id=<?php print Knuddels::escapeNickname($user->nickname); ?>" target="_blank" class="btn btn-primary">Fotoseite öffnen <i class="bi bi-box-arrow-up-right"></i></a>
			
					<a href="https://photo.knuddels.de/photos-comments.html?mode=report&where=<?php print Knuddels::escapeNickname($user->nickname); ?>-pro0vl0p" target="_blank" class="btn btn-primary"><i class="bi bi-exclamation-diamond"></i> Foto Melden <i class="bi bi-box-arrow-up-right"></i></a>
				</div>
				<div class="col text-end">
					<a href="<?php print $picture; ?>" target="_blank" class="btn btn-primary">Bild öffnen <i class="bi bi-box-arrow-up-right"></i></a>
					
					<div class="btn-group dropup">
						<button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
							<i class="bi bi-search"></i> <span>Bildersuche</span>
						</button>
						<ul class="dropdown-menu">
							<li><a class="dropdown-item" data-icon="hive" target="_blank" href="https://bizarrus.github.io/Hive/#analyze/<?php print $picture; ?>">Hive</a></li>
							<li><a class="dropdown-item" data-icon="googleimages" target="_blank" href="https://www.google.com/searchbyimage?image_url=<?php print $picture; ?>&client=app">Google Images</a></li>
							<li><a class="dropdown-item" data-icon="googlelens" target="_blank" href="https://lens.google.com/uploadbyurl?url=<?php print $picture; ?>&hl=en&re=df&st=<?php print time(); ?>&ep=gisbubu">Google Lens</a></li>
							<li><a class="dropdown-item" data-icon="yandex" target="_blank" href="https://yandex.com/images/search?url=<?php print $picture; ?>}&rpt=imageview">Yandex</a></li>
							<li><a class="dropdown-item" data-icon="tineye" target="_blank" href="https://www.tineye.com/search/?url=<?php print $picture; ?>">TinEye</a></li>
							<!--<li><a class="dropdown-item" data-icon="all">Alle</a></li>-->
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
