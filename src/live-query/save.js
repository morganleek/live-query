import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const saveAttributes = { ...attributes, urlRewriteEnabled: attributes.urlRewriteEnabled ? 1 : 0 };

	return (
		<div { ...useBlockProps.save( saveAttributes ) }>
			<InnerBlocks.Content />
		</div>
	);
}
