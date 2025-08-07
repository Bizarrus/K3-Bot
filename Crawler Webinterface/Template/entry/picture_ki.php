<div class="col">
	<a class="card text-decoration-none" target="_blank" href="<?php print $template->url('/user/' . $picture->id); ?>">
		<div class="card-header">
			<?php
				print htmlentities($picture->nickname); ?> (<?php
				print $picture->age;
				
				switch($picture->gender) {
					case 'MALE':
						print('<i class="bi bi-gender-male ms-1"></i>');
					break;
					case 'FEMALE':
						print('<i class="bi bi-gender-female ms-2"></i>');
					break;
					case 'NONBINARY_HE':
					case 'NONBINARY_SHE':
						print('<i class="bi bi-gender-trans ms-2"></i>');
					break;
				}
			?>)
		</div>
		<div class="card-body text-bg-dark p-0 rounded-bottom-4 overflow-hidden">
			<?php
				$classes = $picture->ki_data;
				usort($classes, function($a, $b) {
					return $b->{'score'} <=> $a->{'score'};
				});
				
				$score = min(100, max(0, $classes[0]->score * 100));
				$red   = round(255 * ($score / 100));
				$green = round(255 * (1 - $score / 100));
				$blue  = 0;
				$color = "rgba($red, $green, $blue, 0.8)";
			?>
			<ai-preview>
				<svg xmlns="http://www.w3.org/2000/svg" width="98" height="28" viewBox="0 0 250 250" id="wheel">
					<circle fill="none" cx="125" cy="125" r="100" stroke="<?php echo $color; ?>" stroke-width="20px" stroke-dasharray="630" stroke-dashoffset="<?php print 630 * (1 - $score / 100); ?>" id="outer" />
				</svg>
				<ai-result>
					<h1 style="color: <?php print $color; ?>;"><?php print number_format($score, 2, ',', '.'); ?>%</h1>
					<label>Das Bild ist wahrscheinlich:</label>
					<h2 style="color: <?php print $color; ?>;"><?php print $classes[0]->class; ?></h2>
					<h3 class="badge"></h3>
				</ai-result>
			</ai-preview>
			<img src="<?php print $picture->url; ?>" class="img-fluid object-fit-contain" style="height: 250px; width: 100%;" title="<?php print htmlentities($picture->nickname); ?>">
		</div>
	</a>
</div>