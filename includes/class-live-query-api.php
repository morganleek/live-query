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
                'post_type' => array(
                    'default' => '',
                    'sanitize_callback' => 'sanitize_text_field',
                ),

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
            'taxonomy' => array(
                'default' => '',
                'sanitize_callback' => 'sanitize_text_field',
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

        if (!empty($tax_query_params)) {
            $args['tax_query'] = $tax_query_params;
            if (count($tax_query_params) > 1) {
                $args['tax_query']['relation'] = 'AND';
            }
        }

        // Execute query
        $query = new WP_Query($args);
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
                $html = apply_filters( "live_query_formatted" , $post_id, $html );

                $projects[] = array(
                    'id' => $post_id,
                    'title' => get_the_title(),
                    'excerpt' => str_replace( " [&hellip;]", "", get_the_excerpt() ),
                    'content' => get_the_content(),
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
     * Get all service terms
     */
    public function get_terms($request) {
        $taxonomies = $request->get_param('taxonomies');
        $taxonomyTerms = array();

        if( empty( $taxonomies ) ) {
            return new WP_REST_Response(array('terms' => array()), 200);
        }

        foreach( $taxonomies as $t ) {
            $terms = get_terms(array(
                'taxonomy' => $t,
                'hide_empty' => false,
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

// add_filter( "live_query_formatted", "live_query_formatted_default", 0, 1 );