<?php
	$message = isset( $attributes['message'] ) ? $attributes['message'] : '{count} results found';
	$singularMessage = isset( $attributes['singularMessage'] ) ? $attributes['singularMessage'] : '{count} result found';
	$noResultsMessage = isset( $attributes['noResultsMessage'] ) ? $attributes['noResultsMessage'] : 'No results found';
	$position = isset( $attributes['position'] ) ? $attributes['position'] : 'bottom-right';
	$duration = isset( $attributes['duration'] ) ? floatval( $attributes['duration'] ) : 4;
?>
<div class="wp-block-scm-live-toast"
	message="<?php print esc_attr( $message ); ?>"
	singularMessage="<?php print esc_attr( $singularMessage ); ?>"
	noResultsMessage="<?php print esc_attr( $noResultsMessage ); ?>"
	position="<?php print esc_attr( $position ); ?>"
	duration="<?php print esc_attr( $duration ); ?>"
></div>
