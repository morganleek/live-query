import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const saveAttributes = { ...attributes, filters: attributes.filters.join(",") }

	return (
		<div { ...useBlockProps.save( saveAttributes ) }>
			{ 'Loading...' }
		</div>
	);
}
