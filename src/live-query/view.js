import apiFetch from '@wordpress/api-fetch';

import domReady from '@wordpress/dom-ready';
import { createRoot, createPortal } from '@wordpress/element';
import { useState, useEffect, useRef } from '@wordpress/element';
import { addQueryArgs, getQueryArgs } from '@wordpress/url';
// import Select from 'react-select';
import classNames from 'classnames'

// module-level nonce middleware — nonce property is mutable
const nonceMiddleware = apiFetch.createNonceMiddleware(window.wpApiSettings?.nonce ?? '');
apiFetch.use(nonceMiddleware);

const stripHtml = (html) => (html || '').replace(/<[^>]+>/g, '');

// Rewrite only <a href> targets within an HTML fragment — img src/srcset (and anything else) is left alone
const rewriteAnchorHrefs = (html, pattern, toDomain) => {
	if (!html) {
		return html;
	}

	const doc = new DOMParser().parseFromString(html, 'text/html');
	doc.querySelectorAll('a[href]').forEach((a) => {
		a.setAttribute('href', a.getAttribute('href').replace(pattern, toDomain));
	});
	return doc.body.innerHTML;
};

// HTML fragments rendered by the block — only their <a href> targets get rewritten
const POST_HTML_FIELDS = ['content', 'rendered', 'formatted'];

const rewritePostUrls = (post, fromDomain, toDomain) => {
	const escapedFrom = fromDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const pattern = new RegExp(escapedFrom, 'gi');

	const rewritten = { ...post };

	POST_HTML_FIELDS.forEach((field) => {
		if (typeof rewritten[field] === 'string') {
			rewritten[field] = rewriteAnchorHrefs(rewritten[field], pattern, toDomain);
		}
	});

	// The plain permalink also functions as a link target, so it's rewritten too;
	// featured_image is intentionally left untouched, same as image URLs inside the HTML fields above
	if (typeof rewritten.link === 'string') {
		rewritten.link = rewritten.link.replace(pattern, toDomain);
	}

	return rewritten;
};

const refreshNonce = async () => {
	const res = await window.fetch('/wp-admin/admin-ajax.php', {
		method: 'POST',
		credentials: 'same-origin',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({ action: 'live_query_nonce' }),
	});
	if (res.ok) {
		nonceMiddleware.nonce = (await res.text()).trim();
	}
};

// URL query arg holding the live search keyword — avoids WordPress' reserved `s` / `search` query vars
const SEARCH_ARG = 'keyword';
const SEARCH_DEBOUNCE = 400;

const LivePosts = ({ liveMore, liveFilters, liveSearch, searchLabel, searchPlaceholder, searchShowLabel, initSearch = '', filters, postType, limit, moreLabel, layout, hideEmpty, initFilters, additionalParams = {}, staticTaxQuery = {}, rootUrl, urlRewriteEnabled, urlRewriteFrom, urlRewriteTo }) => {
	const [posts, setPosts] = useState([]);
	const [filtersLoaded, setFiltersLoaded] = useState(false);
	const [filtersWithTerms, setFiltersWithTerms] = useState(null);
	const [expandedFilters, setExpandedFilters] = useState({});
	const [searchQueries, setSearchQueries] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalProjects, setTotalProjects] = useState(0);
	const [loading, setLoading] = useState(true);
	const [initialLoad, setInitialLoad] = useState(true);
	const [searchInput, setSearchInput] = useState(initSearch);
	const [searchTerm, setSearchTerm] = useState(initSearch);

	// handle click off
	const clickDocument = useRef(null);
	// id of the latest posts request, so slower stale responses are ignored
	const latestRequest = useRef(0);

	// const apiUrl = window.projectFiltersData.apiUrl;
	const perPage = limit ? limit : 6;

	useEffect(() => {
		if (liveFilters) {
			fetchTaxonomies();
		}
		else {
			setFiltersWithTerms({});
		}
		setFiltersLoaded(true);

		// mouse event handler
		document.addEventListener('mousedown', handleClickOutside);

		// Clean up event listener on unmount
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Fetch projects when filters or the search term change
	useEffect(() => {
		if (postType.length > 0 && filtersLoaded) {
			fetchPosts(1, false);
		}
	}, [filtersWithTerms, searchTerm]);

	// Debounce typing into the search box before it triggers a fetch
	useEffect(() => {
		const trimmed = searchInput.trim();
		if (trimmed === searchTerm) {
			return;
		}
		const timeout = setTimeout(() => applySearch(trimmed), SEARCH_DEBOUNCE);
		return () => clearTimeout(timeout);
	}, [searchInput]);

	const fetchTaxonomies = async () => {
		await refreshNonce();
		let queryParams = { ...additionalParams };

		if (filters) {
			queryParams.taxonomies = Object.keys(filters);
		}
		if (hideEmpty) {
			queryParams["hide_empty"] = "1";
		}

		fetch( new Request( rootUrl + addQueryArgs('/live-query/v1/terms', queryParams) ) )
		.then( response => {
			if ( !response.ok ) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.json();
		} )
		.then((data) => {
			// if( initFilters.length > 0 ) {
			const tempTaxTerms = data.taxonomyTerms;
			Object.keys(initFilters).forEach(key => (
				tempTaxTerms[key] = tempTaxTerms[key].map(term => (
					{ ...term, selected: initFilters[key].includes(term.slug) ? 1 : 0 }
				))
			)
			);

			setFiltersWithTerms(tempTaxTerms);
			setExpandedFilters(
				Object.fromEntries(
					Object.keys(data.taxonomyTerms).map(
						key => [key, false]
					)
				)
			);
		});

	};

	const fetchPosts = async (page = 1, append = false) => {
		const requestId = ++latestRequest.current;
		await refreshNonce();
		// let queryParams = { ...additionalParams };
		setLoading(true);

		const exclude = document.body.classList.contains('single')
		const postId = document.body.attributes.class.value.match(/postid-(\d+)/);

		try {
			// add taxonomies
			const taxQuery = {};
			if (filtersWithTerms) {
				Object.keys(filtersWithTerms).map(key => {
					taxQuery[key] = [];
					filtersWithTerms[key].forEach(t => {
						if (t.selected === 1) {
							taxQuery[key].push(t.slug);
						}
					})
				});
			}

			const params = {
				...additionalParams,
				page: page,
				per_page: perPage,
				post_type: postType,
				...(exclude && postId && { exclude: postId[1] }),
				tax_query: taxQuery,
				static_tax_query: staticTaxQuery,
				...(searchTerm && { search: searchTerm })
			};
			console.log( params );
			

			fetch( new Request( rootUrl + addQueryArgs("/live-query/v1/posts", params) ) )
			.then( response => {
				if ( !response.ok ) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.json();
			} )
			.then((res) => {
				if (requestId !== latestRequest.current) {
					return;
				}
				const fetchedPosts = urlRewriteEnabled && urlRewriteFrom && urlRewriteTo
					? (res.posts || []).map((post) => rewritePostUrls(post, urlRewriteFrom, urlRewriteTo))
					: res.posts;

				setTotalPages(parseInt(res.total_pages));
				setTotalProjects(parseInt(res.total));
				setCurrentPage(page);
				setInitialLoad(false);
				setPosts(page === 1 ? fetchedPosts : [...posts, ...fetchedPosts]);
				setLoading(false);
			});
		} catch (error) {
			console.error('Error fetching posts:', error);
		}
	};

	const handleLoadMore = () => {
		if (currentPage < totalPages) {
			fetchPosts(currentPage + 1, true);
		}
	};

	const baseURL = () => window.location.href.split("?")[0];

	const setUpdatedURL = (newTerms = {}, keyword = searchTerm) => {
		const taxQuery = {};
		const allTerms = { ...filtersWithTerms, ...newTerms };
		Object.keys(allTerms || {}).map(key => {
			taxQuery[key] = [];
			allTerms[key].forEach(t => {
				if (t.selected === 1) {
					taxQuery[key] = taxQuery[key].length === 0 ? t.slug : taxQuery[key] + "," + t.slug;
				}
			})
		});
		if (keyword) {
			taxQuery[SEARCH_ARG] = keyword;
		}
		const url = addQueryArgs(baseURL(), taxQuery);
		window.history.pushState({}, "Page", url);
	}

	const applySearch = (keyword) => {
		if (keyword === searchTerm) {
			return;
		}
		setCurrentPage(1);
		setSearchTerm(keyword);
		setUpdatedURL({}, keyword);
	}

	const clearSearch = () => {
		setSearchInput('');
		applySearch('');
	}

	const updateSearchTerm = (tax, slug, state) => {
		setCurrentPage(1);

		const newTaxTerms = {}
		newTaxTerms[tax] = filtersWithTerms[tax].map(insideTerm => {
			if (insideTerm.slug === slug) {
				return { ...insideTerm, selected: state ? 1 : 0 }
			}
			return insideTerm;
		});

		setFiltersWithTerms(
			{
				...filtersWithTerms,
				...newTaxTerms
			}
		);

		setUpdatedURL({
			...newTaxTerms
		});
	}

	const clearSearchTerm = (tax) => {
		setCurrentPage(1);

		const newTaxTerms = {}
		newTaxTerms[tax] = filtersWithTerms[tax].map(insideTerm => {
			return { ...insideTerm, selected: 0 }
		});

		setFiltersWithTerms(
			{
				...filtersWithTerms,
				...newTaxTerms
			}
		);

		setUpdatedURL({
			...newTaxTerms
		});
	}

	const handleClickOutside = (e) => {
		if (e.target.closest(".filter-select") === null) {
			setExpandedFilters(
				Object.fromEntries(
					Object.keys(expandedFilters).map(key => [key, false])
				)
			)
		}
		// filter-dropdown
	}

	// const hasActiveFilters = selectedService || selectedIndustry;
	const hasMoreProjects = currentPage < totalPages;

	return (
		<div>
			{liveFilters && createPortal((
				<>
					<div className="posts-header">
						{filtersWithTerms && (
							<div className="posts-filters-controls">
								<div className="live-query-filter-group">
									{!initialLoad && (
										<span className="posts-results">Showing {posts.length} posts in</span>
									)}
									{Object.keys(filtersWithTerms).map(tax => {
										const selectedTerms = filtersWithTerms[tax].filter(term => term.selected === 1);
										const searchQuery = searchQueries[tax] || '';
										const matchingTerms = filtersWithTerms[tax].filter(term => (
											term.selected !== 1 && stripHtml(term.name).toLowerCase().includes(searchQuery.toLowerCase())
										));

										return (
											<div
												key={tax}
												className={classNames(`filter-${layout}`, [`filter-${layout}-${tax}`], { "filter-expanded": expandedFilters[tax] })}
											>
												{layout === "select" ? (
													<>
														<span className="filter-label">{filters[tax] ? filters[tax] : "Select an option"}</span>
														<div
															className="chip-input"
															onClick={() => setExpandedFilters({ [tax]: true })}
														>
															<div className="chip-list">
																{selectedTerms.map(term => (
																	<span className="chip" key={term.slug}>
																		<span dangerouslySetInnerHTML={{ __html: term.name }} />
																		<button
																			type="button"
																			className="chip-remove"
																			aria-label={`Remove ${stripHtml(term.name)}`}
																			onClick={(e) => {
																				e.stopPropagation();
																				updateSearchTerm(tax, term.slug, false);
																			}}
																		>
																			&times;
																		</button>
																	</span>
																))}
																<input
																	type="text"
																	className="chip-search"
																	placeholder={selectedTerms.length === 0 ? "Search..." : ""}
																	value={searchQuery}
																	onFocus={() => setExpandedFilters({ [tax]: true })}
																	onChange={(e) => setSearchQueries({ ...searchQueries, [tax]: e.target.value })}
																/>
															</div>
														</div>
														{expandedFilters[tax] === true && (
															<div className="dropdown">
																{matchingTerms.length === 0 ? (
																	<div className="dropdown-empty">No matches found</div>
																) : (
																	matchingTerms.map(term => (
																		<button
																			type="button"
																			key={term.slug}
																			className="dropdown-option"
																			onClick={() => {
																				updateSearchTerm(tax, term.slug, true);
																				setSearchQueries({ ...searchQueries, [tax]: '' });
																			}}
																			dangerouslySetInnerHTML={{ __html: term.name }}
																		/>
																	))
																)}
															</div>
														)}
													</>
												) : (
													<>
														<button
															className="filter-label"
															onClick={() => clearSearchTerm(tax)}
														>
															{filters[tax] ? filters[tax] : "Select an option"}
														</button>
														{filtersWithTerms[tax].map(term => (
															<label key={term.slug}>
																<span className="checkbox-wrapper">
																	<input
																		type="checkbox"
																		onChange={() => updateSearchTerm(tax, term.slug, !term.selected)}
																		checked={term.selected === 1}
																		value="1"
																	/>
																</span>
																{term.name}</label>
														))}
													</>
												)}
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</>
			), liveFilters)}
			{liveSearch && createPortal((
				<form
					className="live-query-search"
					role="search"
					onSubmit={(e) => {
						e.preventDefault();
						applySearch(searchInput.trim());
					}}
				>
					<label
						className={classNames("search-label", { "screen-reader-text": !searchShowLabel })}
						htmlFor="live-query-search-input"
					>
						{searchLabel}
					</label>
					<div className="search-field">
						<input
							id="live-query-search-input"
							type="search"
							className="search-input"
							placeholder={searchPlaceholder}
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
						{searchInput.length > 0 && (
							<button
								type="button"
								className="search-clear"
								aria-label="Clear search"
								onClick={clearSearch}
							>
								&times;
							</button>
						)}
					</div>
				</form>
			), liveSearch)}
			{liveMore && createPortal((
				<div className="live-posts-more">
					{hasMoreProjects && (
						<button
							onClick={handleLoadMore}
							disabled={loading}
							className="load-more-btn"
						>
							{moreLabel}
						</button>
					)}
					{ parseInt( posts.length ) > 0 && (
						<p>Showing {posts.length} out of {totalProjects} posts</p>
					) }
				</div>
			), liveMore)}
			<>
				{loading && posts.length === 0 ? (
					<div className="post-grid post-loading">
						{[...Array(limit)].map((_, i) => (
							<div className={"post-card loading type-" + postType}></div>
						))}
					</div>
				) : posts.length === 0 ? (
					<div className="post-no-results">
						<p>No {postType}s found matching your criteria.</p>
					</div>
				) : (
					<>
						<div className={classNames("post-grid", { "in-load-more": loading })}>
							{posts.map(post => (
								<div className={"post-card type-" + postType} dangerouslySetInnerHTML={{ __html: post.formatted }} />
							))}
						</div>
					</>
				)}
			</>
		</div>
	);
};

// Render the app
domReady(() => {
	const container = document.querySelector('.wp-block-scm-live-query');
	const livePosts = container.querySelector('.wp-block-scm-live-posts');

	if (livePosts) {
		const liveMore = container.querySelector('.wp-block-scm-live-more');
		const liveFilters = container.querySelector('.wp-block-scm-live-filters');
		const liveSearch = container.querySelector('.wp-block-scm-live-search');
		// attributes
		const postType = container.attributes.posttype.value;
		const limit = parseInt(container.attributes.limit.value);
		const rootUrl = container.attributes.rooturl.value ? container.attributes.rooturl.value : liveQueryData?.rootUrl;
		const urlRewriteEnabled = container.attributes.urlrewriteenabled?.value === "1";
		const urlRewriteFrom = container.attributes.urlrewritefrom?.value || '';
		const urlRewriteTo = container.attributes.urlrewriteto?.value || '';

		let additionalParams = {};
		if (container.attributes.params?.value) {
			try {
				additionalParams = JSON.parse(container.attributes.params.value);
			} catch (e) {
				console.error('Live Query: invalid additional params JSON', e);
			}
		}

		let staticTaxQuery = {};
		if (container.attributes.taxquery?.value) {
			try {
				staticTaxQuery = JSON.parse(container.attributes.taxquery.value);
			} catch (e) {
				console.error('Live Query: invalid static taxonomy filter JSON', e);
			}
		}
		const filterlabels = liveFilters ? JSON.parse(liveFilters.attributes.filters.value) : undefined;
		const moreLabel = liveMore ? liveMore.attributes.content.value : "Load more";
		const layout = liveFilters ? liveFilters.attributes.layout.value : "select";

		// const mutliSelect = liveFilters && liveFilters.attributes.multiselect.value !== "1" ? false : true;
		const hideEmpty = liveFilters && liveFilters.attributes.hideempty.value !== "1" ? false : true;

		// query args
		const args = getQueryArgs(window.location.href);
		const initFilters = {};
		if (filterlabels) {
			Object.keys(filterlabels).forEach(tax => {
				if (args[tax]?.length > 0) {
					initFilters[tax] = args[tax].split(",");
				}
			});
		}
		const initSearch = liveSearch && typeof args[SEARCH_ARG] === 'string' ? args[SEARCH_ARG].trim() : '';
		const searchLabel = liveSearch?.attributes.label?.value || 'Search';
		const searchPlaceholder = liveSearch?.attributes.placeholder?.value || '';
		const searchShowLabel = liveSearch?.attributes.showlabel?.value === "1";

		// const initService = args.service ? args.service : '';
		// const initIndustry = args.industry ? args.industry : '';

		const root = createRoot(
			livePosts
		);
		root.render(<LivePosts
			liveMore={liveMore}
			liveFilters={liveFilters}
			liveSearch={liveSearch}
			searchLabel={searchLabel}
			searchPlaceholder={searchPlaceholder}
			searchShowLabel={searchShowLabel}
			initSearch={initSearch}
			filters={filterlabels}
			initFilters={initFilters}
			postType={postType}
			limit={limit}
			moreLabel={moreLabel}
			layout={layout}
			hideEmpty={hideEmpty}
			rootUrl={rootUrl}
			additionalParams={additionalParams}
			staticTaxQuery={staticTaxQuery}
			urlRewriteEnabled={urlRewriteEnabled}
			urlRewriteFrom={urlRewriteFrom}
			urlRewriteTo={urlRewriteTo}
		// mutliSelect={ mutliSelect }
		/>);
	}
});

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
observer.observe(document.body, {
	childList: true,
	subtree: true
});

function handleImageLoad(img) {
	img.classList.add("has-loaded");
}