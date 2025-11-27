import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	// const saveAttributes = { ...attributes, filters: attributes.filters.join(","), filterLabels: JSON.stringify( attributes.filterLabels ) }

	return (
		<div { ...useBlockProps.save() }>
			<InnerBlocks.Content />
		</div>
	);
}
