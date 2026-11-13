<?php
	$label = isset( $attributes['label'] ) ? $attributes['label'] : '';
	$placeholder = isset( $attributes['placeholder'] ) ? $attributes['placeholder'] : '';
	$showLabel = !empty( $attributes['showLabel'] );
?>
<div class="wp-block-scm-live-search"
	label="<?php print esc_attr( $label ); ?>"
	placeholder="<?php print esc_attr( $placeholder ); ?>"
	showLabel="<?php print $showLabel ? 1 : 0; ?>"
></div>
