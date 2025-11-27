<?php
	if( !isset( $attributes['content'] ) ) {
		return;
	}

	$content = $attributes['content'];
	print "<div class=\"wp-block-scm-live-more\" content=\"$content\"></div>";