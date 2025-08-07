<?php
	use \AF\Utils;
?>
<div class="col">
	<a class="card channel text-decoration-none" target="_blank" href="<?php print $template->url('/channel/' . $channel->channel_id); ?>">
		<div class="card-header">
			<?php
				switch($channel->type) {
					case 'USER':
						print('<i class="bi bi-person-fill"></i> ');
					break;
					case 'SYSTEM':
						print('<i class="bi bi-hash"></i> ');
					break;
					case 'TEMP':
						print('<i class="bi bi-asterisk"></i> ');
					break;
				}
				
				print htmlentities($channel->name);
				
				if(!(empty($channel->restrictions) || empty($channel->restrictions->values))) {
					print(' <i class="bi bi-shield-exclamation text-danger"></i> ');
				}
			?>
		</div>
		<div class="card-body p-0 rounded-bottom-4 overflow-hidden">
			<div class="container">
				<div class="row">
					<?php
						$background	= null;
						$color		= null;
						
						if(!empty($channel->background) && $channel->background !== 'null') {
							$background = $channel->background->url;
						}
						
						if(!empty($channel->color_background)) {
							$color = Utils::RGBtoHex($channel->color_background);
						}
							
						printf('<div class="col-7 background" style="background-color: %s; background-image: url(\'%s\');"></div>', $color, $background);
					?>
					<div class="col-5 p-3">
						<div class="text-warning">
							<?php
								if(empty($channel->stars)) {
									$channel->stars = 0;
								}
								
								$fullStars	= floor($channel->stars);
								$halfStar	= ($channel->stars - $fullStars) >= 0.5;
								
								for($i = 0; $i < $fullStars; $i++) {
									print('<i class="bi bi-star-fill"></i>');
								}
								
								if($halfStar) {
									print('<i class="bi bi-star-half"></i>');
								}
								
								for($i = 0; $i < (5 - $fullStars - ($halfStar ? 1 : 0)); $i++) {
									print('<i class="bi bi-star"></i>');
								}
							?>
						</div>
						<?php
							if($channel->erotic === 'YES') {
								print('<p><kbd class="text-bg-danger">Erotik</kbd></p>');
							}
						?>
					</div>
				</div>
			</div>
		</div>
	</a>
</div>