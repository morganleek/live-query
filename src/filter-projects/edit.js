import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl, TextControl, SelectControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';
import { useEffect, useState } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const { postType, restEndpoint, filters, limit, moreButton, showFilters, showProjectsLink } = attributes;
    const [ postTypeOptions, setPostTypeOptions ] = useState( null );
    // const [ postTypeTerms ]
    const [ postTypes, setPostTypes ] = useState( null );

    useEffect( () => {
        apiFetch( { path: '/wp/v2/types' } ).then( ( types ) => {
            setPostTypes( types );
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

    // useEffect( () => {
    //     console.log( "Post type changed" );
    // }, [postType] );
    
    const updatePostType = ( newType ) => {
        setAttributes( { postType: newType } );
        if( postTypes.hasOwnProperty( newType ) ) {
            // set endpoint
            setAttributes( { restEndpoint: postTypes[newType].rest_namespace + "/" + postTypes[newType].rest_base } );
            // set taxonomies
            if( postTypes[newType].hasOwnProperty( "taxonomies" ) ) {
                console.log( postTypes[newType].taxonomies );
            }
        }
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
					<RadioControl
                        label="Load more button"
                        help="Set to no to hide this button"
                        selected={ moreButton === 1 ? 'yes' : 'no' }
                        options={ [
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ] }
                        onChange={ ( newShow ) => setAttributes( { moreButton: newShow === 'yes' ? 1 : 0 } ) }
					/>
					<RadioControl
                        label="Show filters"
                        help="Include filter dropdowns"
                        selected={ showFilters === 1 ? 'yes' : 'no' }
                        options={ [
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ] }
                        onChange={ ( newShow ) => setAttributes( { showFilters: newShow === 'yes' ? 1 : 0 } ) }
					/>
					{/* <RadioControl
                        label="Show projects link"
                        selected={ showProjectsLink === 1 ? 'yes' : 'no' }
                        options={ [
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ] }
                        onChange={ ( newShow ) => setAttributes( { showProjectsLink: newShow === 'yes' ? 1 : 0 } ) }
					/> */}
				</PanelBody>
			</InspectorControls>
			<p>Filter Projects</p>
		</div>
	);
}
