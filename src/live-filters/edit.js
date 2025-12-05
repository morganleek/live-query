import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl, CheckboxControl, SelectControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';
import { useEffect, useState } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const { filters, filterLabels, multiSelect, layout } = attributes;
	const [ taxonomies, setTaxonomies ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/wp/v2/taxonomies' } ).then( ( data ) => {
			setTaxonomies( data );
		} );
	}, [] );
	
	const updateFilters = ( state, taxonomySlug ) => {
		if( state ) { // add
			if( filters.includes( taxonomySlug ) ) { // not if it already exists
				return;
			}

			setAttributes( { 
				filters: [...filters, taxonomySlug],
				filterLabels: { ...{ [`${taxonomySlug}`]: `Select a ${taxonomySlug}` }, ...filterLabels }
			} );
		}
		else { // remove
			if( !filters.includes( taxonomySlug ) ) { // not if it doesn't exist
				return;
			}
			// const newFilterLabels = 
			setAttributes( { 
				filters: filters.filter( filterSlug => filterSlug !== taxonomySlug ),
				filterLabels: Object.keys( filterLabels ).filter( key => key !== taxonomySlug ).map( key => filterLabels[key] )
			} );
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
				<PanelBody title={ __( 'Settings' ) }>
					<ToggleControl
            checked={ multiSelect }
            label="Allow multiple filter selection"
						value={ multiSelect }
						onChange={ ( newValue ) => { setAttributes( { multiSelect: newValue } ) } }
						disabled
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
            label="Layout"
            value={ layout }
            options={ [
                { label: 'Select', value: 'select' },
                { label: 'List', value: 'list' },
            ] }
            onChange={ ( newLayout ) => setAttributes( { layout: newLayout } ) }
            __next40pxDefaultSize
            __nextHasNoMarginBottom
					/>
				</PanelBody>
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
			<div className="filter-group">
				<span className="posts-results">Showing X posts in</span>
				{ taxonomies && filters && filterLabels && filters.map( filter => (
					layout === "select" ? (
						<div className="filter-dropdown">
							<button className="filter-label">
								{ filterLabels[filter] ? filterLabels[filter] : "Select an option" }
							</button>
						</div>
					) : (
						<div className="filter-list">
							{ filterLabels[filter] ? filterLabels[filter] : "List of options" }
						</div>
					)
				) ) }
				{ filters.length === 0 && ( <p>Select at least one filter</p> ) }
			</div>
		</div>
	);
}