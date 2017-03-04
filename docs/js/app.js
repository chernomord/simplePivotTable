/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./app.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./app.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PivotBuilder; });
// 'use strict';

/**
 * Pivot builder class
 */
class PivotBuilder {
    constructor () {
    }

    /**
     * Builds Array of Rows or Columns with values of corresponding names
     * @param data {Object[]} - input data [ {year:2016, fruit: "Apples"} ... { } ]
     * @param rowNames {String[]} - names array, like ['year','fruit']
     * @returns {String[][]} - it's line [['2014', 'Apples'] ... ['2017', 'Bananas']]
     */
    getRowsArray (data, rowNames) {
        let result = [];
        for (let item of data) {
            let dummy = [];
            for (let name of rowNames) {
                dummy.push(item[name]);
            }
            if (JSON.stringify(result).indexOf(JSON.stringify(dummy)) < 0) {
                result.push(dummy);
            }
        }
        result.sort((a, b) => {
            for (let i = 0; i < a.length; ++i) {
                if (a[i] < b[i]) return -1;
                if (a[i] > b[i]) return 1;
            }
            return 0
        });
        return result;
    }

    /**
     * Find and returns data items witch fields values matches every input fields values
     * @param data {Object[]}
     * @param fields {String[]}
     * @param values {String[]}
     * @returns {Array}
     */
    findMatched (data, fields, values) {
        let result = [];
        for (let item of data) { // iterate data array
            let objectFound = false;
            let obj = {};
            for (let prop in fields) { // iterate array of searched props names
                let field = fields[prop];
                let value = values[prop];
                obj[field] = value;
                if (item[field] === value) {
                    objectFound = true
                } else {
                    objectFound = false;
                    break;
                }
            }
            if (objectFound) result.push(item);
        }
        return result
    }

    /**
     * Gets pivot table, each cell contains array of matched data items
     * @param data {Object[]} - input data
     * @param rowNames {String[]} - names array, like ['year','fruit']
     * @param colNames {String[]} - names array, like ['year','fruit']
     * @returns {Any[][]} - result like [[[{dataItem},...], ... ], ... ]
     */
    pivotResultsRaw (data, rowNames, colNames) {
        let result = [];
        let allProps = rowNames.concat(colNames);
        let rowProps = this.getRowsArray(data, rowNames);
        let colProps = this.getRowsArray(data, colNames);
        for (let rowIdx in rowProps) { // iterate rows values
            result[rowIdx] = [];
            for (let colIdx in colProps) { // iterate cols values
                let allValues = rowProps[rowIdx].concat(colProps[colIdx]);
                result[rowIdx][colIdx] = this.findMatched(data, allProps, allValues);
            }
        }

        return result;
    }

    /**
     * Calculate result using raw array of results for each pivot cell
     * @param rawResultsTable {Any[][]} - like [ [ [ {dataItem},... ], ... ], ... ]
     * @param callback {Function} - function that takes cell items array as parameter and expected to return single value
     * @returns {Array[]} - calculated results for each cell, like: [ [ [45], ... ], ... ]
     */
    calculateResults (rawResultsTable, callback) {
        let refinedResults = [];
        for (let rowId in rawResultsTable) {
            refinedResults[rowId] = [];
            for (let colId in rawResultsTable[rowId]) {
                let matchedItems = rawResultsTable[rowId][colId];
                refinedResults[rowId][colId] = callback(matchedItems);
            }
        }
        return refinedResults
    }

    /**
     * Compose table head
     * @param rowNames {Array}
     * @param colNames {Array}
     * @param cols {Array}
     * @returns {Element}
     */
    composeTHead (rowNames, colNames, cols) {
        let $thead = document.createElement('thead');

        for (let colInnerIdx in colNames) {
            colInnerIdx = +colInnerIdx;
            let $row = document.createElement('tr');
            for (let i = 0; i < rowNames.length + 1; ++i) {
                let $cell = document.createElement('th');
                $cell.classList.add('col-name');
                if (i === rowNames.length) $cell.innerText = colNames[colInnerIdx];
                $row.appendChild($cell);
            }
            let colspan = 1;
            cols.map((rowVal, i) => { // header prop values
                let nextColVal = (cols[i + 1]) ? cols[i + 1][colInnerIdx] : undefined;
                let curColVal = rowVal[colInnerIdx];

                let $th = document.createElement('th');
                $th.innerText = rowVal[colInnerIdx];
                if (colNames.length === colInnerIdx + 1) $th.setAttribute('rowspan', 2);
                if (nextColVal === curColVal) {
                    // if next value is the same then increment colspan and pass
                    colspan++;
                } else {
                    // else add cell and reset colspan
                    $th.setAttribute('colspan', colspan);
                    colspan = 1;
                    $row.appendChild($th);
                }

            });
            $thead.appendChild($row);
        }
        let newRow = $thead.insertRow();
        for (let i = 0, l = rowNames.length + 1; i < l; ++i) {
            let $th = document.createElement('th');
            if (rowNames[i]) {
                $th.classList.add('col-name');
                $th.innerText = rowNames[i];
            }

            newRow.appendChild($th);
        }

        return $thead;
    }

    /**
     *
     * @param results {Array}
     * @param rows {String[][]}
     * @returns {Element}
     */
    composeTBody (results, rows) {
        let $tbody = document.createElement('tbody');

        let rowspan = [];
        let cellToSpan = [];

        for (let rowIdx in results) {
            rowIdx = +rowIdx;
            let $row = document.createElement('tr');
            // headers
            for (let rowColIdx in rows[rowIdx]) {
                rowColIdx = +rowColIdx;
                let prevRowVal = (rows[rowIdx - 1]) ? rows[rowIdx - 1][rowColIdx] : undefined;
                let nextRowVal = (rows[rowIdx + 1]) ? rows[rowIdx + 1][rowColIdx] : undefined;
                let currRowVal = rows[rowIdx][rowColIdx];
                let $td = document.createElement('td');
                $td.innerText = rows[rowIdx][rowColIdx];
                $td.classList.add('rowLabel');

                if (currRowVal !== nextRowVal && currRowVal !== prevRowVal) {
                    $row.appendChild($td);
                }
                // start of repeating row headers
                if (currRowVal === nextRowVal) {
                    if (!rowspan[rowColIdx]) rowspan[rowColIdx] = 1;
                    if (rowspan[rowColIdx] === 1) {
                        cellToSpan[rowColIdx] = $td;
                        $row.appendChild(cellToSpan[rowColIdx]);
                    }
                    rowspan[rowColIdx]++;
                }
                // end of repeating row headers
                if (currRowVal !== nextRowVal && currRowVal === prevRowVal) {
                    if (cellToSpan[rowColIdx]) {
                        cellToSpan[rowColIdx].setAttribute('rowspan', rowspan[rowColIdx] + '');
                    }
                    rowspan[rowColIdx] = 1;
                }

                if (rows[rowIdx].length === rowColIdx + 1) {
                    $td.setAttribute('colspan', 2);
                }
            }
            // results
            for (let result of results[rowIdx]) {
                let $td = document.createElement('td');
                $td.innerText = result || '';
                $td.classList.add('cell');
                $row.appendChild($td);
            }
            $tbody.appendChild($row);
        }
        return $tbody
    }

    /**
     * Main method, returns resulted HTMLElement with calculated Pivot table
     * @param data {Object[]} - input data
     * @param rowNames {String[]} - names array, like ['year','fruit']
     * @param colNames {String[]} - names array, like ['year','fruit']
     * @param calculateResultCallback {Function} - function that takes cell items array as parameter and expected
     * to return single value
     * @returns {HTMLElement}
     */
    renderFknTable (data, rowNames, colNames, calculateResultCallback) {

        let resultsRaw = this.pivotResultsRaw(data, rowNames, colNames);
        let results = this.calculateResults(resultsRaw, calculateResultCallback);

        let rows = this.getRowsArray(data, rowNames);
        let cols = this.getRowsArray(data, colNames);

        let $table = document.createElement('table');
        $table.classList.add('pivot-table');

        let $thead = this.composeTHead(rowNames, colNames, cols);
        let $tbody = this.composeTBody(results,rows);

        $table.appendChild($thead);
        $table.appendChild($tbody);
        return $table;
    }
}





/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".pivot-table {\r\n    margin: 20px auto;\r\n    border-spacing: 0;\r\n    font-family: Verdana, Arial, sans-serif;\r\n    font-size: 11px;\r\n    overflow: hidden;\r\n    border-collapse: collapse;\r\n}\r\n\r\n.pivot-table th,\r\n.pivot-table td {\r\n    border: 1px solid lightgray;\r\n}\r\n\r\n.pivot-table .col-name {\r\n    font-weight: normal;\r\n}\r\n\r\n.pivot-table .rowLabel {\r\n    vertical-align: top;\r\n}\r\n\r\n.pivot-table td,\r\n.pivot-table th {\r\n    position: relative;\r\n    padding: 6px 6px;\r\n}\r\n\r\n.pivot-table .rowLabel {\r\n    text-align: left;\r\n    font-weight: bold;\r\n}\r\n\r\n.pivot-table .cell {\r\n    text-align: right;\r\n    vertical-align: bottom;\r\n}\r\n\r\n.pivot-table tbody tr:nth-of-type(odd) .cell {\r\n    background: rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n.pivot-table th {\r\n    text-align: right;\r\n}\r\n\r\n.pivot-table .cell:hover::after {\r\n    content: \"\";\r\n    position: absolute;\r\n    background: rgba(148, 166, 197, 0.2);\r\n    left: 0;\r\n    top: -5000px;\r\n    height: 10000px;\r\n    width: 100%;\r\n    z-index: -1;\r\n}", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dataCrawler_DataCrawler__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_css__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__app_css__);



let pivot = new __WEBPACK_IMPORTED_MODULE_0__dataCrawler_DataCrawler__["a" /* PivotBuilder */]();

window.pivotTabe = pivot.renderFknTable.bind(pivot);



/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map