<?php
	extract( $attributes );
	print "<pre>" . print_r( $attributes, true ) . "</pre>";
?>	
<div class="wp-block-scm-live-filters"
	filters='<?php print wp_json_encode( $filterLabels ); ?>'
	multiSelect='<?php print $multiSelect ? 1 : 0; ?>'
	hideEmpty='<?php print $hideEmpty ? 1 : 0; ?>'
	layout='<?php print $layout; ?>'
></div>