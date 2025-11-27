import domReady from '@wordpress/dom-ready';
import { createRoot, createPortal } from '@wordpress/element';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs, getQueryArgs, removeQueryArgs } from '@wordpress/url';
// import Select from 'react-select';
import classNames from 'classnames'

const LivePosts = ( { liveMore, liveFilters, filters, postType, limit } ) => {
	const [posts, setPosts] = useState([]);
	const [filtersLoaded, setFiltersLoaded] = useState( false );
	const [filtersWithTerms, setFiltersWithTerms] = useState( null );
	const [expandedFilters, setExpandedFilters] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalProjects, setTotalProjects] = useState(0);
	const [loading, setLoading] = useState(false);
	const [initialLoad, setInitialLoad] = useState(true);

	// const apiUrl = window.projectFiltersData.apiUrl;
	const perPage = limit ? limit : 6;

	// console.log( liveMore, liveFilters );
	useEffect(() => {
		if( liveFilters ) {
			fetchTaxonomies();
		}
		setFiltersLoaded( true );
	}, []);

	// Fetch projects when filters change
	useEffect(() => {
		if( postType && filtersLoaded ) {
			fetchPosts( 1, false );
		}
	}, [filtersWithTerms]);

	const fetchTaxonomies = async () => {
		let queryParams = {};

		if( filters ) {
			queryParams.taxonomies = Object.keys( filters );
		}

		apiFetch( { 
			path: addQueryArgs( '/everything-filter/v1/terms', queryParams )
		} ).then( ( data ) => {
			setFiltersWithTerms( data.taxonomyTerms );
			setExpandedFilters( Object.fromEntries( Object.keys( data.taxonomyTerms ).map( key => [key, false] ) ) );
		} );

	};

	const fetchPosts = async (page = 1, append = false) => {
		setLoading(true);

		const exclude = document.body.classList.contains( 'single' )
		const postId = document.body.attributes.class.value.match( /postid-(\d+)/ );

		try {
			// add taxonomies
			const taxQuery = {};
			Object.keys( filtersWithTerms ).map( key => {
				taxQuery[key] = [];
				filtersWithTerms[key].forEach( t => {
					if( t.selected === 1 ) {
						taxQuery[key].push( t.slug );
					}
				} )
			} );

			const params = {
				page: page,
				per_page: perPage,
				post_type: postType,
				...( exclude && postId && { exclude: postId[1] } ),
				tax_query: taxQuery
			};

			apiFetch( { 
				path: addQueryArgs( "everything-filter/v1/posts", params )
			} ).then( ( res ) => {
				setTotalPages( parseInt( res.total_pages ) );
				setTotalProjects( parseInt( res.total ) );
				setCurrentPage( page );
				setInitialLoad( false );
				setPosts( page === 1 ? res.posts : [...posts, ...res.posts] );
				// return res.json();
			} );
		} catch (error) {
			console.error('Error fetching posts:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleLoadMore = () => {
		if ( currentPage < totalPages ) {
			fetchPosts( currentPage + 1, true );
		}
	};

	// const baseURL = () => removeQueryArgs( window.location.href, 'service', 'industry' );

	const setUpdatedURL = ( newTerms ) => {
		const taxQuery = {};
		const allTerms = { ...filtersWithTerms, ...newTerms };
		Object.keys( allTerms ).map( key => {
			taxQuery[key] = [];
			allTerms[key].forEach( t => {
				if( t.selected === 1 ) {
					taxQuery[key] = taxQuery[key].length === 0 ? t.slug : taxQuery[key] + "," + t.slug;
				}
			} )
		} );
		const url = addQueryArgs( baseURL(), taxQuery );
		window.history.pushState( {}, "Page", url );
	}

	// const handleReset = () => {
	// 	setSelectedService( '' );
	// 	setSelectedIndustry( '' );
	// 	setCurrentPage( 1 );
	// };

	const updateSearchTerm = ( tax, slug, state ) => {
		setCurrentPage( 1 );

		const newTaxTerms = {}
		newTaxTerms[tax] = filtersWithTerms[tax].map( insideTerm => {
			if( insideTerm.slug === slug ) {
				return { ...insideTerm, selected: state ? 1 : 0 }
			}
			return insideTerm;
		} );

		setFiltersWithTerms(
			{ ...filtersWithTerms, 
				...newTaxTerms
			}
		);
		
		setUpdatedURL( { 
			...newTaxTerms
		} );
	}

	// const hasActiveFilters = selectedService || selectedIndustry;
	const hasMoreProjects = currentPage < totalPages;

	return (
		<div>
			{ liveFilters && createPortal( (
				<>
					<select
						onChange={ ( e ) => setLabel( e.target.value ) }
					>
						<option>One</option>
						<option>Two</option>
					</select>
				</>
			), liveFilters ) }
			{ liveMore && createPortal( (
				<div className="live-posts-more">
					<button
						onClick={ handleLoadMore }
						disabled={loading}
						className="load-more-btn"
					>
						{loading ? 'Loading...' : 'show more posts'}
					</button>
					<p>Showing {posts.length} out of {totalProjects} posts</p>
				</div>
			), liveMore ) }
			<>
				{ loading && posts.length === 0 ? (
					<div className="post-loading">
						<p>Loading posts...</p>
					</div>
				) : posts.length === 0 ? (
					<div className="post-no-results">
						<p>No posts found matching your criteria.</p>
					</div>
				) : (
					<>
						<div className="post-grid">
							{posts.map(post => (
								<div className={ "post-card type-" + postType } dangerouslySetInnerHTML={{ __html: post.formatted }} />
							))}
						</div>

						{ /* moreButton && hasMoreProjects && (
							<div className="post-load-more">
								<button
									onClick={handleLoadMore}
									disabled={loading}
									className="load-more-btn"
								>
									{loading ? 'Loading...' : 'show more posts'}
								</button>
								<p>Showing {posts.length} out of {totalProjects} posts</p>
							</div>
						) */ }
					</>
				) }
			</>
		</div>
	);
};

// Render the app
domReady( () => {
	const container = document.querySelector( '.wp-block-scm-live-query' );
	const livePosts = container.querySelector( '.wp-block-scm-live-posts' );

	if( livePosts ) {
		const liveMore = container.querySelector( '.wp-block-scm-live-more' );
		const liveFilters = container.querySelector( '.wp-block-scm-live-filters' );
		// attributes
		const postType = container.attributes.posttype.value;
		const limit = parseInt( container.attributes.limit.value );
		const filterlabels = liveFilters ? JSON.parse( liveFilters.attributes.filters.value ) : undefined;
		const root = createRoot(
			livePosts
		);
		root.render( <LivePosts
			liveMore={ liveMore }
			liveFilters={ liveFilters }
			filters={ filterlabels }
			postType={ postType }
			limit={ limit }
		/> );
	}
} );

// Watch for new images added to the DOM
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.tagName === 'IMG') {
        if (node.complete) {
          handleImageLoad(node);
        } else {
          node.addEventListener('load', () => handleImageLoad(node));
        }
      }
      // Check for images within added elements
      if (node.querySelectorAll) {
        node.querySelectorAll('img').forEach(img => {
          if (img.complete) {
            handleImageLoad(img);
          } else {
            img.addEventListener('load', () => handleImageLoad(img));
          }
        });
      }
    });
  });
});

// Start observing
observer.observe( document.body, {
  childList: true,
  subtree: true
} );

function handleImageLoad( img ) {
  img.classList.add( "has-loaded" );
}