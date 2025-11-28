// import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';
import { useEffect, useState } from '@wordpress/element';

export default function Edit( { attributes, setAttributes, context } ) {
	const { postType, limit } = context;
	const [posts, setPosts] = useState( null );
	// const [loading, setLoading] = useState( true );

	const fetchPosts = async () => {
		// setLoading(true);

		try {
			// add taxonomies
			const params = {
				page: 1,
				per_page: limit,
				post_type: postType
			};

			apiFetch( { 
				path: addQueryArgs( "live-query/v1/posts", params )
			} ).then( ( res ) => {
				setPosts( res.posts );
			} );
		} catch (error) {
			console.error('Error fetching posts:', error);
		} finally {
			// setLoading(false);
		}
	};

	useEffect( () => {
		fetchPosts();
	}, [] );

	return (
		<div { ...useBlockProps() }>
			{ posts && (
				<>
					<div className="post-grid">
						{posts.map(post => (
							<div className={ "post-card type-" + postType } dangerouslySetInnerHTML={{ __html: post.formatted }} />
						))}
					</div>
				</>
			) }
		</div>
	);
}