import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, RangeControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { message, singularMessage, noResultsMessage, position, duration } = attributes;

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Messages' ) }>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label="Results message"
						help={ __( 'Use {count} for the number of results' ) }
						value={ message }
						onChange={ ( newValue ) => setAttributes( { message: newValue } ) }
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label="Single result message"
						value={ singularMessage }
						onChange={ ( newValue ) => setAttributes( { singularMessage: newValue } ) }
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label="No results message"
						value={ noResultsMessage }
						onChange={ ( newValue ) => setAttributes( { noResultsMessage: newValue } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Display' ) }>
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label="Position"
						value={ position }
						options={ [
							{ label: 'Top left', value: 'top-left' },
							{ label: 'Top center', value: 'top-center' },
							{ label: 'Top right', value: 'top-right' },
							{ label: 'Bottom left', value: 'bottom-left' },
							{ label: 'Bottom center', value: 'bottom-center' },
							{ label: 'Bottom right', value: 'bottom-right' },
						] }
						onChange={ ( newValue ) => setAttributes( { position: newValue } ) }
					/>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label="Duration (seconds)"
						value={ duration }
						min={ 1 }
						max={ 15 }
						step={ 0.5 }
						onChange={ ( newValue ) => setAttributes( { duration: newValue } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div className="live-query-toast is-preview">
				<span className="toast-message">{ ( message || '' ).replace( /\{count\}/g, '12' ) }</span>
				<button type="button" className="toast-close" aria-label="Dismiss" disabled>&times;</button>
			</div>
			<p className="live-toast-hint">{ __( 'Toast preview: on the site it appears' ) } { position.replace( '-', ' ' ) } { __( 'after a search or filter change.' ) }</p>
		</div>
	);
}
