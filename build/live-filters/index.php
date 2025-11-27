<?php
	extract( $attributes );
?>	
<div class="wp-block-scm-live-filters"
	filters='<?php print wp_json_encode( $filterLabels ); ?>'
	multiSelect='<?php print $multiSelect ? 1 : 0; ?>'
></div>