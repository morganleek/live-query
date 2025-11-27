<?php
// This file is generated. Do not modify it manually.
return array(
	'filter-projects' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'six-character-media/everything-filter',
		'version' => '1.0.0',
		'title' => 'Everything Filter',
		'category' => 'widgets',
		'icon' => 'grid-view',
		'description' => '',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'postType' => array(
				'type' => 'string',
				'default' => ''
			),
			'restEndpoint' => array(
				'type' => 'string',
				'default' => ''
			),
			'limit' => array(
				'type' => 'integer',
				'default' => 6
			),
			'moreButton' => array(
				'type' => 'integer',
				'default' => 1
			),
			'showFilters' => array(
				'type' => 'integer',
				'default' => 1
			),
			'filters' => array(
				'type' => 'array',
				'default' => array(
					
				)
			),
			'filterLabels' => array(
				'type' => 'object',
				'default' => array(
					
				)
			),
			'showProjectsLink' => array(
				'type' => 'integer',
				'default' => 1
			)
		),
		'textdomain' => 'everything-filter',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./index.php'
	),
	'live-filters' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'scm/live-filters',
		'version' => '1.0.0',
		'title' => 'Live Filters',
		'category' => 'widgets',
		'icon' => 'grid-view',
		'description' => '',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false,
			'spacing' => array(
				'blockGap' => array(
					'horizontal',
					'vertical'
				)
			)
		),
		'ancestor' => array(
			'scm/live-query'
		),
		'attributes' => array(
			'filters' => array(
				'type' => 'array',
				'default' => array(
					
				)
			),
			'filterLabels' => array(
				'type' => 'object',
				'default' => array(
					
				)
			),
			'multiSelect' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'textdomain' => 'live-filters',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./index.php'
	),
	'live-more' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'scm/live-more',
		'version' => '1.0.0',
		'title' => 'Live More',
		'category' => 'widgets',
		'icon' => 'grid-view',
		'description' => '',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'content' => array(
				'type' => 'string',
				'role' => 'content'
			)
		),
		'ancestor' => array(
			'scm/live-query'
		),
		'textdomain' => 'live-more',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./index.php'
	),
	'live-posts' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'scm/live-posts',
		'version' => '1.0.0',
		'title' => 'Live Posts',
		'category' => 'widgets',
		'icon' => 'grid-view',
		'description' => '',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'ancestor' => array(
			'scm/live-query'
		),
		'attributes' => array(
			
		),
		'textdomain' => 'live-posts',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./index.php'
	),
	'live-query' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'scm/live-query',
		'version' => '1.0.0',
		'title' => 'Live Query',
		'category' => 'widgets',
		'icon' => 'grid-view',
		'description' => '',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'postType' => array(
				'type' => 'string',
				'default' => ''
			),
			'limit' => array(
				'type' => 'integer',
				'default' => 6
			)
		),
		'textdomain' => 'live-query',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
