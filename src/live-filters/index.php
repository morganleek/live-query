<?php
	extract( $attributes );
	// print "<pre>" . print_r( $attributes, true ) . "</pre>";

	// Build labels in the order set in the editor (filters), not the order labels were added
	$orderedLabels = array();
	foreach( $filters as $filter ) {
		$orderedLabels[$filter] = isset( $filterLabels[$filter] ) ? $filterLabels[$filter] : '';
	}
?>
<div class="wp-block-scm-live-filters"
	filters='<?php print esc_attr( wp_json_encode( (object) $orderedLabels ) ); ?>'
	multiSelect='<?php print $multiSelect ? 1 : 0; ?>'
	hideEmpty='<?php print $hideEmpty ? 1 : 0; ?>'
	layout='<?php print $layout; ?>'
></div>
