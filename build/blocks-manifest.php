<?php
// This file is generated. Do not modify it manually.
return array(
	'live-filters' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'scm/live-filters',
		'version' => '1.0.0',
		'title' => 'Live Filters',
		'category' => 'widgets',
		'icon' => 'arrow-down-alt2',
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
			),
			'hideEmpty' => array(
				'type' => 'boolean',
				'default' => false
			),
			'layout' => array(
				'type' => 'string',
				'default' => 'select'
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
		'icon' => 'button',
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
		'icon' => 'media-document',
		'description' => '',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'usesContext' => array(
			'postType',
			'limit'
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
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'background' => array(
				'backgroundImage' => true,
				'backgroundSize' => true,
				'__experimentalDefaultControls' => array(
					'backgroundImage' => true
				)
			),
			'color' => array(
				'gradients' => true,
				'heading' => true,
				'button' => true,
				'link' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'shadow' => true,
			'spacing' => array(
				'margin' => array(
					'top',
					'bottom'
				),
				'padding' => true,
				'blockGap' => true,
				'__experimentalDefaultControls' => array(
					'padding' => true,
					'blockGap' => true
				)
			),
			'dimensions' => array(
				'minHeight' => true
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontWeight' => true,
				'__experimentalFontStyle' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'layout' => array(
				'allowSizingOnChildren' => true
			),
			'interactivity' => array(
				'clientNavigation' => true
			),
			'allowedBlocks' => true
		),
		'attributes' => array(
			'postType' => array(
				'type' => 'string',
				'default' => 'post'
			),
			'limit' => array(
				'type' => 'integer',
				'default' => 6
			)
		),
		'providesContext' => array(
			'postType' => 'postType',
			'limit' => 'limit'
		),
		'textdomain' => 'live-query',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
