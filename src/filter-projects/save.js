import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const saveAttributes = { ...attributes, filters: attributes.filters.join(","), filterLabels: JSON.stringify( attributes.filterLabels ) }

	return (
		<div { ...useBlockProps.save( saveAttributes ) }>
			{ 'Loading...' }
		</div>
	);
}
