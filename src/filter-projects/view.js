import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs, getQueryArgs, removeQueryArgs } from '@wordpress/url';
import Select from 'react-select';

const EverythingFilter = ( { postType, filters, restEndpoint, limit, moreButton, showFilter, showProjectsLink, initService, initIndustry } ) => {
	const [posts, setPosts] = useState([]);
	const [filtersLoaded, setFiltersLoaded] = useState( false );
	// const [services, setServices] = useState([]);
	// const [industries, setIndustries] = useState([]);
	const [filtersWithTerms, setFiltersWithTerms] = useState( null );
	const [selectedService, setSelectedService] = useState( initService );
	const [selectedIndustry, setSelectedIndustry] = useState( initIndustry );
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalProjects, setTotalProjects] = useState(0);
	const [loading, setLoading] = useState(false);
	const [initialLoad, setInitialLoad] = useState(true);
	const [loadedImages, setLoadedImages] = useState({});
  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

	// const apiUrl = window.projectFiltersData.apiUrl;
	const perPage = limit ? limit : 6;


	// Fetch taxonomies on mount
	useEffect(() => {
		fetchTaxonomies();
		setFiltersLoaded( true );
	}, []);

	// Fetch projects when filters change
	useEffect(() => {
		if( postType && filtersLoaded ) {
			fetchPosts(1, false);
		}
	}, [filtersWithTerms]);
	

	const fetchTaxonomies = async () => {
		let queryParams = {};

		if( filters ) {
			queryParams.taxonomies = filters.split( "," );
		}

		apiFetch( { 
			path: addQueryArgs( '/everything-filter/v1/terms', queryParams )
		} ).then( ( data ) => {
			setFiltersWithTerms( data.taxonomyTerms );
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
				setPosts( res.posts );
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

	const baseURL = () => removeQueryArgs( window.location.href, 'service', 'industry' );

	const setUpdatedURL = () => {
		const url = addQueryArgs( baseURL(), {
			...( selectedService.length > 0 && { service: selectedService } ),
			...( selectedIndustry.length > 0 && { industry: selectedIndustry } ),
		} );
		window.history.pushState( {}, "Page", url );
	}

	// const handleServiceChange = ( { value } ) => {
	// 	setSelectedService( value );
	// 	setCurrentPage( 1 );
	// 	// update URL
	// 	// setUpdatedURL();
	// };

	// const handleIndustryChange = ( { value } ) => {
	// 	setSelectedIndustry( value );
	// 	setCurrentPage( 1 );
	// 	// update URL
	// 	// setUpdatedURL();
	// };

	const handleReset = () => {
		setSelectedService( '' );
		setSelectedIndustry( '' );
		setCurrentPage( 1 );
	};

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
	}

	const hasActiveFilters = selectedService || selectedIndustry;
	const hasMoreProjects = currentPage < totalPages;

	return (
		<div className={ `posts-filters-container posts-limit-${perPage}` }>
			{ ( showFilter || showProjectsLink ) && (
				<div className="posts-header">
					{ showFilter && filtersWithTerms && (
						<div className="posts-filters-controls">
							<div className="filter-group">
								{!initialLoad && (
									<span className="posts-results">Showing {posts.length} posts in</span>
								)}
								{ Object.keys( filtersWithTerms ).map( tax => (
									<div className={ "filter-dropdown filter-dropdown-" + tax }>
										<span className="filter-label">Select an option</span>
										{ filtersWithTerms[tax].map( term => (
											<label>
												<input 
													type="checkbox"
													onChange={ () => updateSearchTerm( tax, term.slug, !term.selected ) }
													checked={ term.selected === 1 }
													value="1"
												/>
												{term.name}</label>
										) ) }
									</div>
								) ) }
							</div>
						</div>
					) }
				</div>
			) }

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
							<div key={post.id} className="post-card">
								{post.featured_image && (
									<div className="post-image">
										<a href={post.link}>
											<img 
												src={post.featured_image} 
												alt={post.title} 
												className={ loadedImages[post.id] ? 'has-loaded' : '' }
												loading="lazy"
												onLoad={ () => handleImageLoad( post.id ) }
											/>
											{ post.featured_media }
										</a>
									</div>
								)}
								<div className="post-content">
									<h6 className="post-title">
										<a href={post.link}>{post.title}</a>
									</h6>

									{post.excerpt && (
										<div
											className="post-excerpt"
											dangerouslySetInnerHTML={{ __html: post.excerpt }}
										/>
									)}
									<a href={post.link} className="post-link">
										<span className="label">explore the post</span>
									</a>
								</div>
							</div>
						))}
					</div>

					{ moreButton && hasMoreProjects && (
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
					)}
				</>
			)}
		</div>
	);
};

// Render the app
domReady( () => {
	const container = document.querySelector( '.wp-block-six-character-media-everything-filter' );
	const root = createRoot(
		container
	);

	const postType = container.attributes.posttype.value;
	const filters = container.attributes.filters.value;
	const restEndpoint = container.attributes.restendpoint.value;
	const limit = parseInt( container.attributes.limit.value );
	const morebutton = container.attributes.morebutton.value === "1" ? true : false;
	const showFilter = container.attributes.showfilters.value === "1" ? true : false;
	const showProjectsLink = container.attributes.showprojectslink.value === "1" ? true : false;

	const args = getQueryArgs( window.location.href );
	const initService = args.service ? args.service : '';
	const initIndustry = args.industry ? args.industry : '';

	root.render( <EverythingFilter 
		postType={ postType }
		filters={ filters }
		restEndpoint={ restEndpoint }
		limit={ limit }
		moreButton={ morebutton }
		showFilter={ showFilter }
		showProjectsLink={ showProjectsLink }
		initService={ initService }
		initIndustry={ initIndustry }
	/> );
} );