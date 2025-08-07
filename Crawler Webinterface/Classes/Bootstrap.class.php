<?php
	namespace AF;
	
	use AF\Auth;
	
	class Bootstrap {
		public static function header($title, $icon, $buttons = [], $limits = [], $escape = true) {
			?>
				<header class="page-header d-flex justify-content-between w-100 flex-nowrap align-items-center pt-3 pb-2 px-3 border-bottom">
					<h3 class="d-flex flex-nowrap pe-1">
						<i class="bi text-primary bi-<?php print $icon; ?>"></i> <span class="ps-1"><?php print($escape ? htmlentities($title, ENT_QUOTES, 'UTF-8') : $title); ?></span>
					</h3>
					<?php
						if(!empty($limits) && $limits->{'maximum'} !== -1) {
							?>
								<div class="btn-toolbar mb-2 mb-md-0">
									<span class="badge text-bg-light">Kontigent:</span>
									<span class="badge text-bg-secondary"><?php
										print $limits->{'current'};
									?> / <?php
										if($limits->{'maximum'} === -1) {
											print 'Unlimitiert';
										} else {
											print $limits->{'maximum'};
										}
									?></span>
								</div>
							<?php
						}
					?>
					<div class="btn-toolbar mb-2 mb-md-0">
						<?php
							if(!empty($buttons)) {
								if(count($buttons) >= 2) {
									print('<div class="input-group d-flex flex-nowrap">');
								}
								
								foreach($buttons AS $button) {
									print $button;
								}
								
								if(count($buttons) >= 2) {
									print('</div>');
								}
							}
						?>
					</div>
				</header>
			<?php
		}
		
		public static function alerts($errors, $success) {
			?>
				<div class="row">
					<div class="col selectable">
						<?php
							if(!empty($errors)) {
								self::error(implode('<br />', array_filter($errors, function($value, $key) {
									return !is_array($value) && $value !== 'NULL' && $value !== NULL;
								}, ARRAY_FILTER_USE_BOTH)));
							} else if(!empty($success)) {
								self::success($success);
							}
						?>
					</div>
				</div>
			<?php
		}
		
		public static function success($text) {
			?>
				<div class="alert alert-success" role="alert">
					<p class="pb-0 mb-0"><i class="bi bi-check-circle-fill"></i> <?php print $text; ?></p>
				</div>
			<?php
		}
		
		public static function warn($text) {
			?>
				<div class="alert alert-warning" role="alert">
					<p class="pb-0 mb-0"><i class="bi bi-exclamation-triangle-fill"></i> <?php print $text; ?></p>
				</div>
			<?php
		}
		
		public static function error($text) {
			?>
				<div class="alert alert-danger" role="alert">
					<strong><i class="bi bi-exclamation-octagon-fill"></i> Problem</strong>
					<p class="pb-0 mb-0"><?php print $text; ?></p>
				</div>
			<?php
		}
		
		public static function formEntry($text, $name, $value = '', $additional = null) {
			?>
				<div class="mb-3 row">
					<label for="<?php print $name; ?>" class="col-sm-3 col-form-label"><?php print $text; ?>:</label>
					<div class="col-sm-9">
						<input type="text" class="form-control-plaintext<?php print (isset($_POST['action']) && !empty($errors) ? (array_key_exists($name, $errors) ? ' is-invalid' : '') : ''); ?>" id="<?php print $name; ?>" name="<?php print $name; ?>" value="<?php print(empty($value) ? '' : htmlentities($value , ENT_QUOTES, 'UTF-8')); ?>" READONLY />
						<?php
							if(!empty($additional)) {
								printf('<div id="help_%s" class="form-text">%s</div>', $name, $additional);
							}
						?>
					</div>
				</div>
			<?php
		}
		
		public static function formDate($text, $name, $value = '', $errors = [], $disabled = false) {
			?>
				<div class="mb-3 row">
					<label for="<?php print $name; ?>" class="col-sm-3 col-form-label"><?php print $text; ?>:</label>
					<div class="col-sm-9">
						<input type="date" class="form-control<?php print (isset($_POST['action']) && !empty($errors) ? (array_key_exists($name, $errors) ? ' is-invalid' : '') : ''); ?>" id="<?php print $name; ?>" name="<?php print $name; ?>" value="<?php print(empty($value) ? '' : htmlentities($value , ENT_QUOTES, 'UTF-8')); ?>"<?php print ($disabled ? ' DISABLED READONLY' : ''); ?> />
					</div>
				</div>
			<?php
		}
		
		public static function formInput($text, $name, $value = '', $errors = [], $disabled = false, $additional = null) {
			?>
				<div class="mb-3 row">
					<label for="<?php print $name; ?>" class="col-sm-3 col-form-label"><?php print $text; ?>:</label>
					<div class="col-sm-9">
						<input type="text" class="form-control<?php print (isset($_POST['action']) && !empty($errors) ? (array_key_exists($name, $errors) ? ' is-invalid' : '') : ''); ?>" id="<?php print $name; ?>" name="<?php print $name; ?>" value="<?php print(empty($value) ? '' : htmlentities($value , ENT_QUOTES, 'UTF-8')); ?>"<?php print ($disabled ? ' DISABLED READONLY' : ''); ?> />
						<?php
							if(!empty($additional)) {
								printf('<div id="help_%s" class="form-text">%s</div>', $name, $additional);
							}
						?>
					</div>
				</div>
			<?php
		}
		
		public static function formText($text, $name, $value = '', $errors = [], $disabled = false, $additional = null, $rows = 25) {
			?>
				<div class="mb-3 row">
					<label for="<?php print $name; ?>" class="col-sm-3 col-form-label"><?php print $text; ?>:</label>
					<div class="col-sm-9">
						<textarea type="text" rows="<?php print $rows; ?>" class="form-control<?php print (isset($_POST['action']) && !empty($errors) ? (array_key_exists($name, $errors) ? ' is-invalid' : '') : ''); ?>" id="<?php print $name; ?>" name="<?php print $name; ?>"<?php print ($disabled ? ' DISABLED READONLY' : ''); ?>><?php print(empty($value) ? '' : htmlentities($value , ENT_QUOTES, 'UTF-8')); ?></textarea>
						<?php
							if(!empty($additional)) {
								printf('<div id="help_%s" class="form-text">%s</div>', $name, $additional);
							}
						?>
					</div>
				</div>
			<?php
		}
		
		public static function formNumber($text, $name, $value = 0, $min = null, $max = null, $errors = [], $disabled = false) {
			?>
				<div class="mb-3 row">
					<label for="<?php print $name; ?>" class="col-sm-3 col-form-label"><?php print $text; ?>:</label>
					<div class="col-sm-9">
						<input type="number"<?php print ($min !== NULL ? sprintf(' min="%d"', $min) : '') . ($max !== NULL ? sprintf(' max="%d"', $max) : ''); ?> class="form-control<?php print (isset($_POST['action']) ? (array_key_exists($name, $errors) ? ' is-invalid' : '') : ''); ?>" id="<?php print $name; ?>" name="<?php print $name; ?>" value="<?php print(empty($value) ? 0 : htmlentities($value , ENT_QUOTES, 'UTF-8')); ?>"<?php print ($disabled ? ' DISABLED READONLY' : ''); ?> />
					</div>
				</div>
			<?php
		}
		
		public static function formMail($text, $name, $value = '', $errors = []) {
			?>
				<div class="mb-3 row">
					<label for="<?php print $name; ?>" class="col-sm-3 col-form-label"><?php print $text; ?>:</label>
					<div class="col-sm-9">
						<input type="email" class="form-control<?php print (isset($_POST['action']) && !empty($errors) ? (array_key_exists($name, $errors) ? ' is-invalid' : '') : ''); ?>" id="<?php print $name; ?>" name="<?php print $name; ?>" value="<?php print(empty($value) ? '' : htmlentities($value , ENT_QUOTES, 'UTF-8')); ?>" />
					</div>
				</div>
			<?php
		}
		
		public static function formPassword($text, $name, $errors = [], $additional = null) {
			?>
				<div class="mb-3 row">
					<label for="<?php print $name; ?>" class="col-sm-3 col-form-label"><?php print $text; ?>:</label>
					<div class="col-sm-9">
						<input type="password" class="form-control<?php print (isset($_POST['action']) && !empty($errors) ? (array_key_exists($name, $errors) ? ' is-invalid' : '') : ''); ?>" id="<?php print $name; ?>" name="<?php print $name; ?>" value="" autocomplete="new-password" />
						<?php
							if(!empty($additional)) {
								printf('<div id="help_%s" class="form-text">%s</div>', $name, $additional);
							}
						?>
					</div>
				</div>
			<?php
		}
		
		public static function formSelect($text, $name, $selected = null, $entries = [], $errors = null) {
			?>
				<div class="mb-3 row">
					<label for="<?php print $name; ?>" class="col-sm-3 col-form-label"><?php print $text; ?>:</label>
					<div class="col-sm-9">
						<select class="form-select<?php print (isset($_POST['action']) && !empty($errors) ? (array_key_exists($name, $errors) ? ' is-invalid' : '') : ''); ?>" name="<?php print $name; ?>" id="<?php print $name; ?>">
							<?php
								foreach($entries AS $value => $data) {
									if(is_array($data) || is_object($data)) {
										$attributes = [
											($selected == $value ? ' SELECTED' : '')
										];
										
										if(isset($data->{'attribute'})) {
											foreach($data->{'attribute'} AS $attribute_name => $attribute_value) {
												if(str_contains($attribute_value, '"')) {
													$attributes[] = sprintf('%s=\'%s\'', $attribute_name, $attribute_value);
												} else {
													$attributes[] = sprintf('%s="%s"', $attribute_name, $attribute_value);
												}
											}
										}
										
										printf('<option value="%1$s"%3$s>%2$s</option>', $value, $data->{'title'}, implode(' ', $attributes));
									} else {
										printf('<option value="%1$s"%3$s>%2$s</option>', $value, $data, ($selected == $value ? ' SELECTED' : ''));
									}
								}
							?>
						</select>
					</div>
				</div>
			<?php
		}
		
		public static function formSwitch($text, $name, $checked = false, $additional = null, $errors = [], $form = true, $disabled = false) {
			?>
				<div class="row mb-<?php print ($form ? '3' : '0'); ?>">
					<label for="<?php print $name; ?>" class="col-sm-<?php print ($form ? '3' : '0'); ?> col-form-label"></label>
					<div class="col-sm-<?php print ($form ? '9' : '12'); ?>">
						<div class="form-check form-switch">
							<input class="form-check-input" type="checkbox" role="switch" name="<?php print $name; ?>" id="<?php print $name; ?>" aria-describedby="help_<?php print $name; ?>"<?php print(($checked ? ' CHECKED' : '') . ($disabled ? ' DISABLED' : '')); ?> />
							<label class="form-check-label" for="<?php print $name; ?>"><?php print $text; ?></label>
							<?php
								if(!empty($additional)) {
									printf('<div id="help_%s" class="form-text">%s</div>', $name, $additional);
								}
							?>
						</div>
					</div>
				</div>
			<?php
		}
		
		public static function formUpload($text, $name, $value, $target, $additional = null, $errors = []) {
			?>
				<div class="mb-3 row">
					<label for="<?php print $name; ?>" class="col-sm-3 col-form-label"><?php print $text; ?>:</label>
					<div class="col-sm-9">
						<div class="row">
							<div class="card col-2 ms-3 p-0" style="height: 100px; width: 100px">
								<div class="bg-pattern text-center align-content-center w-100 h-100">
									<img src="<?php print $value; ?>" class="img-fluid" />
								</div>
							</div>
							<div class="col-10">
								<div class="input-group input-group-sm">
									<input type="text" class="form-control<?php print (isset($_POST['action']) && !empty($errors) ? (array_key_exists($name, $errors) ? ' is-invalid' : '') : ''); ?>" id="<?php print $name; ?>" name="<?php print $name; ?>" value="<?php print $value; ?>" />
									<button data-action="upload<?php print $target; ?>" class="btn btn-outline-primary" title="neues Bild hochladen" type="button">
										<i class="bi bi-upload"></i>
									</button>
									<button data-action="uploads<?php print $target; ?>" class="btn btn-outline-primary" title="Hochgeladene Bilder" type="button">
										<i class="bi bi-images"></i>
									</button>
									<button data-action="galery<?php print $target; ?>" class="btn btn-outline-primary" title="Vorgefertigte Bilder" type="button">
										<i class="bi bi-grid-fill"></i>
									</button>
								</div>
							</div>
						</div>
						<?php
							if(!empty($additional)) {
								printf('<div id="help_%s" class="form-text">%s</div>', $name, $additional);
							}
						?>
					</div>
				</div>
			<?php
		}
		
		public static function formColor($text, $name, $value, $additional = null, $errors = []) {
			?>
				<div class="mb-3 row">
					<label for="<?php print $name; ?>" class="col-sm-3 col-form-label"><?php print $text; ?>:</label>
					<div class="col-sm-9">
						<div class="input-group mb-1">
							<input class="form-control form-control-<?php print $name; ?> border-0 rounded-0 p-0" type="<?php print $name; ?>" id="<?php print $name; ?>_chooser" name="<?php print $name; ?>_chooser" value="<?php print $value; ?>" />
							<input class="form-control<?php print (isset($_POST['action']) && !empty($errors) ? (array_key_exists($name, $errors) ? ' is-invalid' : '') : ''); ?>" type="text" id="<?php print $name; ?>" name="<?php print $name; ?>" value="<?php print $value; ?>" />
						</div>
					</div>
				</div>
			<?php
		}
		
		public static function formButtons($save = true, $cancel = true, $reload = true) {
			?>
			</section>
			<section div class="container-fluid">
				<?php
					if(Auth::hasPermission('System.Administration.Access.Reload') && $reload) {
						?>
							<div class="mb-3 row border-top pt-3">
								<div class="d-none d-sm-block col-sm-3"></div>
								<div class="col-12 col-sm-9 px-3">
									<div class="form-check form-switch">
										<input class="form-check-input" type="checkbox" role="switch" name="reload" id="reload" aria-describedby="help_reload" aria-expanded="false" />
										<label class="form-check-label" for="reload">Chatserver aktualisieren</label>
										<div id="help_reload" class="form-text">
											Wenn diese Option aktiviert wird, wird der Chatserver mit den neuen Daten überschrieben. Die Änderungen sind danach sofort verfügbar.
										</div>
									</div>
								</div>
							</div>
							<div class="mb-3 row text-nowrap pt-3">
						<?php
					} else {
						?>
							<div class="mb-3 row text-nowrap border-top pt-3">
						<?php
					}
				?>
					<div class="d-none d-sm-block col-sm-3"></div>
					<div class="col-6 col-sm-4 px-3">
						<?php
							if($cancel) {
								?>
									<button type="submit" name="action" value="cancel" class="btn btn-outline-danger"><i class="bi bi-x-square-fill"></i> Abbrechen</button>
								<?php
							}
						?>
					</div>
					<div class="col-6 col-sm-5 px-3 d-flex justify-content-end">
						<?php
							if($save) {
								?>
									<button type="submit" name="action" value="save" class="btn btn-success"><i class="bi bi-floppy"></i> Speichern</button>
								<?php
							}
						?>
					</div>
				</div>
			<?php
		}
	}
?>