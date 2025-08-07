<?php
	$template->header();
?>
<div class="container-fluid d-flex flex-column vh-100 vh-min-100 vh-max-100">
	<div>
		<a class="icon-link my-3" href="<?php print $template->url('/'); ?>">
			<i class="bi bi-arrow-left"></i> Zurück
		</a>
	</div>
	<div class="d-flex flex-column flex-grow-1 pb-3" style="height: calc(100% - 130px)">
		 <div class="card d-flex flex-column flex-grow-1 h-100">
			<div class="card-header">
				Readmes (<span data-name="readmes:count">0</span>)
			</div>
			<div class="card-body d-flex flex-column p-0 overflow-hidden flex-grow-1 h-100">
				<div id="readmes" class="d-flex flex-column flex-grow-1 h-100" data-loading="true">
					<div class="loader d-flex justify-content-center align-items-center" style="height: 3rem;">
						<div class="spinner-border" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					</div>
					<ul class="content flex-grow-1 h-100 overflow-auto d-flex flex-column p-3 m-0"></ul>
				</div>
			</div>
			<div class="card-footer text-center">
				<button class="btn btn-primary" data-action="next">Weitere</button>
			</div>
		</div>
	</div>
</div>

<template id="readme">
	<li class="entry list-group-item p-0 d-flex justify-content-between align-items-start list-group-item-action align-items-stretch border-bottom border-secondary-subtle">
		<div class="d-flex justify-content-between align-items-start list-group-item-action align-items-stretch text-decoration-none">
			<div data-name="id" class="p-2 small align-self-start text-warning text-end" style="width: 100px;">
				$ID
			</div>
			<div data-name="nickname" class="p-2 fw-bold" style="width: 280px;" role="button">
				$NICKNAME
			</div>
			<div class="p-2 me-auto text-start flex-fill selectable">
				<input data-name="readme" class="form-control-sm form-control-plaintext" type="text" value="$README" />
			</div>
			<div data-name="flags" class="p-2">
				$FLAGS
			</div>
		</div>
	</li>
</template>
<?php
	$template->footer();
?>