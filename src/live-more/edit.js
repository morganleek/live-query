import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor'; // InspectorControls, 
import { createBlock, getDefaultBlockName } from '@wordpress/blocks';
import './editor.scss';

export default function Edit( { attributes: { content }, setAttributes, insertBlocksAfter } ) {
	return (
		<>
			<div className="wp-block-live-more">
				<button className="load-more-button">
					<RichText
						identifier="content"
						tagName="span"
						aria-label={ __( '“Load more” link text' ) }
						placeholder={ __( 'Load more' ) }
						value={ content }
						onChange={ ( newValue ) =>
							setAttributes( { content: newValue } )
						}
						__unstableOnSplitAtEnd={ () =>
							insertBlocksAfter( createBlock( getDefaultBlockName() ) )
						}
						withoutInteractiveFormatting
						{ ...useBlockProps() }
					/>
				</button>
			</div>
		</>
	);
}