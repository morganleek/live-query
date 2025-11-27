import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl, TextControl, SelectControl, CheckboxControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';
import { useEffect, useState } from '@wordpress/element';
import { InnerBlocks } from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes } ) {
	const { filters, filterLabels } = attributes;
	const [ taxonomies, setTaxonomies ] = useState( null );
	// const [ taxonomyOptions, setTaxonomyOptions ] = useState( null );

	useEffect( () => {
		// apiFetch( { path: '/wp/v2/types' } ).then( ( types ) => {
		// 	setPostTypes( types );
		// 	// if value is already set load taxonomies also
		// 	if( postType && types.hasOwnProperty( postType) && types[postType].hasOwnProperty( "taxonomies" ) ) {
		// 		setTaxonomyOptions( types[postType].taxonomies );
		// 	}
		// 	if( types ) {
		// 		let typesSelect = [
		// 			{ value: '', label: 'Select a Post Type', disabled: true }
		// 		];
		// 		for( const key in types ) {
		// 			if( types.hasOwnProperty( key ) ) {
		// 				typesSelect.push( { label: types[key].name, value: types[key].slug } );
		// 			}
		// 		}
		// 		setPostTypeOptions( typesSelect );
		// 	}
		// } );

		apiFetch( { path: '/wp/v2/taxonomies' } ).then( ( data ) => {
			setTaxonomies( data );
		} );
	}, [] );
	
	const updateFilters = ( state, taxonomySlug ) => {
		if( state ) { // add
			if( filters.includes( taxonomySlug ) ) { // not if it already exists
				return;
			}
			setAttributes( { filters: [...filters, taxonomySlug] } );
		}
		else { // remove
			if( !filters.includes( taxonomySlug ) ) { // not if it doesn't exist
				return;
			}
			setAttributes( { filters: filters.filter( filterSlug => filterSlug !== taxonomySlug ) } );
		}
	}

	const updateFilterLabel = ( filter, newLabel ) => {
		const newLabelsObject = {};
		newLabelsObject[filter] = newLabel;
		setAttributes( { filterLabels: {
			...filterLabels,
			...newLabelsObject
		} } );
	}

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				{ taxonomies && (
					<PanelBody title={ __( 'Filters' ) }>
						{ Object.keys( taxonomies ).map( slug => (
							<CheckboxControl
								__nextHasNoMarginBottom
								label={ taxonomies[slug].name }
								checked={ filters.includes( slug ) }
								onChange={ ( state ) => updateFilters( state, slug ) }
							/>
						) ) }
						{ filters.map( filter => (
							<TextControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								type="string"
								label={ taxonomies[filter].name + " label" }
								value={ filterLabels[filter] ? filterLabels[filter] : ""}
								onChange={ ( newLabel ) => updateFilterLabel( filter, newLabel ) }
							/>
						) ) }
					</PanelBody>
				) }
			</InspectorControls>
			<ul>
				{ taxonomies && filters && filterLabels && filters.map( filter => (
					<li>{ filterLabels[filter] }</li>
				) ) }
				{ filters.length === 0 && ( <li>Select a filter</li> ) }
			</ul>
		</div>
	);
}