/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/dom-ready":
/*!**********************************!*\
  !*** external ["wp","domReady"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["domReady"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/url":
/*!*****************************!*\
  !*** external ["wp","url"] ***!
  \*****************************/
/***/ ((module) => {

module.exports = window["wp"]["url"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************************!*\
  !*** ./src/filter-projects/view.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/dom-ready */ "@wordpress/dom-ready");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);







const EverythingFilter = ({
  postType,
  restEndpoint,
  limit,
  moreButton,
  showFilter,
  showProjectsLink,
  initService,
  initIndustry
}) => {
  const [posts, setPosts] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  const [services, setServices] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  const [industries, setIndustries] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  const [selectedService, setSelectedService] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(initService);
  const [selectedIndustry, setSelectedIndustry] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(initIndustry);
  const [currentPage, setCurrentPage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
  const [totalPages, setTotalPages] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
  const [totalProjects, setTotalProjects] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [initialLoad, setInitialLoad] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
  const [loadedImages, setLoadedImages] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const handleImageLoad = id => {
    setLoadedImages(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // const apiUrl = window.projectFiltersData.apiUrl;
  const perPage = limit ? limit : 6;

  // Fetch taxonomies on mount
  // useEffect(() => {
  // 	fetchTaxonomies();
  // }, []);

  // Fetch projects when filters change
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (postType && restEndpoint) {
      fetchPosts(1, false);
      // setUpdatedURL();
    }
  }, [selectedService, selectedIndustry]);

  // const fetchTaxonomies = async () => {
  // 	apiFetch( { 
  // 		path: '/project-filters/v1/services' // addQueryArgs( '/services', queryParams )
  // 	} ).then( ( data ) => {
  // 		setServices( data.services || [] );
  // 	} );

  // 	apiFetch( { 
  // 		path: '/project-filters/v1/industries' // addQueryArgs( '/industries', queryParams )
  // 	} ).then( ( data ) => {
  // 		setIndustries( data.industries || [] );
  // 	} );
  // };

  const fetchPosts = async (page = 1, append = false) => {
    setLoading(true);
    const exclude = document.body.classList.contains('single');
    const postId = document.body.attributes.class.value.match(/postid-(\d+)/);
    try {
      const params = {
        page: page,
        per_page: perPage,
        post_type: postType,
        ...(exclude && postId && {
          exclude: postId[1]
        })
      };

      // add taxonomies
      // if (selectedService) {
      // 	params.service = selectedService;
      // }
      // if (selectedIndustry) {
      // 	params.industry = selectedIndustry;
      // }

      _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
        path: (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_3__.addQueryArgs)("everything-filter/v1/posts", params)
      }).then(res => {
        setTotalPages(parseInt(res.total_pages));
        setTotalProjects(parseInt(res.total));
        setCurrentPage(page);
        setInitialLoad(false);
        setPosts(res.posts);
        // return res.json();
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchPosts(currentPage + 1, true);
    }
  };
  const baseURL = () => (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_3__.removeQueryArgs)(window.location.href, 'service', 'industry');
  const setUpdatedURL = () => {
    const url = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_3__.addQueryArgs)(baseURL(), {
      ...(selectedService.length > 0 && {
        service: selectedService
      }),
      ...(selectedIndustry.length > 0 && {
        industry: selectedIndustry
      })
    });
    window.history.pushState({}, "Page", url);
  };
  const handleServiceChange = ({
    value
  }) => {
    setSelectedService(value);
    setCurrentPage(1);
    // update URL
    // setUpdatedURL();
  };
  const handleIndustryChange = ({
    value
  }) => {
    setSelectedIndustry(value);
    setCurrentPage(1);
    // update URL
    // setUpdatedURL();
  };
  const handleReset = () => {
    setSelectedService('');
    setSelectedIndustry('');
    setCurrentPage(1);
  };
  const hasActiveFilters = selectedService || selectedIndustry;
  const hasMoreProjects = currentPage < totalPages;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: `posts-filters-container posts-limit-${perPage}`,
    children: [(showFilter || showProjectsLink) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "posts-header",
      children: showProjectsLink && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        class: "wp-block-buttons is-content-justification-center is-layout-flex wp-block-buttons-is-layout-flex",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          class: "wp-block-button is-style-minimal",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
            class: "wp-block-button__link wp-element-button",
            href: "/projects",
            children: "projects overview"
          })
        })
      })
    }), loading && posts.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "project-loading",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        children: "Loading posts..."
      })
    }) : posts.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "project-no-results",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        children: "No posts found matching your criteria."
      })
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "project-grid",
        children: posts.map(post => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "post-card",
          children: [post.featured_image && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "post-image",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("a", {
              href: post.link,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("img", {
                src: post.featured_image,
                alt: post.title,
                className: loadedImages[post.id] ? 'has-loaded' : '',
                loading: "lazy",
                onLoad: () => handleImageLoad(post.id)
              }), post.featured_media]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "post-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h6", {
              className: "post-title",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
                href: post.link,
                children: post.title
              })
            }), post.excerpt && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              className: "post-excerpt",
              dangerouslySetInnerHTML: {
                __html: post.excerpt
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
              href: post.link,
              className: "post-link",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                className: "label",
                children: "explore the post"
              })
            })]
          })]
        }, post.id))
      }), moreButton && hasMoreProjects && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "project-load-more",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
          onClick: handleLoadMore,
          disabled: loading,
          className: "load-more-btn",
          children: loading ? 'Loading...' : 'show more projects'
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("p", {
          children: ["Showing ", posts.length, " out of ", totalProjects, " projects"]
        })]
      })]
    })]
  });
};

// Render the app
_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0___default()(() => {
  const container = document.querySelector('.wp-block-six-character-media-everything-filter');
  const root = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createRoot)(container);
  const postType = container.attributes.posttype.value;
  const restEndpoint = container.attributes.restendpoint.value;
  const limit = parseInt(container.attributes.limit.value);
  const morebutton = container.attributes.morebutton.value === "1" ? true : false;
  const showFilter = container.attributes.showfilters.value === "1" ? true : false;
  const showProjectsLink = container.attributes.showprojectslink.value === "1" ? true : false;
  const args = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_3__.getQueryArgs)(window.location.href);
  const initService = args.service ? args.service : '';
  const initIndustry = args.industry ? args.industry : '';
  root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(EverythingFilter, {
    postType: postType,
    restEndpoint: restEndpoint,
    limit: limit,
    moreButton: morebutton,
    showFilter: showFilter,
    showProjectsLink: showProjectsLink,
    initService: initService,
    initIndustry: initIndustry
  }));
});
})();

/******/ })()
;
//# sourceMappingURL=view.js.map