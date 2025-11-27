<?php
	if( !isset( $attributes['content'] ) ) {
		return;
	}

	$content = $attributes['content'];
	print "<div class=\"wp-block-scm-live-more\">
		<button class=\"load-more-button\">$content</button>
	</div>";