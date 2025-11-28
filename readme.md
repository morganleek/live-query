### Filter Projects
Contributors:      Morgan Leek
Tags:              block
Tested up to:      6.7
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Live Query is a Gutenberg block for loading posts via AJAX with dynamic taxonomy filters

Use the filter `live_query_formatted` to change the appearance of your content.
```php
function live_query_formatted_default( $post_id ) {
    // featured image 
    $post_thumbnail = ( has_post_thumbnail( $post_id ) ) ? "<div class=\"post-image\">" . 
        "<a href=\"" . get_permalink( $post_id ) . "\">" . 
            get_the_post_thumbnail( $post_id, 'full' ) . 
        "</a>" . 
    "</div>" : "";

    return $post_thumbnail . "<div class=\"post-content\">" . 
        "<h6 class=\"post-title\">" . 
            "<a href=\"" . get_permalink( $post_id ) . "\">" . get_the_title($post_id) . "</a>" . 
        "</h6>" . 
        "<div class=\"post-excerpt\">" . get_the_excerpt( $post_id ) . "</div>" . 
        "<a href=\"" . get_permalink( $post_id ) . "\" class=\"post-link\">" . 
            "<span class=\"label\">explore the post</span>" . 
        "</a>" . 
    "</div>";
}

add_filter( "live_query_formatted", "my_live_query_formatted", 20, 1 );
```