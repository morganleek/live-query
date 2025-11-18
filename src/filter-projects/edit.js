import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { limit, moreButton, showFilters, showProjectsLink } = attributes;
	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<TextControl
            __nextHasNoMarginBottom
            __next40pxDefaultSize
						type="number"
            label="Post limit"
            value={ limit }
            onChange={ ( newLimit ) => setAttributes( { limit: parseInt( newLimit ) } ) }
					/>
					<RadioControl
            label="Show more button"
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
					<RadioControl
            label="Show projects link"
            selected={ showProjectsLink === 1 ? 'yes' : 'no' }
            options={ [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
            ] }
            onChange={ ( newShow ) => setAttributes( { showProjectsLink: newShow === 'yes' ? 1 : 0 } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<p>Filter Projects</p>
		</div>
	);
}
