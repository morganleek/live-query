import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl, TextControl, SelectControl, CheckboxControl, TextareaControl, ToggleControl, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
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
	const { postType, limit, rootURL, params, taxQuery, urlRewriteEnabled, urlRewriteFrom, urlRewriteTo } = attributes;
	const [ postTypeOptions, setPostTypeOptions ] = useState( null );
	const [ paramsError, setParamsError ] = useState( '' );
	const [ taxonomies, setTaxonomies ] = useState( null );
	const [ taxonomyTerms, setTaxonomyTerms ] = useState( {} );
	const [ loadingTerms, setLoadingTerms ] = useState( {} );

	let taxQueryObj = {};
	try {
		taxQueryObj = JSON.parse( taxQuery || '{}' );
	} catch ( e ) {
		taxQueryObj = {};
	}

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
		apiFetch( { path: '/wp/v2/taxonomies' } ).then( ( data ) => {
			setTaxonomies( data );
		} );
	}, [] );

	// Ensure terms are loaded for any taxonomy already selected, including on initial load.
	useEffect( () => {
		Object.keys( taxQueryObj ).forEach( ( slug ) => {
			if( !taxonomyTerms[ slug ] && !loadingTerms[ slug ] ) {
				fetchTermsForTaxonomy( slug );
			}
		} );
	}, [ taxQuery ] );

	const updatePostType = ( newType ) => {
		setAttributes( { postType: newType } );
	}

	const updateParams = ( newParams ) => {
		setAttributes( { params: newParams } );
		try {
			JSON.parse( newParams || '{}' );
			setParamsError( '' );
		} catch ( e ) {
			setParamsError( __( 'Invalid JSON' ) );
		}
	}

	const fetchTermsForTaxonomy = ( taxSlug ) => {
		setLoadingTerms( ( prev ) => ( { ...prev, [ taxSlug ]: true } ) );
		apiFetch( { path: addQueryArgs( '/live-query/v1/terms', { taxonomies: [ taxSlug ] } ) } )
			.then( ( data ) => {
				setTaxonomyTerms( ( prev ) => ( { ...prev, [ taxSlug ]: data.taxonomyTerms?.[ taxSlug ] || [] } ) );
				setLoadingTerms( ( prev ) => ( { ...prev, [ taxSlug ]: false } ) );
			} );
	}

	const toggleStaticTaxonomy = ( taxSlug, checked ) => {
		const newTaxQuery = { ...taxQueryObj };
		if( checked ) {
			newTaxQuery[ taxSlug ] = [];
		} else {
			delete newTaxQuery[ taxSlug ];
		}
		setAttributes( { taxQuery: JSON.stringify( newTaxQuery ) } );
	}

	const toggleStaticTerm = ( taxSlug, termSlug, checked ) => {
		const currentTerms = new Set( taxQueryObj[ taxSlug ] || [] );
		if( checked ) {
			currentTerms.add( termSlug );
		} else {
			currentTerms.delete( termSlug );
		}
		const newTaxQuery = { ...taxQueryObj, [ taxSlug ]: Array.from( currentTerms ) };
		setAttributes( { taxQuery: JSON.stringify( newTaxQuery ) } );
	}

	console.log( taxQueryObj );

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
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						type="text"
						label="Root URL"
						help={ __( 'Optional. Overrides the REST API root URL used by this block on the frontend.' ) }
						value={ rootURL }
						onChange={ ( newRootURL ) => setAttributes( { rootURL: newRootURL } ) }
					/>
					<TextareaControl
						__nextHasNoMarginBottom
						label="Additional params"
						value={ params }
						onChange={ updateParams }
						help={ paramsError || 'JSON object of additional params to send with API requests' }
						rows={ 4 }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label="Rewrite incoming URLs"
						help={ __( 'Replace a domain found in the fetched post data (links, images, content) with a different domain before rendering.' ) }
						checked={ urlRewriteEnabled }
						onChange={ ( newValue ) => setAttributes( { urlRewriteEnabled: newValue } ) }
					/>
					{ urlRewriteEnabled && (
						<>
							<TextControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								type="text"
								label="Domain to replace"
								help={ __( 'e.g. aotm.1fo.au' ) }
								value={ urlRewriteFrom }
								onChange={ ( newValue ) => setAttributes( { urlRewriteFrom: newValue } ) }
							/>
							<TextControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								type="text"
								label="Replacement domain"
								help={ __( 'e.g. aaot.1fo.au' ) }
								value={ urlRewriteTo }
								onChange={ ( newValue ) => setAttributes( { urlRewriteTo: newValue } ) }
							/>
						</>
					) }
				</PanelBody>
				{ taxonomies && (
					<PanelBody title={ __( 'Filters' ) } initialOpen={ Object.keys( taxQueryObj ).length > 0 }>
						<p>{ __( 'Always restrict results by the selected terms' ) }</p>
						<div className="live-query-static-tax-wrapper">
							{ Object.keys( taxonomies )
								.filter( slug => !taxonomies[ slug ].types?.length || taxonomies[ slug ].types.includes( postType ) )
								.map( slug => (
									<div className="live-query-static-tax" key={ slug }>
										<CheckboxControl
											// __nextHasNoMarginBottom
											label={ taxonomies[ slug ].name }
											checked={ taxQueryObj.hasOwnProperty( slug ) }
											onChange={ ( checked ) => toggleStaticTaxonomy( slug, checked ) }
										/>
										{ taxQueryObj.hasOwnProperty( slug ) && (
											<div className="live-query-static-tax-terms">
												{ loadingTerms[ slug ] && <Spinner /> }
												{ taxonomyTerms[ slug ] && taxonomyTerms[ slug ].map( term => (
													<CheckboxControl
														// __nextHasNoMarginBottom
														key={ term.slug }
														label={ term.name }
														checked={ ( taxQueryObj[ slug ] || [] ).includes( term.slug ) }
														onChange={ ( checked ) => toggleStaticTerm( slug, term.slug, checked ) }
													/>
												) ) }
											</div>
										) }
									</div>
								) ) }
						</div>

					</PanelBody>
				) }
			</InspectorControls>
			<InnerBlocks template={ TEMPLATE } />
		</div>
	);
}