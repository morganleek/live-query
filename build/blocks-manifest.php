<?php
// This file is generated. Do not modify it manually.
return array(
	'filter-projects' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'creative-spaces/filter-projects',
		'version' => '1.0.0',
		'title' => 'Filter Projects',
		'category' => 'widgets',
		'icon' => 'clipboard',
		'description' => 'Custom block for Creative Spaces',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
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
			'showProjectsLink' => array(
				'type' => 'integer',
				'default' => 1
			)
		),
		'textdomain' => 'filter-projects',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
