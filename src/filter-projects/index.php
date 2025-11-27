<?php
	// postType,	restEndpoint,	filters,	filterLabels,	limit,	moreButton,	showFilters,	showProjectsLink
	extract( $attributes );

	// for creating terms 
	// $everythingFilters = new Project_Filters_API();
?>
<div 
	posttype="<?php print $postType; ?>" 
	restendpoint="<?php print $restEndpoint; ?>" 
	limit="<?php print $limit; ?>" 
	morebutton="<?php print $moreButton; ?>" 
	showfilters="<?php print $showFilters; ?>" 
	filters="<?php print implode( ",", $filters ); ?>"
	filterlabels='<?php print wp_json_encode( $filterLabels ); ?>'
	showprojectslink="<?php print $showPorjectsLink; ?>" 
	class="wp-block-six-character-media-everything-filter"
>
	<div class="posts-filters-container posts-limit-<?php print $limit; ?>">
		<div class="posts-header">
			<div class="posts-filters-controls">
				<div class="filter-group">
					<span class="posts-results">Showing <?php print $limit; ?> posts in</span>
					<?php foreach( $filters as $filter ) {
						$terms = get_terms(array(
							'taxonomy' => $filter,
							'hide_empty' => false,
            ));
						if ( !is_wp_error( $terms ) ) {
							// term header
							print "<div class=\"filter-dropdown filter-dropdown-{$filter}\">";
								print "<button class=\"filter-label\">{$filterLabels[$filter]}</button>";
							print "</div>";
						}
					} ?>
				</div>
			</div>
		</div>
		<div class="post-grid">
			<?php
				// loop through posts
				$the_query = new WP_Query( [
					'post_type' => $postType,
					'posts_per_page' => $limit
				] );
				if( $the_query->have_posts() ) {
					while ( $the_query->have_posts() ) {
						$the_query->the_post();
						print "<div class=\"post-card type-{$postType}\">";
							// output posts
							print everything_filter_formatted_default( get_the_ID() );
						print "</div>";
					}
				}
			?>
		</div>
		<?php if( $moreButton === 1 ) { ?>
			<div class="post-load-more">
				<button class="load-more-btn">show more posts</button>
				<p>Showing <?php print $limit; ?> out of <?php print $the_query->found_posts; ?> posts</p>
			</div>
		<?php } ?>
	</div>
</div>


