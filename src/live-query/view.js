import domReady from '@wordpress/dom-ready';
import { createRoot, createPortal } from '@wordpress/element';
import { useState, useEffect, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
// import Select from 'react-select';
import classNames from 'classnames'

const LivePosts = ( { liveMore, liveFilters, filters, postType, limit, moreLabel } ) => {
	const [posts, setPosts] = useState([]);
	const [filtersLoaded, setFiltersLoaded] = useState( false );
	const [filtersWithTerms, setFiltersWithTerms] = useState( null );
	const [expandedFilters, setExpandedFilters] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalProjects, setTotalProjects] = useState(0);
	const [loading, setLoading] = useState( true );
	const [initialLoad, setInitialLoad] = useState(true);

	// handle click off 
	const clickDocument = useRef( null );

	// const apiUrl = window.projectFiltersData.apiUrl;
	const perPage = limit ? limit : 6;

	useEffect(() => {
		if( liveFilters ) {
			fetchTaxonomies();
		}
		setFiltersLoaded( true );

		// mouse event handler
		document.addEventListener( 'mousedown', handleClickOutside );

		// Clean up event listener on unmount
		return () => {
			document.removeEventListener( 'mousedown', handleClickOutside );
		};
	}, []);

	// Fetch projects when filters change
	useEffect(() => {
		if( postType.length > 0 && filtersLoaded ) {
			fetchPosts( 1, false );
		}
	}, [filtersWithTerms]);

	const fetchTaxonomies = async () => {
		let queryParams = {};

		if( filters ) {
			queryParams.taxonomies = Object.keys( filters );
		}
		else {
			console.log( "no filters" );
		}

		apiFetch( { 
			path: addQueryArgs( '/live-query/v1/terms', queryParams )
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
			if( filtersWithTerms ) {
				Object.keys( filtersWithTerms ).map( key => {
					taxQuery[key] = [];
					filtersWithTerms[key].forEach( t => {
						if( t.selected === 1 ) {
							taxQuery[key].push( t.slug );
						}
					} )
				} );
			}

			const params = {
				page: page,
				per_page: perPage,
				post_type: postType,
				...( exclude && postId && { exclude: postId[1] } ),
				tax_query: taxQuery
			};

			apiFetch( { 
				path: addQueryArgs( "live-query/v1/posts", params )
			} ).then( ( res ) => {
				setTotalPages( parseInt( res.total_pages ) );
				setTotalProjects( parseInt( res.total ) );
				setCurrentPage( page );
				setInitialLoad( false );
				setPosts( page === 1 ? res.posts : [...posts, ...res.posts] );
				setLoading( false );
				// return res.json();
			} );
		} catch (error) {
			console.error('Error fetching posts:', error);
		} 
		// finally {	}
	};

	const handleLoadMore = () => {
		if ( currentPage < totalPages ) {
			fetchPosts( currentPage + 1, true );
		}
	};

	const baseURL = () => window.location.href.split( "?" )[0];

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

	const handleClickOutside = ( e ) => {
		if( e.target.closest( ".filter-dropdown") === null ) {
			setExpandedFilters( 
				Object.fromEntries(
					Object.keys( expandedFilters ).map( key => [key, false] )
				)
			)
		}
		// filter-dropdown
	}

	// const hasActiveFilters = selectedService || selectedIndustry;
	const hasMoreProjects = currentPage < totalPages;

	return (
		<div>
			{ liveFilters && createPortal( (
				<>
					<div className="posts-header">
						{ filtersWithTerms && (
							<div className="posts-filters-controls">
								<div className="filter-group">
									{!initialLoad && (
										<span className="posts-results">Showing {posts.length} posts in</span>
									)}
									{ Object.keys( filtersWithTerms ).map( tax => (
										<div 
											className={ classNames( "filter-dropdown", [`filter-dropdown-${tax}`], { "filter-expanded": expandedFilters[tax] } ) }
										>
											<button 
												className="filter-label"
												onClick={ () => setExpandedFilters( { ...{ [tax]: !expandedFilters[tax] } } ) }
											>
												{ filters[tax] ? filters[tax] : "Select an option" }
											</button>
											{ expandedFilters[tax] === true && (
												<div className="dropdown">
													{ filtersWithTerms[tax].map( term => (
														<label>
															<span className="checkbox-wrapper">
																<input 
																	type="checkbox"
																	onChange={ () => updateSearchTerm( tax, term.slug, !term.selected ) }
																	checked={ term.selected === 1 }
																	value="1"
																/>
															</span>
															{term.name}</label>
													) ) }
												</div>
											) }
										</div>
									) ) }
								</div>
							</div>
						) }
					</div>
				</>
			), liveFilters ) }
			{ liveMore && createPortal( (
				<div className="live-posts-more">
					{ hasMoreProjects && (
						<button
							onClick={ handleLoadMore }
							disabled={loading}
							className="load-more-btn"
						>
							{ moreLabel }
						</button>
					) } 
					<p>Showing {posts.length} out of {totalProjects} posts</p>
				</div>
			), liveMore ) }
			<>
				{ loading && posts.length === 0 ? (
					<div className="post-loading">
						<div className="post-grid">
							{ [...Array(limit)].map( (_, i) => (
								<div className={ "post-card loading type-" + postType }></div>
							))}
						</div>
					</div>
				) : posts.length === 0 ? (
					<div className="post-no-results">
						<p>No posts found matching your criteria.</p>
					</div>
				) : (
					<>
						<div className={ classNames( "post-grid", { "in-load-more": loading } ) }>
							{posts.map(post => (
								<div className={ "post-card type-" + postType } dangerouslySetInnerHTML={{ __html: post.formatted }} />
							))}
						</div>
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
		const moreLabel = liveMore ? liveMore.attributes.content.value : "Load more";
		// const mutliSelect = liveFilters && liveFilters.attributes.multiselect.value !== "1" ? false : true;
		const root = createRoot(
			livePosts
		);
		root.render( <LivePosts
			liveMore={ liveMore }
			liveFilters={ liveFilters }
			filters={ filterlabels }
			postType={ postType }
			limit={ limit }
			moreLabel={ moreLabel }
			// mutliSelect={ mutliSelect }
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