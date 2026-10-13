<?php
/**
 * REST API Handler for Project Filters
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Project_Filters_API {

    /**
     * Register REST API routes
     */
    public function register_routes() {
        // Get filtered projects
        register_rest_route('live-query/v1', '/posts', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_posts'),
            'permission_callback' => '__return_true',
            'args' => array(
                'page' => array(
                    'default' => 1,
                    'sanitize_callback' => 'absint',
                ),
                'per_page' => array(
                    'default' => 6,
                    'sanitize_callback' => 'absint',
                ),
                'tax_query' => array(
                    'default' => '',
                    // 'sanitize_callback' => 'rest_sanitize_array'
                ),
                'static_tax_query' => array(
                    'default' => '',
                ),
                'post_type' => array(
                    'default' => '',
                    'sanitize_callback' => 'sanitize_text_field',
                ),
                'date_query' => array(
                    'default' => ''
                ),
                'search' => array(
                    'default' => '',
                    'sanitize_callback' => 'sanitize_text_field',
                )
                // 'industry' => array(
                //     'default' => '',
                //     'sanitize_callback' => 'sanitize_text_field',
                // ),
            ),
        ));

        // Get all service taxonomy terms
        register_rest_route('live-query/v1', '/terms', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_terms'),
            'permission_callback' => '__return_true',
            'args' => array(
                'taxonomy' => array(
                    'default' => '',
                    'sanitize_callback' => 'sanitize_text_field',
                ),
                'hide_empty' => array(
                    'default' => false,
                    'sanitize_callback' => 'rest_sanitize_boolean',
                )
            )
        ));

        // // Get all service taxonomy terms
        // register_rest_route('live-query/v1', '/services', array(
        //     'methods' => 'GET',
        //     'callback' => array($this, 'get_services'),
        //     'permission_callback' => '__return_true',
        // ));

        // // Get all industry taxonomy terms
        // register_rest_route('live-query/v1', '/industries', array(
        //     'methods' => 'GET',
        //     'callback' => array($this, 'get_industries'),
        //     'permission_callback' => '__return_true',
        // ));
    }

    /**
     * Get filtered projects
     */
    public function get_posts($request) {
        $page = $request->get_param('page');
        $per_page = $request->get_param('per_page');
        $service = $request->get_param('service');
        $industry = $request->get_param('industry');
        $exclude = $request->get_param('exclude');
        $post_type = $request->get_param('post_type');
        $tax_query = $request->get_param('tax_query');
        $static_tax_query = $request->get_param('static_tax_query');
        $date_query = $request->get_param('date_query') ?: [];
        $search = trim( (string) $request->get_param('search') );

        if( empty( $post_type ) ) {
            return new WP_REST_Response(array(
                'posts' => [],
                'total' => 0,
                'total_pages' => 1,
                'current_page' => 1,
            ), 200);
        }

        $orderby = apply_filters( 'live-query-' . $post_type . '-orderby', 'date' );
        $order = apply_filters( 'live-query-' . $post_type . '-order', 'DESC' );        

        // Build query args
        $args = array(
            'post_type' => $post_type,
            'posts_per_page' => $per_page,
            'paged' => $page,
            'post_status' => 'publish',
            'orderby' => $orderby,
            'order' => $order,
            'date_query' => $date_query,
        );

        // Check if there is a post to exclude
        // i.e. on a single project page
        if (!empty($exclude)) {
            $args['post__not_in'] = [$exclude];
            $args['orderby'] = 'rand';
        }

        // Add tax query if filters are set
        $tax_query_params = array();

        if (!empty($tax_query)) {
            foreach( $tax_query as $k => $v ) {
                if( empty( $v ) ) {
                    continue;
                }
                $tax_query_params[] = array(
                    'taxonomy' => $k,
                    'field' => 'slug',
                    'terms' => $v,
                );
            }
        }

        // Static taxonomy filter set in the block editor; always applied
        // and independent of the visitor-toggled tax_query above.
        if (!empty($static_tax_query)) {
            foreach( $static_tax_query as $k => $v ) {
                if( empty( $v ) ) {
                    continue;
                }
                $tax_query_params[] = array(
                    'taxonomy' => $k,
                    'field' => 'slug',
                    'terms' => $v,
                );
            }
        }

        if (!empty($terms)) {
            // $tax_query[] = array(
            //     'taxonomy' => 'industry',
            //     'field' => 'slug',
            //     'terms' => $industry,
            // );
        }
        
        if( $post_type === 'product' ) {
            $tax_query_params[] = array(
                'taxonomy' => 'product_visibility',
                'field'    => 'name',
                'terms'    => 'exclude-from-catalog',
                'operator' => 'NOT IN',
            );
        }

        if (!empty($tax_query_params)) {
            $args['tax_query'] = $tax_query_params;
            if (count($tax_query_params) > 1) {
                $args['tax_query']['relation'] = 'AND';
            }
        }


        // Keyword search across title, content and taxonomy terms; applied by filter_search_where()
        if ( $search !== '' ) {
            $args['live_query_search'] = $search;
        }

        // Override any arg
        $args = apply_filters( 'live-query-' . $post_type . '-args', $args );

        // Execute query
        add_filter( 'posts_where', array( $this, 'filter_search_where' ), 10, 2 );
        $query = new WP_Query($args);
        remove_filter( 'posts_where', array( $this, 'filter_search_where' ), 10 );
        $projects = array();

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $post_id = get_the_ID();

                // Get featured image
                $featured_image = '';
                if (has_post_thumbnail($post_id)) {
                    $featured_image = get_the_post_thumbnail_url($post_id, 'full');
                }

                // Get taxonomies
                $services = wp_get_post_terms($post_id, 'service', array('fields' => 'names'));
                $industries = wp_get_post_terms($post_id, 'industry', array('fields' => 'names'));

                $html = live_query_formatted_default( $post_id ); 
                $html = apply_filters( "live_query_formatted", $html, $post_id );
                $html = apply_filters( "live_query_" . $post_type . "_formatted", $html, $post_id );

                $content = get_post_field( 'post_content', $post_id );

                $projects[] = array(
                    'id' => $post_id,
                    'title' => get_the_title(),
                    'excerpt' => str_replace( " [&hellip;]", "", get_the_excerpt() ),
                    'content' => $content,
                    'rendered' => apply_filters('the_content', $content),
                    'link' => get_permalink(),
                    'featured_image' => $featured_image,
                    'services' => $services,
                    'industries' => $industries,
                    'date' => get_the_date('c'),
                    'formatted' => $html
                );
            }
            wp_reset_postdata();
        }

        return new WP_REST_Response(array(
            'posts' => $projects,
            'total' => $query->found_posts,
            'total_pages' => $query->max_num_pages,
            'current_page' => $page,
        ), 200);
    }

    /**
     * Restrict a query to posts where every search word appears in the title,
     * the content, or the name of a term (in any public taxonomy of the post type)
     * attached to the post.
     */
    public function filter_search_where( $where, $query ) {
        global $wpdb;

        $search = $query->get( 'live_query_search' );
        if ( empty( $search ) ) {
            return $where;
        }

        $words = array_filter( preg_split( '/\s+/', $search ) );
        if ( empty( $words ) ) {
            return $where;
        }

        $taxonomies = array();
        foreach ( (array) $query->get( 'post_type' ) as $type ) {
            foreach ( get_object_taxonomies( $type, 'objects' ) as $taxonomy ) {
                if ( $taxonomy->public ) {
                    $taxonomies[] = $taxonomy->name;
                }
            }
        }
        $taxonomies = array_unique( $taxonomies );

        $clauses = array();
        foreach ( $words as $word ) {
            $like = '%' . $wpdb->esc_like( $word ) . '%';
            $clause = $wpdb->prepare( "{$wpdb->posts}.post_title LIKE %s OR {$wpdb->posts}.post_content LIKE %s", $like, $like );

            if ( !empty( $taxonomies ) ) {
                $tax_placeholders = implode( ', ', array_fill( 0, count( $taxonomies ), '%s' ) );
                $clause .= $wpdb->prepare(
                    " OR {$wpdb->posts}.ID IN (
                        SELECT tr.object_id FROM {$wpdb->term_relationships} tr
                        INNER JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
                        INNER JOIN {$wpdb->terms} t ON t.term_id = tt.term_id
                        WHERE tt.taxonomy IN ( $tax_placeholders ) AND t.name LIKE %s
                    )",
                    array_merge( $taxonomies, array( $like ) )
                );
            }

            $clauses[] = "( $clause )";
        }

        return $where . ' AND ( ' . implode( ' AND ', $clauses ) . ' )';
    }

    /**
     * Get all service terms
     */
    public function get_terms($request) {
        $taxonomies = $request->get_param('taxonomies');
        $hide_empty = $request->get_param('hide_empty') ?: false;
        $taxonomyTerms = array();

        if( empty( $taxonomies ) ) {
            return new WP_REST_Response(array('terms' => array()), 200);
        }

        foreach( $taxonomies as $t ) {
            $terms = get_terms(array(
                'taxonomy' => $t,
                'hide_empty' => $hide_empty,
            ));
    
            if ( is_wp_error( $terms ) ) {
                return new WP_REST_Response(array('terms' => array()), 200);
            }
            
            foreach ( $terms as $term ) {
                $taxonomyTerms[$t][] = array(
                    'id' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                    'count' => $term->count,
                    'selected' => 0
                );
            }
        }

        return new WP_REST_Response( array( 'taxonomyTerms' => $taxonomyTerms ), 200 );
    }

    /**
     * Get all industry terms
     */
    // public function get_industries($request) {
    //     $terms = get_terms(array(
    //         'taxonomy' => 'industry',
    //         'hide_empty' => false,
    //     ));

    //     if (is_wp_error($terms)) {
    //         return new WP_REST_Response(array('industries' => array()), 200);
    //     }

    //     $industries = array();
    //     foreach ($terms as $term) {
    //         $industries[] = array(
    //             'id' => $term->term_id,
    //             'name' => $term->name,
    //             'slug' => $term->slug,
    //             'count' => $term->count,
    //         );
    //     }

    //     return new WP_REST_Response(array('industries' => $industries), 200);
    // }
}

// Default format filter
function live_query_formatted_default( $post_id ) {
    $type = get_post_type( $post_id );

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