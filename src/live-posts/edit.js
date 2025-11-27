// import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor'; // InspectorControls, 
// import { PanelBody, RadioControl, TextControl, SelectControl, CheckboxControl } from '@wordpress/components';
// import apiFetch from '@wordpress/api-fetch';
import './editor.scss';
// import { useEffect, useState } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	return (
		<div { ...useBlockProps() }>
			<p>Live posts BE</p>
		</div>
	);
}