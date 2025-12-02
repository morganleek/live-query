import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl, TextControl, SelectControl, CheckboxControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';
import { useEffect, useState } from '@wordpress/element';
import { InnerBlocks } from '@wordpress/block-editor';

const TEMPLATE = [
	[ 'core/group', { layout: { type: "flex", flexWrap: "nowrap", justifyContent: "center" } }, [
		[ 'scm/live-filters', {} ]
	] ],
	[ 'scm/live-posts', {} ],
	[ 'core/group', { layout: { type: "flex", flexWrap: "nowrap", justifyContent: "center" } }, [
		[ 'scm/live-more', {} ]
	] ],
];

export default function Edit( { attributes, setAttributes } ) {
	const { postType, limit } = attributes;
	const [ postTypeOptions, setPostTypeOptions ] = useState( null );
	// const [ taxonomies, setTaxonomies ] = useState( null );
	// const [ taxonomyOptions, setTaxonomyOptions ] = useState( null );
	// const [ postTypes, setPostTypes ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/wp/v2/types' } ).then( ( types ) => {
			if( types ) {
				let typesSelect = [
					{ value: '', label: 'Select a Post Type', disabled: true }
				];
				for( const key in types ) {
					if( types.hasOwnProperty( key ) ) {
						typesSelect.push( { label: types[key].name, value: types[key].slug } );
					}
				}
				setPostTypeOptions( typesSelect );
			}
		} );
	}, [] );
			
	const updatePostType = ( newType ) => {
		setAttributes( { postType: newType } );
	}

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					{ postTypeOptions && (
						<SelectControl
							label="Post type"
							value={ postType }
							options={ postTypeOptions }
							onChange={ ( newType ) => updatePostType( newType ) }
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					) }
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						type="number"
						label="Post limit"
						value={ limit }
						onChange={ ( newLimit ) => setAttributes( { limit: parseInt( newLimit ) } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<InnerBlocks template={ TEMPLATE } />
		</div>
	);
}