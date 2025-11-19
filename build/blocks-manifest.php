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
			'showProjectsLink' => array(
				'type' => 'integer',
				'default' => 1
			)
		),
		'textdomain' => 'everything-filter',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
