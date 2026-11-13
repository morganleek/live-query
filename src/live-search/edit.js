import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { label, showLabel, placeholder } = attributes;

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label="Label"
						help={ __( 'Used as the accessible label for the search field' ) }
						value={ label }
						onChange={ ( newLabel ) => setAttributes( { label: newLabel } ) }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label="Show label"
						checked={ showLabel }
						onChange={ ( newValue ) => setAttributes( { showLabel: newValue } ) }
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label="Placeholder"
						value={ placeholder }
						onChange={ ( newPlaceholder ) => setAttributes( { placeholder: newPlaceholder } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div className="live-query-search">
				{ showLabel && ( <label className="search-label">{ label }</label> ) }
				<div className="search-field">
					<input
						type="search"
						className="search-input"
						placeholder={ placeholder }
						disabled
					/>
				</div>
			</div>
		</div>
	);
}
