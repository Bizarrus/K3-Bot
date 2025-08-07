<div class="card d-flex flex-column flex-grow-1 h-100">
	<div class="card-header">
		Filter
	</div>
	<div class="card-body d-flex flex-column p-0 overflow-hidden flex-grow-1 h-100">
		<form method="get">
			<div class="row">
				<div class="col">
					<div class="input-group m-3">
						<strong class="px-3 py-2">Suche</strong>
						<input type="text" class="form-control rounded-start-3" name="search" value="<?php print $search; ?>" placeholder="Suchbegriff..." />
						<button type="submit" class="btn btn-dark">
							<i class="bi bi-search"></i>
						</button>
					</div>
				</div>
				<div class="col">
					<div class="input-group m-3">
						<strong class="px-3 py-2">Alter</strong>
						<input type="number" class="form-control small" value="<?php print(!empty($age['from']) ? $age['from'] : 16); ?>" min="16" max="99" />
						<div class="doublerange">
							<input type="range" class="form-range" name="age[from]" value="<?php print(!empty($age['from']) ? $age['from'] : 16); ?>" min="16" max="99" step="1" />
							<input type="range" class="form-range" name="age[to]" value="<?php print(!empty($age['to']) ? $age['to'] : 99); ?>" min="16" max="99" step="1" />
						</div>
						<input type="number" class="form-control small" value="<?php print(!empty($age['to']) ? $age['to'] : 99); ?>" min="16" max="99" />
					</div>
				</div>
				<div class="col">
					<div class="input-group my-3">
						<strong class="px-3 py-2">Geschlecht</strong>
						
						<input type="checkbox" class="btn-check" id="gender_male" name="gender[]" value="male" autocomplete="off"<?php print ($gender === null || in_array('male', $gender) ? ' CHECKED' : '');?> />
						<label class="btn btn-outline-success rounded-start-3" for="gender_male">
							<i class="bi bi-gender-male"></i>
						</label>
						
						<input type="checkbox" class="btn-check" id="gender_female" name="gender[]" value="female" autocomplete="off"<?php print ($gender === null || in_array('female', $gender) ? ' CHECKED' : '');?> />
						<label class="btn btn-outline-success" for="gender_female">
							<i class="bi bi-gender-female"></i>
						</label>
						
						<input type="checkbox" class="btn-check" id="gender_trans" name="gender[]" value="trans" autocomplete="off"<?php print ($gender === null || in_array('trans', $gender) ? ' CHECKED' : '');?> />
						<label class="btn btn-outline-success" for="gender_trans">
							<i class="bi bi-gender-trans"></i>
						</label>
						
						<input type="checkbox" class="btn-check" id="gender_unknown" name="gender[]" value="unknown" autocomplete="off"<?php print ($gender === null || in_array('unknown', $gender) ? ' CHECKED' : '');?> />
						<label class="btn btn-outline-success rounded-end-3" for="gender_unknown">
							<i class="bi bi-question"></i>
						</label>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>