<?php
/**
 * Plugin Name:       Filter Projects
 * Description:       Customer block for Creative Spaces Projects
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Morgan Leek
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       filter-projects
 *
 * @package CreateBlock
 */

define( 'FILTER_PROJECTS_VERSION', '1.0.0' );
define( 'FILTER_PROJECTS_PLUGIN_DIR', plugin_dir_path(__FILE__) );
define( 'FILTER_PROJECTS_PLUGIN_URL', plugin_dir_url(__FILE__) );

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Filter_Projects {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Load dependencies
		$this->load_dependencies();

		// Register hooks
		add_action('rest_api_init', array($this, 'register_rest_routes'));
		add_action('init', array($this, 'create_block_filter_projects_block_init'));
	}

	// Load required dependencies
	private function load_dependencies() {
		require_once FILTER_PROJECTS_PLUGIN_DIR . 'includes/class-project-filters-api.php';
	}

	// Register REST API routes
	public function register_rest_routes() {
		$api = new Project_Filters_API();
		$api->register_routes();
	}

	public function create_block_filter_projects_block_init() {
		if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
			wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
			return;
		}

		if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
			wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		}

		$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
		foreach ( array_keys( $manifest_data ) as $block_type ) {
			register_block_type( __DIR__ . "/build/{$block_type}" );
		}
	}
}

// Initialize the plugin
function filter_projects_init() {
	new Filter_Projects();
}
add_action('plugins_loaded', 'filter_projects_init');

function filter_projects_flush() {
	flush_rewrite_rules(); // Flush rewrite rules
}
register_activation_hook(__FILE__, 'filter_projects_flush');
register_deactivation_hook(__FILE__, 'filter_projects_flush');
