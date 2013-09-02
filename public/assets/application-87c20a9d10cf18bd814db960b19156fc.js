/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );

(function(){"use strict";if(!("Ink"in window)){var e={Ink:window.location.protocol+"//js.ink.sapo.pt/Ink/"},r={},t=[],n={},o=[],i=function(e){if("object"!=typeof e)return!1;for(var r in e)return!1;return!0};window.Ink={_checkPendingRequireModules:function(){var e,t,n,i,u,c,a=[];for(e=0,t=o.length;t>e;++e)if(n=o[e]){for(i in n.left)u=r[i],u&&(n.args[n.left[i]]=u,delete n.left[i],--n.remaining);if(n.remaining>0)a.push(n);else{if(c=n.cb,!c)continue;delete n.cb,c.apply(!1,n.args)}}o=a,o.length>0&&setTimeout(function(){Ink._checkPendingRequireModules()},0)},_modNameToUri:function(r){if(-1!==r.indexOf("/"))return r;var t=r.replace(/_/g,".").split("."),n=t.shift(),o=e[n];return o||(o="./"+n+"/"),[o,t.join("/"),"/lib.js"].join("")},getPath:function(r){return e[r||"Ink"]},setPath:function(r,t){e[r]=t},loadScript:function(e){var r=document.createElement("script");r.setAttribute("type","text/javascript"),r.setAttribute("src",this._modNameToUri(e));var t=document.getElementsByTagName("head");t.length>0&&t[0].appendChild(r)},namespace:function(e,r){if(!e||!e.length)return null;for(var t,n=e.split("."),o=window,i=0,u=n.length;u>i;++i)o[n[i]]=o[n[i]]||{},t=o,o=o[n[i]];return r?[t,n[i-1]]:o},getModule:function(e,t){var n=t?[e,"_",t].join(""):e;return r[n]},createModule:function(e,o,u,c){var a=function(){if(!("number"==typeof o||"string"==typeof o&&o.length>0))throw Error("version must be passed!");var u=[e,"_",o].join("");if(!r[u]){delete n[u],delete n[e];var a=Array.prototype.slice.call(arguments),l=c.apply(window,a);t.push(u),"object"==typeof l?l._version=o:"function"==typeof l&&(l.prototype._version=o,l._version=o);var s,f=0===e.indexOf("Ink.");f&&(s=Ink.namespace(e,!0)),r[u]=l,f&&(s[0][s[1]+"_"+o]=l),r[e]=l,f&&i(s[0][s[1]])&&(s[0][s[1]]=l),this&&Ink._checkPendingRequireModules()}};this.requireModules(u,a)},requireModules:function(e,t){var i,u,c,a,l;for(u=e.length,c={args:Array(u),left:{},remaining:u,cb:t},i=0;u>i;++i)a=e[i],l=r[a],l?(c.args[i]=l,--c.remaining):(n[a]||(n[a]=!0,Ink.loadScript(a)),c.left[a]=i);c.remaining>0?o.push(c):t.apply(!0,c.args)},getModulesLoadOrder:function(){return t.slice()},getModuleScripts:function(){var e=this.getModulesLoadOrder();return e.unshift("Ink_1"),e=e.map(function(e){var r=e.indexOf(".");-1===r&&(r=e.indexOf("_"));var t=e.substring(0,r);e=e.substring(r+1);var n=Ink.getPath(t);return['<script type="text/javascript" src="',n,e.replace(/\./g,"/"),'/"></script>'].join("")}),e.join("\n")},bind:function(e,r){var t=Array.prototype.slice.call(arguments,2);return function(){var n=Array.prototype.slice.call(arguments),o=t.concat(n);return e.apply(r,o)}},bindEvent:function(e,r){var t=Array.prototype.slice.call(arguments,2);return function(n){var o=t.slice();return o.unshift(n||window.event),e.apply(r,o)}},i:function(e){if(!e)throw Error("Ink.i => id or element must be passed");return"string"==typeof e?document.getElementById(e):e},s:function(e,r){if(Ink.Dom===void 0||Ink.Dom.Selector===void 0)throw Error("This method requires Ink.Dom.Selector");if(document.querySelector)return(r||document).querySelector(e);var t=Ink.Dom.Selector.select(e,r||document);return t.length>0?t[0]:null},ss:function(e,r){if(Ink.Dom===void 0||Ink.Dom.Selector===void 0)throw Error("This method requires Ink.Dom.Selector");if(document.querySelectorAll){var t=(r||document).querySelectorAll(e);return Array.prototype.slice.call(t)}return Ink.Dom.Selector.select(e,r||document)},extendObj:function(e,r){if(r)for(var t in r)r.hasOwnProperty(t)&&(e[t]=r[t]);return e}}}})();
Ink.createModule("Ink.Net.Ajax","1",[],function(){"use strict";var Ajax=function(t,e){this.init(t,e)};Ajax.globalOptions={parameters:{},requestHeaders:{}};var xMLHttpRequestWithCredentials="XMLHttpRequest"in window&&"withCredentials"in new XMLHttpRequest;return Ajax.prototype={init:function(t,e){if(!t)throw Error("WRONG_ARGUMENTS_ERR");var n=Ink.extendObj({asynchronous:!0,method:"POST",parameters:null,timeout:0,delay:0,postBody:"",contentType:"application/x-www-form-urlencoded",requestHeaders:null,onComplete:null,onSuccess:null,onFailure:null,onException:null,onHeaders:null,onCreate:null,onInit:null,onTimeout:null,sanitizeJSON:!1,evalJS:!0,xhrProxy:"",cors:!1,debug:!1,useCredentials:!1,signRequest:!1},Ajax.globalOptions);if(e&&"object"==typeof e){if(n=Ink.extendObj(n,e),"object"==typeof e.parameters)n.parameters=Ink.extendObj(Ink.extendObj({},Ajax.globalOptions.parameters),e.parameters);else if(null!==e.parameters){var s=this.paramsObjToStr(Ajax.globalOptions.parameters);s&&(n.parameters=e.parameters+"&"+s)}n.requestHeaders=Ink.extendObj({},Ajax.globalOptions.requestHeaders),n.requestHeaders=Ink.extendObj(n.requestHeaders,e.requestHeaders)}this.options=n,this.safeCall("onInit");var r=document.createElementNS?document.createElementNS("http://www.w3.org/1999/xhtml","a"):document.createElement("a");r.href=t,this.url=t,this.isHTTP=r.protocol.match(/^https?:$/i)&&!0,this.requestHasBody=0>n.method.search(/^get|head$/i),this.isCrossDomain=this.isHTTP&&"widget:"!==location.protocol&&"object"!=typeof window.widget?location.protocol!==r.protocol||location.host!==r.host.split(":")[0]:!1,this.options.cors&&(this.isCrossDomain=!1),this.transport=this.getTransport(),this.request()},getTransport:function(){if(!xMLHttpRequestWithCredentials&&this.options.cors&&"XDomainRequest"in window)return this.usingXDomainReq=!0,new XDomainRequest;if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"==typeof ActiveXObject)return null;try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(t){return new ActiveXObject("Microsoft.XMLHTTP")}},setHeaders:function(){if(this.transport)try{var t={Accept:"text/javascript,text/xml,application/xml,application/xhtml+xml,text/html,application/json;q=0.9,text/plain;q=0.8,video/x-mng,image/png,image/jpeg,image/gif;q=0.2,*/*;q=0.1","Accept-Language":navigator.language,"X-Requested-With":"XMLHttpRequest","X-Ink-Version":"1"};if(this.options.cors&&(this.options.signRequest||delete t["X-Requested-With"],delete t["X-Ink-Version"]),this.options.requestHeaders&&"object"==typeof this.options.requestHeaders)for(var e in this.options.requestHeaders)t[e]=this.options.requestHeaders[e];this.transport.overrideMimeType&&2005>(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]&&(t.Connection="close");for(var n in t)t.hasOwnProperty(n)&&this.transport.setRequestHeader(n,t[n])}catch(s){}},paramsObjToStr:function(t){var e,n,s,r,i=[];if("object"!=typeof t)return t;for(s in t)if(t.hasOwnProperty(s))if(r=t[s],"[object Array]"!==Object.prototype.toString.call(r)||isNaN(r.length))i=i.concat([encodeURIComponent(s),"=",encodeURIComponent(r),"&"]);else for(e=0,n=r.length;n>e;e++)i=i.concat([encodeURIComponent(s),"=",encodeURIComponent(r[e]),"&"]);return i.length>0&&i.pop(),i.join("")},setParams:function(){var t=null,e=this.options.parameters;t="object"==typeof e?this.paramsObjToStr(e):""+e,t&&(this.url=this.url.indexOf("?")>-1?this.url.split("#")[0]+"&"+t:this.url.split("#")[0]+"?"+t)},getHeader:function(t){if(this.usingXDomainReq&&"Content-Type"===t)return this.transport.contentType;try{return this.transport.getResponseHeader(t)}catch(e){return null}},getAllHeaders:function(){try{return this.transport.getAllResponseHeaders()}catch(t){return null}},getResponse:function(){var t=this.transport,e={headerJSON:null,responseJSON:null,getHeader:this.getHeader,getAllHeaders:this.getAllHeaders,request:this,transport:t,timeTaken:new Date-this.startTime,requestedUrl:this.url};e.readyState=t.readyState;try{e.responseText=t.responseText}catch(n){}try{e.responseXML=t.responseXML}catch(n){}try{e.status=t.status}catch(n){e.status=0}try{e.statusText=t.statusText}catch(n){e.statusText=""}return e},abort:function(){if(this.transport){clearTimeout(this.delayTimeout),clearTimeout(this.stoTimeout);try{this.transport.abort()}catch(t){}this.finish()}},runStateChange:function(){var t=this.transport.readyState;if(3===t)this.isHTTP&&this.safeCall("onHeaders");else if(4===t||this.usingXDomainReq){if(this.options.asynchronous&&this.options.delay&&this.startTime+this.options.delay>(new Date).getTime())return this.delayTimeout=setTimeout(Ink.bind(this.runStateChange,this),this.options.delay+this.startTime-(new Date).getTime()),void 0;var e,n=this.transport.responseText,s=this.getResponse(),r=this.transport.status;this.isHTTP&&!this.options.asynchronous&&this.safeCall("onHeaders"),clearTimeout(this.stoTimeout),0===r?this.isHTTP?this.safeCall("onException",this.makeError(18,"NETWORK_ERR")):r=n?200:404:304===r&&(r=200);var i=this.usingXDomainReq||r>=200&&300>r,o=this.getHeader("Content-Type")||"";if(this.options.evalJS&&(o.indexOf("application/json")>=0||"force"===this.options.evalJS))try{e=this.evalJSON(n,this.sanitizeJSON),e&&(n=s.responseJSON=e)}catch(a){i&&this.safeCall("onException",a)}if(this.usingXDomainReq&&-1!==o.indexOf("xml")&&"DOMParser"in window){var u;switch(o){case"application/xml":case"application/xhtml+xml":case"image/svg+xml":u=o;break;default:u="text/xml"}var l=(new DOMParser).parseFromString(this.transport.responseText,u);this.transport.responseXML=l,s.responseXML=l}null!==this.transport.responseXML&&null===s.responseJSON&&""!==this.transport.responseXML.xml&&(n=this.transport.responseXML),(r||this.usingXDomainReq)&&(i?this.safeCall("onSuccess",s,n):this.safeCall("onFailure",s,n),this.safeCall("on"+r,s,n)),this.finish(s,n)}},finish:function(t,e){if(t&&this.safeCall("onComplete",t,e),clearTimeout(this.stoTimeout),this.transport){try{this.transport.onreadystatechange=null}catch(n){}"function"==typeof this.transport.destroy&&this.transport.destroy(),this.transport=null}},safeCall:function(t,e){function n(t){setTimeout(function(){throw t.message&&(t.message+="\n"+(t.stacktrace||t.stack||"")),t},1)}if("function"==typeof this.options[t])try{this.options[t].apply(this,[].slice.call(arguments,1))}catch(s){n(s)}else e&&window.Error&&e instanceof Error&&n(e)},setRequestHeader:function(t,e){this.options.requestHeaders||(this.options.requestHeaders={}),this.options.requestHeaders[t]=e},request:function(){if(this.transport){var t=null;this.requestHasBody?(null!==this.options.postBody&&""!==this.options.postBody?(t=this.options.postBody,this.setParams()):null!==this.options.parameters&&""!==this.options.parameters&&(t=this.options.parameters),"object"!=typeof t||t.nodeType?"object"!=typeof t&&null!==t&&(t=""+t):t=this.paramsObjToStr(t),this.options.contentType&&this.setRequestHeader("Content-Type",this.options.contentType)):this.setParams();var e=this.url,n=this.options.method,s=this.isCrossDomain;s&&this.options.xhrProxy&&(this.setRequestHeader("X-Url",e),e=this.options.xhrProxy+encodeURIComponent(e),s=!1);try{this.transport.open(n,e,this.options.asynchronous)}catch(r){return this.safeCall("onException",r),this.finish(this.getResponse(),null)}this.setHeaders(),this.safeCall("onCreate"),this.options.timeout&&!isNaN(this.options.timeout)&&(this.stoTimeout=setTimeout(Ink.bind(function(){this.options.onTimeout&&(this.safeCall("onTimeout"),this.abort())},this),1e3*this.options.timeout)),this.options.useCredentials&&!this.usingXDomainReq&&(this.transport.withCredentials=!0),this.options.asynchronous&&!this.usingXDomainReq?this.transport.onreadystatechange=Ink.bind(this.runStateChange,this):this.usingXDomainReq&&(this.transport.onload=Ink.bind(this.runStateChange,this));try{if(s)throw this.makeError(18,"NETWORK_ERR");this.startTime=(new Date).getTime(),this.transport.send(t)}catch(r){return this.safeCall("onException",r),this.finish(this.getResponse(),null)}this.options.asynchronous||this.runStateChange()}},makeError:function(t,e){if("function"!=typeof Error)return{code:t,message:e};var n=Error(e);return n.code=t,n},isJSON:function(t){return"string"==typeof t&&t?(t=t.replace(/\\./g,"@").replace(/"[^"\\\n\r]*"/g,""),/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/.test(t)):!1},evalJSON:function(strJSON,sanitize){if(strJSON&&(!sanitize||this.isJSON(strJSON)))try{return"undefined"!=typeof JSON&&JSON.parse!==void 0?JSON.parse(strJSON):eval("("+strJSON+")")}catch(e){throw Error("ERROR: Bad JSON string...")}return null}},Ajax.load=function(t,e){return new Ajax(t,{method:"GET",onSuccess:function(t){e(t.responseText,t)}})},Ajax.ping=function(t,e){return new Ajax(t,{method:"HEAD",onSuccess:function(t){"function"==typeof e&&e(t)}})},Ajax});
Ink.createModule("Ink.Net.JsonP","1",[],function(){"use strict";var t=function(t,e){this.init(t,e)};return t.prototype={init:function(t,e){if(this.options=Ink.extendObj({onSuccess:void 0,onFailure:void 0,failureObj:{},timeout:10,params:{},callbackParam:"jsoncallback",internalCallback:"_cb",randVar:!1},e||{}),this.randVar=this.options.randVar!==!1?this.options.randVar:parseInt(1e5*Math.random(),10),this.options.internalCallback+=this.randVar,this.uri=t,"function"==typeof this.options.onComplete&&(this.options.onSuccess=this.options.onComplete),"string"!=typeof this.uri)throw"Please define an URI";if("function"!=typeof this.options.onSuccess)throw"please define a callback function on option onSuccess!";Ink.Net.JsonP[this.options.internalCallback]=Ink.bind(function(){window.clearTimeout(this.timeout),delete window.Ink.Net.JsonP[this.options.internalCallback],this._removeScriptTag(),this.options.onSuccess(arguments[0])},this),this._addScriptTag()},_addParamsToGet:function(t,e){var n,s,i,o=-1!==t.indexOf("?"),r=[t];for(s in e)e.hasOwnProperty(s)&&(o?n="&":(n="?",o=!0),i=e[s],"number"==typeof i||i||(i=""),r=r.concat([n,s,"=",encodeURIComponent(i)]));return r.join("")},_getScriptContainer:function(){var t=document.getElementsByTagName("head");if(0===t.length){var e=document.getElementsByTagName("script");return e[0]}return t[0]},_addScriptTag:function(){this.options.params[this.options.callbackParam]="Ink.Net.JsonP."+this.options.internalCallback,this.options.params.rnd_seed=this.randVar,this.uri=this._addParamsToGet(this.uri,this.options.params);var t=document.createElement("script");t.type="text/javascript",t.src=this.uri;var e=this._getScriptContainer();e.appendChild(t),this.timeout=setTimeout(Ink.bind(this._requestFailed,this),1e3*this.options.timeout)},_requestFailed:function(){delete Ink.Net.JsonP[this.options.internalCallback],this._removeScriptTag(),"function"==typeof this.options.onFailure&&this.options.onFailure(this.options.failureObj)},_removeScriptTag:function(){for(var t,e=document.getElementsByTagName("script"),n=0,s=e.length;s>n;++n)if(t=e[n],t.src===this.uri)return t.parentNode.removeChild(t),void 0}},t});
Ink.createModule("Ink.Dom.Css",1,[],function(){"use strict";var t={addRemoveClassName:function(t,e,n){return n?this.addClassName(t,e):(this.removeClassName(t,e),void 0)},addClassName:function(t,e){t=Ink.i(t),t&&e&&(t.classList!==void 0?t.classList.add(e):this.hasClassName(t,e)||(t.className+=(t.className?" ":"")+e))},removeClassName:function(t,e){if(t=Ink.i(t),t&&e)if(t.classList!==void 0)t.classList.remove(e);else{if(t.className===void 0)return!1;var n=t.className,s=RegExp("(^|\\s+)"+e+"(\\s+|$)");n=n.replace(s," "),n=n.replace(/^\s+/,"").replace(/\s+$/,""),t.className=n}},setClassName:function(t,e,n){this.addRemoveClassName(t,e,n||!1)},hasClassName:function(t,e){if(t=Ink.i(t),t&&e){if(t.classList!==void 0)return t.classList.contains(e);if(t.className===void 0)return!1;var n=t.className;if(n.length===void 0)return!1;if(n.length>0){if(n===e)return!0;var s=RegExp("(^|\\s)"+e+"(\\s|$)");if(s.test(n))return!0}}return!1},blinkClass:function(t,e,n,s){t=Ink.i(t),this.addRemoveClassName(t,e,!s),setTimeout(Ink.bind(function(){this.addRemoveClassName(t,e,s)},this),Number(n)||100)},toggleClassName:function(t,e,n){return t&&e&&t.classList!==void 0?(t=Ink.i(t),null!==t&&t.classList.toggle(e),!0):(n!==void 0?n===!0?this.addClassName(t,e):n===!1&&this.removeClassName(t,e):this.hasClassName(t,e)?this.removeClassName(t,e):this.addClassName(t,e),void 0)},setOpacity:function(t,e){if(t=Ink.i(t),null!==t){var n=1;isNaN(Number(e))||(n=0>=e?0:1>=e?e:100>=e?e/100:1),t.style.opacity!==void 0?t.style.opacity=n:t.style.filter="alpha(opacity:"+(0|100*n)+")"}},_camelCase:function(t){return t?t.replace(/-(\w)/g,function(t,e){return e.toUpperCase()}):t},getStyle:function(t,e){if(t=Ink.i(t),null!==t){e="float"===e?"cssFloat":this._camelCase(e);var n=t.style[e];if(!window.getComputedStyle||n&&"auto"!==n)!n&&t.currentStyle&&(n=t.currentStyle[e],"auto"!==n||"width"!==e&&"height"!==e||(n=t["offset"+e.charAt(0).toUpperCase()+e.slice(1)]+"px"));else{var s=window.getComputedStyle(t,null);n=s?s[e]:null}if("opacity"===e)return n?parseFloat(n,10):1;if("borderTopWidth"===e||"borderBottomWidth"===e||"borderRightWidth"===e||"borderLeftWidth"===e){if("thin"===n)return"1px";if("medium"===n)return"3px";if("thick"===n)return"5px"}return"auto"===n?null:n}},setStyle:function(t,e){if(t=Ink.i(t),null!==t)if("string"==typeof e)t.style.cssText+="; "+e,-1!==e.indexOf("opacity")&&this.setOpacity(t,e.match(/opacity:\s*(\d?\.?\d*)/)[1]);else for(var n in e)e.hasOwnProperty(n)&&("opacity"===n?this.setOpacity(t,e[n]):"float"===n||"cssFloat"===n?t.style.styleFloat===void 0?t.style.cssFloat=e[n]:t.style.styleFloat=e[n]:t.style[n]=e[n])},show:function(t,e){t=Ink.i(t),null!==t&&(t.style.display=e?e:"")},hide:function(t){t=Ink.i(t),null!==t&&(t.style.display="none")},showHide:function(t,e){t=Ink.i(t),t&&(t.style.display=e?"":"none")},toggle:function(t,e){t=Ink.i(t),null!==t&&(e!==void 0?e===!0?this.show(t):this.hide(t):"none"===t.style.display?this.show(t):this.hide(t))},_getRefTag:function(t){if(t.firstElementChild)return t.firstElementChild;for(var e=t.firstChild;e;e=e.nextSibling)if(1===e.nodeType)return e;return null},appendStyleTag:function(t,e,n){n=Ink.extendObj({type:"text/css",force:!1},n||{});var s,i,r=document.getElementsByTagName("style"),o=!1,a=!0;for(s=0,i=r.length;i>s;s++)o=r[s].innerHTML,o.indexOf(t)>=0&&(a=!1);if(a){var l=document.createElement("style"),u=document.getElementsByTagName("head")[0],c=!1,h="";l.type=n.type,h+=t+" {",h+=e,h+="} ",l.styleSheet!==void 0?l.styleSheet.cssText=h:l.appendChild(document.createTextNode(h)),n.force?u.appendChild(l):(c=this._getRefTag(u),c&&u.insertBefore(l,c))}},appendStylesheet:function(t,e){e=Ink.extendObj({media:"screen",type:"text/css",force:!1},e||{});var n,s=document.createElement("link"),i=document.getElementsByTagName("head")[0];s.media=e.media,s.type=e.type,s.href=t,s.rel="Stylesheet",e.force?i.appendChild(s):(n=this._getRefTag(i),n&&i.insertBefore(s,n))},_loadingCSSFiles:{},_loadedCSSFiles:{},appendStylesheetCb:function(t,e){if(!t)return e(t);if(this._loadedCSSFiles[t])return e(t);var n=this._loadingCSSFiles[t];if(n)return n.push(e);this._loadingCSSFiles[t]=[e];var s=document.createElement("link");s.type="text/css",s.rel="stylesheet",s.href=t;var i=document.getElementsByTagName("head")[0];i.appendChild(s);var r=document.createElement("img");r.onerror=Ink.bindEvent(function(t,e){var n=e;this._loadedCSSFiles[n]=!0;for(var s=this._loadingCSSFiles[n],i=0,r=s.length;r>i;++i)s[i](n);delete this._loadingCSSFiles[n]},this,t),r.src=t},decToHex:function(t){var e=function(t){return 1===t.length&&(t="0"+t),t=t.toUpperCase()};if("object"==typeof t){var n=e(parseInt(t.r,10).toString(16)),s=e(parseInt(t.g,10).toString(16)),i=e(parseInt(t.b,10).toString(16));return n+s+i}t+="";var r=t.match(/\((\d+),\s?(\d+),\s?(\d+)\)/);return null!==r?e(parseInt(r[1],10).toString(16))+e(parseInt(r[2],10).toString(16))+e(parseInt(r[3],10).toString(16)):e(parseInt(t,10).toString(16))},hexToDec:function(t){return 0===t.indexOf("#")&&(t=t.substr(1)),6===t.length?{r:parseInt(t.substr(0,2),16),g:parseInt(t.substr(2,2),16),b:parseInt(t.substr(4,2),16)}:3===t.length?{r:parseInt(t.charAt(0)+t.charAt(0),16),g:parseInt(t.charAt(1)+t.charAt(1),16),b:parseInt(t.charAt(2)+t.charAt(2),16)}:2>=t.length?parseInt(t,16):void 0},getPropertyFromStylesheet:function(t,e){var n=this.getRuleFromStylesheet(t);return n?n.style[e]:null},getPropertyFromStylesheet2:function(t,e){for(var n,s=this.getRulesFromStylesheet(t),i=0,r=s.length;r>i;i++)if(n=s[i].style[e],null!==n&&void 0!==n)return n;return null},getRuleFromStylesheet:function(t){var e,n,s,i,r,o=document.styleSheets;if(!o)return null;for(var a=0,l=document.styleSheets.length;l>a;++a){if(e=document.styleSheets[a],n=e.rules?e.rules:e.cssRules,!n)return null;for(s=0,i=n.length;i>s;++s)if(r=n[s],r.selectorText&&r.selectorText===t)return r}return null},getRulesFromStylesheet:function(t){var e,n,s,i,r,o=[],a=document.styleSheets;if(!a)return o;for(var l=0,u=document.styleSheets.length;u>l;++l){if(e=document.styleSheets[l],n=e.rules?e.rules:e.cssRules,!n)return null;for(s=0,i=n.length;i>s;++s)r=n[s],r.selectorText&&r.selectorText===t&&o.push(r)}return o},getPropertiesFromRule:function(t){var e,n,s,i=this.getRuleFromStylesheet(t),r={};i=i.style.cssText;var o,a,l,u,c=i.split(";");for(n=0,s=c.length;s>n;++n)" "===c[n].charAt(0)&&(c[n]=c[n].substring(1)),o=c[n].split(":"),e=this._camelCase(o[0].toLowerCase()),a=o[1],a&&(a=a.substring(1),"padding"===e||"margin"===e||"borderWidth"===e?("borderWidth"===e?(l="border",u="Width"):(l=e,u=""),-1!==a.indexOf(" ")?(a=a.split(" "),r[l+"Top"+u]=a[0],r[l+"Bottom"+u]=a[0],r[l+"Left"+u]=a[1],r[l+"Right"+u]=a[1]):(r[l+"Top"+u]=a,r[l+"Bottom"+u]=a,r[l+"Left"+u]=a,r[l+"Right"+u]=a)):"borderRadius"===e?-1!==a.indexOf(" ")?(a=a.split(" "),r.borderTopLeftRadius=a[0],r.borderBottomRightRadius=a[0],r.borderTopRightRadius=a[1],r.borderBottomLeftRadius=a[1]):(r.borderTopLeftRadius=a,r.borderTopRightRadius=a,r.borderBottomLeftRadius=a,r.borderBottomRightRadius=a):r[e]=a);return r},changeFontSize:function(t,e,n,s,i){var r=this;Ink.requireModules(["Ink.Dom.Selector_1"],function(o){var a;if("string"!=typeof t?a="1st argument must be a CSS selector rule.":"number"!=typeof e?a="2nd argument must be a number.":void 0!==n&&"+"!==n&&"*"!==n?a='3rd argument must be one of "+", "*".':void 0!==s&&("number"!=typeof s||0>=s)?a="4th argument must be a positive number.":void 0!==i&&("number"!=typeof i||i>i)&&(a="5th argument must be a positive number greater than minValue."),a)throw new TypeError(a);var l,u,c=o.select(t);void 0===s&&(s=1),n="*"===n?function(t,e){return t*e}:function(t,e){return t+e};for(var h=0,p=c.length;p>h;++h)u=c[h],l=parseFloat(r.getStyle(u,"fontSize")),l=n(l,e),s>l||"number"==typeof i&&l>i||(u.style.fontSize=l+"px")})}};return t});
Ink.createModule("Ink.Dom.Element",1,[],function(){"use strict";var e={get:function(e){return e!==void 0?"string"==typeof e?document.getElementById(e):e:null},create:function(e,t){var n=document.createElement(e);for(var i in t)t.hasOwnProperty(i)&&("className"===i&&(i="class"),n.setAttribute(i,t[i]));return n},remove:function(e){var t;e&&(t=e.parentNode)&&t.removeChild(e)},scrollTo:function(e){if(e=this.get(e)){if(e.scrollIntoView)return e.scrollIntoView();var t={},n=0,i=0;do n+=e.offsetTop||0,i+=e.offsetLeft||0,e=e.offsetParent;while(e);t={x:i,y:n},window.scrollTo(t.x,t.y)}},offsetTop:function(e){e=this.get(e);for(var t=e.offsetTop;e.offsetParent&&"body"!==e.offsetParent.tagName.toLowerCase();)e=e.offsetParent,t+=e.offsetTop;return t},offsetLeft:function(e){return this.offset2(e)},positionedOffset:function(e){var t=0,n=0;e=this.get(e);do if(t+=e.offsetTop||0,n+=e.offsetLeft||0,e=e.offsetParent){if("body"===e.tagName.toLowerCase())break;var i=e.style.position;if(!i&&e.currentStyle&&(i=e.currentStyle.position),(!i||"auto"===i)&&"undefined"!=typeof getComputedStyle){var r=getComputedStyle(e,null);i=r?r.position:null}if("relative"===i||"absolute"===i)break}while(e);return[n,t]},offset:function(e){return[this.offsetLeft(e),this.offsetTop(e)]},scroll:function(e){return e=e?Ink.i(e):document.body,[window.pageXOffset?window.pageXOffset:e.scrollLeft,window.pageYOffset?window.pageYOffset:e.scrollTop]},_getPropPx:function(e,t){var n,i,r=e.getPropertyValue?e.getPropertyValue(t):e[t];return r?(i=r.indexOf("px"),n=-1===i?0:parseInt(r,10)):n=0,n},offset2:function(e){e=Ink.i(e);var t,n,i,r,o=["border-left-width","border-top-width"],s=[0,0],a=this._getPropPx,l=Ink.getModule("Ink.Dom.Browser",1);do r=window.getComputedStyle?window.getComputedStyle(e,null):e.currentStyle,t=[0|e.offsetLeft,0|e.offsetTop],n=[a(r,o[0]),a(r,o[1])],l.OPERA?(s[0]+=t[0],s[1]+=t[1]):(s[0]+=t[0]+n[0],s[1]+=t[1]+n[1]),i=e.offsetParent;while(e=i);return n=[a(r,o[0]),a(r,o[1])],l.GECKO?(s[0]+=n[0],s[1]+=n[1]):l.OPERA||(s[0]-=n[0],s[1]-=n[1]),s},hasAttribute:function(e,t){return e.hasAttribute?e.hasAttribute(t):!!e.getAttribute(t)},insertAfter:function(e,t){(t=this.get(t))&&t.parentNode.insertBefore(e,t.nextSibling)},insertTop:function(e,t){(t=this.get(t))&&t.insertBefore(e,t.firstChild)},textContent:function(e){e=Ink.i(e);var t,n,i,r;switch(e&&e.nodeType){case 9:return this.textContent(e.documentElement||e.body&&e.body.parentNode||e.body);case 1:if(t=e.innerText,t!==void 0)return t;case 11:if(t=e.textContent,t!==void 0)return t;if(e.firstChild===e.lastChild)return this.textContent(e.firstChild);for(t=[],i=e.childNodes,n=0,r=i.length;r>n;++n)t.push(this.textContent(i[n]));return t.join("");case 3:case 4:return e.nodeValue}return""},setTextContent:function(e,t){switch(e=Ink.i(e),e&&e.nodeType){case 1:if("innerText"in e){e.innerText=t;break}case 11:if("textContent"in e){e.textContent=t;break}case 9:for(;e.firstChild;)e.removeChild(e.firstChild);if(""!==t){var n=e.ownerDocument||e;e.appendChild(n.createTextNode(t))}break;case 3:case 4:e.nodeValue=t}},isLink:function(e){var t=e&&1===e.nodeType&&(/^a|area$/i.test(e.tagName)||e.hasAttributeNS&&e.hasAttributeNS("http://www.w3.org/1999/xlink","href"));return!!t},isAncestorOf:function(e,t){if(!t||!e)return!1;if(t.compareDocumentPosition)return 0!==(16&e.compareDocumentPosition(t));for(;t=t.parentNode;)if(t===e)return!0;return!1},descendantOf:function(e,t){return e!==t&&this.isAncestorOf(e,t)},firstElementChild:function(e){if(!e)return null;if("firstElementChild"in e)return e.firstElementChild;for(var t=e.firstChild;t&&1!==t.nodeType;)t=t.nextSibling;return t},lastElementChild:function(e){if(!e)return null;if("lastElementChild"in e)return e.lastElementChild;for(var t=e.lastChild;t&&1!==t.nodeType;)t=t.previousSibling;return t},nextElementSibling:function(e){var t=null;if(!e)return t;if("nextElementSibling"in e)return e.nextElementSibling;for(t=e.nextSibling;t&&1!==t.nodeType;)t=t.nextSibling;return t},previousElementSibling:function(e){var t=null;if(!e)return t;if("previousElementSibling"in e)return e.previousElementSibling;for(t=e.previousSibling;t&&1!==t.nodeType;)t=t.previousSibling;return t},elementWidth:function(e){return"string"==typeof e&&(e=document.getElementById(e)),e.offsetWidth},elementHeight:function(e){return"string"==typeof e&&(e=document.getElementById(e)),e.offsetHeight},elementLeft:function(e){return"string"==typeof e&&(e=document.getElementById(e)),e.offsetLeft},elementTop:function(e){return"string"==typeof e&&(e=document.getElementById(e)),e.offsetTop},elementDimensions:function(e){return"string"==typeof e&&(e=document.getElementById(e)),[e.offsetWidth,e.offsetHeight]},clonePosition:function(e,t){var n=this.offset2(t);return e.style.left=n[0]+"px",e.style.top=n[1]+"px",e},ellipsizeText:function(e,t){if(e=Ink.i(e))for(;e&&e.scrollHeight>e.offsetHeight+8;)e.textContent=e.textContent.replace(/(\s+\S+)\s*$/,t||"…")},findUpwardsByClass:function(e,t){for(var n=RegExp("(^|\\s)"+t+"(\\s|$)");;){if(e.className!==void 0&&n.test(e.className))return e;if(e=e.parentNode,!e||1!==e.nodeType)return!1}},findUpwardsByTag:function(e,t){for(;;){if(e&&e.nodeName.toUpperCase()===t.toUpperCase())return e;if(e=e.parentNode,!e||1!==e.nodeType)return!1}},findUpwardsById:function(e,t){for(;;){if(e.id!==void 0&&e.id===t)return e;if(e=e.parentNode,!e||1!==e.nodeType)return!1}},getChildrenText:function(e,t){var n,i,r,o=e.childNodes,s=o.length,a="";if(!e)return a;for(i=0;s>i;++i)n=o[i],n&&3===n.nodeType&&(r=this._trimString(n.data+""),r.length>0?(a+=r,t&&e.removeChild(n)):e.removeChild(n));return a},_trimString:function(e){return String.prototype.trim?e.trim():e.replace(/^\s*/,"").replace(/\s*$/,"")},getSelectValues:function(e){for(var t=Ink.i(e),n=[],i=0;t.options.length>i;++i)n.push(t.options[i].value);return n},_normalizeData:function(e){for(var t,n=[],i=0,r=e.length;r>i;++i)t=e[i],t instanceof Array?1===t.length&&t.push(t[0]):t=[t,t],n.push(t);return n},fillSelect:function(e,t,n,i){var r=Ink.i(e);if(r){r.innerHTML="";var o,s;n||(s=document.createElement("option"),s.setAttribute("value",""),r.appendChild(s)),t=this._normalizeData(t);for(var a=0,l=t.length;l>a;++a)o=t[a],s=document.createElement("option"),s.setAttribute("value",o[0]),o.length>2&&s.setAttribute("extra",o[2]),s.appendChild(document.createTextNode(o[1])),o[0]===i&&s.setAttribute("selected","selected"),r.appendChild(s)}},fillSelect2:function(e,t){e=Ink.i(e),e.innerHTML="";var n={skipEmpty:!1,skipCreate:!1,emptyLabel:"none",createLabel:"create",optionsGroupLabel:"groups",emptyOptionsGroupLabel:"none exist",defaultValue:""};if(!t)throw"param opts is a requirement!";if(!t.data)throw"opts.data is a requirement!";t=Ink.extendObj(n,t);var i,r,o=document.createElement("optgroup");o.setAttribute("label",t.optionsGroupLabel),t.data=this._normalizeData(t.data),t.skipCreate||t.data.unshift(["$create$",t.createLabel]),t.skipEmpty||t.data.unshift(["",t.emptyLabel]);for(var s=0,a=t.data.length;a>s;++s)r=t.data[s],i=document.createElement("option"),i.setAttribute("value",r[0]),i.appendChild(document.createTextNode(r[1])),r[0]===t.defaultValue&&i.setAttribute("selected","selected"),""===r[0]||"$create$"===r[0]?e.appendChild(i):o.appendChild(i);var l=function(e){var t=e[e.length-1][0];return""===t||"$create$"===t};l(t.data)&&(i=document.createElement("option"),i.setAttribute("value","$dummy$"),i.setAttribute("disabled","disabled"),i.appendChild(document.createTextNode(t.emptyOptionsGroupLabel)),o.appendChild(i)),e.appendChild(o);var u=function(t,n){var i=e.options[e.options.length-1];i.getAttribute("disabled")&&i.parentNode.removeChild(i),i=document.createElement("option"),i.setAttribute("value",t),i.appendChild(document.createTextNode(n)),o.appendChild(i),e.options[e.options.length-1].setAttribute("selected",!0)};t.skipCreate||(e.onchange=function(){"$create$"===e.value&&"function"==typeof t.onCreate&&t.onCreate(e,u)})},fillRadios:function(e,t,n,i,r,o){var s=Ink.i(e);for(s=s.nextSibling;s&&1!==s.nodeType;)s=s.nextSibling;var a=document.createElement("span");s?s.parentNode.insertBefore(a,s):Ink.i(e).appendChild(a),n=this._normalizeData(n),"]"!==t.substring(t.length-1)&&(t+="[]");var l,u;i||(u=document.createElement("input"),u.setAttribute("type","radio"),u.setAttribute("name",t),u.setAttribute("value",""),a.appendChild(u),o&&a.appendChild(document.createElement(o)));for(var d=0;n.length>d;++d)l=n[d],u=document.createElement("input"),u.setAttribute("type","radio"),u.setAttribute("name",t),u.setAttribute("value",l[0]),a.appendChild(u),a.appendChild(document.createTextNode(l[1])),o&&a.appendChild(document.createElement(o)),l[0]===r&&(u.checked=!0);return a},fillChecks:function(e,t,n,i,r){var o=Ink.i(e);for(o=o.nextSibling;o&&1!==o.nodeType;)o=o.nextSibling;var s=document.createElement("span");o?o.parentNode.insertBefore(s,o):Ink.i(e).appendChild(s),n=this._normalizeData(n),"]"!==t.substring(t.length-1)&&(t+="[]");for(var a,l,u=0;n.length>u;++u)a=n[u],l=document.createElement("input"),l.setAttribute("type","checkbox"),l.setAttribute("name",t),l.setAttribute("value",a[0]),s.appendChild(l),s.appendChild(document.createTextNode(a[1])),r&&s.appendChild(document.createElement(r)),a[0]===i&&(l.checked=!0);return s},parentIndexOf:function(e,t){for(var n,i=0,r=0,o=e.childNodes.length;o>r;++r)if(n=e.childNodes[r],1===n.nodeType){if(n===t)return i;++i}return-1},nextSiblings:function(e){if("string"==typeof e&&(e=document.getElementById(e)),"object"==typeof e&&null!==e&&e.nodeType&&1===e.nodeType){for(var t=[],n=e.parentNode.children,i=this.parentIndexOf(e.parentNode,e),r=++i,o=n.length;o>r;r++)t.push(n[r]);return t}return[]},previousSiblings:function(e){if("string"==typeof e&&(e=document.getElementById(e)),"object"==typeof e&&null!==e&&e.nodeType&&1===e.nodeType){for(var t=[],n=e.parentNode.children,i=this.parentIndexOf(e.parentNode,e),r=0,o=i;o>r;r++)t.push(n[r]);return t}return[]},siblings:function(e){if("string"==typeof e&&(e=document.getElementById(e)),"object"==typeof e&&null!==e&&e.nodeType&&1===e.nodeType){for(var t=[],n=e.parentNode.children,i=0,r=n.length;r>i;i++)e!==n[i]&&t.push(n[i]);return t}return[]},childElementCount:function(e){return e=Ink.i(e),"childElementCount"in e?e.childElementCount:e?this.siblings(e).length+1:0},appendHTML:function(e,t){var n=document.createElement("div");n.innerHTML=t;for(var i=n.children,r=0;i.length>r;r++)e.appendChild(i[r])},prependHTML:function(e,t){var n=document.createElement("div");n.innerHTML=t;for(var i=e.firstChild,r=n.children,o=r.length-1;o>=0;o--)e.insertBefore(r[o],i),i=e.firstChild},htmlToFragment:function(e){return this.htmlToFragment="function"==typeof document.createRange&&"function"==typeof Range.prototype.createContextualFragment?function(e){var t;return"string"!=typeof e?document.createDocumentFragment():(t=document.createRange(),t.selectNode(document.body),t.createContextualFragment(e))}:function(e){var t,n,i=document.createDocumentFragment();if("string"!=typeof e)return i;for(t=document.createElement("div"),t.innerHTML=e;n=t.firstChild;)i.appendChild(n);return i},this.htmlToFragment.call(this,e)},_camelCase:function(e){return e?e.replace(/-(\w)/g,function(e,t){return t.toUpperCase()}):e},data:function(e){if("object"!=typeof e&&"string"!=typeof e)throw"[Ink.Dom.Element.data] :: Invalid selector defined";if("object"==typeof e)var t=e;else{var n=Ink.getModule("Ink.Dom.Selector",1);if(!n)throw"[Ink.Dom.Element.data] :: This method requires Ink.Dom.Selector - v1";var t=n.select(e);if(0>=t.length)throw"[Ink.Dom.Element.data] :: Can't find any element with the specified selector";t=t[0]}var i,r,o={},s=t.attributes||[];if(s)for(var a=0,l=s.length;l>a;a++)i=s[a].name,r=s[a].value,i&&0===i.indexOf("data-")&&(o[this._camelCase(i.replace("data-",""))]=r);return o},moveCursorTo:function(e,t){if(e.setSelectionRange)e.setSelectionRange(t,t);else{var n=e.createTextRange();n.collapse(!0),n.moveEnd("character",t),n.moveStart("character",t),n.select()}},pageWidth:function(){var e;e=window.innerWidth&&window.scrollMaxX?window.innerWidth+window.scrollMaxX:document.body.scrollWidth>document.body.offsetWidth?document.body.scrollWidth:document.body.offsetWidth;var t;return window.self.innerWidth?t=document.documentElement.clientWidth?document.documentElement.clientWidth:window.self.innerWidth:document.documentElement&&document.documentElement.clientWidth?t=document.documentElement.clientWidth:document.body&&(t=document.body.clientWidth),t>e?e:t},pageHeight:function(){var e;e=window.innerHeight&&window.scrollMaxY?window.innerHeight+window.scrollMaxY:document.body.scrollHeight>document.body.offsetHeight?document.body.scrollHeight:document.body.offsetHeight;var t;return window.self.innerHeight?t=window.self.innerHeight:document.documentElement&&document.documentElement.clientHeight?t=document.documentElement.clientHeight:document.body&&(t=document.body.clientHeight),t>e?t:e},viewportWidth:function(){return window.innerWidth!==void 0?window.innerWidth:document.documentElement&&document.documentElement.offsetWidth!==void 0?document.documentElement.offsetWidth:void 0},viewportHeight:function(){return window.innerHeight!==void 0?window.innerHeight:document.documentElement&&document.documentElement.offsetHeight!==void 0?document.documentElement.offsetHeight:void 0},scrollWidth:function(){return window.self.pageXOffset!==void 0?window.self.pageXOffset:document.documentElement!==void 0&&document.documentElement.scrollLeft!==void 0?document.documentElement.scrollLeft:document.body.scrollLeft},scrollHeight:function(){return window.self.pageYOffset!==void 0?window.self.pageYOffset:document.documentElement!==void 0&&document.documentElement.scrollTop!==void 0?document.documentElement.scrollTop:document.body.scrollTop}};return e});
Ink.createModule("Ink.Dom.Event",1,[],function(){"use strict";var e={KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,KEY_HOME:36,KEY_END:35,KEY_PAGEUP:33,KEY_PAGEDOWN:34,KEY_INSERT:45,element:function(e){var t=e.target||"mouseout"===e.type&&e.fromElement||"mouseleave"===e.type&&e.fromElement||"mouseover"===e.type&&e.toElement||"mouseenter"===e.type&&e.toElement||e.srcElement||null;return!t||3!==t.nodeType&&4!==t.nodeType?t:t.parentNode},relatedTarget:function(e){var t=e.relatedTarget||"mouseout"===e.type&&e.toElement||"mouseleave"===e.type&&e.toElement||"mouseover"===e.type&&e.fromElement||"mouseenter"===e.type&&e.fromElement||null;return!t||3!==t.nodeType&&4!==t.nodeType?t:t.parentNode},findElement:function(e,t,n){for(var o=this.element(e);;){if(o.nodeName.toLowerCase()===t.toLowerCase())return o;if(o=o.parentNode,!o)return n?!1:document;if(!o.parentNode)return n?!1:document}},fire:function(e,t,n){e=Ink.i(e);var o,r;if(r=document.createEvent?{DOMActivate:!0,DOMFocusIn:!0,DOMFocusOut:!0,focus:!0,focusin:!0,focusout:!0,blur:!0,load:!0,unload:!0,abort:!0,error:!0,select:!0,change:!0,submit:!0,reset:!0,resize:!0,scroll:!0,click:!0,dblclick:!0,mousedown:!0,mouseenter:!0,mouseleave:!0,mousemove:!0,mouseover:!0,mouseout:!0,mouseup:!0,mousewheel:!0,wheel:!0,textInput:!0,keydown:!0,keypress:!0,keyup:!0,compositionstart:!0,compositionupdate:!0,compositionend:!0,DOMSubtreeModified:!0,DOMNodeInserted:!0,DOMNodeRemoved:!0,DOMNodeInsertedIntoDocument:!0,DOMNodeRemovedFromDocument:!0,DOMAttrModified:!0,DOMCharacterDataModified:!0,DOMAttributeNameChanged:!0,DOMElementNameChanged:!0,hashchange:!0}:{onabort:!0,onactivate:!0,onafterprint:!0,onafterupdate:!0,onbeforeactivate:!0,onbeforecopy:!0,onbeforecut:!0,onbeforedeactivate:!0,onbeforeeditfocus:!0,onbeforepaste:!0,onbeforeprint:!0,onbeforeunload:!0,onbeforeupdate:!0,onblur:!0,onbounce:!0,oncellchange:!0,onchange:!0,onclick:!0,oncontextmenu:!0,oncontrolselect:!0,oncopy:!0,oncut:!0,ondataavailable:!0,ondatasetchanged:!0,ondatasetcomplete:!0,ondblclick:!0,ondeactivate:!0,ondrag:!0,ondragend:!0,ondragenter:!0,ondragleave:!0,ondragover:!0,ondragstart:!0,ondrop:!0,onerror:!0,onerrorupdate:!0,onfilterchange:!0,onfinish:!0,onfocus:!0,onfocusin:!0,onfocusout:!0,onhashchange:!0,onhelp:!0,onkeydown:!0,onkeypress:!0,onkeyup:!0,onlayoutcomplete:!0,onload:!0,onlosecapture:!0,onmessage:!0,onmousedown:!0,onmouseenter:!0,onmouseleave:!0,onmousemove:!0,onmouseout:!0,onmouseover:!0,onmouseup:!0,onmousewheel:!0,onmove:!0,onmoveend:!0,onmovestart:!0,onoffline:!0,ononline:!0,onpage:!0,onpaste:!0,onprogress:!0,onpropertychange:!0,onreadystatechange:!0,onreset:!0,onresize:!0,onresizeend:!0,onresizestart:!0,onrowenter:!0,onrowexit:!0,onrowsdelete:!0,onrowsinserted:!0,onscroll:!0,onselect:!0,onselectionchange:!0,onselectstart:!0,onstart:!0,onstop:!0,onstorage:!0,onstoragecommit:!0,onsubmit:!0,ontimeout:!0,onunload:!0},null!==e&&void 0!==e){e===document&&document.createEvent&&!e.dispatchEvent&&(e=document.documentElement),document.createEvent?(o=document.createEvent("HTMLEvents"),r[t]===void 0?o.initEvent("dataavailable",!0,!0):o.initEvent(t,!0,!0)):(o=document.createEventObject(),o.eventType=r["on"+t]===void 0?"ondataavailable":"on"+t),o.eventName=t,o.memo=n||{};try{if(document.createEvent)e.dispatchEvent(o);else{if(!e.fireEvent)return;e.fireEvent(o.eventType,o)}}catch(i){}return o}},observe:function(e,t,n,o){if(e=Ink.i(e),null!==e&&void 0!==e){if(-1!==t.indexOf(":")||"hashchange"===t&&e.attachEvent&&!window.onhashchange){var r=n;n=Ink.bindEvent(function(e,t,n){e.eventName===t&&(window.addEventListener&&(window.event=e),n())},this,t,r),t="dataavailable"}e.addEventListener?e.addEventListener(t,n,!!o):e.attachEvent("on"+t,n)}},stopObserving:function(e,t,n,o){e=Ink.i(e),null!==e&&void 0!==e&&(e.removeEventListener?e.removeEventListener(t,n,!!o):e.detachEvent("on"+t,n))},stop:function(e){null!==e.cancelBubble&&(e.cancelBubble=!0),e.stopPropagation&&e.stopPropagation(),e.preventDefault&&e.preventDefault(),window.attachEvent&&(e.returnValue=!1),null!==e.cancel&&(e.cancel=!0)},stopDefault:function(e){e.preventDefault&&e.preventDefault(),window.attachEvent&&(e.returnValue=!1),null!==e.cancel&&(e.cancel=!0)},pointer:function(e){return{x:e.pageX||e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft),y:e.pageY||e.clientY+(document.documentElement.scrollTop||document.body.scrollTop)}},pointerX:function(e){return e.pageX||e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft)},pointerY:function(e){return e.pageY||e.clientY+(document.documentElement.scrollTop||document.body.scrollTop)},isLeftClick:function(e){if(window.addEventListener){if(0===e.button)return!0;if("touch"===e.type.substring(0,5)&&null===e.button)return!0}else if(1===e.button)return!0;return!1},isRightClick:function(e){return 2===e.button},isMiddleClick:function(e){return window.addEventListener?1===e.button:4===e.button},getCharFromKeyboardEvent:function(e,t){var n=e.keyCode,o=String.fromCharCode(n),r=e.shiftKey;if(n>=65&&90>=n)return"boolean"==typeof t&&(r=t),r?o:o.toLowerCase();if(n>=96&&105>=n)return String.fromCharCode(48+(n-96));switch(n){case 109:case 189:return"-";case 107:case 187:return"+"}return o},debug:function(){}};return e});
Ink.createModule("Ink.Dom.Loaded",1,[],function(){"use strict";var e={_cbQueue:[],run:function(e,t){t||(t=e,e=window),this._win=e,this._doc=e.document,this._root=this._doc.documentElement,this._done=!1,this._top=!0,this._handlers={checkState:Ink.bindEvent(this._checkState,this),poll:Ink.bind(this._poll,this)};var n=this._doc.addEventListener;this._add=n?"addEventListener":"attachEvent",this._rem=n?"removeEventListener":"detachEvent",this._pre=n?"":"on",this._det=n?"DOMContentLoaded":"onreadystatechange",this._wet=this._pre+"load";var o=this._handlers.checkState;if("complete"===this._doc.readyState)t.call(this._win,"lazy");else{this._cbQueue.push(t),this._doc[this._add](this._det,o),this._win[this._add](this._wet,o);var r=1;try{r=this._win.frameElement}catch(i){}if(!n&&this._root.doScroll){try{this._top=!r}catch(i){}this._top&&this._poll()}}},_checkState:function(e){if(e&&("readystatechange"!==e.type||"complete"===this._doc.readyState)){var t="load"===e.type?this._win:this._doc;t[this._rem](this._pre+e.type,this._handlers.checkState,!1),this._ready()}},_poll:function(){try{this._root.doScroll("left")}catch(e){return setTimeout(this._handlers.poll,50)}this._ready()},_ready:function(){if(!this._done){this._done=!0;for(var e=0;this._cbQueue.length>e;++e)this._cbQueue[e].call(this._win);this._cbQueue=[]}}};return e});
Ink.createModule("Ink.Dom.Selector",1,[],function(){"use strict";function e(e){return ht.test(e+"")}function t(){var e,t=[];return e=function(n,r){return t.push(n+=" ")>w.cacheLength&&delete e[t.shift()],e[n]=r}}function n(e){return e[q]=!0,e}function r(e){var t=A.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t=null}}function o(e,t,n,r){var o,i,s,a,u,d,f,p,h,m;if((t?t.ownerDocument||t:P)!==A&&O(t),t=t||A,n=n||[],!e||"string"!=typeof e)return n;if(1!==(a=t.nodeType)&&9!==a)return[];if(_&&!r){if(o=mt.exec(e))if(s=o[1]){if(9===a){if(i=t.getElementById(s),!i||!i.parentNode)return n;if(i.id===s)return n.push(i),n}else if(t.ownerDocument&&(i=t.ownerDocument.getElementById(s))&&M(t,i)&&i.id===s)return n.push(i),n}else{if(o[2])return Q.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&B.getElementsByClassName&&t.getElementsByClassName)return Q.apply(n,t.getElementsByClassName(s)),n}if(B.qsa&&!L.test(e)){if(f=!0,p=q,h=t,m=9===a&&e,1===a&&"object"!==t.nodeName.toLowerCase()){for(d=l(e),(f=t.getAttribute("id"))?p=f.replace(vt,"\\$&"):t.setAttribute("id",p),p="[id='"+p+"'] ",u=d.length;u--;)d[u]=p+c(d[u]);h=pt.test(e)&&t.parentNode||t,m=d.join(",")}if(m)try{return Q.apply(n,h.querySelectorAll(m)),n}catch(g){}finally{f||t.removeAttribute("id")}}}return v(e.replace(at,"$1"),t,n,r)}function i(e,t){var n=t&&e,r=n&&(~t.sourceIndex||z)-(~e.sourceIndex||z);if(r)return r;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function s(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function a(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function u(e){return n(function(t){return t=+t,n(function(n,r){for(var o,i=e([],n.length,t),s=i.length;s--;)n[o=i[s]]&&(n[o]=!(r[o]=n[o]))})})}function l(e,t){var n,r,i,s,a,u,l,c=W[e+" "];if(c)return t?0:c.slice(0);for(a=e,u=[],l=w.preFilter;a;){(!n||(r=ut.exec(a)))&&(r&&(a=a.slice(r[0].length)||a),u.push(i=[])),n=!1,(r=lt.exec(a))&&(n=r.shift(),i.push({value:n,type:r[0].replace(at," ")}),a=a.slice(n.length));for(s in w.filter)!(r=ft[s].exec(a))||l[s]&&!(r=l[s](r))||(n=r.shift(),i.push({value:n,type:s,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?o.error(e):W(e,u).slice(0)}function c(e){for(var t=0,n=e.length,r="";n>t;t++)r+=e[t].value;return r}function d(e,t,n){var r=t.dir,o=n&&"parentNode"===r,i=F++;return t.first?function(t,n,i){for(;t=t[r];)if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var a,u,l,c=j+" "+i;if(s){for(;t=t[r];)if((1===t.nodeType||o)&&e(t,n,s))return!0}else for(;t=t[r];)if(1===t.nodeType||o)if(l=t[q]||(t[q]={}),(u=l[r])&&u[0]===c){if((a=u[1])===!0||a===C)return a===!0}else if(u=l[r]=[c],u[1]=e(t,n,s)||C,u[1]===!0)return!0}}function f(e){return e.length>1?function(t,n,r){for(var o=e.length;o--;)if(!e[o](t,n,r))return!1;return!0}:e[0]}function p(e,t,n,r,o){for(var i,s=[],a=0,u=e.length,l=null!=t;u>a;a++)(i=e[a])&&(!n||n(i,r,o))&&(s.push(i),l&&t.push(a));return s}function h(e,t,r,o,i,s){return o&&!o[q]&&(o=h(o)),i&&!i[q]&&(i=h(i,s)),n(function(n,s,a,u){var l,c,d,f=[],h=[],m=s.length,g=n||y(t||"*",a.nodeType?[a]:a,[]),v=!e||!n&&t?g:p(g,f,e,a,u),b=r?i||(n?e:m||o)?[]:s:v;if(r&&r(v,b,a,u),o)for(l=p(b,h),o(l,[],a,u),c=l.length;c--;)(d=l[c])&&(b[h[c]]=!(v[h[c]]=d));if(n){if(i||e){if(i){for(l=[],c=b.length;c--;)(d=b[c])&&l.push(v[c]=d);i(null,b=[],l,u)}for(c=b.length;c--;)(d=b[c])&&(l=i?et.call(n,d):f[c])>-1&&(n[l]=!(s[l]=d))}}else b=p(b===s?b.splice(m,b.length):b),i?i(null,s,b,u):Q.apply(s,b)})}function m(e){for(var t,n,r,o=e.length,i=w.relative[e[0].type],s=i||w.relative[" "],a=i?1:0,u=d(function(e){return e===t},s,!0),l=d(function(e){return et.call(t,e)>-1},s,!0),p=[function(e,n,r){return!i&&(r||n!==N)||((t=n).nodeType?u(e,n,r):l(e,n,r))}];o>a;a++)if(n=w.relative[e[a].type])p=[d(f(p),n)];else{if(n=w.filter[e[a].type].apply(null,e[a].matches),n[q]){for(r=++a;o>r&&!w.relative[e[r].type];r++);return h(a>1&&f(p),a>1&&c(e.slice(0,a-1)).replace(at,"$1"),n,r>a&&m(e.slice(a,r)),o>r&&m(e=e.slice(r)),o>r&&c(e))}p.push(n)}return f(p)}function g(e,t){var r=0,i=t.length>0,s=e.length>0,a=function(n,a,u,l,c){var d,f,h,m=[],g=0,y="0",v=n&&[],b=null!=c,E=N,T=n||s&&w.find.TAG("*",c&&a.parentNode||a),x=j+=null==E?1:Math.random()||.1;for(b&&(N=a!==A&&a,C=r);null!=(d=T[y]);y++){if(s&&d){for(f=0;h=e[f++];)if(h(d,a,u)){l.push(d);break}b&&(j=x,C=++r)}i&&((d=!h&&d)&&g--,n&&v.push(d))}if(g+=y,i&&y!==g){for(f=0;h=t[f++];)h(v,m,a,u);if(n){if(g>0)for(;y--;)v[y]||m[y]||(m[y]=K.call(l));m=p(m)}Q.apply(l,m),b&&!n&&m.length>0&&g+t.length>1&&o.uniqueSort(l)}return b&&(j=x,N=E),v};return i?n(a):a}function y(e,t,n){for(var r=0,i=t.length;i>r;r++)o(e,t[r],n);return n}function v(e,t,n,r){var o,i,s,a,u,d=l(e);if(!r&&1===d.length){if(i=d[0]=d[0].slice(0),i.length>2&&"ID"===(s=i[0]).type&&9===t.nodeType&&_&&w.relative[i[1].type]){if(t=(w.find.ID(s.matches[0].replace(Et,Ct),t)||[])[0],!t)return n;e=e.slice(i.shift().value.length)}for(o=ft.needsContext.test(e)?0:i.length;o--&&(s=i[o],!w.relative[a=s.type]);)if((u=w.find[a])&&(r=u(s.matches[0].replace(Et,Ct),pt.test(i[0].type)&&t.parentNode||t))){if(i.splice(o,1),e=r.length&&c(i),!e)return Q.apply(n,r),n;break}}return S(e,d)(r,t,!_,n,pt.test(e)),n}function b(){}var E,C,w,T,x,S,N,k,I,O,A,R,_,L,D,H,M,q="sizzle"+-new Date,P=window.document,B={},j=0,F=0,X=t(),W=t(),$=t(),J=!1,U=function(){return 0},Y="undefined",z=1<<31,V=[],K=V.pop,G=V.push,Q=V.push,Z=V.slice,et=V.indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(this[t]===e)return t;return-1},tt="[\\x20\\t\\r\\n\\f]",nt="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",rt=nt.replace("w","w#"),ot="([*^$|!~]?=)",it="\\["+tt+"*("+nt+")"+tt+"*(?:"+ot+tt+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+rt+")|)|)"+tt+"*\\]",st=":("+nt+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+it.replace(3,8)+")*)|.*)\\)|)",at=RegExp("^"+tt+"+|((?:^|[^\\\\])(?:\\\\.)*)"+tt+"+$","g"),ut=RegExp("^"+tt+"*,"+tt+"*"),lt=RegExp("^"+tt+"*([\\x20\\t\\r\\n\\f>+~])"+tt+"*"),ct=RegExp(st),dt=RegExp("^"+rt+"$"),ft={ID:RegExp("^#("+nt+")"),CLASS:RegExp("^\\.("+nt+")"),NAME:RegExp("^\\[name=['\"]?("+nt+")['\"]?\\]"),TAG:RegExp("^("+nt.replace("w","w*")+")"),ATTR:RegExp("^"+it),PSEUDO:RegExp("^"+st),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+tt+"*(even|odd|(([+-]|)(\\d*)n|)"+tt+"*(?:([+-]|)"+tt+"*(\\d+)|))"+tt+"*\\)|)","i"),needsContext:RegExp("^"+tt+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+tt+"*((?:-\\d)?\\d*)"+tt+"*\\)|)(?=[^-]|$)","i")},pt=/[\x20\t\r\n\f]*[+~]/,ht=/^[^{]+\{\s*\[native code/,mt=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,gt=/^(?:input|select|textarea|button)$/i,yt=/^h\d$/i,vt=/'|\\/g,bt=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,Et=/\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,Ct=function(e,t){var n="0x"+t-65536;return n!==n?t:0>n?String.fromCharCode(n+65536):String.fromCharCode(55296|n>>10,56320|1023&n)};try{Q.apply(V=Z.call(P.childNodes),P.childNodes),V[P.childNodes.length].nodeType}catch(wt){Q={apply:V.length?function(e,t){G.apply(e,Z.call(t))}:function(e,t){for(var n=e.length,r=0;e[n++]=t[r++];);e.length=n-1}}}x=o.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},O=o.setDocument=function(t){var n=t?t.ownerDocument||t:P;return n!==A&&9===n.nodeType&&n.documentElement?(A=n,R=n.documentElement,_=!x(n),B.getElementsByTagName=r(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),B.attributes=r(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return"boolean"!==t&&"string"!==t}),B.getElementsByClassName=r(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",e.getElementsByClassName&&e.getElementsByClassName("e").length?(e.lastChild.className="e",2===e.getElementsByClassName("e").length):!1}),B.getByName=r(function(e){e.id=q+0,e.appendChild(A.createElement("a")).setAttribute("name",q),e.appendChild(A.createElement("i")).setAttribute("name",q),R.appendChild(e);var t=n.getElementsByName&&n.getElementsByName(q).length===2+n.getElementsByName(q+0).length;return R.removeChild(e),t}),B.sortDetached=r(function(e){return e.compareDocumentPosition&&1&e.compareDocumentPosition(A.createElement("div"))}),w.attrHandle=r(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==Y&&"#"===e.firstChild.getAttribute("href")})?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},B.getByName?(w.find.ID=function(e,t){if(typeof t.getElementById!==Y&&_){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},w.filter.ID=function(e){var t=e.replace(Et,Ct);return function(e){return e.getAttribute("id")===t}}):(w.find.ID=function(e,t){if(typeof t.getElementById!==Y&&_){var n=t.getElementById(e);return n?n.id===e||typeof n.getAttributeNode!==Y&&n.getAttributeNode("id").value===e?[n]:void 0:[]}},w.filter.ID=function(e){var t=e.replace(Et,Ct);return function(e){var n=typeof e.getAttributeNode!==Y&&e.getAttributeNode("id");return n&&n.value===t}}),w.find.TAG=B.getElementsByTagName?function(e,t){return typeof t.getElementsByTagName!==Y?t.getElementsByTagName(e):void 0}:function(e,t){var n,r=[],o=0,i=t.getElementsByTagName(e);if("*"===e){for(;n=i[o++];)1===n.nodeType&&r.push(n);return r}return i},w.find.NAME=B.getByName&&function(e,t){return typeof t.getElementsByName!==Y?t.getElementsByName(name):void 0},w.find.CLASS=B.getElementsByClassName&&function(e,t){return typeof t.getElementsByClassName!==Y&&_?t.getElementsByClassName(e):void 0},D=[],L=[":focus"],(B.qsa=e(n.querySelectorAll))&&(r(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||L.push("\\["+tt+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||L.push(":checked")}),r(function(e){e.innerHTML="<input type='hidden' i=''/>",e.querySelectorAll("[i^='']").length&&L.push("[*^$]="+tt+"*(?:\"\"|'')"),e.querySelectorAll(":enabled").length||L.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),L.push(",.*:")})),(B.matchesSelector=e(H=R.matchesSelector||R.mozMatchesSelector||R.webkitMatchesSelector||R.oMatchesSelector||R.msMatchesSelector))&&r(function(e){B.disconnectedMatch=H.call(e,"div"),H.call(e,"[s!='']:x"),D.push("!=",st)}),L=RegExp(L.join("|")),D=D.length&&RegExp(D.join("|")),M=e(R.contains)||R.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},U=R.compareDocumentPosition?function(e,t){if(e===t)return J=!0,0;var r=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return r?1&r||k&&t.compareDocumentPosition(e)===r?e===n||M(P,e)?-1:t===n||M(P,t)?1:I?et.call(I,e)-et.call(I,t):0:4&r?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,o=0,s=e.parentNode,a=t.parentNode,u=[e],l=[t];if(e===t)return J=!0,0;if(!s||!a)return e===n?-1:t===n?1:s?-1:a?1:0;if(s===a)return i(e,t);for(r=e;r=r.parentNode;)u.unshift(r);for(r=t;r=r.parentNode;)l.unshift(r);for(;u[o]===l[o];)o++;return o?i(u[o],l[o]):u[o]===P?-1:l[o]===P?1:0},A):A},o.matches=function(e,t){return o(e,null,null,t)},o.matchesSelector=function(e,t){if((e.ownerDocument||e)!==A&&O(e),t=t.replace(bt,"='$1']"),B.matchesSelector&&_&&(!D||!D.test(t))&&!L.test(t))try{var n=H.call(e,t);if(n||B.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(r){}return o(t,A,null,[e]).length>0},o.contains=function(e,t){return(e.ownerDocument||e)!==A&&O(e),M(e,t)},o.attr=function(e,t){var n;return(e.ownerDocument||e)!==A&&O(e),_&&(t=t.toLowerCase()),(n=w.attrHandle[t])?n(e):!_||B.attributes?e.getAttribute(t):((n=e.getAttributeNode(t))||e.getAttribute(t))&&e[t]===!0?t:n&&n.specified?n.value:null},o.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},o.uniqueSort=function(e){var t,n=[],r=0,o=0;if(J=!B.detectDuplicates,k=!B.sortDetached,I=!B.sortStable&&e.slice(0),e.sort(U),J){for(;t=e[o++];)t===e[o]&&(r=n.push(o));for(;r--;)e.splice(n[r],1)}return e},T=o.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=T(e)}else if(3===o||4===o)return e.nodeValue}else for(;t=e[r];r++)n+=T(t);return n},w=o.selectors={cacheLength:50,createPseudo:n,match:ft,find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(Et,Ct),e[3]=(e[4]||e[5]||"").replace(Et,Ct),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||o.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&o.error(e[0]),e},PSEUDO:function(e){var t,n=!e[5]&&e[2];return ft.CHILD.test(e[0])?null:(e[4]?e[2]=e[4]:n&&ct.test(n)&&(t=l(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){return"*"===e?function(){return!0}:(e=e.replace(Et,Ct).toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=X[e+" "];return t||(t=RegExp("(^|"+tt+")"+e+"("+tt+"|$)"))&&X(e,function(e){return t.test(e.className||typeof e.getAttribute!==Y&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=o.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,o){var i="nth"!==e.slice(0,3),s="last"!==e.slice(-4),a="of-type"===t;return 1===r&&0===o?function(e){return!!e.parentNode}:function(t,n,u){var l,c,d,f,p,h,m=i!==s?"nextSibling":"previousSibling",g=t.parentNode,y=a&&t.nodeName.toLowerCase(),v=!u&&!a;if(g){if(i){for(;m;){for(d=t;d=d[m];)if(a?d.nodeName.toLowerCase()===y:1===d.nodeType)return!1;h=m="only"===e&&!h&&"nextSibling"}return!0}if(h=[s?g.firstChild:g.lastChild],s&&v){for(c=g[q]||(g[q]={}),l=c[e]||[],p=l[0]===j&&l[1],f=l[0]===j&&l[2],d=p&&g.childNodes[p];d=++p&&d&&d[m]||(f=p=0)||h.pop();)if(1===d.nodeType&&++f&&d===t){c[e]=[j,p,f];break}}else if(v&&(l=(t[q]||(t[q]={}))[e])&&l[0]===j)f=l[1];else for(;(d=++p&&d&&d[m]||(f=p=0)||h.pop())&&((a?d.nodeName.toLowerCase()!==y:1!==d.nodeType)||!++f||(v&&((d[q]||(d[q]={}))[e]=[j,f]),d!==t)););return f-=o,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var r,i=w.pseudos[e]||w.setFilters[e.toLowerCase()]||o.error("unsupported pseudo: "+e);return i[q]?i(t):i.length>1?(r=[e,e,"",t],w.setFilters.hasOwnProperty(e.toLowerCase())?n(function(e,n){for(var r,o=i(e,t),s=o.length;s--;)r=et.call(e,o[s]),e[r]=!(n[r]=o[s])}):function(e){return i(e,0,r)}):i}},pseudos:{not:n(function(e){var t=[],r=[],o=S(e.replace(at,"$1"));return o[q]?n(function(e,t,n,r){for(var i,s=o(e,null,r,[]),a=e.length;a--;)(i=s[a])&&(e[a]=!(t[a]=i))}):function(e,n,i){return t[0]=e,o(t,null,i,r),!r.pop()}}),has:n(function(e){return function(t){return o(e,t).length>0}}),contains:n(function(e){return function(t){return(t.textContent||t.innerText||T(t)).indexOf(e)>-1}}),lang:n(function(e){return dt.test(e||"")||o.error("unsupported lang: "+e),e=e.replace(Et,Ct).toLowerCase(),function(t){var n;do if(n=_?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(e){var t=window.location&&window.location.hash;return t&&t.slice(1)===e.id},root:function(e){return e===R},focus:function(e){return e===A.activeElement&&(!A.hasFocus||A.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!w.pseudos.empty(e)},header:function(e){return yt.test(e.nodeName)},input:function(e){return gt.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:u(function(){return[0]}),last:u(function(e,t){return[t-1]}),eq:u(function(e,t,n){return[0>n?n+t:n]}),even:u(function(e,t){for(var n=0;t>n;n+=2)e.push(n);return e}),odd:u(function(e,t){for(var n=1;t>n;n+=2)e.push(n);return e}),lt:u(function(e,t,n){for(var r=0>n?n+t:n;--r>=0;)e.push(r);return e}),gt:u(function(e,t,n){for(var r=0>n?n+t:n;t>++r;)e.push(r);return e})}};for(E in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})w.pseudos[E]=s(E);for(E in{submit:!0,reset:!0})w.pseudos[E]=a(E);return S=o.compile=function(e,t){var n,r=[],o=[],i=$[e+" "];if(!i){for(t||(t=l(e)),n=t.length;n--;)i=m(t[n]),i[q]?r.push(i):o.push(i);i=$(e,g(o,r))}return i},w.pseudos.nth=w.pseudos.eq,b.prototype=w.filters=w.pseudos,w.setFilters=new b,B.sortStable=q.split("").sort(U).join("")===q,O(),[0,0].sort(U),B.detectDuplicates=J,{select:o,matches:o.matches}});
Ink.createModule("Ink.Dom.Browser","1",[],function(){"use strict";var e={IE:!1,GECKO:!1,OPERA:!1,SAFARI:!1,KONQUEROR:!1,CHROME:!1,model:!1,version:!1,userAgent:!1,init:function(){this.detectBrowser(),this.setDimensions(),this.setReferrer()},setDimensions:function(){var e=0,t=0;"number"==typeof window.innerWidth?(e=window.innerWidth,t=window.innerHeight):document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)?(e=document.documentElement.clientWidth,t=document.documentElement.clientHeight):document.body&&(document.body.clientWidth||document.body.clientHeight)&&(e=document.body.clientWidth,t=document.body.clientHeight),this.windowWidth=e,this.windowHeight=t},setReferrer:function(){this.referrer=void 0!==document.referrer?document.referrer.length>0?window.escape(document.referrer):!1:!1},detectBrowser:function(){var e=navigator.userAgent;if(this.userAgent=e,e=e.toLowerCase(),RegExp("applewebkit/").test(e))RegExp("chrome/").test(e)?(this.CHROME=!0,this.model="chrome",this.version=e.replace(RegExp("(.*)chrome/([^\\s]+)(.*)"),"$2"),this.cssPrefix="-webkit-",this.domPrefix="Webkit"):(this.SAFARI=!0,this.model="safari",this.version=e.replace(RegExp("(.*)applewebkit/([^\\s]+)(.*)"),"$2"),this.cssPrefix="-webkit-",this.domPrefix="Webkit");else if(RegExp("opera").test(e))this.OPERA=!0,this.model="opera",this.version=e.replace(RegExp("(.*)opera.([^\\s$]+)(.*)"),"$2"),this.cssPrefix="-o-",this.domPrefix="O";else if(RegExp("konqueror").test(e))this.KONQUEROR=!0,this.model="konqueror",this.version=e.replace(RegExp("(.*)konqueror/([^;]+);(.*)"),"$2"),this.cssPrefix="-khtml-",this.domPrefix="Khtml";else if(RegExp("msie\\ ").test(e))this.IE=!0,this.model="ie",this.version=e.replace(RegExp("(.*)\\smsie\\s([^;]+);(.*)"),"$2"),this.cssPrefix="-ms-",this.domPrefix="ms";else if(RegExp("gecko").test(e)){this.GECKO=!0;var t=RegExp("(camino|chimera|epiphany|minefield|firefox|firebird|phoenix|galeon|iceweasel|k\\-meleon|seamonkey|netscape|songbird|sylera)");if(t.test(e))this.model=e.match(t)[1],this.version=e.replace(RegExp("(.*)"+this.model+"/([^;\\s$]+)(.*)"),"$2"),this.cssPrefix="-moz-",this.domPrefix="Moz";else{this.model="mozilla";var n=RegExp("(.*)rv:([^)]+)(.*)");n.test(e)&&(this.version=e.replace(n,"$2")),this.cssPrefix="-moz-",this.domPrefix="Moz"}}},debug:function(){var e="known browsers: (ie, gecko, opera, safari, konqueror) \n";e+=[this.IE,this.GECKO,this.OPERA,this.SAFARI,this.KONQUEROR]+"\n",e+="model -> "+this.model+"\n",e+="version -> "+this.version+"\n",e+="\n",e+="original UA -> "+this.userAgent,alert(e)}};return e.init(),e});
Ink.createModule("Ink.Util.Url","1",[],function(){"use strict";var e={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",getUrl:function(){return window.location.href},genQueryString:function(e,t){var n,r,o,i=-1!==e.indexOf("?"),s=[e];for(r in t)t.hasOwnProperty(r)&&(i?n="&":(n="?",i=!0),o=t[r],"number"==typeof o||o||(o=""),s=s.concat([n,encodeURIComponent(r),"=",encodeURIComponent(o)]));return s.join("")},getQueryString:function(e){var t;t=e&&e!==void 0?e:this.getUrl();var n={};if(t.match(/\?(.+)/i)){var r=t.replace(/^(.*)\?([^\#]+)(\#(.*))?/g,"$2");if(r.length>0)for(var o=r.split(/[;&]/),i=0;o.length>i;i++){var s=o[i].split("=");n[decodeURIComponent(s[0])]=s[1]!==void 0&&s[1]?decodeURIComponent(s[1]):!1}}return n},getAnchor:function(e){var t;t=e&&e!==void 0?e:this.getUrl();var n=!1;return t.match(/#(.+)/)&&(n=t.replace(/([^#]+)#(.*)/,"$2")),n},getAnchorString:function(e){var t;t=e&&e!==void 0?e:this.getUrl();var n={};if(t.match(/#(.+)/i)){var r=t.replace(/^([^#]+)#(.*)?/g,"$2");if(r.length>0)for(var o=r.split(/[;&]/),i=0;o.length>i;i++){var s=o[i].split("=");n[decodeURIComponent(s[0])]=s[1]!==void 0&&s[1]?decodeURIComponent(s[1]):!1}}return n},parseUrl:function(e){var t={};if(e&&e!==void 0&&"string"==typeof e){if(e.match(/^([^:]+):\/\//i)){var n=/^([^:]+):\/\/([^\/]*)\/?([^\?#]*)\??([^#]*)#?(.*)/i;e.match(n)&&(t.scheme=e.replace(n,"$1"),t.host=e.replace(n,"$2"),t.path="/"+e.replace(n,"$3"),t.query=e.replace(n,"$4")||!1,t.fragment=e.replace(n,"$5")||!1)}else{var r=RegExp("^([^\\?]+)\\?([^#]+)#(.*)","i"),o=RegExp("^([^\\?]+)\\?([^#]+)#?","i"),i=RegExp("^([^\\?]+)\\??","i");e.match(r)?(t.scheme=!1,t.host=!1,t.path=e.replace(r,"$1"),t.query=e.replace(r,"$2"),t.fragment=e.replace(r,"$3")):e.match(o)?(t.scheme=!1,t.host=!1,t.path=e.replace(o,"$1"),t.query=e.replace(o,"$2"),t.fragment=!1):e.match(i)&&(t.scheme=!1,t.host=!1,t.path=e.replace(i,"$1"),t.query=!1,t.fragment=!1)}if(t.host){var s=RegExp("^(.*)\\:(\\d+)$","i");if(t.host.match(s)){var a=t.host;t.host=a.replace(s,"$1"),t.port=a.replace(s,"$2")}else t.port=!1;if(t.host.match(/@/i)){var l=t.host;t.host=l.split("@")[1];var u=l.split("@")[0];u.match(/\:/)?(t.user=u.split(":")[0],t.pass=u.split(":")[1]):(t.user=u,t.pass=!1)}}}return t},currentScriptElement:function(e){var t=document.getElementsByTagName("script");if(e===void 0)return t.length>0?t[t.length-1]:!1;for(var n=!1,r=RegExp(""+e,"i"),o=0,i=t.length;i>o;o++)if(n=t[o],r.test(n.src))return n;return!1},_debug:function(){}};return e});
Ink.createModule("Ink.Util.Swipe","1",["Ink.Dom.Event_1"],function(e){"use strict";var t=function(e,t){this._options=Ink.extendObj({callback:void 0,forceAxis:void 0,maxDist:void 0,maxDuration:void 0,minDist:void 0,minDuration:void 0,stopEvents:!0,storeGesture:!1},t||{}),this._handlers={down:Ink.bindEvent(this._onDown,this),move:Ink.bindEvent(this._onMove,this),up:Ink.bindEvent(this._onUp,this)},this._element=Ink.i(e),this._init()};return t._supported="ontouchstart"in document.documentElement,t.prototype={_init:function(){var t=document.body;e.observe(t,"touchstart",this._handlers.down),this._options.storeGesture&&e.observe(t,"touchmove",this._handlers.move),e.observe(t,"touchend",this._handlers.up),this._isOn=!1},_isMeOrParent:function(e,t){if(e){do{if(e===t)return!0;e=e.parentNode}while(e);return!1}},_onDown:function(t){1===event.changedTouches.length&&this._isMeOrParent(t.target,this._element)&&(this._options.stopEvents===!0&&e.stop(t),t=t.changedTouches[0],this._isOn=!0,this._target=t.target,this._t0=(new Date).valueOf(),this._p0=[t.pageX,t.pageY],this._options.storeGesture&&(this._gesture=[this._p0],this._time=[0]))},_onMove:function(t){if(this._isOn&&1===event.changedTouches.length){this._options.stopEvents===!0&&e.stop(t),t=t.changedTouches[0];var n=(new Date).valueOf(),r=.001*(n-this._t0);this._gesture.push([t.pageX,t.pageY]),this._time.push(r)}},_onUp:function(t){if(this._isOn&&1===event.changedTouches.length){this._options.stopEvents===!0&&e.stop(t),t=t.changedTouches[0],this._isOn=!1;var n=(new Date).valueOf(),r=[t.pageX,t.pageY],o=.001*(n-this._t0),i=[r[0]-this._p0[0],r[1]-this._p0[1]],s=Math.sqrt(i[0]*i[0]+i[1]*i[1]),a=Math.abs(i[0])>Math.abs(i[1])?"x":"y",u=this._options;if(!(u.minDist&&u.minDist>s||u.maxDist&&s>u.maxDist||u.minDuration&&u.minDuration>o||u.maxDuration&&o>u.maxDuration||u.forceAxis&&a!==u.forceAxis)){var l={elementId:this._element.id,duration:o,dr:i,dist:s,axis:a,target:this._target};this._options.storeGesture&&(l.gesture=this._gesture,l.time=this._time),this._options.callback(this,l)}}}},t});
Ink.createModule("Ink.Util.String","1",[],function(){"use strict";var InkUtilString={_chars:["&","à","á","â","ã","ä","å","æ","ç","è","é","ê","ë","ì","í","î","ï","ð","ñ","ò","ó","ô","õ","ö","ø","ù","ú","û","ü","ý","þ","ÿ","À","Á","Â","Ã","Ä","Å","Æ","Ç","È","É","Ê","Ë","Ì","Í","Î","Ï","Ð","Ñ","Ò","Ó","Ô","Õ","Ö","Ø","Ù","Ú","Û","Ü","Ý","Þ","€",'"',"ß","<",">","¢","£","¤","¥","¦","§","¨","©","ª","«","¬","­","®","¯","°","±","²","³","´","µ","¶","·","¸","¹","º","»","¼","½","¾"],_entities:["amp","agrave","aacute","acirc","atilde","auml","aring","aelig","ccedil","egrave","eacute","ecirc","euml","igrave","iacute","icirc","iuml","eth","ntilde","ograve","oacute","ocirc","otilde","ouml","oslash","ugrave","uacute","ucirc","uuml","yacute","thorn","yuml","Agrave","Aacute","Acirc","Atilde","Auml","Aring","AElig","Ccedil","Egrave","Eacute","Ecirc","Euml","Igrave","Iacute","Icirc","Iuml","ETH","Ntilde","Ograve","Oacute","Ocirc","Otilde","Ouml","Oslash","Ugrave","Uacute","Ucirc","Uuml","Yacute","THORN","euro","quot","szlig","lt","gt","cent","pound","curren","yen","brvbar","sect","uml","copy","ordf","laquo","not","shy","reg","macr","deg","plusmn","sup2","sup3","acute","micro","para","middot","cedil","sup1","ordm","raquo","frac14","frac12","frac34"],_accentedChars:["à","á","â","ã","ä","å","è","é","ê","ë","ì","í","î","ï","ò","ó","ô","õ","ö","ù","ú","û","ü","ç","ñ","À","Á","Â","Ã","Ä","Å","È","É","Ê","Ë","Ì","Í","Î","Ï","Ò","Ó","Ô","Õ","Ö","Ù","Ú","Û","Ü","Ç","Ñ"],_accentedRemovedChars:["a","a","a","a","a","a","e","e","e","e","i","i","i","i","o","o","o","o","o","u","u","u","u","c","n","A","A","A","A","A","A","E","E","E","E","I","I","I","I","O","O","O","O","O","U","U","U","U","C","N"],_htmlUnsafeChars:{"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"},ucFirst:function(e){return e?(e+"").replace(/(^|\s)(\w)(\S{2,})/g,function(e,t,n,r){return t+n.toUpperCase()+r.toLowerCase()}):e},trim:function(e){return"string"==typeof e?e.replace(/^\s+|\s+$|\n+$/g,""):e},stripTags:function(e,t){if(t&&"string"==typeof t){for(var n=this.trim(t).split(","),r=[],o=!1,i=0;n.length>i;i++)""!==this.trim(n[i])&&(o=this.trim(n[i].replace(/(\<|\>)/g,"").replace(/\s/,"")),r.push("(<"+o+"\\s[^>]+>|<(\\s|\\/)?(\\s|\\/)?"+o+">)"));for(var s=r.join("|"),a=RegExp(s,"i"),u=e.match(RegExp("<[^>]*>","g")),l=0;u.length>l;l++)u[l].match(a)||(e=e.replace(RegExp(u[l],"gm"),""));return e}return e.replace(/\<[^\>]+\>/g,"")},htmlEntitiesEncode:function(e){if(e&&e.replace)for(var t=!1,n=0;this._chars.length>n;n++)t=RegExp(this._chars[n],"gm"),e=e.replace(t,"&"+this._entities[n]+";");return e},htmlEntitiesDecode:function(e){if(e&&e.replace){for(var t=!1,n=0;this._entities.length>n;n++)t=RegExp("&"+this._entities[n]+";","gm"),e=e.replace(t,this._chars[n]);e=e.replace(/&#[^;]+;?/g,function(e){return"x"===e.charAt(2)?String.fromCharCode(parseInt(e.substring(3),16)):String.fromCharCode(parseInt(e.substring(2),10))})}return e},utf8Encode:function(e){e=e.replace(/\r\n/g,"\n");for(var t="",n=0;e.length>n;n++){var r=e.charCodeAt(n);128>r?t+=String.fromCharCode(r):r>127&&2048>r?(t+=String.fromCharCode(192|r>>6),t+=String.fromCharCode(128|63&r)):(t+=String.fromCharCode(224|r>>12),t+=String.fromCharCode(128|63&r>>6),t+=String.fromCharCode(128|63&r))}return t},shortString:function(e,t){for(var n=e.split(" "),r="",o=0;n.length>o;o++){if((r+n[o]+" ").length>=t){r+="&hellip;";break}r+=n[o]+" "}return r},truncateString:function(e,t){return e.length-1>t?e.substr(0,t-1)+"…":e},utf8Decode:function(e){for(var t="",n=0,r=0,o=0,i=0;e.length>n;)r=e.charCodeAt(n),128>r?(t+=String.fromCharCode(r),n++):r>191&&224>r?(o=e.charCodeAt(n+1),t+=String.fromCharCode((31&r)<<6|63&o),n+=2):(o=e.charCodeAt(n+1),i=e.charCodeAt(n+2),t+=String.fromCharCode((15&r)<<12|(63&o)<<6|63&i),n+=3);return t},removeAccentedChars:function(e){for(var t=e,n=!1,r=0;this._accentedChars.length>r;r++)n=RegExp(this._accentedChars[r],"gm"),t=t.replace(n,""+this._accentedRemovedChars[r]);return t},substrCount:function(e,t){return e?e.split(t).length-1:0},evalJSON:function(strJSON,sanitize){if(sanitize===void 0||null===sanitize||this.isJSON(strJSON))try{return"undefined"!=typeof JSON&&JSON.parse!==void 0?JSON.parse(strJSON):eval("("+strJSON+")")}catch(e){throw Error("ERROR: Bad JSON string...")}},isJSON:function(e){return e=e.replace(/\\./g,"@").replace(/"[^"\\\n\r]*"/g,""),/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/.test(e)},htmlEscapeUnsafe:function(e){var t=this._htmlUnsafeChars;return null!=e?(e+"").replace(/[<>&'"]/g,function(e){return t[e]}):e},normalizeWhitespace:function(e){return null!=e?this.trim((e+"").replace(/\s+/g," ")):e},toUnicode:function(e){if("string"==typeof e){for(var t="",n=!1,r=!1,o=e.length,i=0;o>i;){if(n=e.charCodeAt(i),n>=32&&126>=n||8==n||9==n||10==n||12==n||13==n||32==n||34==n||47==n||58==n||92==n)r=8==n?"\\b":9==n?"\\t":10==n?"\\n":12==n?"\\f":13==n?"\\r":e.charAt(i);else{for(r=e.charCodeAt(i).toString(16)+"".toUpperCase();4>r.length;)r="0"+r;r="\\u"+r}t+=r,i++}return t}},escape:function(e){var t=e.charCodeAt(0).toString(16).split("");if(3>t.length){for(;2>t.length;)t.unshift("0");t.unshift("x")}else{for(;4>t.length;)t.unshift("0");t.unshift("u")}return t.unshift("\\"),t.join("")},unescape:function(e){var t=e.lastIndexOf("0");t=-1===t?2:Math.min(t,2);var n=e.substring(t),r=parseInt(n,16);return String.fromCharCode(r)},escapeText:function(e,t){void 0===t&&(t=["[","]","'",","]);for(var n,r,o=[],i=0,s=e.length;s>i;++i)n=e[i],r=n.charCodeAt(0),(32>r||r>126&&-1===t.indexOf(n))&&(n=this.escape(n)),o.push(n);return o.join("")},escapedCharRegex:/(\\x[0-9a-fA-F]{2})|(\\u[0-9a-fA-F]{4})/g,unescapeText:function(e){for(var t;t=this.escapedCharRegex.exec(e);)t=t[0],e=e.replace(t,this.unescape(t)),this.escapedCharRegex.lastIndex=0;return e},strcmp:function(e,t){return e===t?0:e>t?1:-1},packetize:function(e,t){for(var n,r=e.length,o=Array(Math.ceil(r/t)),i=e.split(""),s=0;r;)n=Math.min(t,r),o[s++]=i.splice(0,n).join(""),r-=n;return o}};return InkUtilString});
Ink.createModule("Ink.Util.Kink",1,["Ink.Dom.Browser_1","Ink.Dom.Selector_1","Ink.Dom.Event_1","Ink.Dom.Element_1","Ink.Dom.Css_1","Ink.Dom.Loaded_1","Ink.Util.Array_1","Ink.Util.Url_1","Ink.Util.String_1","Ink.Util.Date_1","Ink.Util.Cookie_1","Ink.Net.Ajax","Ink.Net.JsonP"],function(e,t,n,r,o,i,s,a,u,l,c){var d=function(e){return Ink.bindEvent(function(r){for(var o in f.liveEvents[e]){var i=t.select(o),a=n.element(r);-1!==i.indexOf(a)&&s.each(f.liveEvents[e][o],function(e){e.call(a,r)})}},this)},h=function(e,t){return this.selector=t,this.arr=e,this.get=function(e){return void 0===e&&(e=0),new h([this.arr[e]])},this.result=function(e){return void 0===e?this.arr:this.arr[e]},this};h.prototype.each=function(e){return s.each(this.arr,e),this},h.prototype.some=function(e,t){return s.some(this.arr,e,t)},h.prototype.addClassName=h.prototype.addClass=function(e){return this.each(function(t){o.addClassName(t,e)}),this},h.prototype.removeClassName=h.prototype.removeClass=function(e){return this.each(function(t){o.removeClassName(t,e)}),this},h.prototype.setClassName=h.prototype.setClass=function(e,t){return this.each(function(n){o.setClassName(n,e,t)}),this},h.prototype.hasClassName=h.prototype.hasClass=function(e){return this.some(function(t){return o.hasClassName(t,e)})},h.prototype.hide=function(){return this.each(function(e){o.hide(e)}),this},h.prototype.show=function(){return this.each(function(e){o.show(e)}),this},h.prototype.showHide=function(e){return this.each(function(t){o.showHide(t,e)}),this},h.prototype.toggle=function(){return this.each(function(e){o.toggle(e,boolState)}),this},h.prototype.style=h.prototype.setStyle=function(e){return this.each(function(t){o.setStyle(t,e)}),this},h.prototype.on=h.prototype.bind=function(e,t){return void 0===t?this.each(function(t){n.fire(t,e)}):this.each(function(r){n.observe(r,e,t)}),this},h.prototype.live=function(e,t){return"string"==typeof this.selector?(e in f.liveEvents||n.observe(document,e,d(e)),e in f.liveEvents||(f.liveEvents[e]={}),this.selector in f.liveEvents[e]||(f.liveEvents[e][this.selector]=[]),f.liveEvents[e][this.selector].push(t),this):void 0},h.prototype.die=function(e,t){if(t!==void 0){if(!(this.selector in f.liveEvents[e]))return;var r=f.liveEvents[e][this.selector].indexOf(t);-1!==r&&f.liveEvents[e][this.selector].splice(r,1)}else f.liveEvents[e][this.selector].splice(0,f.liveEvents[e][this.selector].length-1);0===f.liveEvents[e][this.selector].length&&delete f.liveEvents[e][this.selector];var o=0;for(var i in f.liveEvents[e])f.liveEvents[e].hasOwnProperty(i)&&o++;return 0===o&&n.stopObserving(document,e,d(e)),this},h.prototype.click=function(e){return this.bind("click",e)},h.prototype.dblclick=function(e){return this.bind("dblclick",e)},h.prototype.mousemove=function(e){return this.bind("mousemove",e)},h.prototype.mouseover=function(e){return this.bind("mouseover",e),this},h.prototype.mouseout=function(e){return this.bind("mouseout",e),this},h.prototype.hover=function(e,t){return void 0===t?this.mouseover(e):this.mouseover(e).mouseout(t),this},h.prototype.html=function(e){return void 0===e&&1===this.arr.length?r.textContent(this.result(0)):(this.each(function(t){r.setTextContent(t,e)}),this)},h.prototype.appendHTML=function(e){return this.each(function(t){r.appendHTML(t,e)}),this},h.prototype.prependHTML=function(e){return this.each(function(t){r.prependHTML(t,e)}),this},h.prototype.remove=function(){return this.each(function(e){r.remove(e)}),!0},h.prototype.data=function(){return r.data(this.result(0))},h.prototype.size=h.prototype.elementDimensions=function(){return r.elementDimensions(this.result(0))},h.prototype.height=h.prototype.elementHeight=function(){return r.elementHeight(this.result(0))},h.prototype.width=h.prototype.elementWidth=function(){return r.elementWidth(this.result(0))},h.prototype.hasAttribute=function(e){return this.some(function(t){return r.hasAttribute(t,e)})},h.prototype.scroll=function(){return r.scroll(this.result(0))},h.prototype.scrollTo=function(){return r.scrollTo(this.result(0))},h.prototype.siblings=function(){return new h(r.siblings(this.result(0)))},h.prototype.parent=function(){return new h([this.result(0).parentNode])},h.prototype.childs=function(e){var t=[];return this.each(function(e){var n=s.convert(e.children),r=new h(n);r.each(function(e){t.push(e)})}),"number"==typeof e||e?new h(t).get(e):new h(t)},h.prototype.find=function(e){var n=[];return this.each(function(r){var o=new h(t.select(e,r));o.each(function(e){n.push(e)})}),new h(n)};var f=function(e,n){return"string"==typeof e?new h(t.select(e,n),e):e instanceof Array?new h(e):new h([e])};return f.liveEvents={},f.viewportHeight=r.viewportHeight,f.viewportWidth=r.viewportWidth,f.ready=function(e){i.run(e)},f.browser=e,f.url=a,f.date=l,f.string=u,f.cookie=c,f.ajax=function(e,t,n){var r=n,o="Ajax";return"function"==typeof t?(r=t,t={onComplete:r}):(t=Ink.extendObj(t,{onComplete:r}),t.jsonp&&(o="JsonP")),new o.call(this,e,t)},window.kk=f,f});
Ink.createModule("Ink.Util.Dumper","1",[],function(){"use strict";var e={_tab:"    ",_formatParam:function(e){var t="";switch(typeof e){case"string":t="(string) "+e;break;case"number":t="(number) "+e;break;case"boolean":t="(boolean) "+e;break;case"object":t=null!==e?e.constructor===Array?"Array \n{\n"+this._outputFormat(e,0)+"\n}":"Object \n{\n"+this._outputFormat(e,0)+"\n}":"null";break;default:t=!1}return t},_getTabs:function(e){for(var t="",n=0;e>n;n++)t+=this._tab;return t},_outputFormat:function(e,t){var n="",r=!1;for(var o in e)if(null!==e[o])if("object"!=typeof e[o]||e[o].constructor!==Array&&e[o].constructor!==Object){if(e[o].constructor===Function)continue;n=n+this._tab+this._getTabs(t)+"["+o+"] => "+e[o]+"\n"}else e[o].constructor===Array?r="Array":e[o].constructor===Object&&(r="Object"),n+=this._tab+this._getTabs(t)+"["+o+"] => <b>"+r+"</b>\n",n+=this._tab+this._getTabs(t)+"{\n",n+=this._outputFormat(e[o],t+1)+this._tab+this._getTabs(t)+"}\n";else n=n+this._tab+this._getTabs(t)+"["+o+"] => null \n";return n},printDump:function(e,t){if(t&&t!==void 0)if("string"==typeof t)document.getElementById(t).innerHTML="<pre>"+this._formatParam(e)+"</pre>";else{if("object"!=typeof t)throw"TARGET must be an element or an element ID";t.innerHTML="<pre>"+this._formatParam(e)+"</pre>"}else document.write("<pre>"+this._formatParam(e)+"</pre>")},returnDump:function(e){return this._formatParam(e)},alertDump:function(e){window.alert(this._formatParam(e).replace(/(<b>)(Array|Object)(<\/b>)/g,"$2"))},windowDump:function(e){var t="dumperwindow_"+1e4*Math.random(),n=window.open("",t,"width=400,height=300,left=50,top=50,status,menubar,scrollbars,resizable");n.document.open(),n.document.write("<pre>"+this._formatParam(e)+"</pre>"),n.document.close(),n.focus()}};return e});
Ink.createModule("Ink.Util.Date","1",[],function(){"use strict";var e={_months:function(e){var t=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];return t[e]},_iMonth:function(e){return Number(e)?+e-1:{janeiro:0,jan:0,fevereiro:1,fev:1,"março":2,mar:2,abril:3,abr:3,maio:4,mai:4,junho:5,jun:5,julho:6,jul:6,agosto:7,ago:7,setembro:8,set:8,outubro:9,out:9,novembro:10,nov:10,dezembro:11,dez:11}[e.toLowerCase()]},_wDays:function(e){var t=["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];return t[e]},_iWeek:function(e){return Number(e)?+e||7:{segunda:1,seg:1,"terça":2,ter:2,quarta:3,qua:3,quinta:4,qui:4,sexta:5,sex:5,"sábado":6,"sáb":6,domingo:7,dom:7}[e.toLowerCase()]},_daysInMonth:function(e,t){var n;return n=1===e||3===e||5===e||7===e||8===e||10===e||12===e?31:4===e||6===e||9===e||11===e?30:0===t%400||0===t%4&&0!==t%100?29:28},get:function(e,t){(e===void 0||""===e)&&(e="Y-m-d");var n,r=e.split(""),o=Array(r.length),i="\\";n=t===void 0?new Date:"number"==typeof t?new Date(1e3*t):new Date(t);for(var s,a,u,c=0;r.length>c;c++)switch(r[c]){case i:o[c]=r[c+1],c++;break;case"d":var l=n.getDate();o[c]=(l+"").length>1?l:"0"+l;break;case"D":o[c]=this._wDays(n.getDay()).substring(0,3);break;case"j":o[c]=n.getDate();break;case"l":o[c]=this._wDays(n.getDay());break;case"N":o[c]=n.getDay()||7;break;case"S":var d=n.getDate(),h=["st","nd","rd"],f="";o[c]=d>=11&&13>=d?"th":(f=h[(d+"").substr(-1)-1])?f:"th";break;case"w":o[c]=n.getDay();break;case"z":s=Date.UTC(n.getFullYear(),0,0),a=Date.UTC(n.getFullYear(),n.getMonth(),n.getDate()),o[c]=Math.floor((a-s)/864e5);break;case"W":var p=new Date(n.getFullYear(),0,1);s=p.getDay()||7;var m=Math.floor((n-p)/864e5+1);o[c]=Math.ceil((m-(8-s))/7)+1;break;case"F":o[c]=this._months(n.getMonth());break;case"m":var g=n.getMonth()+1+"";o[c]=g.length>1?g:"0"+g;break;case"M":o[c]=this._months(n.getMonth()).substring(0,3);break;case"n":o[c]=n.getMonth()+1;break;case"t":o[c]=this._daysInMonth(n.getMonth()+1,n.getYear());break;case"L":var v=n.getFullYear();o[c]=v%4?!1:v%100?!0:v%400?!1:!0;break;case"o":throw'"o" not implemented!';case"Y":o[c]=n.getFullYear();break;case"y":o[c]=(n.getFullYear()+"").substring(2);break;case"a":o[c]=12>n.getHours()?"am":"pm";break;case"A":o[c]=12>n.getHours?"AM":"PM";break;case"B":throw'"B" not implemented!';case"g":u=n.getHours(),o[c]=12>=u?u:u-12;break;case"G":o[c]=n.getHours()+"";break;case"h":u=n.getHours()+"",u=12>=u?u:u-12,o[c]=u.length>1?u:"0"+u;break;case"H":u=n.getHours()+"",o[c]=u.length>1?u:"0"+u;break;case"i":var y=n.getMinutes()+"";o[c]=y.length>1?y:"0"+y;break;case"s":var b=n.getSeconds()+"";o[c]=b.length>1?b:"0"+b;break;case"u":throw'"u" not implemented!';case"e":throw'"e" not implemented!';case"I":s=new Date(n.getFullYear(),0,1),o[c]=n.getTimezoneOffset()!==s.getTimezoneOffset()?1:0;break;case"O":var w=n.getTimezoneOffset(),E=w%60;u=-1*((w-E)/60)+"","-"!==u.charAt(0)&&(u="+"+u),u=3===u.length?u:u.replace(/([+\-])(\d)/,"$10$2"),o[c]=u+E+"0";break;case"P":throw'"P" not implemented!';case"T":throw'"T" not implemented!';case"Z":o[c]=60*n.getTimezoneOffset();break;case"c":throw'"c" not implemented!';case"r":var C=this._wDays(n.getDay()).substr(0,3),k=this._months(n.getMonth()).substr(0,3);o[c]=C+", "+n.getDate()+" "+k+this.get(" Y H:i:s O",n);break;case"U":o[c]=Math.floor(n.getTime()/1e3);break;default:o[c]=r[c]}return o.join("")},set:function(e,t){if(void 0!==t){(e===void 0||""===e)&&(e="Y-m-d");for(var n,r=e.split(""),o=Array(r.length),i="\\",s={year:void 0,month:void 0,day:void 0,dayY:void 0,dayW:void 0,week:void 0,hour:void 0,hourD:void 0,min:void 0,sec:void 0,msec:void 0,ampm:void 0,diffM:void 0,diffH:void 0,date:void 0},a=0,u=0;r.length>u;u++)switch(r[u]){case i:o[u]=r[u+1],u++;break;case"d":o[u]="(\\d{2})",s.day={original:u,match:a++};break;case"j":o[u]="(\\d{1,2})",s.day={original:u,match:a++};break;case"D":o[u]="([\\wá]{3})",s.dayW={original:u,match:a++};break;case"l":o[u]="([\\wá]{5,7})",s.dayW={original:u,match:a++};break;case"N":o[u]="(\\d)",s.dayW={original:u,match:a++};break;case"w":o[u]="(\\d)",s.dayW={original:u,match:a++};break;case"S":o[u]="\\w{2}";break;case"z":o[u]="(\\d{1,3})",s.dayY={original:u,match:a++};break;case"W":o[u]="(\\d{1,2})",s.week={original:u,match:a++};break;case"F":o[u]="([\\wç]{4,9})",s.month={original:u,match:a++};break;case"M":o[u]="(\\w{3})",s.month={original:u,match:a++};break;case"m":o[u]="(\\d{2})",s.month={original:u,match:a++};break;case"n":o[u]="(\\d{1,2})",s.month={original:u,match:a++};break;case"t":o[u]="\\d{2}";break;case"L":o[u]="\\w{4,5}";break;case"o":throw'"o" not implemented!';case"Y":o[u]="(\\d{4})",s.year={original:u,match:a++};break;case"y":o[u]="(\\d{2})",(s.year===void 0||"Y"!==r[s.year.original])&&(s.year={original:u,match:a++});break;case"a":o[u]="(am|pm)",s.ampm={original:u,match:a++};break;case"A":o[u]="(AM|PM)",s.ampm={original:u,match:a++};break;case"B":throw'"B" not implemented!';case"g":o[u]="(\\d{1,2})",s.hourD={original:u,match:a++};break;case"G":o[u]="(\\d{1,2})",s.hour={original:u,match:a++};break;case"h":o[u]="(\\d{2})",s.hourD={original:u,match:a++};break;case"H":o[u]="(\\d{2})",s.hour={original:u,match:a++};break;case"i":o[u]="(\\d{2})",s.min={original:u,match:a++};break;case"s":o[u]="(\\d{2})",s.sec={original:u,match:a++};break;case"u":throw'"u" not implemented!';case"e":throw'"e" not implemented!';case"I":o[u]="\\d";break;case"O":o[u]="([-+]\\d{4})",s.diffH={original:u,match:a++};break;case"P":throw'"P" not implemented!';case"T":throw'"T" not implemented!';case"Z":o[u]="(\\-?\\d{1,5})",s.diffM={original:u,match:a++};break;case"c":throw'"c" not implemented!';case"r":o[u]="([\\wá]{3}, \\d{1,2} \\w{3} \\d{4} \\d{2}:\\d{2}:\\d{2} [+\\-]\\d{4})",s.date={original:u,match:a++};break;case"U":o[u]="(\\d{1,13})",s.date={original:u,match:a++};break;default:o[u]=r[u]}var c=RegExp(o.join(""));try{if(n=t.match(c),!n)return}catch(l){return}var d,h,f=s.date!==void 0,p=s.year!==void 0,m=s.dayY!==void 0,g=s.day!==void 0,v=s.month!==void 0,y=v&&g,b=!v&&g,w=s.dayW!==void 0,E=s.week!==void 0,C=E&&w,k=!E&&w,x=m||y||!p&&b||C||!p&&k,T=!(p||m||g||v||w||E),S=s.hourD!==void 0&&s.ampm!==void 0,I=s.hour!==void 0,_=S||I,N=s.min!==void 0,O=s.sec!==void 0,A=s.msec!==void 0,D=!T||_,R=D||N,M=s.diffM!==void 0,L=s.diffH!==void 0;if(f){if("U"===r[s.date.original])return new Date(1e3*+n[s.date.match+1]);var H=n[s.date.match+1].match(/\w{3}, (\d{1,2}) (\w{3}) (\d{4}) (\d{2}):(\d{2}):(\d{2}) ([+\-]\d{4})/);return d=+H[4]+ +H[7].slice(0,3),h=+H[5]+60*((H[7].slice(0,1)+H[7].slice(3))/100),new Date(H[3],this._iMonth(H[2]),H[1],d,h,H[6])}var P,j,q,B,U,F,$,W=new Date;if(x||T){if(x){if(p){var Y=W.getFullYear()-50+"";P=n[s.year.match+1],"y"===r[s.year.original]&&(P=+Y.slice(0,2)+(P>=Y.slice(2)?0:1)+P)}else P=W.getFullYear();if(m)j=0,q=n[s.dayY.match+1];else if(g)j=v?this._iMonth(n[s.month.match+1]):W.getMonth(),q=n[s.day.match+1];else{j=0;var X;X=E?n[s.week.match+1]:this.get("W",W),q=7*(X-2)+(8-(new Date(P,0,1).getDay()||7))+this._iWeek(n[s.week.match+1])}if(0===j&&q>31){var z=new Date(P,j,q);j=z.getMonth(),q=z.getDate()}}else P=W.getFullYear(),j=W.getMonth(),q=W.getDate();return B=P+"-"+(j+1)+"-"+q+" ",d=S?+n[s.hourD.match+1]+("pm"===n[s.ampm.match+1]?12:0):I?n[s.hour.match+1]:T?W.getHours():"00",h=N?n[s.min.match+1]:D?"00":W.getMinutes(),U=O?n[s.sec.match+1]:R?"00":W.getSeconds(),F=A?n[s.msec.match+1]:"000",$=L?n[s.diffH.match+1]:M?(100*(-1*n[s.diffM.match+1]/60)+"").replace(/^(\d)/,"+$1").replace(/(^[\-+])(\d{3}$)/,"$10$2"):"+0000",new Date(B+d+":"+h+":"+U+"."+F+$)}}}};return e});
Ink.createModule("Ink.Util.Cookie","1",[],function(){"use strict";var e={get:function(e){var t=document.cookie||!1,n={};if(t){t=t.replace(RegExp("; ","g"),";");var r=t.split(";"),o=[];if(r.length>0)for(var i=0;r.length>i;i++)o=r[i].split("="),2===o.length&&(n[o[0]]=decodeURIComponent(o[1])),o=[]}return e?n[e]!==void 0?n[e]:null:n},set:function(e,t,n,r,o,i){var s;if(!e||t===!1||void 0===e||void 0===t)return!1;s=e+"="+encodeURIComponent(t);var a=!1,u=!1,c=!1,l=!1;if(n&&n!==void 0&&!isNaN(n)){var d=new Date,h=parseInt(Number(d.valueOf()),10)+1e3*Number(parseInt(n,10)),f=new Date(h),p=f.toGMTString(),m=RegExp("([^\\s]+)(\\s\\d\\d)\\s(\\w\\w\\w)\\s(.*)");p=p.replace(m,"$1$2-$3-$4"),a="expires="+p}else a=void 0===n||isNaN(n)||0!==Number(parseInt(n,10))?"expires=Thu, 01-Jan-2037 00:00:01 GMT":"";if(u=r&&r!==void 0?"path="+r:"path=/",o&&o!==void 0)c="domain="+o;else{var g=RegExp(":(.*)");c="domain="+window.location.host,c=c.replace(g,"")}l=i&&i!==void 0?i:!1,document.cookie=s+"; "+a+"; "+u+"; "+c+"; "+l},remove:function(e,t,n){var r=!1,o=!1,i=-999999999;r=t&&t!==void 0?t:"/",o=n&&n!==void 0?n:window.location.host,this.set(e,"deleted",i,r,o)}};return e});
Ink.createModule("Ink.Util.Array","1",[],function(){"use strict";var e={inArray:function(e,t){if("object"==typeof t)for(var n=0,r=t.length;r>n;++n)if(t[n]===e)return!0;return!1},sortMulti:function(e,t){if(e===void 0||e.constructor!==Array)return!1;if("string"!=typeof t)return e.sort();if(e.length>0){if(e[0][t]===void 0)return!1;e.sort(function(e,n){var r=e[t],o=n[t];return o>r?-1:r>o?1:0})}return e},keyValue:function(e,t,n){if(e!==void 0&&"object"==typeof t&&this.inArray(e,t)){for(var r=[],o=0,i=t.length;i>o;++o)if(t[o]===e){if(n!==void 0&&n===!0)return o;r.push(o)}return r}return!1},shuffle:function(e){if(e!==void 0&&e.constructor!==Array)return!1;for(var t=e.length,n=!1,r=!1;t--;)r=Math.floor(Math.random()*(t+1)),n=e[t],e[t]=e[r],e[r]=n;return e},each:function(e,t){var n=e.slice(0),r=n.length,o=Math.floor(r/8),i=r%8,s=0;if(i>0)do t(n[s++],s-1,e);while(--i>0);if(0===o)return e;do t(n[s++],s-1,e),t(n[s++],s-1,e),t(n[s++],s-1,e),t(n[s++],s-1,e),t(n[s++],s-1,e),t(n[s++],s-1,e),t(n[s++],s-1,e),t(n[s++],s-1,e);while(--o>0);return e},some:function(e,t,n){if(null===e)throw new TypeError("First argument is invalid.");var r=Object(e),o=r.length>>>0;if("function"!=typeof t)throw new TypeError("Second argument must be a function.");for(var i=0;o>i;i++)if(i in r&&t.call(n,r[i],i,r))return!0;return!1},intersect:function(e,t){if(!e||!t||e instanceof Array==!1||t instanceof Array==!1)return[];for(var n=[],r=0,o=e.length;o>r;++r)for(var i=0,s=t.length;s>i;++i)e[r]===t[i]&&n.push(e[r]);return n},convert:function(e){return Array.prototype.slice.call(e||[],0)},insert:function(e,t,n){e.splice(t,0,n)},remove:function(e,t,n){for(var r=[],o=0,i=e.length;i>o;o++)o>=t&&t+n>o||r.push(e[o]);return r}};return e});
Ink.createModule("Ink.Util.Validator","1",[],function(){"use strict";var e={_countryCodes:["AO","CV","MZ","PT"],_internacionalPT:351,_indicativosPT:{21:"lisboa",22:"porto",231:"mealhada",232:"viseu",233:"figueira da foz",234:"aveiro",235:"arganil",236:"pombal",238:"seia",239:"coimbra",241:"abrantes",242:"ponte de sôr",243:"santarém",244:"leiria",245:"portalegre",249:"torres novas",251:"valença",252:"vila nova de famalicão",253:"braga",254:"peso da régua",255:"penafiel",256:"são joão da madeira",258:"viana do castelo",259:"vila real",261:"torres vedras",262:"caldas da raínha",263:"vila franca de xira",265:"setúbal",266:"évora",268:"estremoz",269:"santiago do cacém",271:"guarda",272:"castelo branco",273:"bragança",274:"proença-a-nova",275:"covilhã",276:"chaves",277:"idanha-a-nova",278:"mirandela",279:"moncorvo",281:"tavira",282:"portimão",283:"odemira",284:"beja",285:"moura",286:"castro verde",289:"faro",291:"funchal, porto santo",292:"corvo, faial, flores, horta, pico",295:"angra do heroísmo, graciosa, são jorge, terceira",296:"ponta delgada, são miguel, santa maria",91:"rede móvel 91 (Vodafone / Yorn)",93:"rede móvel 93 (Optimus)",96:"rede móvel 96 (TMN)",92:"rede móvel 92 (TODOS)",707:"número único",760:"número único",800:"número grátis",808:"chamada local",30:"voip"},_internacionalCV:238,_indicativosCV:{2:"fixo",91:"móvel 91",95:"móvel 95",97:"móvel 97",98:"móvel 98",99:"móvel 99"},_internacionalAO:244,_indicativosAO:{2:"fixo",91:"móvel 91",92:"móvel 92"},_internacionalMZ:258,_indicativosMZ:{2:"fixo",82:"móvel 82",84:"móvel 84"},_internacionalTL:670,_indicativosTL:{3:"fixo",7:"móvel 7"},_isLeapYear:function(e){var t=/^\d{4}$/;return t.test(e)?e%4?!1:e%100?!0:e%400?!1:!0:!1},_dateParsers:{"yyyy-mm-dd":{day:5,month:3,year:1,sep:"-",parser:/^(\d{4})(\-)(\d{1,2})(\-)(\d{1,2})$/},"yyyy/mm/dd":{day:5,month:3,year:1,sep:"/",parser:/^(\d{4})(\/)(\d{1,2})(\/)(\d{1,2})$/},"yy-mm-dd":{day:5,month:3,year:1,sep:"-",parser:/^(\d{2})(\-)(\d{1,2})(\-)(\d{1,2})$/},"yy/mm/dd":{day:5,month:3,year:1,sep:"/",parser:/^(\d{2})(\/)(\d{1,2})(\/)(\d{1,2})$/},"dd-mm-yyyy":{day:1,month:3,year:5,sep:"-",parser:/^(\d{1,2})(\-)(\d{1,2})(\-)(\d{4})$/},"dd/mm/yyyy":{day:1,month:3,year:5,sep:"/",parser:/^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/},"dd-mm-yy":{day:1,month:3,year:5,sep:"-",parser:/^(\d{1,2})(\-)(\d{1,2})(\-)(\d{2})$/},"dd/mm/yy":{day:1,month:3,year:5,sep:"/",parser:/^(\d{1,2})(\/)(\d{1,2})(\/)(\d{2})$/}},_daysInMonth:function(e,t){var n=0;return n=1===e||3===e||5===e||7===e||8===e||10===e||12===e?31:4===e||6===e||9===e||11===e?30:0===t%400||0===t%4&&0!==t%100?29:28},_isValidDate:function(e,t,n){var r=/^\d{4}$/,o=/^\d{1,2}$/;return r.test(e)&&o.test(t)&&o.test(n)&&t>=1&&12>=t&&n>=1&&this._daysInMonth(t,e)>=n?!0:!1},mail:function(e){var t=RegExp("^[_a-z0-9-]+((\\.|\\+)[_a-z0-9-]+)*@([\\w]*-?[\\w]*\\.)+[a-z]{2,4}$","i");return t.test(e)?!0:!1},url:function(e,t){if(t===void 0||t===!1){var n=RegExp("(^(http\\:\\/\\/|https\\:\\/\\/)(.+))","i");n.test(e)===!1&&(e="http://"+e)}var r=RegExp("^(http:\\/\\/|https:\\/\\/)([\\w]*(-?[\\w]*)*\\.)+[a-z]{2,4}","i");return r.test(e)===!1?!1:!0},isPTPhone:function(e){e=""+e;var t=[];for(var n in this._indicativosPT)"string"==typeof this._indicativosPT[n]&&t.push(n);var r=t.join("|"),o=/^(00351|\+351)/;o.test(e)&&(e=e.replace(o,""));var i=/(\s|\-|\.)+/g;e=e.replace(i,"");var s=/[\d]{9}/i;if(9===e.length&&s.test(e)){var a=RegExp("^("+r+")");if(a.test(e))return!0}return!1},isPortuguesePhone:function(e){return this.isPTPhone(e)},isCVPhone:function(e){e=""+e;var t=[];for(var n in this._indicativosCV)"string"==typeof this._indicativosCV[n]&&t.push(n);var r=t.join("|"),o=/^(00238|\+238)/;o.test(e)&&(e=e.replace(o,""));var i=/(\s|\-|\.)+/g;e=e.replace(i,"");var s=/[\d]{7}/i;if(7===e.length&&s.test(e)){var a=RegExp("^("+r+")");if(a.test(e))return!0}return!1},isAOPhone:function(e){e=""+e;var t=[];for(var n in this._indicativosAO)"string"==typeof this._indicativosAO[n]&&t.push(n);var r=t.join("|"),o=/^(00244|\+244)/;o.test(e)&&(e=e.replace(o,""));var i=/(\s|\-|\.)+/g;e=e.replace(i,"");var s=/[\d]{9}/i;if(9===e.length&&s.test(e)){var a=RegExp("^("+r+")");if(a.test(e))return!0}return!1},isMZPhone:function(e){e=""+e;var t=[];for(var n in this._indicativosMZ)"string"==typeof this._indicativosMZ[n]&&t.push(n);var r=t.join("|"),o=/^(00258|\+258)/;o.test(e)&&(e=e.replace(o,""));var i=/(\s|\-|\.)+/g;e=e.replace(i,"");var s=/[\d]{8,9}/i;if((9===e.length||8===e.length)&&s.test(e)){var a=RegExp("^("+r+")");if(a.test(e)){if(0===e.indexOf("2")&&8===e.length)return!0;if(0===e.indexOf("8")&&9===e.length)return!0}}return!1},isTLPhone:function(e){e=""+e;var t=[];for(var n in this._indicativosTL)"string"==typeof this._indicativosTL[n]&&t.push(n);var r=t.join("|"),o=/^(00670|\+670)/;o.test(e)&&(e=e.replace(o,""));var i=/(\s|\-|\.)+/g;e=e.replace(i,"");var s=/[\d]{7}/i;if(7===e.length&&s.test(e)){var a=RegExp("^("+r+")");if(a.test(e))return!0}return!1},isPhone:function(){var e;if(0===arguments.length)return!1;var t=arguments[0];if(arguments.length>1){if(arguments[1].constructor!==Array){if("function"==typeof this["is"+arguments[1].toUpperCase()+"Phone"])return this["is"+arguments[1].toUpperCase()+"Phone"](t);throw"Invalid Country Code!"}var n;for(e=0;arguments[1].length>e;e++){if("function"!=typeof(n=this["is"+arguments[1][e].toUpperCase()+"Phone"]))throw"Invalid Country Code!";if(n(t))return!0}}else for(e=0;this._countryCodes.length>e;e++)if(this["is"+this._countryCodes[e]+"Phone"](t))return!0;return!1},codPostal:function(e,t,n){var r=/^(\s*\-\s*|\s+)$/,o=/^\s+|\s+$/g,i=/^[1-9]\d{3}$/,s=/^\d{3}$/,a=/^(.{4})(.*)(.{3})$/;if(n=!!n,e=e.replace(o,""),t!==void 0){if(t=t.replace(o,""),i.test(e)&&s.test(t))return n===!0?[!0,!0]:!0}else{if(i.test(e))return n===!0?[!0,!1]:!0;var u=e.match(a);if(null!==u&&i.test(u[1])&&r.test(u[2])&&s.test(u[3]))return n===!0?[!0,!1]:!0}return n===!0?[!1,!1]:!1},isDate:function(e,t){if(this._dateParsers[e]===void 0)return!1;var n=this._dateParsers[e].year,r=this._dateParsers[e].month,o=this._dateParsers[e].day,i=this._dateParsers[e].parser,s=this._dateParsers[e].sep,a=t.match(i);if(null!==a&&a[2]===a[4]&&a[2]===s){var u=2===a[n].length?"20"+(""+a[n]):a[n];if(this._isValidDate(u,""+a[r],""+a[o]))return!0}return!1},isColor:function(e){var t,n=!1,r=/^[a-zA-Z]+$/,o=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,i=/^rgb\(\s*([0-9]{1,3})(%)?\s*,\s*([0-9]{1,3})(%)?\s*,\s*([0-9]{1,3})(%)?\s*\)$/,s=/^rgba\(\s*([0-9]{1,3})(%)?\s*,\s*([0-9]{1,3})(%)?\s*,\s*([0-9]{1,3})(%)?\s*,\s*(1(\.0)?|0(\.[0-9])?)\s*\)$/,a=/^hsl\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})(%)?\s*,\s*([0-9]{1,3})(%)?\s*\)$/,u=/^hsla\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})(%)?\s*,\s*([0-9]{1,3})(%)?\s*,\s*(1(\.0)?|0(\.[0-9])?)\s*\)$/;if(r.test(e)||o.test(e))return!0;var c;if(null!==(t=i.exec(e))||null!==(t=s.exec(e)))for(c=t.length;c--;){if((2===c||4===c||6===c)&&t[c]!==void 0&&""!==t[c]){if(!(t[c-1]!==void 0&&t[c-1]>=0&&100>=t[c-1]))return!1;n=!0}if(1===c||3===c||5===c&&(t[c+1]===void 0||""===t[c+1])){if(!(t[c]!==void 0&&t[c]>=0&&255>=t[c]))return!1;n=!0}}if(null!==(t=a.exec(e))||null!==(t=u.exec(e)))for(c=t.length;c--;){if(3===c||5===c){if(!(t[c-1]!==void 0&&t[c]!==void 0&&""!==t[c]&&t[c-1]>=0&&100>=t[c-1]))return!1;n=!0}if(1===c){if(!(t[c]!==void 0&&t[c]>=0&&360>=t[c]))return!1;n=!0}}return n}};return e});

Ink.createModule("Ink.UI.Aux","1",["Ink.Net.Ajax_1","Ink.Dom.Css_1","Ink.Dom.Selector_1","Ink.Util.Url_1"],function(e,t,n,r){"use strict";var o={},i=0,a={Layouts:{SMALL:"small",MEDIUM:"medium",LARGE:"large"},isDOMElement:function(e){return"object"==typeof e&&"nodeType"in e&&1===e.nodeType},isInteger:function(e){return"number"==typeof e&&0===e%1},elOrSelector:function(e,t){if(!this.isDOMElement(e)){var r=n.select(e);if(0===r.length)throw new TypeError(t+" must either be a DOM Element or a selector expression!\nThe script element must also be after the DOM Element itself.");return r[0]}return e},clone:function(e){try{if("object"!=typeof e)throw Error("Given argument is not an object!");return JSON.parse(JSON.stringify(e))}catch(t){throw Error("Given object cannot have loops!")}},childIndex:function(e){if(a.isDOMElement(e))for(var t=n.select("> *",e.parentNode),r=0,o=t.length;o>r;++r)if(t[r]===e)return r;throw"not found!"},ajaxJSON:function(t,n,r){new e(t,{evalJS:"force",method:"POST",parameters:n,onSuccess:function(e){try{if(e=e.responseJSON,"ok"!==e.status)throw"server error: "+e.message;r(null,e)}catch(t){r(t)}},onFailure:function(){r("communication failure")}})},currentLayout:function(){var e,r,o,i,a,s=n.select("#ink-layout-detector")[0];if(!s){s=document.createElement("div"),s.id="ink-layout-detector";for(o in this.Layouts)this.Layouts.hasOwnProperty(o)&&(i=this.Layouts[o],a=document.createElement("div"),a.className="show-"+i+" hide-all",a.setAttribute("data-ink-layout",i),s.appendChild(a));document.body.appendChild(s)}for(e=0,r=s.childNodes.length;r>e;++e)if(a=s.childNodes[e],"hidden"!==t.getStyle(a,"visibility"))return a.getAttribute("data-ink-layout")},hashSet:function(e){if("object"!=typeof e)throw new TypeError("o should be an object!");var t=r.getAnchorString();t=Ink.extendObj(t,e),window.location.hash=r.genQueryString("",t).substring(1)},cleanChildren:function(e){if(!a.isDOMElement(e))throw"Please provide a valid DOMElement";for(var t,n=e.lastChild;n;)t=n.previousSibling,e.removeChild(n),n=t},storeIdAndClasses:function(e,t){if(!a.isDOMElement(e))throw"Please provide a valid DOMElement as first parameter";var n=e.id;n&&(t._id=n);var r=e.className;r&&(t._classes=r)},restoreIdAndClasses:function(e,t){if(!a.isDOMElement(e))throw"Please provide a valid DOMElement as first parameter";t._id&&e.id!==t._id&&(e.id=t._id),t._classes&&-1===e.className.indexOf(t._classes)&&(e.className?e.className+=" "+t._classes:e.className=t._classes),t._instanceId&&!e.getAttribute("data-instance")&&e.setAttribute("data-instance",t._instanceId)},registerInstance:function(e,t,n){if(!e._instanceId){if("object"!=typeof e)throw new TypeError("1st argument must be a JavaScript object!");if(!e._options||!e._options.skipRegister){if(!this.isDOMElement(t))throw new TypeError("2nd argument must be a DOM element!");if(void 0!==n&&"string"!=typeof n)throw new TypeError("3rd argument must be a string!");var r=(n||"instance")+ ++i;o[r]=e,e._instanceId=r;var a=t.getAttribute("data-instance");a=null!==a?[a,r].join(" "):r,t.setAttribute("data-instance",a)}}},unregisterInstance:function(e){delete o[e]},getInstance:function(e){var t;if(this.isDOMElement(e)){if(t=e.getAttribute("data-instance"),null===t)throw Error("argument is not a DOM instance element!")}else t=e;t=t.split(" ");var n,r,i,a=t.length,s=[];for(i=0;a>i;++i){if(r=t[i],!r)throw Error("Element is not a JS instance!");if(n=o[r],!n)throw Error('Instance "'+r+'" not found!');s.push(n)}return 1===a?s[0]:s},getInstanceFromSelector:function(e){var t=n.select(e)[0];if(!t)throw Error("Element not found!");return this.getInstance(t)},getInstanceIds:function(){var e=[];for(var t in o)o.hasOwnProperty(t)&&e.push(t);return e},getInstances:function(){var e=[];for(var t in o)o.hasOwnProperty(t)&&e.push(o[t]);return e},destroyComponent:function(){Ink.Util.Aux.unregisterInstance(this._instanceId),this._element.parentNode.removeChild(this._element)}};return a});
Ink.createModule("Ink.UI.SmoothScroller","1",["Ink.Dom.Event_1","Ink.Dom.Selector_1","Ink.Dom.Loaded_1"],function(e,t,n){"use strict";var r={speed:10,gy:function(e){var t;if(t=e.offsetTop,e.offsetParent)for(;e=e.offsetParent;)t+=e.offsetTop;return t},scrollTop:function(){var e=document.body,t=document.documentElement;return e&&e.scrollTop?e.scrollTop:t&&t.scrollTop?t.scrollTop:window.pageYOffset?window.pageYOffset:0},add:function(t,n,r){e.observe(t,n,r)},end:function(t){return window.event?(window.event.cancelBubble=!0,window.event.returnValue=!1,void 0):(e.stop(t),void 0)},scroll:function(e){var t=Ink.UI.SmoothScroller.scrollTop();t+=e>t?Math.ceil((e-t)/Ink.UI.SmoothScroller.speed):(e-t)/Ink.UI.SmoothScroller.speed,window.scrollTo(0,t),(t===e||Ink.UI.SmoothScroller.offsetTop===t)&&clearInterval(Ink.UI.SmoothScroller.interval),Ink.UI.SmoothScroller.offsetTop=t},init:function(){n.run(Ink.UI.SmoothScroller.render)},render:function(){var n=t.select("a.scrollableLink");Ink.UI.SmoothScroller.end(this);for(var r=0;n.length>r;r++){var o=n[r];!o.href||-1===o.href.indexOf("#")||o.pathname!==location.pathname&&"/"+o.pathname!==location.pathname||(Ink.UI.SmoothScroller.add(o,"click",Ink.UI.SmoothScroller.end),e.observe(o,"click",Ink.bindEvent(Ink.UI.SmoothScroller.clickScroll,this,o)))}},clickScroll:function(e,n){if(Ink.UI.SmoothScroller.end(n),null!==n&&null!==n.getAttribute("href")){var r=n.href.indexOf("#");if(-1===r)return;var o=n.href.substr(r+1),i=t.select('a[name="'+o+'"],#'+o);if(i[0]!==void 0){if(-1===n.parentNode.className.indexOf("active")){var a=n.parentNode.parentNode,s=a.firstChild;do if(s.tagName!==void 0&&"LI"===s.tagName.toUpperCase()&&-1!==s.className.indexOf("active")){s.className=s.className.replace("active","");break}while(s=s.nextSibling);n.parentNode.className+=" active"}clearInterval(Ink.UI.SmoothScroller.interval),Ink.UI.SmoothScroller.interval=setInterval("Ink.UI.SmoothScroller.scroll("+Ink.UI.SmoothScroller.gy(i[0])+")",10)}}}};return r});
Ink.createModule("Ink.UI.Spy","1",["Ink.UI.Aux_1","Ink.Dom.Event_1","Ink.Dom.Css_1","Ink.Dom.Element_1","Ink.Dom.Selector_1","Ink.Util.Array_1"],function(e,t,n,r,o,i){"use strict";var a=function(t,n){this._rootElement=e.elOrSelector(t,"1st argument"),this._options=Ink.extendObj({target:void 0},r.data(this._rootElement)),this._options=Ink.extendObj(this._options,n||{}),this._options.target=e.elOrSelector(this._options.target,"Target"),this._scrollTimeout=null,this._init()};return a.prototype={_elements:[],_init:function(){t.observe(document,"scroll",Ink.bindEvent(this._onScroll,this)),this._elements.push(this._rootElement)},_onScroll:function(){var e=r.scrollHeight();if(!(this._rootElement.offsetTop>e)){for(var t=0,a=this._elements.length;a>t;t++)if(e>=this._elements[t].offsetTop&&this._elements[t]!==this._rootElement&&this._elements[t].offsetTop>this._rootElement.offsetTop)return;i.each(o.select("a",this._options.target),Ink.bind(function(e){var t="name"in this._rootElement&&this._rootElement.name?"#"+this._rootElement.name:"#"+this._rootElement.id;e.href.substr(e.href.indexOf("#"))===t?n.addClassName(r.findUpwardsByTag(e,"li"),"active"):n.removeClassName(r.findUpwardsByTag(e,"li"),"active")},this))}}},a});
Ink.createModule("Ink.UI.Sticky","1",["Ink.UI.Aux_1","Ink.Dom.Event_1","Ink.Dom.Css_1","Ink.Dom.Element_1","Ink.Dom.Selector_1"],function(e,t,n,r,o){"use strict";var i=function(t,n){if("object"!=typeof t&&"string"!=typeof t)throw"[Sticky] :: Invalid selector defined";if("object"==typeof t)this._rootElement=t;else{if(this._rootElement=o.select(t),0>=this._rootElement.length)throw"[Sticky] :: Can't find any element with the specified selector";this._rootElement=this._rootElement[0]}this._options=Ink.extendObj({offsetBottom:0,offsetTop:0,topElement:void 0,bottomElement:void 0},r.data(this._rootElement)),this._options=Ink.extendObj(this._options,n||{}),this._options.topElement=this._options.topElement!==void 0?e.elOrSelector(this._options.topElement,"Top Element"):e.elOrSelector("body","Top Element"),this._options.bottomElement=this._options.bottomElement!==void 0?e.elOrSelector(this._options.bottomElement,"Bottom Element"):e.elOrSelector("body","Top Element"),this._computedStyle=window.getComputedStyle?window.getComputedStyle(this._rootElement,null):this._rootElement.currentStyle,this._dims={height:this._computedStyle.height,width:this._computedStyle.width},this._init()};return i.prototype={_init:function(){t.observe(document,"scroll",Ink.bindEvent(this._onScroll,this)),t.observe(window,"resize",Ink.bindEvent(this._onResize,this)),this._calculateOriginalSizes(),this._calculateOffsets()},_onScroll:function(){var e="CSS1Compat"===document.compatMode?document.documentElement:document.body;return 100*r.elementWidth(this._rootElement)/e.clientWidth>90||649>=e.clientWidth?(r.hasAttribute(this._rootElement,"style")&&this._rootElement.removeAttribute("style"),void 0):(this._scrollTimeout&&clearTimeout(this._scrollTimeout),this._scrollTimeout=setTimeout(Ink.bind(function(){var e=r.scrollHeight();if(r.hasAttribute(this._rootElement,"style"))this._options.offsetTop>=e?this._rootElement.removeAttribute("style"):document.body.scrollHeight-(e+parseInt(this._dims.height,10))<this._options.offsetBottom?(this._rootElement.style.position="fixed",this._rootElement.style.top="auto",this._rootElement.style.bottom=this._options.offsetBottom<parseInt(document.body.scrollHeight-(document.documentElement.clientHeight+e),10)?this._options.originalOffsetBottom+"px":this._options.offsetBottom-parseInt(document.body.scrollHeight-(document.documentElement.clientHeight+e),10)+"px",this._rootElement.style.width=this._options.originalWidth+"px"):document.body.scrollHeight-(e+parseInt(this._dims.height,10))>=this._options.offsetBottom&&(this._rootElement.style.position="fixed",this._rootElement.style.bottom="auto",this._rootElement.style.top=this._options.originalOffsetTop+"px",this._rootElement.style.width=this._options.originalWidth+"px");else{if(this._options.offsetTop>=e)return;this._rootElement.style.position="fixed",this._rootElement.style.bottom="auto",this._rootElement.style.top=this._options.offsetTop+"px",this._rootElement.style.width=this._options.originalWidth+"px"}this._scrollTimeout=void 0},this),0),void 0)},_onResize:function(){this._resizeTimeout&&clearTimeout(this._resizeTimeout),this._resizeTimeout=setTimeout(Ink.bind(function(){this._rootElement.removeAttribute("style"),this._calculateOriginalSizes(),this._calculateOffsets()},this),0)},_calculateOffsets:function(){if(this._options.topElement!==void 0)if("body"!==this._options.topElement.nodeName.toLowerCase()){var e=r.elementHeight(this._options.topElement),t=r.elementTop(this._options.topElement);this._options.offsetTop=parseInt(e,10)+parseInt(t,10)+parseInt(this._options.originalOffsetTop,10)}else this._options.offsetTop=parseInt(this._options.originalOffsetTop,10);if(this._options.bottomElement!==void 0)if("body"!==this._options.bottomElement.nodeName.toLowerCase()){var n=r.elementHeight(this._options.bottomElement);this._options.offsetBottom=parseInt(n,10)+parseInt(this._options.originalOffsetBottom,10)}else this._options.offsetBottom=parseInt(this._options.originalOffsetBottom,10);this._onScroll()},_calculateOriginalSizes:function(){this._options.originalOffsetTop=parseInt(this._options.offsetTop,10),this._options.originalOffsetBottom=parseInt(this._options.offsetBottom,10),this._options.originalTop=parseInt(this._rootElement.offsetTop,10),isNaN(this._options.originalWidth=parseInt(this._dims.width,10))&&(this._options.originalWidth=0),this._options.originalWidth=parseInt(this._computedStyle.width,10)}},i});
Ink.createModule("Ink.UI.Table","1",["Ink.Net.Ajax_1","Ink.UI.Aux_1","Ink.Dom.Event_1","Ink.Dom.Css_1","Ink.Dom.Element_1","Ink.Dom.Selector_1","Ink.Util.Array_1","Ink.Util.String_1"],function(e,t,n,i,r,o,s,a){"use strict";var l=function(e,n){if(this._rootElement=t.elOrSelector(e,"1st argument"),"table"!==this._rootElement.nodeName.toLowerCase())throw"[Ink.UI.Table] :: The element is not a table";this._options=Ink.extendObj({pageSize:void 0,endpoint:void 0,loadMode:"full",allowResetSorting:!1,visibleFields:void 0},r.data(this._rootElement)),this._options=Ink.extendObj(this._options,n||{}),this._markupMode=this._options.endpoint===void 0,this._options.visibleFields&&(this._options.visibleFields=this._options.visibleFields.split(",")),this._handlers={click:Ink.bindEvent(this._onClick,this)},this._originalFields=[],this._sortableFields={},this._originalData=this._data=[],this._headers=[],this._pagination=null,this._totalRows=0,this._init()};return l.prototype={_init:function(){if(this._markupMode){if(this._setHeadersHandlers(),s.each(o.select("tbody tr",this._rootElement),Ink.bind(function(e){this._data.push(e)},this)),this._originalData=this._data.slice(0),this._totalRows=this._data.length,"pageSize"in this._options&&this._options.pageSize!==void 0){for(this._pagination=this._rootElement.nextSibling;1!==this._pagination.nodeType;)this._pagination=this._pagination.nextSibling;if("nav"!==this._pagination.nodeName.toLowerCase())throw"[Ink.UI.Table] :: Missing the pagination markup or is mis-positioned";var e=Ink.getModule("Ink.UI.Pagination",1);this._pagination=new e(this._pagination,{size:Math.ceil(this._totalRows/this._options.pageSize),onChange:Ink.bind(function(e){this._paginate(e._current+1)},this)}),this._paginate(1)}}else this._getData(this._options.endpoint,!0)},_onClick:function(e){n.stop(e);var i,l,u=n.element(e),c=r.data(u),d="pageSize"in this._options&&this._options.pageSize!==void 0;if("th"===u.nodeName.toLowerCase()&&"sortable"in c&&"true"==""+c.sortable){if(i=-1,s.inArray(u,this._headers))for(l=0;this._headers.length>l;l++)if(this._headers[l]===u){i=l;break}if(!this._markupMode&&d){for(var h in this._sortableFields)h!=="col_"+i&&(this._sortableFields[h]="none",this._headers[h.replace("col_","")].innerHTML=a.stripTags(this._headers[h.replace("col_","")].innerHTML));"asc"===this._sortableFields["col_"+i]?(this._sortableFields["col_"+i]="desc",this._headers[i].innerHTML=a.stripTags(this._headers[i].innerHTML)+'<i class="icon-caret-down"></i>'):(this._sortableFields["col_"+i]="asc",this._headers[i].innerHTML=a.stripTags(this._headers[i].innerHTML)+'<i class="icon-caret-up"></i>'),this._pagination.setCurrent(this._pagination._current)}else{if(-1===i)return;if("desc"===this._sortableFields["col_"+i]&&this._options.allowResetSorting&&"true"==""+this._options.allowResetSorting)this._headers[i].innerHTML=a.stripTags(this._headers[i].innerHTML),this._sortableFields["col_"+i]="none",this._data=this._originalData.slice(0);else{for(var h in this._sortableFields)h!=="col_"+i&&(this._sortableFields[h]="none",this._headers[h.replace("col_","")].innerHTML=a.stripTags(this._headers[h.replace("col_","")].innerHTML));this._sort(i),"asc"===this._sortableFields["col_"+i]?(this._data.reverse(),this._sortableFields["col_"+i]="desc",this._headers[i].innerHTML=a.stripTags(this._headers[i].innerHTML)+'<i class="icon-caret-down"></i>'):(this._sortableFields["col_"+i]="asc",this._headers[i].innerHTML=a.stripTags(this._headers[i].innerHTML)+'<i class="icon-caret-up"></i>')}var f=o.select("tbody",this._rootElement)[0];t.cleanChildren(f),s.each(this._data,function(e){f.appendChild(e)}),this._pagination.setCurrent(0),this._paginate(1)}}},_paginate:function(e){s.each(this._data,Ink.bind(function(t,n){n>=(e-1)*parseInt(this._options.pageSize,10)&&(e-1)*parseInt(this._options.pageSize,10)+parseInt(this._options.pageSize,10)>n?i.removeClassName(t,"hide-all"):i.addClassName(t,"hide-all")},this))},_sort:function(e){this._data.sort(Ink.bind(function(t,n){var i=o.select("td",t)[e].innerText,r=o.select("td",n)[e].innerText,s=RegExp(/\d/g);return!isNaN(i)&&s.test(i)?i=parseInt(i,10):isNaN(i)||(i=parseFloat(i)),!isNaN(r)&&s.test(r)?r=parseInt(r,10):isNaN(r)||(r=parseFloat(r)),i===r?0:i>r?1:-1},this))},_setHeaders:function(e,t){var n,i,r,s,a;if(0===(r=o.select("thead",this._rootElement)).length){r=this._rootElement.createTHead(),s=r.insertRow(0);for(n in e)this._options.visibleFields&&-1===this._options.visibleFields.indexOf(n)||(a=document.createElement("th"),i=e[n],"sortable"in i&&"true"==""+i.sortable&&a.setAttribute("data-sortable","true"),"label"in i&&(a.innerText=i.label),this._originalFields.push(n),s.appendChild(a))}else{var l=t[0];for(n in l)this._options.visibleFields&&-1===this._options.visibleFields.indexOf(n)||this._originalFields.push(n)}},_setHeadersHandlers:function(){var e=o.select("thead",this._rootElement);e.length&&(n.observe(e[0],"click",this._handlers.click),this._headers=o.select("thead tr th",this._rootElement),s.each(this._headers,Ink.bind(function(e,t){var n=r.data(e);"sortable"in n&&"true"==""+n.sortable&&(this._sortableFields["col_"+t]="none")},this)))},_setData:function(e){var t,n,i,r,s,a;n=o.select("tbody",this._rootElement),0===n.length?(n=document.createElement("tbody"),this._rootElement.appendChild(n)):(n=n[0],n.innerHTML=""),this._data=[];for(s in e){i=document.createElement("tr"),n.appendChild(i),a=0;for(t in e[s])this._options.visibleFields&&-1===this._options.visibleFields.indexOf(t)||(r=i.insertCell(a++),r.innerHTML=e[s][t]);this._data.push(i)}this._originalData=this._data.slice(0)},setEndpoint:function(e,t){this._markupMode||(this._options.endpoint=e,this._pagination.setCurrent(t?parseInt(t,10):0))},_setPagination:function(){if("pageSize"in this._options&&this._options.pageSize!==void 0,"pageSize"in this._options&&this._options.pageSize!==void 0&&!this._pagination){this._pagination=document.createElement("nav"),this._pagination.className="ink-navigation",this._rootElement.parentNode.insertBefore(this._pagination,this._rootElement.nextSibling),this._pagination.appendChild(document.createElement("ul")).className="pagination";var e=Ink.getModule("Ink.UI.Pagination",1);this._pagination=new e(this._pagination,{size:Math.ceil(this._totalRows/this._options.pageSize),onChange:Ink.bind(function(){this._getData(this._options.endpoint)},this)})}},_getData:function(e){Ink.requireModules(["Ink.Util.Url_1"],Ink.bind(function(t){var n=t.parseUrl(e),i="pageSize"in this._options&&this._options.pageSize!==void 0,r=this._pagination?this._pagination._current+1:1;if(n.query=n.query?n.query.split("&"):[],i){n.query.push("rows_per_page="+this._options.pageSize),n.query.push("page="+r);for(var o in this._sortableFields)if("none"!==this._sortableFields[o]){n.query.push("sortField="+this._originalFields[parseInt(o.replace("col_",""),10)]),n.query.push("sortOrder="+this._sortableFields[o]);break}this._getDataViaAjax(e+"?"+n.query.join("&"))}else this._getDataViaAjax(e)},this))},_getDataViaAjax:function(t){var n="pageSize"in this._options&&this._options.pageSize!==void 0;new e(t,{method:"GET",contentType:"application/json",sanitizeJSON:!0,onSuccess:Ink.bind(function(e){if(200===e.status){var t=JSON.parse(e.responseText);0===this._headers.length&&(this._setHeaders(t.headers,t.rows),this._setHeadersHandlers()),this._setData(t.rows),n?this._totalRows&&parseInt(t.totalRows,10)!==parseInt(this._totalRows,10)?(this._totalRows=t.totalRows,this._pagination.setSize(Math.ceil(this._totalRows/this._options.pageSize))):this._totalRows=t.totalRows:this._totalRows&&t.rows.length!==parseInt(this._totalRows,10)?(this._totalRows=t.rows.length,this._pagination.setSize(Math.ceil(this._totalRows/this._options.pageSize))):this._totalRows=t.rows.length,this._setPagination()}},this)})}},l});
Ink.createModule("Ink.UI.Tabs","1",["Ink.UI.Aux_1","Ink.Dom.Event_1","Ink.Dom.Css_1","Ink.Dom.Element_1","Ink.Dom.Selector_1","Ink.Util.Array_1"],function(e,t,n,i,r,o){"use strict";var s=function(t,n){if(e.isDOMElement(t))this._element=t;else{if(t=r.select(t),0===t.length)throw new TypeError("1st argument must either be a DOM Element or a selector expression!");this._element=t[0]}this._options=Ink.extendObj({preventUrlChange:!1,active:void 0,disabled:[],onBeforeChange:void 0,onChange:void 0},i.data(t)),this._options=Ink.extendObj(this._options,n||{}),this._handlers={tabClicked:Ink.bindEvent(this._onTabClicked,this),disabledTabClicked:Ink.bindEvent(this._onDisabledTabClicked,this),resize:Ink.bindEvent(this._onResize,this)},this._init()};return s.prototype={_init:function(){this._menu=r.select(".tabs-nav",this._element)[0],this._menuTabs=this._getChildElements(this._menu),this._contentTabs=r.select(".tabs-content",this._element),this._initializeDom(),this._observe(),this._setFirstActive(),this._changeTab(this._activeMenuLink),this._handlers.resize(),e.registerInstance(this,this._element,"tabs")},_initializeDom:function(){for(var e=0;this._contentTabs.length>e;e++)n.hide(this._contentTabs[e])},_observe:function(){o.each(this._menuTabs,Ink.bind(function(e){var t=r.select("a",e)[0];o.inArray(t.getAttribute("href"),this._options.disabled)?this.disable(t):this.enable(t)},this)),t.observe(window,"resize",this._handlers.resize)},_setFirstActive:function(){var e=window.location.hash;this._activeContentTab=r.select(e,this._element)[0]||r.select(this._hashify(this._options.active),this._element)[0]||r.select(".tabs-content",this._element)[0],this._activeMenuLink=this._findLinkByHref(this._activeContentTab.getAttribute("id")),this._activeMenuTab=this._activeMenuLink.parentNode},_changeTab:function(e,t){t&&this._options.onBeforeChange!==void 0&&this._options.onBeforeChange(this);var i=e.getAttribute("href");n.removeClassName(this._activeMenuTab,"active"),n.removeClassName(this._activeContentTab,"active"),n.addClassName(this._activeContentTab,"hide-all"),this._activeMenuLink=e,this._activeMenuTab=this._activeMenuLink.parentNode,this._activeContentTab=r.select(i.substr(i.indexOf("#")),this._element)[0],n.addClassName(this._activeMenuTab,"active"),n.addClassName(this._activeContentTab,"active"),n.removeClassName(this._activeContentTab,"hide-all"),n.show(this._activeContentTab),t&&this._options.onChange!==void 0&&this._options.onChange(this)},_onTabClicked:function(e){t.stop(e);var n=t.findElement(e,"A");"a"===n.nodeName.toLowerCase()&&("true"!=""+this._options.preventUrlChange&&(window.location.hash=n.getAttribute("href").substr(n.getAttribute("href").indexOf("#"))),n!==this._activeMenuLink&&this.changeTab(n))},_onDisabledTabClicked:function(e){t.stop(e)},_onResize:function(){var t=e.currentLayout();t!==this._lastLayout&&(t===e.Layouts.SMALL||t===e.Layouts.MEDIUM?(n.removeClassName(this._menu,"menu"),n.removeClassName(this._menu,"horizontal")):(n.addClassName(this._menu,"menu"),n.addClassName(this._menu,"horizontal")),this._lastLayout=t)},_hashify:function(e){return e?0===e.indexOf("#")?e:"#"+e:""},_findLinkByHref:function(e){e=this._hashify(e);var t;return o.each(this._menuTabs,Ink.bind(function(n){var i=r.select("a",n)[0];-1!==i.getAttribute("href").indexOf("#")&&i.getAttribute("href").substr(i.getAttribute("href").indexOf("#"))===e&&(t=i)},this)),t},_getChildElements:function(e){for(var t=[],n=e.children,i=0;n.length>i;i++)1===n[i].nodeType&&t.push(n[i]);return t},changeTab:function(e){var t=1===e.nodeType?e:this._findLinkByHref(this._hashify(e));t&&!n.hasClassName(t,"ink-disabled")&&this._changeTab(t,!0)},disable:function(e){var i=1===e.nodeType?e:this._findLinkByHref(this._hashify(e));i&&(t.stopObserving(i,"click",this._handlers.tabClicked),t.observe(i,"click",this._handlers.disabledTabClicked),n.addClassName(i,"ink-disabled"))},enable:function(e){var i=1===e.nodeType?e:this._findLinkByHref(this._hashify(e));i&&(t.stopObserving(i,"click",this._handlers.disabledTabClicked),t.observe(i,"click",this._handlers.tabClicked),n.removeClassName(i,"ink-disabled"))},activeTab:function(){return this._activeContentTab.getAttribute("id")},activeMenuTab:function(){return this._activeMenuTab},activeMenuLink:function(){return this._activeMenuLink},activeContentTab:function(){return this._activeContentTab},destroy:e.destroyComponent},s});
Ink.createModule("Ink.UI.Toggle","1",["Ink.UI.Aux_1","Ink.Dom.Event_1","Ink.Dom.Css_1","Ink.Dom.Element_1","Ink.Dom.Selector_1"],function(e,t,n,i,o){"use strict";var r=function(t,n){if("string"!=typeof t&&"object"!=typeof t)throw"[Ink.UI.Toggle] Invalid CSS selector to determine the root element";if("string"==typeof t){if(this._rootElement=o.select(t),0>=this._rootElement.length)throw"[Ink.UI.Toggle] Root element not found";this._rootElement=this._rootElement[0]}else this._rootElement=t;if(this._options=Ink.extendObj({target:void 0,triggerEvent:"click",closeOnClick:!0},i.data(this._rootElement)),this._options=Ink.extendObj(this._options,n||{}),this._options.target===void 0)throw"[Ink.UI.Toggle] Target option not defined";this._childElement=e.elOrSelector(this._options.target,"Target"),this._init()};return r.prototype={_init:function(){this._accordion=n.hasClassName(this._rootElement.parentNode,"accordion")||n.hasClassName(this._childElement.parentNode,"accordion"),t.observe(this._rootElement,this._options.triggerEvent,Ink.bindEvent(this._onTriggerEvent,this)),"true"==""+this._options.closeOnClick&&t.observe(document,"click",Ink.bindEvent(this._onClick,this))},_onTriggerEvent:function(){if(this._accordion){var e,t,r;for(r=n.hasClassName(this._childElement.parentNode,"accordion")?this._childElement.parentNode:this._childElement.parentNode.parentNode,e=o.select(".toggle",r),t=0;e.length>t;t+=1){var s=i.data(e[t]),a=o.select(s.target,r);a.length>0&&a[0]!==this._childElement&&(a[0].style.display="none")}}var l="none"===n.getStyle(this._childElement,"display")?"show-all":"hide-all",c="none"===n.getStyle(this._childElement,"display")?"block":"none";n.removeClassName(this._childElement,"show-all"),n.removeClassName(this._childElement,"hide-all"),n.addClassName(this._childElement,l),this._childElement.style.display=c,"show-all"===l?n.addClassName(this._rootElement,"active"):n.removeClassName(this._rootElement,"active")},_onClick:function(e){var n,o=t.element(e);if(this._rootElement!==o&&!i.isAncestorOf(this._rootElement,o)&&!i.isAncestorOf(this._childElement,o)){if((n=Ink.ss(".ink-shade")).length)for(var r=n.length,s=0;r>s;s++)if(i.isAncestorOf(n[s],o)&&i.isAncestorOf(n[s],this._rootElement))return;i.findUpwardsByClass(o,"toggle")&&this._dismiss(this._rootElement)}},_dismiss:function(){"none"!==n.getStyle(this._childElement,"display")&&(n.removeClassName(this._childElement,"show-all"),n.removeClassName(this._rootElement,"active"),n.addClassName(this._childElement,"hide-all"),this._childElement.style.display="none")}},r});
Ink.createModule("Ink.UI.Tooltip","1",["Ink.UI.Aux_1","Ink.Dom.Event_1","Ink.Dom.Element_1","Ink.Dom.Selector_1","Ink.Util.Array_1","Ink.Dom.Css_1","Ink.Dom.Browser_1"],function(e,t,n,i,o,r){"use strict";function s(e,t){this._init(e,t||{})}function a(e,t){this._init(e,t)}var l,c,u;return function(){for(var e=document.createElement("DIV"),t=["transition","oTransition","msTransition","mozTransition","webkitTransition"],n=0;t.length>n;n++)if(e.style[t[n]+"Duration"]!==void 0){l=t[n]+"Duration",c=t[n]+"Property",u=t[n]+"TimingFunction";break}}(),s.prototype={_init:function(e,t){var n;if(this.options=Ink.extendObj({where:"up",zIndex:1e4,left:10,top:10,spacing:8,forever:0,color:"",timeout:0,delay:0,template:null,templatefield:null,fade:.3,text:""},t||{}),"string"==typeof e)n=i.select(e);else{if("object"!=typeof e)throw"Element expected";n=[e]}this.tooltips=[];for(var o=0,r=n.length;r>o;o++)this.tooltips[o]=new a(this,n[o])},destroy:function(){o.each(this.tooltips,function(e){e._destroy()}),this.tooltips=null,this.options=null}},a.prototype={_oppositeDirections:{left:"right",right:"left",up:"down",down:"up"},_init:function(e,n){t.observe(n,"mouseover",Ink.bindEvent(this._onMouseOver,this)),t.observe(n,"mouseout",Ink.bindEvent(this._onMouseOut,this)),t.observe(n,"mousemove",Ink.bindEvent(this._onMouseMove,this)),this.root=e,this.element=n,this._delayTimeout=null,this.tooltip=null},_makeTooltip:function(e){var n;n=this._createTooltipElement(),this.tooltip&&this._removeTooltip(),this.tooltip=n,this._fadeInTooltipElement(n),this._placeTooltipElement(n,e),t.observe(n,"mouseover",Ink.bindEvent(this._onTooltipMouseOver,this));var i=this._getFloatOpt("timeout");i&&setTimeout(Ink.bind(function(){this.tooltip===n&&this._removeTooltip()},this),1e3*i)},_createTooltipElement:function(){var t,o,s=this._getOpt("template"),a=this._getOpt("templatefield"),l=this._getOpt("where");if(s){var c=document.createElement("DIV");if(c.innerHTML=e.elOrSelector(s,"options.template").outerHTML,t=c.firstChild,a){if(o=i.select(a,t),!o)throw"options.templatefield must be a valid selector within options.template";o=o[0]}else o=t}else if(t=document.createElement("DIV"),r.addClassName(t,"ink-tooltip"),r.addClassName(t,this._getOpt("color")),o=document.createElement("DIV"),r.addClassName(o,"content"),t.appendChild(o),l.match(/(up|down|left|right)/)){var u=document.createElement("SPAN");r.addClassName(u,"arrow"),r.addClassName(u,this._oppositeDirections[l]),t.appendChild(u)}return n.setTextContent(o,this._getOpt("text")),t.style.display="block",t.style.position="absolute",t.style.zIndex=this._getIntOpt("zIndex"),t},_fadeInTooltipElement:function(e){var t=this._getFloatOpt("fade");l&&t&&(e.style.opacity="0",e.style[l]=t+"s",e.style[c]="opacity",e.style[u]="ease-in-out",setTimeout(function(){e.style.opacity="1"},0))},_placeTooltipElement:function(e,t){var i=this._getOpt("where"),o=function(){var t=document.getElementsByTagName("body"),n=t&&t.length?t[0]:document.documentElement;n.appendChild(e)};if("mousemove"===i||"mousefix"===i){var r=t;this._setPos(r[0],r[1]),o()}else if(i.match(/(up|down|left|right)/)){o();var s=n.offset(this.element),a=s[0],l=s[1];a instanceof Array&&(l=a[1],a=a[0]);var c=n.elementWidth(this.element)/2-n.elementWidth(e)/2,u=n.elementHeight(this.element)/2-n.elementHeight(e)/2,h=this._getIntOpt("spacing");"up"===i?(l-=n.elementHeight(e),l-=h,a+=c):"down"===i?(l+=n.elementHeight(this.element),l+=h,a+=c):"left"===i?(a-=n.elementWidth(e),a-=h,l+=u):"right"===i&&(a+=n.elementWidth(this.element),a+=h,l+=u);var d=this._getLocalScroll();e.style.left=a-d[0]+"px",e.style.top=l-d[1]+"px"}},_removeTooltip:function(){var e=this.tooltip;if(e){var t=Ink.bind(n.remove,{},e);"mousemove"!==this._getOpt("where")&&l?(e.style.opacity=0,setTimeout(t,1e3*this._getFloatOpt("fade"))):t(),this.tooltip=null}},_getOpt:function(e){var t=n.data(this.element)[n._camelCase("tip-"+e)];if(t)return t;var i=this.root.options[e];return i!==void 0?i:void 0},_getIntOpt:function(e){return parseInt(this._getOpt(e),10)},_getFloatOpt:function(e){return parseFloat(this._getOpt(e),10)},_destroy:function(){this.tooltip&&n.remove(this.tooltip),this.root=null,this.element=null,this.tooltip=null},_onMouseOver:function(e){var t=this._getMousePosition(e),n=this._getFloatOpt("delay");n?this._delayTimeout=setTimeout(Ink.bind(function(){this.tooltip||this._makeTooltip(t),this._delayTimeout=null},this),1e3*n):this._makeTooltip(t)},_onMouseMove:function(e){if("mousemove"===this._getOpt("where")&&this.tooltip){var t=this._getMousePosition(e);this._setPos(t[0],t[1])}},_onMouseOut:function(){this._getIntOpt("forever")||this._removeTooltip(),this._delayTimeout&&(clearTimeout(this._delayTimeout),this._delayTimeout=null)},_onTooltipMouseOver:function(){this.tooltip&&this._removeTooltip()},_setPos:function(e,t){e+=this._getIntOpt("left"),t+=this._getIntOpt("top");var i=this._getPageXY();if(this.tooltip){var o=[n.elementWidth(this.tooltip),n.elementHeight(this.tooltip)],r=this._getScroll();o[0]+e-r[0]>=i[0]-20&&(e=e-o[0]-this._getIntOpt("left")-10),o[1]+t-r[1]>=i[1]-20&&(t=t-o[1]-this._getIntOpt("top")-10),this.tooltip.style.left=e+"px",this.tooltip.style.top=t+"px"}},_getPageXY:function(){var e=0,t=0;return"number"==typeof window.innerWidth?(e=window.innerWidth,t=window.innerHeight):document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)?(e=document.documentElement.clientWidth,t=document.documentElement.clientHeight):document.body&&(document.body.clientWidth||document.body.clientHeight)&&(e=document.body.clientWidth,t=document.body.clientHeight),[parseInt(e,10),parseInt(t,10)]},_getScroll:function(){var e=document.documentElement,t=document.body;return e&&(e.scrollLeft||e.scrollTop)?[e.scrollLeft,e.scrollTop]:t?[t.scrollLeft,t.scrollTop]:[0,0]},_getLocalScroll:function(){for(var e,t,n=[0,0],i=this.element.parentNode;i&&i!==document.documentElement&&i!==document.body;)e=i.scrollLeft,t=i.scrollTop,e&&(n[0]+=e),t&&(n[1]+=t),i=i.parentNode;return n},_getMousePosition:function(e){return[parseInt(t.pointerX(e),10),parseInt(t.pointerY(e),10)]}},s});
Ink.createModule("Ink.UI.TreeView","1",["Ink.UI.Aux_1","Ink.Dom.Event_1","Ink.Dom.Css_1","Ink.Dom.Element_1","Ink.Dom.Selector_1","Ink.Util.Array_1"],function(e,t,n,i,o,r){"use strict";var s=function(t,n){if(!e.isDOMElement(t)&&"string"!=typeof t)throw"[Ink.UI.TreeView] :: Invalid selector";if("string"==typeof t){if(this._element=o.select(t),1>this._element.length)throw"[Ink.UI.TreeView] :: Selector has returned no elements";this._element=this._element[0]}else this._element=t;this._options=Ink.extendObj({node:"li",child:"ul"},i.data(this._element)),this._options=Ink.extendObj(this._options,n||{}),this._init()};return s.prototype={_init:function(){this._handlers={click:Ink.bindEvent(this._onClick,this)},t.observe(this._element,"click",this._handlers.click);var e,i=o.select(this._options.node,this._element);r.each(i,Ink.bind(function(t){n.hasClassName(t,"open")||(n.hasClassName(t,"closed")||n.addClassName(t,"closed"),e=o.select(this._options.child,t),r.each(e,Ink.bind(function(e){n.hasClassName(e,"hide-all")||n.addClassName(e,"hide-all")},this)))},this))},_onClick:function(e){var i=t.element(e);if("."===this._options.node[0]){if(!n.hasClassName(i,this._options.node.substr(1)))for(;!n.hasClassName(i,this._options.node.substr(1))&&"body"!==i.nodeName.toLowerCase();)i=i.parentNode}else if("#"===this._options.node[0]){if(i.id!==this._options.node.substr(1))for(;i.id!==this._options.node.substr(1)&&"body"!==i.nodeName.toLowerCase();)i=i.parentNode}else if(i.nodeName.toLowerCase()!==this._options.node)for(;i.nodeName.toLowerCase()!==this._options.node&&"body"!==i.nodeName.toLowerCase();)i=i.parentNode;if("body"!==i.nodeName.toLowerCase()){var r=o.select(this._options.child,i);r.length>0&&(t.stop(e),r=r[0],n.hasClassName(r,"hide-all")?(n.removeClassName(r,"hide-all"),n.addClassName(i,"open"),n.removeClassName(i,"closed")):(n.addClassName(r,"hide-all"),n.removeClassName(i,"open"),n.addClassName(i,"closed")))}}},s});
Ink.createModule("Ink.UI.SortableList","1",["Ink.UI.Aux_1","Ink.Dom.Event_1","Ink.Dom.Css_1","Ink.Dom.Element_1","Ink.Dom.Selector_1","Ink.Util.Array_1"],function(e,t,n,i,o,r){"use strict";var s=function(t,n){if(this._element=e.elOrSelector(t,"1st argument"),!e.isDOMElement(t)&&"string"!=typeof t)throw"[Ink.UI.SortableList] :: Invalid selector";if("string"==typeof t){if(this._element=Ink.Dom.Selector.select(t),1>this._element.length)throw"[Ink.UI.SortableList] :: Selector has returned no elements";this._element=this._element[0]}else this._element=t;if(this._options=Ink.extendObj({dragObject:"li"},Ink.Dom.Element.data(this._element)),this._options=Ink.extendObj(this._options,n||{}),this._handlers={down:Ink.bindEvent(this._onDown,this),move:Ink.bindEvent(this._onMove,this),up:Ink.bindEvent(this._onUp,this)},this._model=[],this._index=void 0,this._isMoving=!1,this._options.model instanceof Array)this._model=this._options.model,this._createdFrom="JSON";else{if("ul"!==this._element.nodeName.toLowerCase())throw new TypeError("You must pass a selector expression/DOM element as 1st option or provide a model on 2nd argument!");this._createdFrom="DOM"}if(this._dragTriggers=o.select(this._options.dragObject,this._element),!this._dragTriggers)throw"[Ink.UI.SortableList] :: Drag object not found";this._init()};return s.prototype={_init:function(){"DOM"===this._createdFrom&&(this._extractModelFromDOM(),this._createdFrom="JSON");var n="ontouchstart"in document.documentElement;this._down=n?"touchstart":"mousedown",this._move=n?"touchmove":"mousemove",this._up=n?"touchend":"mouseup";var i=document.body;t.observe(i,this._move,this._handlers.move),t.observe(i,this._up,this._handlers.up),this._observe(),e.registerInstance(this,this._element,"sortableList")},_observe:function(){t.observe(this._element,this._down,this._handlers.down)},_extractModelFromDOM:function(){this._model=[];var e=this,t=o.select("> li",this._element);r.each(t,function(t){var n=t.innerHTML;e._model.push(n)})},_generateMarkup:function(){var e=document.createElement("ul");e.className="unstyled ink-sortable-list";var t=this;return r.each(this._model,function(n,i){var o=document.createElement("li");i===t._index&&(o.className="drag"),o.innerHTML=[n].join(""),e.appendChild(o)}),e},_getY:function(e){return 0===e.type.indexOf("touch")?e.changedTouches[0].pageY:"number"==typeof e.pageY?e.pageY:e.clientY},_refresh:function(t){var n=this._generateMarkup();this._element.parentNode.replaceChild(n,this._element),this._element=n,e.restoreIdAndClasses(this._element,this),this._dragTriggers=o.select(this._options.dragObject,this._element),t||this._observe()},_onDown:function(n){if(!this._isMoving){var i=t.element(n);if(!r.inArray(i,this._dragTriggers)){for(;!r.inArray(i,this._dragTriggers)&&"body"!==i.nodeName.toLowerCase();)i=i.parentNode;if("body"===i.nodeName.toLowerCase())return}t.stop(n);var o;if("li"!==i.nodeName.toLowerCase())for(;"li"!==i.nodeName.toLowerCase()&&"body"!==i.nodeName.toLowerCase();)i=i.parentNode;return o=i,this._index=e.childIndex(o),this._height=o.offsetHeight,this._startY=this._getY(n),this._isMoving=!0,document.body.style.cursor="move",this._refresh(!1),!1}},_onMove:function(e){if(this._isMoving){t.stop(e);var n=this._getY(e),i=n-this._startY,o=i>0?1:-1,r=o*Math.floor(Math.abs(i)/this._height);if(0!==r&&(r/=Math.abs(r),!(-1===r&&0===this._index||1===r&&this._index===this._model.length-1))){var s=r>0?this._index:this._index+r,a=0>r?this._index:this._index+r;this._model.splice(s,2,this._model[a],this._model[s]),this._index+=r,this._startY=n,this._refresh(!1)}}},_onUp:function(e){this._isMoving&&(t.stop(e),this._index=void 0,this._isMoving=!1,document.body.style.cursor="",this._refresh())},getModel:function(){return this._model.slice()},destroy:e.destroyComponent},s});
Ink.createModule("Ink.UI.Modal","1",["Ink.UI.Aux_1","Ink.Dom.Event_1","Ink.Dom.Css_1","Ink.Dom.Element_1","Ink.Dom.Selector_1","Ink.Util.Array_1"],function(e,t,n,i,o,r){"use strict";var s=function(e,s){if("string"!=typeof e&&"object"!=typeof e&&s.markup===void 0)throw"Invalid Modal selector";if("string"==typeof e){if(""!==e){if(this._element=o.select(e),0===this._element.length)throw"The Modal selector has not returned any elements";this._element=this._element[0]}}else e&&(this._element=e);if(this._options={width:void 0,height:void 0,shadeClass:void 0,modalClass:void 0,trigger:void 0,triggerEvent:"click",markup:void 0,onShow:void 0,onDismiss:void 0,closeOnClick:!1,responsive:!0,disableScroll:!0},this._handlers={click:Ink.bindEvent(this._onClick,this),keyDown:Ink.bindEvent(this._onKeyDown,this),resize:Ink.bindEvent(this._onResize,this)},this._wasDismissed=!1,this._markupMode=this._element?n.hasClassName(this._element,"ink-modal"):!1,this._markupMode){if(this._modalDiv=this._element,this._modalDivStyle=this._modalDiv.style,this._modalShadow=this._modalDiv.parentNode,this._modalShadowStyle=this._modalShadow.style,this._contentContainer=o.select(".modal-body",this._modalDiv),!this._contentContainer.length)throw'Missing div with class "modal-body"';this._contentContainer=this._contentContainer[0],this._options.markup=this._contentContainer.innerHTML,this._options=Ink.extendObj(this._options,i.data(this._element))}else this._modalShadow=document.createElement("div"),this._modalShadowStyle=this._modalShadow.style,this._modalDiv=document.createElement("div"),this._modalDivStyle=this._modalDiv.style,this._element&&(this._options.markup=this._element.innerHTML),n.addClassName(this._modalShadow,"ink-shade"),n.addClassName(this._modalDiv,"ink-modal"),n.addClassName(this._modalDiv,"ink-space"),this._modalShadow.appendChild(this._modalDiv),document.body.appendChild(this._modalShadow);if(this._options=Ink.extendObj(this._options,s||{}),this._markupMode||this.setContentMarkup(this._options.markup),"string"==typeof this._options.shadeClass&&r.each(this._options.shadeClass.split(" "),Ink.bind(function(e){n.addClassName(this._modalShadow,e.trim())},this)),"string"==typeof this._options.modalClass&&r.each(this._options.modalClass.split(" "),Ink.bind(function(e){n.addClassName(this._modalDiv,e.trim())},this)),"trigger"in this._options&&this._options.trigger!==void 0){var a,l;if("string"==typeof this._options.trigger&&(a=o.select(this._options.trigger),a.length>0))for(l=0;a.length>l;l++)t.observe(a[l],this._options.triggerEvent,Ink.bindEvent(this._init,this))}else this._init()};return s.prototype={_init:function(o){o&&t.stop(o);var r="CSS1Compat"===document.compatMode?document.documentElement:document.body;this._resizeTimeout=null,n.addClassName(this._modalShadow,"ink-shade"),this._modalShadowStyle.display=this._modalDivStyle.display="block",setTimeout(Ink.bind(function(){n.addClassName(this._modalShadow,"visible"),n.addClassName(this._modalDiv,"visible")},this),100),this._contentElement=this._modalDiv,this._shadeElement=this._modalShadow,this.setContentMarkup(this._options.markup),this._options.width!==void 0?(this._modalDivStyle.width=this._options.width,-1===this._options.width.indexOf("%")&&(this._modalDivStyle.maxWidth=i.elementWidth(this._modalDiv)+"px")):this._modalDivStyle.maxWidth=this._modalDivStyle.width=i.elementWidth(this._modalDiv)+"px",parseInt(r.clientWidth,10)<=parseInt(this._modalDivStyle.width,10)&&(this._modalDivStyle.width=~~(.9*parseInt(r.clientWidth,10))+"px"),this._options.height!==void 0?(this._modalDivStyle.height=this._options.height,-1===this._options.height.indexOf("%")&&(this._modalDivStyle.maxHeight=i.elementHeight(this._modalDiv)+"px")):this._modalDivStyle.maxHeight=this._modalDivStyle.height=i.elementHeight(this._modalDiv)+"px",parseInt(r.clientHeight,10)<=parseInt(this._modalDivStyle.height,10)&&(this._modalDivStyle.height=~~(.9*parseInt(r.clientHeight,10))+"px"),this.originalStatus={viewportHeight:parseInt(r.clientHeight,10),viewportWidth:parseInt(r.clientWidth,10),width:parseInt(this._modalDivStyle.maxWidth,10),height:parseInt(this._modalDivStyle.maxHeight,10)},this._options.responsive?(this._onResize(!0),t.observe(window,"resize",this._handlers.resize)):(this._resizeContainer(),this._reposition()),this._options.onShow&&this._options.onShow(this),this._options.disableScroll&&this._disableScroll(),t.observe(this._shadeElement,"click",this._handlers.click),t.observe(document,"keydown",this._handlers.keyDown),e.registerInstance(this,this._shadeElement,"modal")},_reposition:function(){this._modalDivStyle.top=this._modalDivStyle.left="50%",this._modalDivStyle.marginTop="-"+~~(i.elementHeight(this._modalDiv)/2)+"px",this._modalDivStyle.marginLeft="-"+~~(i.elementWidth(this._modalDiv)/2)+"px"},_onResize:function(e){"boolean"==typeof e?this._timeoutResizeFunction.call(this):this._resizeTimeout||"object"!=typeof e||(this._resizeTimeout=setTimeout(Ink.bind(this._timeoutResizeFunction,this),250))},_timeoutResizeFunction:function(){var e="CSS1Compat"===document.compatMode?document.documentElement:document.body,t=parseInt(e.clientHeight,10),n=parseInt(e.clientWidth,10);this._modalDivStyle.width=n>this.originalStatus.width?this._modalDivStyle.maxWidth:~~(.9*n)+"px",this._modalDivStyle.height=t>this.originalStatus.height&&parseInt(this._modalDivStyle.maxHeight,10)>=i.elementHeight(this._modalDiv)?this._modalDivStyle.maxHeight:~~(.9*t)+"px",this._resizeContainer(),this._reposition(),this._resizeTimeout=void 0},_onClick:function(e){var r=t.element(e);if(n.hasClassName(r,"ink-close")||n.hasClassName(r,"ink-dismiss")||this._options.closeOnClick&&(!i.descendantOf(this._shadeElement,r)||r===this._shadeElement)){for(var s=o.select(".ink-alert",this._shadeElement),a=s.length,l=0;a>l;l++)if(i.descendantOf(s[l],r))return;t.stop(e),this.dismiss()}},_onKeyDown:function(e){27!==e.keyCode||this._wasDismissed||this.dismiss()},_resizeContainer:function(){this._contentElement.style.overflow=this._contentElement.style.overflowX=this._contentElement.style.overflowY="hidden";var e=i.elementHeight(this._modalDiv);this._modalHeader=o.select(".modal-header",this._modalDiv),this._modalHeader.length>0&&(this._modalHeader=this._modalHeader[0],e-=i.elementHeight(this._modalHeader)),this._modalFooter=o.select(".modal-footer",this._modalDiv),this._modalFooter.length>0&&(this._modalFooter=this._modalFooter[0],e-=i.elementHeight(this._modalFooter)),this._contentContainer.style.height=e+"px",e!==i.elementHeight(this._contentContainer)&&(this._contentContainer.style.height=~~(e-(i.elementHeight(this._contentContainer)-e))+"px"),this._markupMode||(this._contentContainer.style.overflow=this._contentContainer.style.overflowX="hidden",this._contentContainer.style.overflowY="auto",this._contentElement.style.overflow=this._contentElement.style.overflowX=this._contentElement.style.overflowY="visible")},_disableScroll:function(){this._oldScrollPos=i.scroll(),this._onScrollBinded=Ink.bindEvent(function(e){var n=t.element(e);i.descendantOf(this._modalShadow,n)||(t.stop(e),window.scrollTo(this._oldScrollPos[0],this._oldScrollPos[1]))},this),t.observe(window,"scroll",this._onScrollBinded),t.observe(document,"touchmove",this._onScrollBinded)},dismiss:function(){if(this._options.onDismiss&&this._options.onDismiss(this),this._options.disableScroll&&(t.stopObserving(window,"scroll",this._onScrollBinded),t.stopObserving(document,"touchmove",this._onScrollBinded)),this._options.responsive&&t.stopObserving(window,"resize",this._handlers.resize),this._markupMode){n.removeClassName(this._modalDiv,"visible"),n.removeClassName(this._modalShadow,"visible");var e,i=Ink.bindEvent(function(){e&&(this._modalShadowStyle.display="none",t.stopObserving(document,"transitionend",i),t.stopObserving(document,"oTransitionEnd",i),t.stopObserving(document,"webkitTransitionEnd",i),clearInterval(e),e=void 0)},this);t.observe(document,"transitionend",i),t.observe(document,"oTransitionEnd",i),t.observe(document,"webkitTransitionEnd",i),e||(e=setInterval(Ink.bind(function(){this._modalShadowStyle.opacity>0||(this._modalShadowStyle.display="none",clearInterval(e),e=void 0)},this),500))}else this._modalShadow.parentNode.removeChild(this._modalShadow),this.destroy()},destroy:function(){e.unregisterInstance(this._instanceId)},getContentElement:function(){return this._contentContainer},setContentMarkup:function(e){if(this._markupMode)this._contentContainer.innerHTML=[e].join("");else{if(this._modalDiv.innerHTML=[e].join(""),this._contentContainer=o.select(".modal-body",this._modalDiv),!this._contentContainer.length){var t=o.select(".modal-header",this._modalDiv),i=o.select(".modal-footer",this._modalDiv);r.each(t,Ink.bind(function(e){e.parentNode.removeChild(e)},this)),r.each(i,Ink.bind(function(e){e.parentNode.removeChild(e)},this));var s=document.createElement("div");n.addClassName(s,"modal-body"),s.innerHTML=this._modalDiv.innerHTML,this._modalDiv.innerHTML="",r.each(t,Ink.bind(function(e){this._modalDiv.appendChild(e)},this)),this._modalDiv.appendChild(s),r.each(i,Ink.bind(function(e){this._modalDiv.appendChild(e)},this)),this._contentContainer=o.select(".modal-body",this._modalDiv)}this._contentContainer=this._contentContainer[0]}this._contentElement=this._modalDiv,this._resizeContainer()}},s});
Ink.createModule("Ink.UI.ImageQuery","1",["Ink.UI.Aux_1","Ink.Dom.Event_1","Ink.Dom.Css_1","Ink.Dom.Element_1","Ink.Dom.Selector_1","Ink.Util.Array_1"],function(e,t,n,i,o,r){"use strict";var s=function(t,n){if(!e.isDOMElement(t)&&"string"!=typeof t)throw"[ImageQuery] :: Invalid selector";if("string"==typeof t){if(this._element=o.select(t),1>this._element.length)throw"[ImageQuery] :: Selector has returned no elements";if(this._element.length>1){var r;for(r=1;this._element.length>r;r+=1)new Ink.UI.ImageQuery(this._element[r],n)}this._element=this._element[0]}else this._element=t;this._options=Ink.extendObj({queries:[],onLoad:null},i.data(this._element)),this._options=Ink.extendObj(this._options,n||{});var s;if(-1!==(s=this._element.src.lastIndexOf("?"))){var a=this._element.src.substr(s);this._filename=this._element.src.replace(a,"").split("/").pop()+a}else this._filename=this._element.src.split("/").pop();this._init()};return s.prototype={_init:function(){this._options.queries=r.sortMulti(this._options.queries,"width").reverse(),this._handlers={resize:Ink.bindEvent(this._onResize,this),load:Ink.bindEvent(this._onLoad,this)},"function"==typeof this._options.onLoad&&t.observe(this._element,"onload",this._handlers.load),t.observe(window,"resize",this._handlers.resize),this._handlers.resize.call(this)},_onResize:function(){clearTimeout(e);var e=setTimeout(Ink.bind(function(){if(!this._options.queries||this._options.queries==={})return clearTimeout(e),void 0;var t,n,i;for("number"==typeof window.innerWidth?i=window.innerWidth:document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)?i=document.documentElement.clientWidth:document.body&&(document.body.clientWidth||document.body.clientHeight)&&(i=document.body.clientWidth),t=0;this._options.queries.length>t;t+=1)if(i>=this._options.queries[t].width){n=t;break}n===void 0&&(n=this._options.queries.length-1);var o=this._options.queries[n].src||this._options.src;if("devicePixelRatio"in window&&window.devicePixelRatio>1&&"retina"in this._options&&(o=this._options.queries[n].retina||this._options.retina),this._options.queries[n].file=this._filename,"function"==typeof o&&(o=o.apply(this,[this._element,this._options.queries[n]]),"string"!=typeof o))throw'[ImageQuery] :: "src" callback does not return a string';var r;for(r in this._options.queries[n])"src"!==r&&"retina"!==r&&(o=o.replace("{:"+r+"}",this._options.queries[n][r]));this._element.src=o,delete this._options.queries[n].file,e=void 0},this),300)},_onLoad:function(){this._options.onLoad.call(this)}},s});
Ink.createModule("Ink.UI.FormValidator","1",["Ink.Dom.Css_1","Ink.Util.Validator_1"],function(e,t){"use strict";var n={version:"1",_flagMap:{"ink-fv-required":{msg:"Required field"},"ink-fv-email":{msg:"Invalid e-mail address"},"ink-fv-url":{msg:"Invalid URL"},"ink-fv-number":{msg:"Invalid number"},"ink-fv-phone_pt":{msg:"Invalid phone number"},"ink-fv-phone_cv":{msg:"Invalid phone number"},"ink-fv-phone_mz":{msg:"Invalid phone number"},"ink-fv-phone_ao":{msg:"Invalid phone number"},"ink-fv-date":{msg:"Invalid date"},"ink-fv-confirm":{msg:"Confirmation does not match"},"ink-fv-custom":{msg:""}},elements:{},confirmElms:{},hasConfirm:{},_errorClassName:"tip",_errorValidationClassName:"validaton",_errorTypeWarningClassName:"warning",_errorTypeErrorClassName:"error",validate:function(e,t){if(this._free(),t=Ink.extendObj({onSuccess:!1,onError:!1,customFlag:!1,confirmGroup:[]},t||{}),"string"==typeof e&&(e=document.getElementById(e)),null===e)return!1;this.element=e,(this.element.id===void 0||null===this.element.id||""===this.element.id)&&(this.element.id="ink-fv_randomid_"+Math.round(99999*Math.random())),this.custom=t.customFlag,this.confirmGroup=t.confirmGroup;var n=this._validateElements();return n.length>0?(t.onError?t.onError(n):this._showError(e,n),!1):(t.onError||this._clearError(e),this._clearCache(),t.onSuccess&&t.onSuccess(),!0)},reset:function(){this._clearError(),this._clearCache()},_free:function(){this.element=null,this.custom=!1,this.confirmGroup=!1},_clearCache:function(){this.element=null,this.elements=[],this.custom=!1,this.confirmGroup=!1},_getElements:function(){this.elements[this.element.id]=[],this.confirmElms[this.element.id]=[];for(var t=this.element.elements,n=!1,i=0,o=t.length;o>i;i++)if(n=t[i],null!==n.getAttribute("type")&&"radio"===n.getAttribute("type").toLowerCase()){if(0===this.elements[this.element.id].length||n.getAttribute("type")!==this.elements[this.element.id][this.elements[this.element.id].length-1].getAttribute("type")&&n.getAttribute("name")!==this.elements[this.element.id][this.elements[this.element.id].length-1].getAttribute("name"))for(var r in this._flagMap)if(e.hasClassName(n,r)){this.elements[this.element.id].push(n);break}}else{for(var s in this._flagMap)if(e.hasClassName(n,s)&&"ink-fv-confirm"!==s){this.elements[this.element.id].push(n);break}e.hasClassName(n,"ink-fv-confirm")&&(this.confirmElms[this.element.id].push(n),this.hasConfirm[this.element.id]=!0)}},_validateElements:function(){var t;this._getElements(),this.hasConfirm[this.element.id]!==void 0&&this.hasConfirm[this.element.id]===!0&&(t=this._makeConfirmGroups());for(var n,i=[],o=!1,r=!1,s=0,a=this.elements[this.element.id].length;a>s;s++)if(n=!1,o=this.elements[this.element.id][s],!o.disabled)for(var l in this._flagMap)e.hasClassName(o,l)&&("ink-fv-custom"!==l&&"ink-fv-confirm"!==l?this._isValid(o,l)||(n?i[i.length-1].errors.push(l):(i.push({elm:o,errors:[l]}),n=!0)):"ink-fv-confirm"!==l&&(r=this._isCustomValid(o),r.length>0&&i.push({elm:o,errors:[l],custom:r})));return i=this._validateConfirmGroups(t,i)},_validateConfirmGroups:function(e,t){var n=!1;for(var i in e)n=e[i],2===n.length&&n[0].value!==n[1].value&&t.push({elm:n[1],errors:["ink-fv-confirm"]});return t},_makeConfirmGroups:function(){var t;if(this.confirmGroup&&this.confirmGroup.length>0){t={};for(var n=!1,i=!1,o=0,r=this.confirmElms[this.element.id].length;r>o;o++){n=this.confirmElms[this.element.id][o];for(var s=0,a=this.confirmGroup.length;a>s;s++)i=this.confirmGroup[s],e.hasClassName(n,i)&&(t[i]===void 0?t[i]=[n]:t[i].push(n))}return t}return 2===this.confirmElms[this.element.id].length&&(t={"ink-fv-confirm":[this.confirmElms[this.element.id][0],this.confirmElms[this.element.id][1]]}),t},_isCustomValid:function(t){for(var n=[],i=!1,o=0,r=this.custom.length;r>o;o++)i=this.custom[o],e.hasClassName(t,i.flag)&&(i.callback(t,i.msg)||n.push({flag:i.flag,msg:i.msg}));return n},_isValid:function(n,i){switch(i){case"ink-fv-required":if("select"===n.nodeName.toLowerCase())return n.selectedIndex>0?!0:!1;if("checkbox"!==n.getAttribute("type")&&"radio"!==n.getAttribute("type")){if(""!==this._trim(n.value))return!0}else if("checkbox"===n.getAttribute("type")){if(n.checked===!0)return!0}else if("radio"===n.getAttribute("type")){var o=n.form[n.name];o.length===void 0&&(o=[o]);for(var r=!1,s=0,a=o.length;a>s;s++)o[s].checked===!0&&(r=!0);return r}break;case"ink-fv-email":if(""===this._trim(n.value))return e.hasClassName(n,"ink-fv-required")?!1:!0;if(t.mail(n.value))return!0;break;case"ink-fv-url":if(""===this._trim(n.value))return e.hasClassName(n,"ink-fv-required")?!1:!0;if(t.url(n.value))return!0;break;case"ink-fv-number":if(""===this._trim(n.value))return e.hasClassName(n,"ink-fv-required")?!1:!0;if(!isNaN(Number(n.value)))return!0;break;case"ink-fv-phone_pt":if(""===this._trim(n.value))return e.hasClassName(n,"ink-fv-required")?!1:!0;if(t.isPTPhone(n.value))return!0;break;case"ink-fv-phone_cv":if(""===this._trim(n.value))return e.hasClassName(n,"ink-fv-required")?!1:!0;if(t.isCVPhone(n.value))return!0;break;case"ink-fv-phone_ao":if(""===this._trim(n.value))return e.hasClassName(n,"ink-fv-required")?!1:!0;if(t.isAOPhone(n.value))return!0;break;case"ink-fv-phone_mz":if(""===this._trim(n.value))return e.hasClassName(n,"ink-fv-required")?!1:!0;if(t.isMZPhone(n.value))return!0;break;case"ink-fv-date":if(""===this._trim(n.value))return e.hasClassName(n,"ink-fv-required")?!1:!0;var l=Ink.getModule("Ink.Dom.Element",1),h=l.data(n),d="yyyy-mm-dd";if(e.hasClassName(n,"ink-datepicker")&&"format"in h?d=h.format:"validFormat"in h&&(d=h.validFormat),!(d in t._dateParsers)){var c=[];for(var u in t._dateParsers)c.push(u);throw"The attribute data-valid-format must be one of the following values: "+c.join(",")}return t.isDate(d,n.value);case"ink-fv-custom":}return!1},_showError:function(t,n){this._clearError(t);for(var i=!1,o=0,r=n.length;r>o;o++)if(i=n[o].elm,"radio"!==i.getAttribute("type")){var s=document.createElement("p");e.addClassName(s,this._errorClassName),e.addClassName(s,this._errorTypeErrorClassName),s.innerHTML="ink-fv-custom"!==n[o].errors[0]?this._flagMap[n[o].errors[0]].msg:n[o].custom[0].msg,"checkbox"!==i.getAttribute("type")&&(i.nextSibling.parentNode.insertBefore(s,i.nextSibling),e.hasClassName(i.parentNode,"control")&&(e.addClassName(i.parentNode.parentNode,"validation"),"ink-fv-required"===n[o].errors[0]?e.addClassName(i.parentNode.parentNode,"error"):e.addClassName(i.parentNode.parentNode,"warning")))}else e.hasClassName(i.parentNode.parentNode,"control-group")&&(e.addClassName(i.parentNode.parentNode,"validation"),e.addClassName(i.parentNode.parentNode,"error"))},_clearError:function(t){for(var n=t.getElementsByTagName("p"),i=!1,o=n.length-1;o>=0;o--)i=n[o],e.hasClassName(i,this._errorClassName)&&(e.hasClassName(i.parentNode,"control")&&(e.removeClassName(i.parentNode.parentNode,"validation"),e.removeClassName(i.parentNode.parentNode,"error"),e.removeClassName(i.parentNode.parentNode,"warning")),e.hasClassName(i,"tip")&&e.hasClassName(i,"error")&&i.parentNode.removeChild(i));var r=t.getElementsByTagName("ul");for(o=r.length-1;o>=0;o--)i=r[o],e.hasClassName(i,"control-group")&&(e.removeClassName(i,"validation"),e.removeClassName(i,"error"))},_trim:function(e){return"string"==typeof e?e.replace(/^\s+|\s+$|\n+$/g,""):void 0}};return n});
Ink.createModule("Ink.UI.Droppable","1",["Ink.Dom.Element_1","Ink.Dom.Event_1","Ink.Dom.Css_1"],function(e,t,n){var i={debug:!1,_elements:{},add:function(e,t){var n=Ink.extendObj({hoverclass:!1,accept:!1,onHover:!1,onDrop:!1,onDropOut:!1},t||{});e=Ink.i(e),n.accept&&n.accept.constructor===Array&&(n.accept=n.accept.join()),this._elements[e.id]={options:n},this.update(e.id)},updateAll:function(){for(var e in this._elements)this._elements.hasOwnProperty(e)&&this.update(Ink.i(e))},update:function(t){t=Ink.i(t);var n=this._elements[t.id];n&&(n.left=e.offsetLeft(t),n.top=e.offsetTop(t),n.right=n.left+e.elementWidth(t),n.bottom=n.top+e.elementHeight(t))},remove:function(e){e=Ink.i(e),delete this._elements[e.id]},action:function(e,t,i,o){var r,s,a,l,h;for(var d in this._elements)if(this._elements.hasOwnProperty(d))if(l=this._elements[d],r=l.options,a=!1,h=Ink.i(d),e.x>=l.left&&e.x<=l.right&&e.y>=l.top&&e.y<=l.bottom){if(r.accept){s=o.className.split(" ");for(var c=0,u=s.length;u>c;c++)r.accept.search(s[c])>=0&&o!==h&&(a=!0)}else a=!0;a&&("drag"===t?(r.hoverclass&&n.addClassName(h,r.hoverclass),r.onHover&&r.onHover(o,h)):"drop"===t&&r.onDrop&&(r.hoverclass&&n.removeClassName(h,r.hoverclass),r.onDrop&&r.onDrop(o,h,i)))}else"drag"===t&&r.hoverclass&&n.removeClassName(h,r.hoverclass),"drop"===t&&r.onDropOut&&r.onDropOut(o,h,i)}};return i});
Ink.createModule("Ink.UI.Draggable","1",["Ink.Dom.Element_1","Ink.Dom.Event_1","Ink.Dom.Css_1","Ink.Dom.Browser_1","Ink.UI.Droppable_1"],function(e,t,n,i,o){var s=function(e,t){this.init(e,t)};return s.prototype={init:function(n,o){var s=Ink.extendObj({constraint:!1,top:0,right:e.pageWidth(),bottom:e.pageHeight(),left:0,handler:!1,revert:!1,cursor:"move",zindex:9999,dragClass:"drag",onStart:!1,onEnd:!1,onDrag:!1,onChange:!1,droppableProxy:!1,mouseAnchor:void 0,skipChildren:!0,debug:!1},o||{});this.options=s,this.element=Ink.i(n),this.handle=!1,this.elmStartPosition=!1,this.active=!1,this.dragged=!1,this.prevCoords=!1,this.placeholder=!1,this.position=!1,this.zindex=!1,this.firstDrag=!0,s.fps&&(this.deltaMs=1e3/s.fps,this.lastRanAt=0),this.handlers={},this.handlers.start=Ink.bindEvent(this._onStart,this),this.handlers.dragFacade=Ink.bindEvent(this._onDragFacade,this),this.handlers.drag=Ink.bindEvent(this._onDrag,this),this.handlers.end=Ink.bindEvent(this._onEnd,this),this.handlers.selectStart=function(e){return t.stop(e),!1},this.handle=this.options.handler?Ink.i(this.options.handler):this.element,this.handle.style.cursor=s.cursor,s.right!==!1&&(this.options.right=s.right-e.elementWidth(n)),s.bottom!==!1&&(this.options.bottom=s.bottom-e.elementHeight(n)),t.observe(this.handle,"touchstart",this.handlers.start),t.observe(this.handle,"mousedown",this.handlers.start),i.IE&&t.observe(this.element,"selectstart",this.handlers.selectStart)},destroy:function(){t.stopObserving(this.handle,"touchstart",this.handlers.start),t.stopObserving(this.handle,"mousedown",this.handlers.start),i.IE&&t.stopObserving(this.element,"selectstart",this.handlers.selectStart)},_getPageScroll:function(){return self.pageXOffset!==void 0?[self.pageXOffset,self.pageYOffset]:document.documentElement!==void 0&&document.documentElement.scrollLeft!==void 0?[document.documentElement.scrollLeft,document.documentElement.scrollTop]:[document.body.scrollLeft,document.body.scrollTop]},_getCoords:function(e){var t=this._getPageScroll();return{x:(e.touches?e.touches[0].clientX:e.clientX)+t[0],y:(e.touches?e.touches[0].clientY:e.clientY)+t[1]}},_cloneStyle:function(t,i){i.className=t.className,i.style.borderWidth="0",i.style.padding="0",i.style.position="absolute",i.style.width=e.elementWidth(t)+"px",i.style.height=e.elementHeight(t)+"px",i.style.left=e.elementLeft(t)+"px",i.style.top=e.elementTop(t)+"px",i.style.cssFloat=n.getStyle(t,"float"),i.style.display=n.getStyle(t,"display")},_onStart:function(i){if(!this.active&&t.isLeftClick(i)||i.button===void 0){var o=t.element(i);if(this.options.skipChildren&&o!==this.element)return;t.stop(i),n.addClassName(this.element,this.options.dragClass),this.elmStartPosition=[e.elementLeft(this.element),e.elementTop(this.element)];var s=[parseInt(n.getStyle(this.element,"left"),10),parseInt(n.getStyle(this.element,"top"),10)],r=[e.elementWidth(this.element),e.elementHeight(this.element)];this.originalPosition=[s[0]?s[0]:null,s[1]?s[1]:null],this.delta=this._getCoords(i),this.active=!0,this.position=n.getStyle(this.element,"position"),this.zindex=n.getStyle(this.element,"zIndex");var a=document.createElement("div");if(a.style.position=this.position,a.style.width=r[0]+"px",a.style.height=r[1]+"px",a.style.marginTop=n.getStyle(this.element,"margin-top"),a.style.marginBottom=n.getStyle(this.element,"margin-bottom"),a.style.marginLeft=n.getStyle(this.element,"margin-left"),a.style.marginRight=n.getStyle(this.element,"margin-right"),a.style.borderWidth="0",a.style.padding="0",a.style.cssFloat=n.getStyle(this.element,"float"),a.style.display=n.getStyle(this.element,"display"),a.style.visibility="hidden",this.delta2=[this.delta.x-this.elmStartPosition[0],this.delta.y-this.elmStartPosition[1]],this.options.mouseAnchor){var l=this.options.mouseAnchor.split(" "),h=[r[0],r[1]];"left"===l[0]?h[0]=0:"center"===l[0]&&(h[0]=parseInt(h[0]/2,10)),"top"===l[1]?h[1]=0:"center"===l[1]&&(h[1]=parseInt(h[1]/2,10)),this.applyDelta=[this.delta2[0]-h[0],this.delta2[1]-h[1]]}if(this.placeholder=a,this.options.onStart&&this.options.onStart(this.element,i),this.options.droppableProxy){this.proxy=document.createElement("div"),r=[window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight];var d=this.proxy.style;d.width=r[0]+"px",d.height=r[1]+"px",d.position="fixed",d.left="0",d.top="0",d.zIndex=this.options.zindex+1,d.backgroundColor="#FF0000",n.setOpacity(this.proxy,0);for(var c=document.body.firstChild;c&&1!==c.nodeType;)c=c.nextSibling;document.body.insertBefore(this.proxy,c),t.observe(this.proxy,"mousemove",this.handlers[this.options.fps?"dragFacade":"drag"]),t.observe(this.proxy,"touchmove",this.handlers[this.options.fps?"dragFacade":"drag"])}else t.observe(document,"mousemove",this.handlers[this.options.fps?"dragFacade":"drag"]);return this.element.style.position="absolute",this.element.style.zIndex=this.options.zindex,this.element.parentNode.insertBefore(this.placeholder,this.element),this._onDrag(i),t.observe(document,"mouseup",this.handlers.end),t.observe(document,"touchend",this.handlers.end),!1}},_onDragFacade:function(e){var t=(new Date).getTime();(!this.lastRanAt||t>this.lastRanAt+this.deltaMs)&&(this.lastRanAt=t,this._onDrag(e))},_onDrag:function(e){if(this.active){t.stop(e),this.dragged=!0;var n=this._getCoords(e),i=n.x,s=n.y,r=this.options,a=!1,l=!1;if(this.prevCoords||(this.prevCoords={x:0,y:0}),i!==this.prevCoords.x||s!==this.prevCoords.y){if(r.onDrag&&r.onDrag(this.element,e),this.prevCoords=n,a=this.elmStartPosition[0]+i-this.delta.x,l=this.elmStartPosition[1]+s-this.delta.y,("horizontal"===r.constraint||"both"===r.constraint)&&(r.right!==!1&&a>r.right&&(a=r.right),r.left!==!1&&r.left>a&&(a=r.left)),("vertical"===r.constraint||"both"===r.constraint)&&(r.bottom!==!1&&l>r.bottom&&(l=r.bottom),r.top!==!1&&r.top>l&&(l=r.top)),this.firstDrag&&(o&&o.updateAll(),this.firstDrag=!1),a&&(this.element.style.left=a+"px"),l&&(this.element.style.top=l+"px"),o){var h=this.options.mouseAnchor?{x:i-this.applyDelta[0],y:s-this.applyDelta[1]}:n;o.action(h,"drag",e,this.element)}r.onChange&&r.onChange(this)}}},_onEnd:function(i){t.stopObserving(document,"mousemove",this.handlers.drag),t.stopObserving(document,"touchmove",this.handlers.drag),this.options.fps&&this._onDrag(i),n.removeClassName(this.element,this.options.dragClass),this.active&&this.dragged&&(this.options.droppableProxy&&document.body.removeChild(this.proxy),this.pt&&(e.remove(this.pt),this.pt=void 0),this.placeholder&&e.remove(this.placeholder),this.options.revert&&(this.element.style.position=this.position,this.element.style.zIndex=null!==this.zindex?this.zindex:"auto",this.element.style.left=this.originalPosition[0]?this.originalPosition[0]+"px":"",this.element.style.top=this.originalPosition[1]?this.originalPosition[1]+"px":""),this.options.onEnd&&this.options.onEnd(this.element,i),o&&o.action(this._getCoords(i),"drop",i,this.element),this.position=!1,this.zindex=!1,this.firstDrag=!0),this.active=!1,this.dragged=!1}},s});
Ink.createModule("Ink.UI.DatePicker","1",["Ink.UI.Aux_1","Ink.Dom.Event_1","Ink.Dom.Css_1","Ink.Dom.Element_1","Ink.Dom.Selector_1","Ink.Util.Array_1","Ink.Util.Date_1","Ink.Dom.Browser_1"],function(e,t,n,i,o,s,r){"use strict";var a=function(t,n){t&&(this._dataField=e.elOrSelector(t,"1st argument")),this._options=Ink.extendObj({instance:"scdp_"+Math.round(99999*Math.random()),format:"yyyy-mm-dd",cssClass:"sapo_component_datepicker",position:"right",onFocus:!0,onYearSelected:void 0,onMonthSelected:void 0,validDayFn:void 0,startDate:!1,onSetDate:!1,displayInSelect:!1,showClose:!0,showClean:!0,yearRange:!1,dateRange:!1,startWeekDay:1,closeText:"Close",cleanText:"Clear",prevLinkText:"«",nextLinkText:"»",ofText:"&nbsp;de&nbsp;",month:{1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"},wDay:{0:"Sunday",1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday"}},i.data(this._dataField)||{}),this._options=Ink.extendObj(this._options,n||{}),this._options.format=this._dateParsers[this._options.format]||this._options.format,this._hoverPicker=!1,this._picker=null,this._options.pickerField&&(this._picker=e.elOrSelector(this._options.pickerField,"pickerField")),this._today=new Date,this._day=this._today.getDate(),this._month=this._today.getMonth(),this._year=this._today.getFullYear(),this._setMinMax(this._options.dateRange||this._options.yearRange),this._data=new Date(Date.UTC.apply(this,this._checkDateRange(this._year,this._month,this._day))),this._options.startDate&&"string"==typeof this._options.startDate&&/\d\d\d\d\-\d\d\-\d\d/.test(this._options.startDate)&&this.setDate(this._options.startDate),this._init(),this._render(),this._options.startDate||this._dataField&&"string"==typeof this._dataField.value&&this._dataField.value&&this.setDate(this._dataField.value),e.registerInstance(this,this._containerObject,"datePicker")};return a.prototype={version:"0.1",_init:function(){Ink.extendObj(this._options,this._lang||{})},_render:function(){this._containerObject=document.createElement("div"),this._containerObject.id=this._options.instance,this._containerObject.className="sapo_component_datepicker";var n=document.getElementsByTagName("body")[0];if(this._options.showClose||this._options.showClean){if(this._superTopBar=document.createElement("div"),this._superTopBar.className="sapo_cal_top_options",this._options.showClean){var o=document.createElement("a");o.className="clean",o.innerHTML=this._options.cleanText,this._superTopBar.appendChild(o)}if(this._options.showClose){var s=document.createElement("a");s.className="close",s.innerHTML=this._options.closeText,this._superTopBar.appendChild(s)}this._containerObject.appendChild(this._superTopBar)}var r=document.createElement("div");r.className="sapo_cal_top",this._monthDescContainer=document.createElement("div"),this._monthDescContainer.className="sapo_cal_month_desc",this._monthPrev=document.createElement("div"),this._monthPrev.className="sapo_cal_prev",this._monthPrev.innerHTML='<a href="#prev" class="change_month_prev">'+this._options.prevLinkText+"</a>",this._monthNext=document.createElement("div"),this._monthNext.className="sapo_cal_next",this._monthNext.innerHTML='<a href="#next" class="change_month_next">'+this._options.nextLinkText+"</a>",r.appendChild(this._monthPrev),r.appendChild(this._monthDescContainer),r.appendChild(this._monthNext),this._monthContainer=document.createElement("div"),this._monthContainer.className="sapo_cal_month",this._containerObject.appendChild(r),this._containerObject.appendChild(this._monthContainer),this._monthSelector=document.createElement("ul"),this._monthSelector.className="sapo_cal_month_selector";for(var a,l,h=1;12>=h;h++)0===(h-1)%4&&(a=document.createElement("ul")),l=document.createElement("li"),l.innerHTML='<a href="#" class="sapo_calmonth_'+(2===(h+"").length?h:"0"+h)+'">'+this._options.month[h].substring(0,3)+"</a>",a.appendChild(l),0===h%4&&this._monthSelector.appendChild(a);if(this._containerObject.appendChild(this._monthSelector),this._yearSelector=document.createElement("ul"),this._yearSelector.className="sapo_cal_year_selector",this._containerObject.appendChild(this._yearSelector),(!this._options.onFocus||this._options.displayInSelect)&&(this._options.pickerField?this._picker=e.elOrSelector(this._options.pickerField,"pickerField"):(this._picker=document.createElement("a"),this._picker.href="#open_cal",this._picker.innerHTML="open",this._picker.style.position="absolute",this._picker.style.top=i.elementTop(this._dataField),this._picker.style.left=i.elementLeft(this._dataField)+(i.elementWidth(this._dataField)||0)+5+"px",this._dataField.parentNode.appendChild(this._picker),this._picker.className="sapo_cal_date_picker")),this._options.displayInSelect){if(!(this._options.dayField&&this._options.monthField&&this._options.yearField||this._options.pickerField))throw"To use display in select you *MUST* to set dayField, monthField, yearField and pickerField!";this._options.dayField=e.elOrSelector(this._options.dayField,"dayField"),this._options.monthField=e.elOrSelector(this._options.monthField,"monthField"),this._options.yearField=e.elOrSelector(this._options.yearField,"yearField")}n.insertBefore(this._containerObject,n.childNodes[0]),this._picker?t.observe(this._picker,"click",Ink.bindEvent(function(e){t.stop(e),this._containerObject=i.clonePosition(this._containerObject,this._picker),this._updateDate(),this._showMonth(),this._containerObject.style.display="block"},this)):t.observe(this._dataField,"focus",Ink.bindEvent(function(){this._containerObject=i.clonePosition(this._containerObject,this._dataField),"bottom"===this._options.position?(this._containerObject.style.top=i.elementHeight(this._dataField)+i.offsetTop(this._dataField)+"px",this._containerObject.style.left=i.offset(this._dataField)[0]+"px"):(this._containerObject.style.top=i.offset(this._dataField)[1]+"px",this._containerObject.style.left=i.elementWidth(this._dataField)+i.offset(this._dataField)[0]+"px"),this._updateDate(),this._showMonth(),this._containerObject.style.display="block"},this)),this._options.displayInSelect?(t.observe(this._options.dayField,"change",Ink.bindEvent(function(){var e=this._options.yearField[this._options.yearField.selectedIndex].value;""!==e&&0!==e&&(this._updateDate(),this._showDefaultView())},this)),t.observe(this._options.monthField,"change",Ink.bindEvent(function(){var e=this._options.yearField[this._options.yearField.selectedIndex].value;""!==e&&0!==e&&(this._updateDate(),this._showDefaultView())},this)),t.observe(this._options.yearField,"change",Ink.bindEvent(function(){this._updateDate(),this._showDefaultView()},this))):(t.observe(this._dataField,"change",Ink.bindEvent(function(){this._updateDate(),this._showDefaultView(),this.setDate(),this._hoverPicker||(this._containerObject.style.display="none")},this)),t.observe(this._dataField,"blur",Ink.bindEvent(function(){this._hoverPicker||(this._containerObject.style.display="none")},this))),t.observe(document,"click",Ink.bindEvent(function(e){void 0===e.target&&(e.target=e.srcElement),i.descendantOf(this._containerObject,e.target)||e.target===this._dataField||(this._picker?e.target===this._picker||this._options.displayInSelect&&(e.target===this._options.dayField||e.target===this._options.monthField||e.target===this._options.yearField)||this._options.dayField&&(i.descendantOf(this._options.dayField,e.target)||i.descendantOf(this._options.monthField,e.target)||i.descendantOf(this._options.yearField,e.target))||(this._containerObject.style.display="none"):this._containerObject.style.display="none")},this)),this._showMonth(),this._monthChanger=document.createElement("a"),this._monthChanger.href="#monthchanger",this._monthChanger.className="sapo_cal_link_month",this._monthChanger.innerHTML=this._options.month[this._month+1],this._deText=document.createElement("span"),this._deText.innerHTML=this._options._deText,this._yearChanger=document.createElement("a"),this._yearChanger.href="#yearchanger",this._yearChanger.className="sapo_cal_link_year",this._yearChanger.innerHTML=this._year,this._monthDescContainer.innerHTML="",this._monthDescContainer.appendChild(this._monthChanger),this._monthDescContainer.appendChild(this._deText),this._monthDescContainer.appendChild(this._yearChanger),t.observe(this._containerObject,"mouseover",Ink.bindEvent(function(e){t.stop(e),this._hoverPicker=!0},this)),t.observe(this._containerObject,"mouseout",Ink.bindEvent(function(e){t.stop(e),this._hoverPicker=!1},this)),t.observe(this._containerObject,"click",Ink.bindEvent(function(e){e.target===void 0&&(e.target=e.srcElement);var n=e.target.className,i=-1!==n.indexOf("sapo_cal_off");if(t.stop(e),0!==n.indexOf("sapo_cal_")||i)if(0!==n.indexOf("sapo_calmonth_")||i)if(0!==n.indexOf("sapo_calyear_")||i)0!==n.indexOf("change_month_")||i?0!==n.indexOf("change_year_")||i?"clean"===n?this._options.displayInSelect?(this._options.yearField.selectedIndex=0,this._options.monthField.selectedIndex=0,this._options.dayField.selectedIndex=0):this._dataField.value="":"close"===n&&(this._containerObject.style.display="none"):"change_year_next"===n?this._showYearSelector(1):"change_year_prev"===n&&this._showYearSelector(-1):"change_month_next"===n?this._updateCal(1):"change_month_prev"===n&&this._updateCal(-1);else{var o=n.substr(13,4);Number(o)&&(this._year=o,"function"==typeof this._options.onYearSelected&&this._options.onYearSelected(this,{year:this._year}),this._monthPrev.childNodes[0].className="action_inactive",this._monthNext.childNodes[0].className="action_inactive",this._yearSelector.style.display="none",this._setActiveMonth(),this._monthSelector.style.display="block")}else{var s=n.substr(14,2);Number(s)&&(this._month=s-1,this._monthSelector.style.display="none",this._monthPrev.childNodes[0].className="change_month_prev",this._monthNext.childNodes[0].className="change_month_next",this._year<this._yearMin||this._year===this._yearMin&&this._month<=this._monthMin?this._monthPrev.childNodes[0].className="action_inactive":(this._year>this._yearMax||this._year===this._yearMax&&this._month>=this._monthMax)&&(this._monthNext.childNodes[0].className="action_inactive"),this._updateCal(),this._monthContainer.style.display="block")}else{var r=n.substr(9,2);Number(r)?(this.setDate(this._year+"-"+(this._month+1)+"-"+r),this._containerObject.style.display="none"):"sapo_cal_link_month"===n?(this._monthContainer.style.display="none",this._yearSelector.style.display="none",this._monthPrev.childNodes[0].className="action_inactive",this._monthNext.childNodes[0].className="action_inactive",this._setActiveMonth(),this._monthSelector.style.display="block"):"sapo_cal_link_year"===n&&(this._monthPrev.childNodes[0].className="action_inactive",this._monthNext.childNodes[0].className="action_inactive",this._monthSelector.style.display="none",this._monthContainer.style.display="none",this._showYearSelector(),this._yearSelector.style.display="block")}this._updateDescription()},this))},_setMinMax:function(e){var t;if(e){var n=e.split(":"),i=/^(\d{4})((\-)(\d{1,2})((\-)(\d{1,2}))?)?$/;if(n[0]&&("NOW"===n[0]?(this._yearMin=this._today.getFullYear(),this._monthMin=this._today.getMonth()+1,this._dayMin=this._today.getDate()):i.test(n[0])?(t=n[0].split("-"),this._yearMin=Math.floor(t[0]),this._monthMin=Math.floor(t[1])||1,this._dayMin=Math.floor(t[2])||1,this._monthMin>1&&this._monthMin>12&&(this._monthMin=1,this._dayMin=1),this._dayMin>1&&this._dayMin>this._daysInMonth(this._yearMin,this._monthMin)&&(this._dayMin=1)):(this._yearMin=Number.MIN_VALUE,this._monthMin=1,this._dayMin=1)),n[1])if("NOW"===n[1])this._yearMax=this._today.getFullYear(),this._monthMax=this._today.getMonth()+1,this._dayMax=this._today.getDate();else if(i.test(n[1])){t=n[1].split("-"),this._yearMax=Math.floor(t[0]),this._monthMax=Math.floor(t[1])||12,this._dayMax=Math.floor(t[2])||this._daysInMonth(this._yearMax,this._monthMax),this._monthMax>1&&this._monthMax>12&&(this._monthMax=12,this._dayMax=31);var o=this._daysInMonth(this._yearMax,this._monthMax);this._dayMax>1&&this._dayMax>o&&(this._dayMax=o)}else this._yearMax=Number.MAX_VALUE,this._monthMax=12,this._dayMax=31;this._yearMax>=this._yearMin&&(this._monthMax>this._monthMin||this._monthMax===this._monthMin&&this._dayMax>=this._dayMin)||(this._yearMin=Number.MIN_VALUE,this._monthMin=1,this._dayMin=1,this._yearMax=Number.MAX_VALUE,this._monthMax=12,this._dayMaXx=31)}else this._yearMin=Number.MIN_VALUE,this._monthMin=1,this._dayMin=1,this._yearMax=Number.MAX_VALUE,this._monthMax=12,this._dayMax=31},_checkDateRange:function(e,t,n){return this._isValidDate(e,t+1,n)||(e=this._today.getFullYear(),t=this._today.getMonth(),n=this._today.getDate()),e>this._yearMax?(e=this._yearMax,t=this._monthMax-1,n=this._dayMax):this._yearMin>e&&(e=this._yearMin,t=this._monthMin-1,n=this._dayMin),e===this._yearMax&&t+1>this._monthMax?(t=this._monthMax-1,n=this._dayMax):e===this._yearMin&&this._monthMin>t+1&&(t=this._monthMin-1,n=this._dayMin),e===this._yearMax&&t+1===this._monthMax&&n>this._dayMax?n=this._dayMax:e===this._yearMin&&t+1===this._monthMin&&this._dayMin>n?n=this._dayMin:n>this._daysInMonth(e,t+1)&&(n=this._daysInMonth(e,t+1)),[e,t,n]},_showDefaultView:function(){this._yearSelector.style.display="none",this._monthSelector.style.display="none",this._monthPrev.childNodes[0].className="change_month_prev",this._monthNext.childNodes[0].className="change_month_next",this._year<this._yearMin||this._year===this._yearMin&&this._month+1<=this._monthMin?this._monthPrev.childNodes[0].className="action_inactive":(this._year>this._yearMax||this._year===this._yearMax&&this._month+1>=this._monthMax)&&(this._monthNext.childNodes[0].className="action_inactive"),this._monthContainer.style.display="block"},_updateDate:function(){var e;this._options.displayInSelect?(e=[],this._isValidDate(e[0]=this._options.yearField[this._options.yearField.selectedIndex].value,e[1]=this._options.monthField[this._options.monthField.selectedIndex].value,e[2]=this._options.dayField[this._options.dayField.selectedIndex].value)?(e=this._checkDateRange(e[0],e[1]-1,e[2]),this._year=e[0],this._month=e[1],this._day=e[2]):(e=this._checkDateRange(e[0],e[1]-1,1),this._isValidDate(e[0],e[1]+1,e[2])&&(this._year=e[0],this._month=e[1],this._day=this._daysInMonth(e[0],e[1]),this.setDate()))):""!==this._dataField.value&&(this._isDate(this._options.format,this._dataField.value)?(e=this._getDataArrayParsed(this._dataField.value),e=this._checkDateRange(e[0],e[1]-1,e[2]),this._year=e[0],this._month=e[1],this._day=e[2]):(this._dataField.value="",this._year=this._data.getFullYear(),this._month=this._data.getMonth(),this._day=this._data.getDate()),this._data.setFullYear(this._year,this._month,this._day),this._dataField.value=this._writeDateInFormat()),this._updateDescription(),this._showMonth()},_updateDescription:function(){this._monthChanger.innerHTML=this._options.month[this._month+1],this._deText.innerHTML=this._options.ofText,this._yearChanger.innerHTML=this._year},_showYearSelector:function(){if(arguments.length){var e=+this._year+10*arguments[0];if(e-=e%10,e>this._yearMax||this._yearMin>e+9)return;this._year=+this._year+10*arguments[0]}for(var t="<li>",n=this._year-this._year%10,i=0;11>=i;i++)0===i%4&&(t+="<ul>"),t+=i&&11!==i?this._yearMax>=n+i-1&&n+i-1>=this._yearMin?'<li><a href="#" class="sapo_calyear_'+(n+i-1)+(n+i-1===this._data.getFullYear()?" sapo_cal_on":"")+'">'+(n+i-1)+"</a></li>":'<li><a href="#" class="sapo_cal_off">'+(n+i-1)+"</a></li>":i&&this._yearMax>=n+i-1&&n+i-1>=this._yearMin?'<li><a href="#year_next" class="change_year_next">'+this._options.nextLinkText+"</a></li>":this._yearMax>=n+i-1&&n+i-1>=this._yearMin?'<li><a href="#year_prev" class="change_year_prev">'+this._options.prevLinkText+"</a></li>":"<li>&nbsp;</li>",0===(i+1)%4&&(t+="</ul>");t+="</li>",this._yearSelector.innerHTML=t},_getDataArrayParsed:function(e){var t=[],n=r.set(this._options.format,e);return n&&(t=[n.getFullYear(),n.getMonth()+1,n.getDate()]),t},_isValidDate:function(e,t,n){var i=/^\d{4}$/,o=/^\d{1,2}$/;return i.test(e)&&o.test(t)&&o.test(n)&&t>=1&&12>=t&&n>=1&&this._daysInMonth(e,t)>=n},_isDate:function(e,t){try{if(e===void 0)return!1;var n=r.set(e,t);if(n&&this._isValidDate(n.getFullYear(),n.getMonth()+1,n.getDate()))return!0}catch(i){}return!1},_writeDateInFormat:function(){return r.get(this._options.format,this._data)},setDate:function(e){if("string"==typeof e&&/\d{4}-\d{1,2}-\d{1,2}/.test(e)){var t=e.split("-");this._year=t[0],this._month=t[1]-1,this._day=t[2]}this._setDate()},_setDate:function(e){e!==void 0&&e.className&&0===e.className.indexOf("sapo_cal_")&&(this._day=e.className.substr(9,2)),this._data.setFullYear.apply(this._data,this._checkDateRange(this._year,this._month,this._day)),this._options.displayInSelect?(this._options.dayField.value=this._data.getDate(),this._options.monthField.value=this._data.getMonth()+1,this._options.yearField.value=this._data.getFullYear()):this._dataField.value=this._writeDateInFormat(),this._options.onSetDate&&this._options.onSetDate(this,{date:this._data})},_updateCal:function(e){"function"==typeof this._options.onMonthSelected&&this._options.onMonthSelected(this,{year:this._year,month:this._month}),this._updateMonth(e),this._showMonth()},_daysInMonth:function(e,t){var n=31;switch(t){case 2:n=0===e%400||0===e%4&&0!==e%100?29:28;break;case 4:case 6:case 9:case 11:n=30}return n},_updateMonth:function(e){e===void 0&&(e="0");var t=this._month+1,n=this._year;switch(e){case-1:if(1===t){if(n===this._yearMin)return;t=12,n--}else t--;this._year=n,this._month=t-1;break;case 1:if(12===t){if(n===this._yearMax)return;t=1,n++}else t++;this._year=n,this._month=t-1;break;default:}},_dateParsers:{"yyyy-mm-dd":"Y-m-d","yyyy/mm/dd":"Y/m/d","yy-mm-dd":"y-m-d","yy/mm/dd":"y/m/d","dd-mm-yyyy":"d-m-Y","dd/mm/yyyy":"d/m/Y","dd-mm-yy":"d-m-y","dd/mm/yy":"d/m/y","mm/dd/yyyy":"m/d/Y","mm-dd-yyyy":"m-d-Y"},_showMonth:function(){var e,t,n=this._month+1,i=this._year,o=this._daysInMonth(i,n),s=new Date(i,n-1,1).getDay(),r=this._options.startWeekDay||0;this._monthPrev.childNodes[0].className="change_month_prev",this._monthNext.childNodes[0].className="change_month_next",this._yearMin>i||i===this._yearMin&&this._monthMin>=n?this._monthPrev.childNodes[0].className="action_inactive":(i>this._yearMax||i===this._yearMax&&n>=this._monthMax)&&(this._monthNext.childNodes[0].className="action_inactive"),r&&Number(r)&&(r>s?s=7+r-s:s+=r);var a="";for(a+='<ul class="sapo_cal_header">',e=0;7>e;e++)a+="<li>"+this._options.wDay[e+(r+e>6?r-7:r)].substring(0,1)+"</li>";a+="</ul>";var l=0;if(a+="<ul>",s)for(t=r;s-r>t;t++)l||(a+="<ul>"),a+='<li class="sapo_cal_empty">&nbsp;</li>',l++;for(e=1;o>=e;e++){7===l&&(l=0,a+="<ul>");var h="sapo_cal_"+(2===(e+"").length?e:"0"+e);h+=i===this._yearMin&&n===this._monthMin&&this._dayMin>e||i===this._yearMax&&n===this._monthMax&&e>this._dayMax||i===this._yearMin&&this._monthMin>n||i===this._yearMax&&n>this._monthMax||this._yearMin>i||i>this._yearMax||this._options.validDayFn&&!this._options.validDayFn.call(this,new Date(i,n-1,e))?" sapo_cal_off":this._data.getFullYear()===i&&this._data.getMonth()===n-1&&e===this._day?" sapo_cal_on":"",a+='<li><a href="#" class="'+h+'">'+e+"</a></li>",l++,7===l&&(a+="</ul>")}if(7!==l){for(e=l;7>e;e++)a+='<li class="sapo_cal_empty">&nbsp;</li>';a+="</ul>"}a+="</ul>",this._monthContainer.innerHTML=a},_setActiveMonth:function(e){e===void 0&&(e=this._monthSelector);var t=e.childNodes.length;if(e.className&&e.className.match(/sapo_calmonth_/)){var i=this._year,o=e.className.substr(14,2);i===this._data.getFullYear()&&o===this._data.getMonth()+1?(n.addClassName(e,"sapo_cal_on"),n.removeClassName(e,"sapo_cal_off")):(n.removeClassName(e,"sapo_cal_on"),i===this._yearMin&&this._monthMin>o||i===this._yearMax&&o>this._monthMax||this._yearMin>i||i>this._yearMax?n.addClassName(e,"sapo_cal_off"):n.removeClassName(e,"sapo_cal_off"))}else if(0!==t)for(var s=0;t>s;s++)this._setActiveMonth(e.childNodes[s])},lang:function(e){this._lang=e},showMonth:function(){this._showMonth()},isMonthRendered:function(){var e=o.select(".sapo_cal_header",this._containerObject)[0];return"none"!==n.getStyle(e.parentNode,"display")&&"none"!==n.getStyle(e.parentNode.parentNode,"display")}},a});
Ink.createModule("Ink.UI.Close","1",["Ink.Dom.Event_1","Ink.Dom.Element_1"],function(e,t){"use strict";var n=function(){e.observe(document.body,"click",function(n){var i=e.element(n);if(i=t.findUpwardsByClass(i,"ink-close")||t.findUpwardsByClass(i,"ink-dismiss")){var o=i;o=t.findUpwardsByClass(i,"ink-alert")||t.findUpwardsByClass(i,"ink-alert-block"),o&&(e.stop(n),t.remove(o))}})};return n});
Ink.createModule("Ink.UI.Pagination","1",["Ink.UI.Aux_1","Ink.Dom.Event_1","Ink.Dom.Css_1","Ink.Dom.Element_1","Ink.Dom.Selector_1"],function(e,t,n,i,o){"use strict";var s=function(e){var t=document.createElement("a");return t.setAttribute("href","#"),t.innerHTML=e,t},r=function(t,n){if(this._options=Ink.extendObj({size:void 0,start:1,firstLabel:"First",lastLabel:"Last",previousLabel:"Previous",nextLabel:"Next",onChange:void 0,setHash:!1,hashParameter:"page"},n||{}),this._options.previousPageLabel||(this._options.previousPageLabel="Previous "+this._options.maxSize),this._options.nextPageLabel||(this._options.nextPageLabel="Next "+this._options.maxSize),this._handlers={click:Ink.bindEvent(this._onClick,this)},this._element=e.elOrSelector(t,"1st argument"),!e.isInteger(this._options.size))throw new TypeError("size option is a required integer!");if(!e.isInteger(this._options.start)&&this._options.start>0&&this._options.start<=this._options.size)throw new TypeError("start option is a required integer between 1 and size!");if(this._options.maxSize&&!e.isInteger(this._options.maxSize)&&this._options.maxSize>0)throw new TypeError("maxSize option is a positive integer!");if(0>this._options.size)throw new RangeError("size option must be equal or more than 0!");if(void 0!==this._options.onChange&&"function"!=typeof this._options.onChange)throw new TypeError("onChange option must be a function!");this._current=this._options.start-1,this._itemLiEls=[],this._init()};return r.prototype={_init:function(){this._generateMarkup(this._element),this._updateItems(),this._observe(),e.registerInstance(this,this._element,"pagination")},_observe:function(){t.observe(this._element,"click",this._handlers.click)},_updateItems:function(){var e,t,i,o=this._itemLiEls,r=this._options.size===o.length;if(r)for(e=0,t=this._options.size;t>e;++e)n.setClassName(o[e],"active",e===this._current);else{for(e=o.length-1;e>=0;--e)this._ulEl.removeChild(o[e]);for(o=[],e=0,t=this._options.size;t>e;++e)i=document.createElement("li"),i.appendChild(s(e+1)),n.setClassName(i,"active",e===this._current),this._ulEl.insertBefore(i,this._nextEl),o.push(i);this._itemLiEls=o}if(this._options.maxSize){var a=Math.floor(this._current/this._options.maxSize),l=this._options.maxSize*a,h=l+this._options.maxSize-1;for(e=0,t=this._options.size;t>e;++e)i=o[e],n.setClassName(i,"hide-all",l>e||e>h);this._pageStart=l,this._pageEnd=h,this._page=a,n.setClassName(this._prevPageEl,"disabled",!this.hasPreviousPage()),n.setClassName(this._nextPageEl,"disabled",!this.hasNextPage()),n.setClassName(this._firstEl,"disabled",this.isFirst()),n.setClassName(this._lastEl,"disabled",this.isLast())}n.setClassName(this._prevEl,"disabled",!this.hasPrevious()),n.setClassName(this._nextEl,"disabled",!this.hasNext())},_generateMarkup:function(e){n.addClassName(e,"ink-navigation");var t,i,r=!1;1>(t=o.select("ul.pagination",e)).length?(t=document.createElement("ul"),n.addClassName(t,"pagination")):(r=!0,t=t[0]),this._options.maxSize&&(i=document.createElement("li"),i.appendChild(s(this._options.firstLabel)),this._firstEl=i,n.addClassName(i,"first"),t.appendChild(i),i=document.createElement("li"),i.appendChild(s(this._options.previousPageLabel)),this._prevPageEl=i,n.addClassName(i,"previousPage"),t.appendChild(i)),i=document.createElement("li"),i.appendChild(s(this._options.previousLabel)),this._prevEl=i,n.addClassName(i,"previous"),t.appendChild(i),i=document.createElement("li"),i.appendChild(s(this._options.nextLabel)),this._nextEl=i,n.addClassName(i,"next"),t.appendChild(i),this._options.maxSize&&(i=document.createElement("li"),i.appendChild(s(this._options.nextPageLabel)),this._nextPageEl=i,n.addClassName(i,"nextPage"),t.appendChild(i),i=document.createElement("li"),i.appendChild(s(this._options.lastLabel)),this._lastEl=i,n.addClassName(i,"last"),t.appendChild(i)),r||e.appendChild(t),this._ulEl=t},_onClick:function(e){t.stop(e);var i=t.element(e);if("a"!==i.nodeName.toLowerCase()){do i=i.parentNode;while("a"!==i.nodeName.toLowerCase()&&i!==this._element);if(i===this._element)return}var o=i.parentNode;if("li"===o.nodeName.toLowerCase()&&!n.hasClassName(o,"active")&&!n.hasClassName(o,"disabled")){var s=n.hasClassName(o,"previous"),r=n.hasClassName(o,"next"),a=n.hasClassName(o,"previousPage"),l=n.hasClassName(o,"nextPage"),h=n.hasClassName(o,"first"),d=n.hasClassName(o,"last");if(h)this.setCurrent(0);else if(d)this.setCurrent(this._options.size-1);else if(a||l)this.setCurrent((a?-1:1)*this._options.maxSize,!0);else if(s||r)this.setCurrent(s?-1:1,!0);else{var c=parseInt(i.innerHTML,10)-1;this.setCurrent(c)}}},setSize:function(t){if(!e.isInteger(t))throw new TypeError("1st argument must be an integer number!");this._options.size=t,this._updateItems(),this._current=0},setCurrent:function(t,n){if(!e.isInteger(t))throw new TypeError("1st argument must be an integer number!");n&&(t+=this._current),0>t?t=0:t>this._options.size-1&&(t=this._options.size-1),this._current=t,this._updateItems(),this._options.onChange&&this._options.onChange(this)},getSize:function(){return this._options.size},getCurrent:function(){return this._current},isFirst:function(){return 0===this._current},isLast:function(){return this._current===this._options.size-1},hasPrevious:function(){return this._current>0},hasNext:function(){return this._current<this._options.size-1},hasPreviousPage:function(){return this._options.maxSize&&this._current>this._options.maxSize-1},hasNextPage:function(){return this._options.maxSize&&this._options.size-this._current>=this._options.maxSize+1},destroy:e.destroyComponent},r});
Ink.createModule("Ink.UI.ProgressBar","1",["Ink.Dom.Selector_1","Ink.Dom.Element_1"],function(e,t){"use strict";var n=function(n,i){if("object"!=typeof n){if("string"!=typeof n)throw"[Ink.UI.ProgressBar] :: Invalid selector";if(this._element=e.select(n),1>this._element.length)throw"[Ink.UI.ProgressBar] :: Selector didn't find any elements";this._element=this._element[0]}else this._element=n;this._options=Ink.extendObj({startValue:0,onStart:function(){},onEnd:function(){}},t.data(this._element)),this._options=Ink.extendObj(this._options,i||{}),this._value=this._options.startValue,this._init()};return n.prototype={_init:function(){if(this._elementBar=e.select(".bar",this._element),1>this._elementBar.length)throw"[Ink.UI.ProgressBar] :: Bar element not found";this._elementBar=this._elementBar[0],this._options.onStart=Ink.bind(this._options.onStart,this),this._options.onEnd=Ink.bind(this._options.onEnd,this),this.setValue(this._options.startValue)},setValue:function(e){this._options.onStart(this._value),e=parseInt(e,10),isNaN(e)||0>e?e=0:e>100&&(e=100),this._value=e,this._elementBar.style.width=this._value+"%",this._options.onEnd(this._value)}},n});
( function(){
    var autoload = {

        /***************************
         * DatePicker - Default CSS selector is .ink-datepicker
         ***************************/
        'DatePicker_1': '.ink-datepicker',

        /***************************
         * Gallery - Default CSS selector is ul.ink-gallery-source
         ***************************/
        'Gallery_1': 'ul.ink-gallery-source',

        /***************************
         * Modal - Default CSS selector is .ink-modal
         ***************************/
         'Modal_1': '.ink-modal',

        /***************************
         * ProgressBar - Default CSS selector is .ink-progress-bar
         ***************************/
         'ProgressBar_1': '.ink-progress-bar',

        /***************************
         * SortableList - Default CSS selector is .ink-sortable-list
         ***************************/
         'SortableList_1': '.ink-sortable-list',

        /***************************
         * Spy - Default CSS selector is *[data-spy="true"]
         ***************************/
         'Spy_1': '*[data-spy="true"]',

        /***************************
         * Sticky - Default CSS selector is .ink-navigation.sticky
         ***************************/
         'Sticky_1': '.ink-navigation.sticky',

        /***************************
         * Table - Default CSS selector is .ink-table
         ***************************/
         'Table_1': '.ink-table',

        /***************************
         * Tabs - Default CSS selector is .ink-tabs
         ***************************/
         'Tabs_1': '.ink-tabs',

        /***************************
         * TreeView - Default CSS selector is .ink-tree-view
         ***************************/
         'TreeView_1': '.ink-tree-view',

        /***************************
         * Toggle - Default CSS selector is .toggle
         ***************************/
         'Toggle_1': '.toggle'

    };

    Ink.requireModules(['Ink.Dom.Selector_1', 'Ink.Dom.Loaded_1', 'Ink.Util.Array_1', 'Ink.UI.SmoothScroller_1', 'Ink.UI.Close_1'],
        function( Selector, Loaded, InkArray, Scroller, Close ){

        var elements;
        var fn = function( Component ) {
            InkArray.each(elements, function( element ){
                new Component(element);
            });
        };

        Loaded.run(function(){
            for( var mod in autoload ){
                if( !autoload.hasOwnProperty(mod) ){
                    continue;
                }
                elements = Selector.select( autoload[mod] );
                if( elements.length ){
                    Ink.requireModules( ['Ink.UI.' + mod ], fn);
                }
            }
            Scroller.init();
            new Close();
        });
    });
})();
/**
* @preserve HTML5 Shiv v3.6.2pre | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/

;(function(window, document) {
/*jshint evil:true */
  /** version */
  var version = '3.6.2pre';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }
  
    /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/\w+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

}(this, document));
/*
Copyright 2012 Igor Vaynberg

Version: 3.4.2 Timestamp: Mon Aug 12 15:04:12 PDT 2013

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

    http://www.apache.org/licenses/LICENSE-2.0
    http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL Licesnse is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/

(function ($) {
    if(typeof $.fn.each2 == "undefined") {
        $.extend($.fn, {
            /*
            * 4-10 times faster .each replacement
            * use it carefully, as it overrides jQuery context of element on each iteration
            */
            each2 : function (c) {
                var j = $([0]), i = -1, l = this.length;
                while (
                    ++i < l
                    && (j.context = j[0] = this[i])
                    && c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
                );
                return this;
            }
        });
    }
})(jQuery);

(function ($, undefined) {
    "use strict";
    /*global document, window, jQuery, console */

    if (window.Select2 !== undefined) {
        return;
    }

    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,
        lastMousePosition={x:0,y:0}, $document, scrollBarDimensions,

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (e) {
            var k = e.which;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }

            if (e.metaKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    },
    MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>",

    DIACRITICS = {"\u24B6":"A","\uFF21":"A","\u00C0":"A","\u00C1":"A","\u00C2":"A","\u1EA6":"A","\u1EA4":"A","\u1EAA":"A","\u1EA8":"A","\u00C3":"A","\u0100":"A","\u0102":"A","\u1EB0":"A","\u1EAE":"A","\u1EB4":"A","\u1EB2":"A","\u0226":"A","\u01E0":"A","\u00C4":"A","\u01DE":"A","\u1EA2":"A","\u00C5":"A","\u01FA":"A","\u01CD":"A","\u0200":"A","\u0202":"A","\u1EA0":"A","\u1EAC":"A","\u1EB6":"A","\u1E00":"A","\u0104":"A","\u023A":"A","\u2C6F":"A","\uA732":"AA","\u00C6":"AE","\u01FC":"AE","\u01E2":"AE","\uA734":"AO","\uA736":"AU","\uA738":"AV","\uA73A":"AV","\uA73C":"AY","\u24B7":"B","\uFF22":"B","\u1E02":"B","\u1E04":"B","\u1E06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24B8":"C","\uFF23":"C","\u0106":"C","\u0108":"C","\u010A":"C","\u010C":"C","\u00C7":"C","\u1E08":"C","\u0187":"C","\u023B":"C","\uA73E":"C","\u24B9":"D","\uFF24":"D","\u1E0A":"D","\u010E":"D","\u1E0C":"D","\u1E10":"D","\u1E12":"D","\u1E0E":"D","\u0110":"D","\u018B":"D","\u018A":"D","\u0189":"D","\uA779":"D","\u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz","\u01C5":"Dz","\u24BA":"E","\uFF25":"E","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u1EC0":"E","\u1EBE":"E","\u1EC4":"E","\u1EC2":"E","\u1EBC":"E","\u0112":"E","\u1E14":"E","\u1E16":"E","\u0114":"E","\u0116":"E","\u00CB":"E","\u1EBA":"E","\u011A":"E","\u0204":"E","\u0206":"E","\u1EB8":"E","\u1EC6":"E","\u0228":"E","\u1E1C":"E","\u0118":"E","\u1E18":"E","\u1E1A":"E","\u0190":"E","\u018E":"E","\u24BB":"F","\uFF26":"F","\u1E1E":"F","\u0191":"F","\uA77B":"F","\u24BC":"G","\uFF27":"G","\u01F4":"G","\u011C":"G","\u1E20":"G","\u011E":"G","\u0120":"G","\u01E6":"G","\u0122":"G","\u01E4":"G","\u0193":"G","\uA7A0":"G","\uA77D":"G","\uA77E":"G","\u24BD":"H","\uFF28":"H","\u0124":"H","\u1E22":"H","\u1E26":"H","\u021E":"H","\u1E24":"H","\u1E28":"H","\u1E2A":"H","\u0126":"H","\u2C67":"H","\u2C75":"H","\uA78D":"H","\u24BE":"I","\uFF29":"I","\u00CC":"I","\u00CD":"I","\u00CE":"I","\u0128":"I","\u012A":"I","\u012C":"I","\u0130":"I","\u00CF":"I","\u1E2E":"I","\u1EC8":"I","\u01CF":"I","\u0208":"I","\u020A":"I","\u1ECA":"I","\u012E":"I","\u1E2C":"I","\u0197":"I","\u24BF":"J","\uFF2A":"J","\u0134":"J","\u0248":"J","\u24C0":"K","\uFF2B":"K","\u1E30":"K","\u01E8":"K","\u1E32":"K","\u0136":"K","\u1E34":"K","\u0198":"K","\u2C69":"K","\uA740":"K","\uA742":"K","\uA744":"K","\uA7A2":"K","\u24C1":"L","\uFF2C":"L","\u013F":"L","\u0139":"L","\u013D":"L","\u1E36":"L","\u1E38":"L","\u013B":"L","\u1E3C":"L","\u1E3A":"L","\u0141":"L","\u023D":"L","\u2C62":"L","\u2C60":"L","\uA748":"L","\uA746":"L","\uA780":"L","\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uFF2D":"M","\u1E3E":"M","\u1E40":"M","\u1E42":"M","\u2C6E":"M","\u019C":"M","\u24C3":"N","\uFF2E":"N","\u01F8":"N","\u0143":"N","\u00D1":"N","\u1E44":"N","\u0147":"N","\u1E46":"N","\u0145":"N","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u019D":"N","\uA790":"N","\uA7A4":"N","\u01CA":"NJ","\u01CB":"Nj","\u24C4":"O","\uFF2F":"O","\u00D2":"O","\u00D3":"O","\u00D4":"O","\u1ED2":"O","\u1ED0":"O","\u1ED6":"O","\u1ED4":"O","\u00D5":"O","\u1E4C":"O","\u022C":"O","\u1E4E":"O","\u014C":"O","\u1E50":"O","\u1E52":"O","\u014E":"O","\u022E":"O","\u0230":"O","\u00D6":"O","\u022A":"O","\u1ECE":"O","\u0150":"O","\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1EDC":"O","\u1EDA":"O","\u1EE0":"O","\u1EDE":"O","\u1EE2":"O","\u1ECC":"O","\u1ED8":"O","\u01EA":"O","\u01EC":"O","\u00D8":"O","\u01FE":"O","\u0186":"O","\u019F":"O","\uA74A":"O","\uA74C":"O","\u01A2":"OI","\uA74E":"OO","\u0222":"OU","\u24C5":"P","\uFF30":"P","\u1E54":"P","\u1E56":"P","\u01A4":"P","\u2C63":"P","\uA750":"P","\uA752":"P","\uA754":"P","\u24C6":"Q","\uFF31":"Q","\uA756":"Q","\uA758":"Q","\u024A":"Q","\u24C7":"R","\uFF32":"R","\u0154":"R","\u1E58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1E5A":"R","\u1E5C":"R","\u0156":"R","\u1E5E":"R","\u024C":"R","\u2C64":"R","\uA75A":"R","\uA7A6":"R","\uA782":"R","\u24C8":"S","\uFF33":"S","\u1E9E":"S","\u015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u0160":"S","\u1E66":"S","\u1E62":"S","\u1E68":"S","\u0218":"S","\u015E":"S","\u2C7E":"S","\uA7A8":"S","\uA784":"S","\u24C9":"T","\uFF34":"T","\u1E6A":"T","\u0164":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\u1E70":"T","\u1E6E":"T","\u0166":"T","\u01AC":"T","\u01AE":"T","\u023E":"T","\uA786":"T","\uA728":"TZ","\u24CA":"U","\uFF35":"U","\u00D9":"U","\u00DA":"U","\u00DB":"U","\u0168":"U","\u1E78":"U","\u016A":"U","\u1E7A":"U","\u016C":"U","\u00DC":"U","\u01DB":"U","\u01D7":"U","\u01D5":"U","\u01D9":"U","\u1EE6":"U","\u016E":"U","\u0170":"U","\u01D3":"U","\u0214":"U","\u0216":"U","\u01AF":"U","\u1EEA":"U","\u1EE8":"U","\u1EEE":"U","\u1EEC":"U","\u1EF0":"U","\u1EE4":"U","\u1E72":"U","\u0172":"U","\u1E76":"U","\u1E74":"U","\u0244":"U","\u24CB":"V","\uFF36":"V","\u1E7C":"V","\u1E7E":"V","\u01B2":"V","\uA75E":"V","\u0245":"V","\uA760":"VY","\u24CC":"W","\uFF37":"W","\u1E80":"W","\u1E82":"W","\u0174":"W","\u1E86":"W","\u1E84":"W","\u1E88":"W","\u2C72":"W","\u24CD":"X","\uFF38":"X","\u1E8A":"X","\u1E8C":"X","\u24CE":"Y","\uFF39":"Y","\u1EF2":"Y","\u00DD":"Y","\u0176":"Y","\u1EF8":"Y","\u0232":"Y","\u1E8E":"Y","\u0178":"Y","\u1EF6":"Y","\u1EF4":"Y","\u01B3":"Y","\u024E":"Y","\u1EFE":"Y","\u24CF":"Z","\uFF3A":"Z","\u0179":"Z","\u1E90":"Z","\u017B":"Z","\u017D":"Z","\u1E92":"Z","\u1E94":"Z","\u01B5":"Z","\u0224":"Z","\u2C7F":"Z","\u2C6B":"Z","\uA762":"Z","\u24D0":"a","\uFF41":"a","\u1E9A":"a","\u00E0":"a","\u00E1":"a","\u00E2":"a","\u1EA7":"a","\u1EA5":"a","\u1EAB":"a","\u1EA9":"a","\u00E3":"a","\u0101":"a","\u0103":"a","\u1EB1":"a","\u1EAF":"a","\u1EB5":"a","\u1EB3":"a","\u0227":"a","\u01E1":"a","\u00E4":"a","\u01DF":"a","\u1EA3":"a","\u00E5":"a","\u01FB":"a","\u01CE":"a","\u0201":"a","\u0203":"a","\u1EA1":"a","\u1EAD":"a","\u1EB7":"a","\u1E01":"a","\u0105":"a","\u2C65":"a","\u0250":"a","\uA733":"aa","\u00E6":"ae","\u01FD":"ae","\u01E3":"ae","\uA735":"ao","\uA737":"au","\uA739":"av","\uA73B":"av","\uA73D":"ay","\u24D1":"b","\uFF42":"b","\u1E03":"b","\u1E05":"b","\u1E07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24D2":"c","\uFF43":"c","\u0107":"c","\u0109":"c","\u010B":"c","\u010D":"c","\u00E7":"c","\u1E09":"c","\u0188":"c","\u023C":"c","\uA73F":"c","\u2184":"c","\u24D3":"d","\uFF44":"d","\u1E0B":"d","\u010F":"d","\u1E0D":"d","\u1E11":"d","\u1E13":"d","\u1E0F":"d","\u0111":"d","\u018C":"d","\u0256":"d","\u0257":"d","\uA77A":"d","\u01F3":"dz","\u01C6":"dz","\u24D4":"e","\uFF45":"e","\u00E8":"e","\u00E9":"e","\u00EA":"e","\u1EC1":"e","\u1EBF":"e","\u1EC5":"e","\u1EC3":"e","\u1EBD":"e","\u0113":"e","\u1E15":"e","\u1E17":"e","\u0115":"e","\u0117":"e","\u00EB":"e","\u1EBB":"e","\u011B":"e","\u0205":"e","\u0207":"e","\u1EB9":"e","\u1EC7":"e","\u0229":"e","\u1E1D":"e","\u0119":"e","\u1E19":"e","\u1E1B":"e","\u0247":"e","\u025B":"e","\u01DD":"e","\u24D5":"f","\uFF46":"f","\u1E1F":"f","\u0192":"f","\uA77C":"f","\u24D6":"g","\uFF47":"g","\u01F5":"g","\u011D":"g","\u1E21":"g","\u011F":"g","\u0121":"g","\u01E7":"g","\u0123":"g","\u01E5":"g","\u0260":"g","\uA7A1":"g","\u1D79":"g","\uA77F":"g","\u24D7":"h","\uFF48":"h","\u0125":"h","\u1E23":"h","\u1E27":"h","\u021F":"h","\u1E25":"h","\u1E29":"h","\u1E2B":"h","\u1E96":"h","\u0127":"h","\u2C68":"h","\u2C76":"h","\u0265":"h","\u0195":"hv","\u24D8":"i","\uFF49":"i","\u00EC":"i","\u00ED":"i","\u00EE":"i","\u0129":"i","\u012B":"i","\u012D":"i","\u00EF":"i","\u1E2F":"i","\u1EC9":"i","\u01D0":"i","\u0209":"i","\u020B":"i","\u1ECB":"i","\u012F":"i","\u1E2D":"i","\u0268":"i","\u0131":"i","\u24D9":"j","\uFF4A":"j","\u0135":"j","\u01F0":"j","\u0249":"j","\u24DA":"k","\uFF4B":"k","\u1E31":"k","\u01E9":"k","\u1E33":"k","\u0137":"k","\u1E35":"k","\u0199":"k","\u2C6A":"k","\uA741":"k","\uA743":"k","\uA745":"k","\uA7A3":"k","\u24DB":"l","\uFF4C":"l","\u0140":"l","\u013A":"l","\u013E":"l","\u1E37":"l","\u1E39":"l","\u013C":"l","\u1E3D":"l","\u1E3B":"l","\u017F":"l","\u0142":"l","\u019A":"l","\u026B":"l","\u2C61":"l","\uA749":"l","\uA781":"l","\uA747":"l","\u01C9":"lj","\u24DC":"m","\uFF4D":"m","\u1E3F":"m","\u1E41":"m","\u1E43":"m","\u0271":"m","\u026F":"m","\u24DD":"n","\uFF4E":"n","\u01F9":"n","\u0144":"n","\u00F1":"n","\u1E45":"n","\u0148":"n","\u1E47":"n","\u0146":"n","\u1E4B":"n","\u1E49":"n","\u019E":"n","\u0272":"n","\u0149":"n","\uA791":"n","\uA7A5":"n","\u01CC":"nj","\u24DE":"o","\uFF4F":"o","\u00F2":"o","\u00F3":"o","\u00F4":"o","\u1ED3":"o","\u1ED1":"o","\u1ED7":"o","\u1ED5":"o","\u00F5":"o","\u1E4D":"o","\u022D":"o","\u1E4F":"o","\u014D":"o","\u1E51":"o","\u1E53":"o","\u014F":"o","\u022F":"o","\u0231":"o","\u00F6":"o","\u022B":"o","\u1ECF":"o","\u0151":"o","\u01D2":"o","\u020D":"o","\u020F":"o","\u01A1":"o","\u1EDD":"o","\u1EDB":"o","\u1EE1":"o","\u1EDF":"o","\u1EE3":"o","\u1ECD":"o","\u1ED9":"o","\u01EB":"o","\u01ED":"o","\u00F8":"o","\u01FF":"o","\u0254":"o","\uA74B":"o","\uA74D":"o","\u0275":"o","\u01A3":"oi","\u0223":"ou","\uA74F":"oo","\u24DF":"p","\uFF50":"p","\u1E55":"p","\u1E57":"p","\u01A5":"p","\u1D7D":"p","\uA751":"p","\uA753":"p","\uA755":"p","\u24E0":"q","\uFF51":"q","\u024B":"q","\uA757":"q","\uA759":"q","\u24E1":"r","\uFF52":"r","\u0155":"r","\u1E59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1E5B":"r","\u1E5D":"r","\u0157":"r","\u1E5F":"r","\u024D":"r","\u027D":"r","\uA75B":"r","\uA7A7":"r","\uA783":"r","\u24E2":"s","\uFF53":"s","\u00DF":"s","\u015B":"s","\u1E65":"s","\u015D":"s","\u1E61":"s","\u0161":"s","\u1E67":"s","\u1E63":"s","\u1E69":"s","\u0219":"s","\u015F":"s","\u023F":"s","\uA7A9":"s","\uA785":"s","\u1E9B":"s","\u24E3":"t","\uFF54":"t","\u1E6B":"t","\u1E97":"t","\u0165":"t","\u1E6D":"t","\u021B":"t","\u0163":"t","\u1E71":"t","\u1E6F":"t","\u0167":"t","\u01AD":"t","\u0288":"t","\u2C66":"t","\uA787":"t","\uA729":"tz","\u24E4":"u","\uFF55":"u","\u00F9":"u","\u00FA":"u","\u00FB":"u","\u0169":"u","\u1E79":"u","\u016B":"u","\u1E7B":"u","\u016D":"u","\u00FC":"u","\u01DC":"u","\u01D8":"u","\u01D6":"u","\u01DA":"u","\u1EE7":"u","\u016F":"u","\u0171":"u","\u01D4":"u","\u0215":"u","\u0217":"u","\u01B0":"u","\u1EEB":"u","\u1EE9":"u","\u1EEF":"u","\u1EED":"u","\u1EF1":"u","\u1EE5":"u","\u1E73":"u","\u0173":"u","\u1E77":"u","\u1E75":"u","\u0289":"u","\u24E5":"v","\uFF56":"v","\u1E7D":"v","\u1E7F":"v","\u028B":"v","\uA75F":"v","\u028C":"v","\uA761":"vy","\u24E6":"w","\uFF57":"w","\u1E81":"w","\u1E83":"w","\u0175":"w","\u1E87":"w","\u1E85":"w","\u1E98":"w","\u1E89":"w","\u2C73":"w","\u24E7":"x","\uFF58":"x","\u1E8B":"x","\u1E8D":"x","\u24E8":"y","\uFF59":"y","\u1EF3":"y","\u00FD":"y","\u0177":"y","\u1EF9":"y","\u0233":"y","\u1E8F":"y","\u00FF":"y","\u1EF7":"y","\u1E99":"y","\u1EF5":"y","\u01B4":"y","\u024F":"y","\u1EFF":"y","\u24E9":"z","\uFF5A":"z","\u017A":"z","\u1E91":"z","\u017C":"z","\u017E":"z","\u1E93":"z","\u1E95":"z","\u01B6":"z","\u0225":"z","\u0240":"z","\u2C6C":"z","\uA763":"z"};

    $document = $(document);

    nextUid=(function() { var counter=1; return function() { return counter++; }; }());


    function stripDiacritics(str) {
        var ret, i, l, c;

        if (!str || str.length < 1) return str;

        ret = "";
        for (i = 0, l = str.length; i < l; i++) {
            c = str.charAt(i);
            ret += DIACRITICS[c] || c;
        }
        return ret;
    }

    function indexOf(value, array) {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) {
            if (equal(value, array[i])) return i;
        }
        return -1;
    }

    function measureScrollbar () {
        var $template = $( MEASURE_SCROLLBAR_TEMPLATE );
        $template.appendTo('body');

        var dim = {
            width: $template.width() - $template[0].clientWidth,
            height: $template.height() - $template[0].clientHeight
        };
        $template.remove();

        return dim;
    }

    /**
     * Compares equality of a and b
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        // Check whether 'a' or 'b' is a string (primitive or object).
        // The concatenation of an empty string (+'') converts its argument to a string's primitive.
        if (a.constructor === String) return a+'' === b+''; // a+'' - in case 'a' is a String object
        if (b.constructor === String) return b+'' === a+''; // b+'' - in case 'b' is a String object
        return false;
    }

    /**
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth(false) - element.width();
    }

    function installKeyUpChangeEvent(element) {
        var key="keyup-change-value";
        element.on("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.on("keyup", function () {
            var val= $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }

    $document.on("mousemove", function (e) {
        lastMousePosition.x = e.pageX;
        lastMousePosition.y = e.pageY;
    });

    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
        element.on("mousemove", function (e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }

    /**
     * A simple implementation of a thunk
     * @param formula function used to lazily initialize the thunk
     * @return {Function}
     */
    function thunk(formula) {
        var evaluated = false,
            value;
        return function() {
            if (evaluated === false) { value = formula(); evaluated = true; }
            return value;
        };
    };

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.on("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function focus($el) {
        if ($el[0] === document.activeElement) return;

        /* set the focus in a 0 timeout - that way the focus is set after the processing
            of the current event has finished - which seems like the only reliable way
            to set focus */
        window.setTimeout(function() {
            var el=$el[0], pos=$el.val().length, range;

            $el.focus();

            /* make sure el received focus so we do not error out when trying to manipulate the caret.
                sometimes modals or others listeners may steal it after its set */
            if ($el.is(":visible") && el === document.activeElement) {

                /* after the focus is set move the caret to the end, necessary when we val()
                    just before setting focus */
                if(el.setSelectionRange)
                {
                    el.setSelectionRange(pos, pos);
                }
                else if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }
        }, 0);
    }

    function getCursorInfo(el) {
        el = $(el)[0];
        var offset = 0;
        var length = 0;
        if ('selectionStart' in el) {
            offset = el.selectionStart;
            length = el.selectionEnd - offset;
        } else if ('selection' in document) {
            el.focus();
            var sel = document.selection.createRange();
            length = document.selection.createRange().text.length;
            sel.moveStart('character', -el.value.length);
            offset = sel.text.length - length;
        }
        return { offset: offset, length: length };
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function measureTextWidth(e) {
        if (!sizer){
            var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
            sizer = $(document.createElement("div")).css({
                position: "absolute",
                left: "-10000px",
                top: "-10000px",
                display: "none",
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                fontStyle: style.fontStyle,
                fontWeight: style.fontWeight,
                letterSpacing: style.letterSpacing,
                textTransform: style.textTransform,
                whiteSpace: "nowrap"
            });
            sizer.attr("class","select2-sizer");
            $("body").append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }

    function syncCssClasses(dest, src, adapter) {
        var classes, replacements = [], adapted;

        classes = dest.attr("class");
        if (classes) {
            classes = '' + classes; // for IE which returns object
            $(classes.split(" ")).each2(function() {
                if (this.indexOf("select2-") === 0) {
                    replacements.push(this);
                }
            });
        }
        classes = src.attr("class");
        if (classes) {
            classes = '' + classes; // for IE which returns object
            $(classes.split(" ")).each2(function() {
                if (this.indexOf("select2-") !== 0) {
                    adapted = adapter(this);
                    if (adapted) {
                        replacements.push(this);
                    }
                }
            });
        }
        dest.attr("class", replacements.join(" "));
    }


    function markMatch(text, term, markup, escapeMarkup) {
        var match=stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())),
            tl=term.length;

        if (match<0) {
            markup.push(escapeMarkup(text));
            return;
        }

        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    }

    function defaultEscapeMarkup(markup) {
        var replace_map = {
            '\\': '&#92;',
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#47;'
        };

        return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
            return replace_map[match];
        });
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration paramters
     * @param options.params parameter map for the transport ajax call, can contain such options as cache, jsonpCallback, etc. see $.ajax
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            handler = null,
            quietMillis = options.quietMillis || 100,
            ajaxUrl = options.url,
            self = this;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                var data = options.data, // ajax data function
                    url = ajaxUrl, // ajax url string or function
                    transport = options.transport || $.fn.select2.ajaxDefaults.transport,
                    // deprecated - to be removed in 4.0  - use params instead
                    deprecated = {
                        type: options.type || 'GET', // set type of request (GET or POST)
                        cache: options.cache || false,
                        jsonpCallback: options.jsonpCallback||undefined,
                        dataType: options.dataType||"json"
                    },
                    params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);

                data = data ? data.call(self, query.term, query.page, query.context) : null;
                url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;

                if (handler) { handler.abort(); }

                if (options.params) {
                    if ($.isFunction(options.params)) {
                        $.extend(params, options.params.call(self));
                    } else {
                        $.extend(params, options.params);
                    }
                }

                $.extend(params, {
                    url: url,
                    dataType: options.dataType,
                    data: data,
                    success: function (data) {
                        // TODO - replace query.page with query so users have access to term, page, etc.
                        var results = options.results(data, query.page);
                        query.callback(results);
                    }
                });
                handler = transport.call(self, params);
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used ti is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            dataText,
            tmp,
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

         if ($.isArray(data)) {
            tmp = data;
            data = { results: tmp };
        }

         if ($.isFunction(data) === false) {
            tmp = data;
            data = function() { return tmp; };
        }

        var dataItem = data();
        if (dataItem.text) {
            text = dataItem.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) {
                dataText = dataItem.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                text = function (item) { return item[dataText]; };
            }
        }

        return function (query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
                query.callback(data());
                return;
            }

            process = function(datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
                    }
                    group.children=[];
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
                    if (group.children.length || query.matcher(t, text(group), datum)) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum), datum)) {
                        collection.push(datum);
                    }
                }
            };

            $(data().results).each2(function(i, datum) { process(datum, filtered.results); });
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        var isFunc = $.isFunction(data);
        return function (query) {
            var t = query.term, filtered = {results: []};
            $(isFunc ? data() : data).each(function () {
                var isObject = this.text !== undefined,
                    text = isObject ? this.text : this;
                if (t === "" || query.matcher(t, text)) {
                    filtered.results.push(isObject ? this : {id: this, text: this});
                }
            });
            query.callback(filtered);
        };
    }

    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return true;
        if (!formatter) return false;
        throw new Error(formatterName +" must be a function or a falsy value");
    }

    function evaluate(val) {
        return $.isFunction(val) ? val() : val;
    }

    function countResults(results) {
        var count = 0;
        $.each(results, function(i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }

    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator; // the matched separator

        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

        while (true) {
            index = -1;

            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0) break;
            }

            if (index < 0) break; // did not find any token separator in the input string, bail

            token = input.substring(0, index);
            input = input.substring(index + separator.length);

            if (token.length > 0) {
                token = opts.createSearchChoice.call(this, token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true; break;
                        }
                    }

                    if (!dupe) selectCallback(token);
                }
            }
        }

        if (original!==input) return input;
    }

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        // abstract
        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        // abstract
        init: function (opts) {
            var results, search, resultsSelector = ".select2-results", disabled, readonly;

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined &&
                opts.element.data("select2") !== null) {
                opts.element.data("select2").destroy();
            }

            this.container = this.createContainer();

            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
            this.containerSelector="#"+this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);

            // cache the body so future lookups are cheap
            this.body = thunk(function() { return opts.element.closest("body"); });

            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);

            this.container.attr("style", opts.element.attr("style"));
            this.container.css(evaluate(opts.containerCss));
            this.container.addClass(evaluate(opts.containerCssClass));

            this.elementTabIndex = this.opts.element.attr("tabindex");

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .attr("tabindex", "-1")
                .before(this.container);
            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");
            this.dropdown.addClass(evaluate(opts.dropdownCssClass));
            this.dropdown.data("select2", this);

            syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);

            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");

            this.queryCount = 0;
            this.resultsPage = 0;
            this.context = null;

            // initialize the container
            this.initContainer();

            installFilteredMouseMove(this.results);
            this.dropdown.on("mousemove-filtered touchstart touchmove touchend", resultsSelector, this.bind(this.highlightUnderEvent));

            installDebouncedScroll(80, this.results);
            this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));

            // do not propagate change event from the search field out of the component
            $(this.container).on("change", ".select2-input", function(e) {e.stopPropagation();});
            $(this.dropdown).on("change", ".select2-input", function(e) {e.stopPropagation();});

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop(), height;
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.on("keyup-change input paste", this.bind(this.updateResults));
            search.on("focus", function () { search.addClass("select2-focused"); });
            search.on("blur", function () { search.removeClass("select2-focused");});

            this.dropdown.on("mouseup", resultsSelector, this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                }
            }));

            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want
            this.dropdown.on("click mouseup mousedown", function (e) { e.stopPropagation(); });

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }

            if (opts.maximumInputLength !== null) {
                this.search.attr("maxlength", opts.maximumInputLength);
            }

            var disabled = opts.element.prop("disabled");
            if (disabled === undefined) disabled = false;
            this.enable(!disabled);

            var readonly = opts.element.prop("readonly");
            if (readonly === undefined) readonly = false;
            this.readonly(readonly);

            // Calculate size of scrollbar
            scrollBarDimensions = scrollBarDimensions || measureScrollbar();

            this.autofocus = opts.element.prop("autofocus");
            opts.element.prop("autofocus", false);
            if (this.autofocus) this.focus();

            this.nextSearchTerm = undefined;
        },

        // abstract
        destroy: function () {
            var element=this.opts.element, select2 = element.data("select2");

            this.close();

            if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }

            if (select2 !== undefined) {
                select2.container.remove();
                select2.dropdown.remove();
                element
                    .removeClass("select2-offscreen")
                    .removeData("select2")
                    .off(".select2")
                    .prop("autofocus", this.autofocus || false);
                if (this.elementTabIndex) {
                    element.attr({tabindex: this.elementTabIndex});
                } else {
                    element.removeAttr("tabindex");
                }
                element.show();
            }
        },

        // abstract
        optionToData: function(element) {
            if (element.is("option")) {
                return {
                    id:element.prop("value"),
                    text:element.text(),
                    element: element.get(),
                    css: element.attr("class"),
                    disabled: element.prop("disabled"),
                    locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)
                };
            } else if (element.is("optgroup")) {
                return {
                    text:element.attr("label"),
                    children:[],
                    element: element.get(),
                    css: element.attr("class")
                };
            }
        },

        // abstract
        prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl, self = this;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                populateResults: function(container, results, query) {
                    var populate,  data, result, children, id=this.opts.id;

                    populate=function(results, container, depth) {

                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;

                        results = opts.sortResults(results, container, query);

                        for (i = 0, l = results.length; i < l; i = i + 1) {

                            result=results[i];

                            disabled = (result.disabled === true);
                            selectable = (!disabled) && (id(result) !== undefined);

                            compound=result.children && result.children.length > 0;

                            node=$("<li></li>");
                            node.addClass("select2-results-dept-"+depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (disabled) { node.addClass("select2-disabled"); }
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result));

                            label=$(document.createElement("div"));
                            label.addClass("select2-result-label");

                            formatted=opts.formatResult(result, label, query, self.opts.escapeMarkup);
                            if (formatted!==undefined) {
                                label.html(formatted);
                            }

                            node.append(label);

                            if (compound) {

                                innerContainer=$("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth+1);
                                node.append(innerContainer);
                            }

                            node.data("select2-data", result);
                            container.append(node);
                        }
                    };

                    populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if ($.isArray(opts.element.data("select2Tags"))) {
                if ("tags" in opts) {
                    throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                }
                opts.tags=opts.element.data("select2Tags");
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false },
                        term = query.term,
                        children, placeholderOption, process;

                    process=function(element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push(self.optionToData(element));
                            }
                        } else if (element.is("optgroup")) {
                            group=self.optionToData(element);
                            element.children().each2(function(i, elm) { process(elm, group.children); });
                            if (group.children.length>0) {
                                collection.push(group);
                            }
                        }
                    };

                    children=element.children();

                    // ignore the placeholder option if there is one
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        placeholderOption = this.getPlaceholderOption();
                        if (placeholderOption) {
                            children=children.not(placeholderOption);
                        }
                    }

                    children.each2(function(i, elm) { process(elm, data.results); });

                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and there id is hardcoded
                opts.id=function(e) { return e.id; };
                opts.formatResultCssClass = function(data) { return data.css; };
            } else {
                if (!("query" in opts)) {

                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax.call(opts.element, opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        if (opts.createSearchChoice === undefined) {
                            opts.createSearchChoice = function (term) { return {id: $.trim(term), text: $.trim(term)}; };
                        }
                        if (opts.initSelection === undefined) {
                            opts.initSelection = function (element, callback) {
                                var data = [];
                                $(splitVal(element.val(), opts.separator)).each(function () {
                                    var id = this, text = this, tags=opts.tags;
                                    if ($.isFunction(tags)) tags=tags();
                                    $(tags).each(function() { if (equal(this.id, id)) { text = this.text; return false; } });
                                    data.push({id: id, text: text});
                                });

                                callback(data);
                            };
                        }
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        // abstract
        monitorSource: function () {
            var el = this.opts.element, sync;

            el.on("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));

            sync = this.bind(function () {

                var enabled, readonly, self = this;

                // sync enabled state
                var disabled = el.prop("disabled");
                if (disabled === undefined) disabled = false;
                this.enable(!disabled);

                var readonly = el.prop("readonly");
                if (readonly === undefined) readonly = false;
                this.readonly(readonly);

                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                this.container.addClass(evaluate(this.opts.containerCssClass));

                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                this.dropdown.addClass(evaluate(this.opts.dropdownCssClass));

            });

            // mozilla and IE
            el.on("propertychange.select2 DOMAttrModified.select2", sync);


            // hold onto a reference of the callback to work around a chromium bug
            if (this.mutationCallback === undefined) {
                this.mutationCallback = function (mutations) {
                    mutations.forEach(sync);
                }
            }

            // safari and chrome
            if (typeof WebKitMutationObserver !== "undefined") {
                if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
                this.propertyObserver = new WebKitMutationObserver(this.mutationCallback);
                this.propertyObserver.observe(el.get(0), { attributes:true, subtree:false });
            }
        },

        // abstract
        triggerSelect: function(data) {
            var evt = $.Event("select2-selecting", { val: this.id(data), object: data });
            this.opts.element.trigger(evt);
            return !evt.isDefaultPrevented();
        },

        /**
         * Triggers the change event on the source element
         */
        // abstract
        triggerChange: function (details) {

            details = details || {};
            details= $.extend({}, details, { type: "change", val: this.val() });
            // prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);

            // some validation frameworks ignore the change event and listen instead to keyup, click for selects
            // so here we trigger the click event manually
            this.opts.element.click();

            // ValidationEngine ignorea the change event and listens instead to blur
            // so here we trigger the blur event manually if so desired
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        },

        //abstract
        isInterfaceEnabled: function()
        {
            return this.enabledInterface === true;
        },

        // abstract
        enableInterface: function() {
            var enabled = this._enabled && !this._readonly,
                disabled = !enabled;

            if (enabled === this.enabledInterface) return false;

            this.container.toggleClass("select2-container-disabled", disabled);
            this.close();
            this.enabledInterface = enabled;

            return true;
        },

        // abstract
        enable: function(enabled) {
            if (enabled === undefined) enabled = true;
            if (this._enabled === enabled) return;
            this._enabled = enabled;

            this.opts.element.prop("disabled", !enabled);
            this.enableInterface();
        },

        // abstract
        disable: function() {
            this.enable(false);
        },

        // abstract
        readonly: function(enabled) {
            if (enabled === undefined) enabled = false;
            if (this._readonly === enabled) return false;
            this._readonly = enabled;

            this.opts.element.prop("readonly", enabled);
            this.enableInterface();
            return true;
        },

        // abstract
        opened: function () {
            return this.container.hasClass("select2-dropdown-open");
        },

        // abstract
        positionDropdown: function() {
            var $dropdown = this.dropdown,
                offset = this.container.offset(),
                height = this.container.outerHeight(false),
                width = this.container.outerWidth(false),
                dropHeight = $dropdown.outerHeight(false),
                viewPortRight = $(window).scrollLeft() + $(window).width(),
                viewportBottom = $(window).scrollTop() + $(window).height(),
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= this.body().scrollTop(),
                dropWidth = $dropdown.outerWidth(false),
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight,
                aboveNow = $dropdown.hasClass("select2-drop-above"),
                bodyOffset,
                above,
                css,
                resultsListNode;

            if (this.opts.dropdownAutoWidth) {
                resultsListNode = $('.select2-results', $dropdown)[0];
                $dropdown.addClass('select2-drop-auto-width');
                $dropdown.css('width', '');
                // Add scrollbar width to dropdown if vertical scrollbar is present
                dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
                dropWidth > width ? width = dropWidth : dropWidth = width;
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
            }
            else {
                this.container.removeClass('select2-drop-auto-width');
            }

            //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body().scrollTop(), "enough?", enoughRoomAbove);

            // fix positioning when body has an offset and is not position: static
            if (this.body().css('position') !== 'static') {
                bodyOffset = this.body().offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }

            // always prefer the current above/below alignment, unless there is not enough room
            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) above = false;
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) above = true;
            }

            if (!enoughRoomOnRight) {
               dropLeft = offset.left + width - dropWidth;
            }

            if (above) {
                dropTop = offset.top - dropHeight;
                this.container.addClass("select2-drop-above");
                $dropdown.addClass("select2-drop-above");
            }
            else {
                this.container.removeClass("select2-drop-above");
                $dropdown.removeClass("select2-drop-above");
            }

            css = $.extend({
                top: dropTop,
                left: dropLeft,
                width: width
            }, evaluate(this.opts.dropdownCss));

            $dropdown.css(css);
        },

        // abstract
        shouldOpen: function() {
            var event;

            if (this.opened()) return false;

            if (this._enabled === false || this._readonly === true) return false;

            event = $.Event("select2-opening");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
        },

        // abstract
        clearDropdownAlignmentPreference: function() {
            // clear the classes used to figure out the preference of where the dropdown should be opened
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        },

        /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
        // abstract
        open: function () {

            if (!this.shouldOpen()) return false;

            this.opening();

            return true;
        },

        /**
         * Performs the opening of the dropdown
         */
        // abstract
        opening: function() {
            var cid = this.containerId,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid,
                mask, maskCss;

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

            this.clearDropdownAlignmentPreference();

            if(this.dropdown[0] !== this.body().children().last()[0]) {
                this.dropdown.detach().appendTo(this.body());
            }

            // create the dropdown mask if doesnt already exist
            mask = $("#select2-drop-mask");
            if (mask.length == 0) {
                mask = $(document.createElement("div"));
                mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");
                mask.hide();
                mask.appendTo(this.body());
                mask.on("mousedown touchstart click", function (e) {
                    var dropdown = $("#select2-drop"), self;
                    if (dropdown.length > 0) {
                        self=dropdown.data("select2");
                        if (self.opts.selectOnBlur) {
                            self.selectHighlighted({noFocus: true});
                        }
                        self.close({focus:false});
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }

            // ensure the mask is always right before the dropdown
            if (this.dropdown.prev()[0] !== mask[0]) {
                this.dropdown.before(mask);
            }

            // move the global id to the correct dropdown
            $("#select2-drop").removeAttr("id");
            this.dropdown.attr("id", "select2-drop");

            // show the elements
            mask.show();

            this.positionDropdown();
            this.dropdown.show();
            this.positionDropdown();

            this.dropdown.addClass("select2-drop-active");

            // attach listeners to events that can change the position of the container and thus require
            // the position of the dropdown to be updated as well so it does not come unglued from the container
            var that = this;
            this.container.parents().add(window).each(function () {
                $(this).on(resize+" "+scroll+" "+orient, function (e) {
                    that.positionDropdown();
                });
            });


        },

        // abstract
        close: function () {
            if (!this.opened()) return;

            var cid = this.containerId,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid;

            // unbind event listeners
            this.container.parents().add(window).each(function () { $(this).off(scroll).off(resize).off(orient); });

            this.clearDropdownAlignmentPreference();

            $("#select2-drop-mask").hide();
            this.dropdown.removeAttr("id"); // only the active dropdown has the select2-drop id
            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open");
            this.results.empty();


            this.clearSearch();
            this.search.removeClass("select2-active");
            this.opts.element.trigger($.Event("select2-close"));
        },

        /**
         * Opens control, sets input value, and updates results.
         */
        // abstract
        externalSearch: function (term) {
            this.open();
            this.search.val(term);
            this.updateResults(false);
        },

        // abstract
        clearSearch: function () {

        },

        //abstract
        getMaximumSelectionSize: function() {
            return evaluate(this.opts.maximumSelectionSize);
        },

        // abstract
        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more;

            index = this.highlight();

            if (index < 0) return;

            if (index == 0) {

                // if the first element is highlighted scroll all the way to the top,
                // that way any unselectable headers above it will also be scrolled
                // into view

                results.scrollTop(0);
                return;
            }

            children = this.findHighlightableChoices().find('.select2-result-label');

            child = $(children[index]);

            hb = child.offset().top + child.outerHeight(true);

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight(true);
                }
            }

            rb = results.offset().top + results.outerHeight(true);
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = child.offset().top - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0 && child.css('display') != 'none' ) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        // abstract
        findHighlightableChoices: function() {
            return this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)");
        },

        // abstract
        moveHighlight: function (delta) {
            var choices = this.findHighlightableChoices(),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        // abstract
        highlight: function (index) {
            var choices = this.findHighlightableChoices(),
                choice,
                data;

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            this.removeHighlight();

            choice = $(choices[index]);
            choice.addClass("select2-highlighted");

            this.ensureHighlightVisible();

            data = choice.data("select2-data");
            if (data) {
                this.opts.element.trigger({ type: "select2-highlight", val: this.id(data), choice: data });
            }
        },

        removeHighlight: function() {
            this.results.find(".select2-highlighted").removeClass("select2-highlighted");
        },

        // abstract
        countSelectableResults: function() {
            return this.findHighlightableChoices().length;
        },

        // abstract
        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
                var choices = this.findHighlightableChoices();
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                // if we are over an unselectable item remove all highlights
                this.removeHighlight();
            }
        },

        // abstract
        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                offset = -1, // index of first element without data
                page = this.resultsPage + 1,
                self=this,
                term=this.search.val(),
                context=this.context;

            if (more.length === 0) return;
            below = more.offset().top - results.offset().top - results.height();

            if (below <= this.opts.loadMorePadding) {
                more.addClass("select2-active");
                this.opts.query({
                        element: this.opts.element,
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function (data) {

                    // ignore a response if the select2 has been closed before it was received
                    if (!self.opened()) return;


                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});
                    self.postprocessResults(data, false, false);

                    if (data.more===true) {
                        more.detach().appendTo(results).text(self.opts.formatLoadMore(page+1));
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                    } else {
                        more.remove();
                    }
                    self.positionDropdown();
                    self.resultsPage = page;
                    self.context = data.context;
                    this.opts.element.trigger({ type: "select2-loaded", items: data });
                })});
            }
        },

        /**
         * Default tokenizer function which does nothing
         */
        tokenize: function() {

        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        // abstract
        updateResults: function (initial) {
            var search = this.search,
                results = this.results,
                opts = this.opts,
                data,
                self = this,
                input,
                term = search.val(),
                lastTerm = $.data(this.container, "select2-last-term"),
                // sequence number used to drop out-of-order responses
                queryNumber;

            // prevent duplicate queries against the same term
            if (initial !== true && lastTerm && equal(term, lastTerm)) return;

            $.data(this.container, "select2-last-term", term);

            // if the search is currently hidden we do not alter the results
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }

            function postRender() {
                search.removeClass("select2-active");
                self.positionDropdown();
            }

            function render(html) {
                results.html(html);
                postRender();
            }

            queryNumber = ++this.queryCount;

            var maxSelSize = this.getMaximumSelectionSize();
            if (maxSelSize >=1) {
                data = this.data();
                if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                    render("<li class='select2-selection-limit'>" + opts.formatSelectionTooBig(maxSelSize) + "</li>");
                    return;
                }
            }

            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                    render("<li class='select2-no-results'>" + opts.formatInputTooShort(search.val(), opts.minimumInputLength) + "</li>");
                } else {
                    render("");
                }
                if (initial && this.showSearch) this.showSearch(true);
                return;
            }

            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                    render("<li class='select2-no-results'>" + opts.formatInputTooLong(search.val(), opts.maximumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }

            if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
                render("<li class='select2-searching'>" + opts.formatSearching() + "</li>");
            }

            search.addClass("select2-active");

            this.removeHighlight();

            // give the tokenizer a chance to pre-process the input
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }

            this.resultsPage = 1;

            opts.query({
                element: opts.element,
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function (data) {
                var def; // default choice

                // ignore old responses
                if (queryNumber != this.queryCount) {
                  return;
                }

                // ignore a response if the select2 has been closed before it was received
                if (!this.opened()) {
                    this.search.removeClass("select2-active");
                    return;
                }

                // save context, if any
                this.context = (data.context===undefined) ? null : data.context;
                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(self, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            data.results.unshift(def);
                        }
                    }
                }

                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                    render("<li class='select2-no-results'>" + opts.formatNoMatches(search.val()) + "</li>");
                    return;
                }

                results.empty();
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                    results.append("<li class='select2-more-results'>" + self.opts.escapeMarkup(opts.formatLoadMore(this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                }

                this.postprocessResults(data, initial);

                postRender();

                this.opts.element.trigger({ type: "select2-loaded", items: data });
            })});
        },

        // abstract
        cancel: function () {
            this.close();
        },

        // abstract
        blur: function () {
            // if selectOnBlur == true, select the currently highlighted option
            if (this.opts.selectOnBlur)
                this.selectHighlighted({noFocus: true});

            this.close();
            this.container.removeClass("select2-container-active");
            // synonymous to .is(':focus'), which is available in jquery >= 1.6
            if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        },

        // abstract
        focusSearch: function () {
            focus(this.search);
        },

        // abstract
        selectHighlighted: function (options) {
            var index=this.highlight(),
                highlighted=this.results.find(".select2-highlighted"),
                data = highlighted.closest('.select2-result').data("select2-data");

            if (data) {
                this.highlight(index);
                this.onSelect(data, options);
            } else if (options && options.noFocus) {
                this.close();
            }
        },

        // abstract
        getPlaceholder: function () {
            var placeholderOption;
            return this.opts.element.attr("placeholder") ||
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") ||
                this.opts.placeholder ||
                ((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
        },

        // abstract
        getPlaceholderOption: function() {
            if (this.select) {
                var firstOption = this.select.children().first();
                if (this.opts.placeholderOption !== undefined ) {
                    //Determine the placeholder option based on the specified placeholderOption setting
                    return (this.opts.placeholderOption === "first" && firstOption) ||
                           (typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select));
                } else if (firstOption.text() === "" && firstOption.val() === "") {
                    //No explicit placeholder option specified, use the first if it's blank
                    return firstOption;
                }
            }
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
        // abstract
        initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l;

                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element"){
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    // check if there is inline style on the element that contains width
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            matches = attrs[i].replace(/\s/g, '')
                                .match(/[^-]width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }

                    if (this.opts.width === "resolve") {
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css
                        style = this.opts.element.css('width');
                        if (style.indexOf("%") > 0) return style;

                        // finally, fallback on the calculated width of the element
                        return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }

                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
               }
            };

            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.css("width", width);
            }
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        // single

        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container"
            }).html([
                "<a href='javascript:void(0)' onclick='return false;' class='select2-choice' tabindex='-1'>",
                "   <span class='select2-chosen'>&nbsp;</span><abbr class='select2-search-choice-close'></abbr>",
                "   <span class='select2-arrow'><b></b></span>",
                "</a>",
                "<input class='select2-focusser select2-offscreen' type='text'/>",
                "<div class='select2-drop select2-display-none'>",
                "   <div class='select2-search'>",
                "       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'/>",
                "   </div>",
                "   <ul class='select2-results'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // single
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.focusser.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // single
        opening: function () {
            var el, range, len;

            if (this.opts.minimumResultsForSearch >= 0) {
                this.showSearch(true);
            }

            this.parent.opening.apply(this, arguments);

            if (this.showSearchInput !== false) {
                // IE appends focusser.val() at the end of field :/ so we manually insert it at the beginning using a range
                // all other browsers handle this just fine

                this.search.val(this.focusser.val());
            }
            this.search.focus();
            // move the cursor to the end after focussing, otherwise it will be at the beginning and
            // new text will appear *before* focusser.val()
            el = this.search.get(0);
            if (el.createTextRange) {
                range = el.createTextRange();
                range.collapse(false);
                range.select();
            } else if (el.setSelectionRange) {
                len = this.search.val().length;
                el.setSelectionRange(len, len);
            }

            // initializes search's value with nextSearchTerm (if defined by user)
            // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
            if(this.search.val() === "") {
                if(this.nextSearchTerm != undefined){
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }

            this.focusser.prop("disabled", true).val("");
            this.updateResults(true);
            this.opts.element.trigger($.Event("select2-open"));
        },

        // single
        close: function (params) {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);

            params = params || {focus: true};
            this.focusser.removeAttr("disabled");

            if (params.focus) {
                this.focusser.focus();
            }
        },

        // single
        focus: function () {
            if (this.opened()) {
                this.close();
            } else {
                this.focusser.removeAttr("disabled");
                this.focusser.focus();
            }
        },

        // single
        isFocused: function () {
            return this.container.hasClass("select2-container-active");
        },

        // single
        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.focusser.removeAttr("disabled");
            this.focusser.focus();
        },

        // single
        destroy: function() {
            $("label[for='" + this.focusser.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);
        },

        // single
        initContainer: function () {

            var selection,
                container = this.container,
                dropdown = this.dropdown;

            if (this.opts.minimumResultsForSearch < 0) {
                this.showSearch(false);
            } else {
                this.showSearch(true);
            }

            this.selection = selection = container.find(".select2-choice");

            this.focusser = container.find(".select2-focusser");

            // rewrite labels from original element to focusser
            this.focusser.attr("id", "s2id_autogen"+nextUid());

            $("label[for='" + this.opts.element.attr("id") + "']")
                .attr('for', this.focusser.attr('id'));

            this.focusser.attr("tabindex", this.elementTabIndex);

            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        // if selectOnBlur == true, select the currently highlighted option
                        if (this.opts.selectOnBlur) {
                            this.selectHighlighted({noFocus: true});
                        }
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                }
            }));

            this.search.on("blur", this.bind(function(e) {
                // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                // without this the search field loses focus which is annoying
                if (document.activeElement === this.body().get(0)) {
                    window.setTimeout(this.bind(function() {
                        this.search.focus();
                    }), 0);
                }
            }));

            this.focusser.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DOWN || e.which == KEY.UP
                    || (e.which == KEY.ENTER && this.opts.openOnEnter)) {

                    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

                    this.open();
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    killEvent(e);
                    return;
                }
            }));


            installKeyUpChangeEvent(this.focusser);
            this.focusser.on("keyup-change input", this.bind(function(e) {
                if (this.opts.minimumResultsForSearch >= 0) {
                    e.stopPropagation();
                    if (this.opened()) return;
                    this.open();
                }
            }));

            selection.on("mousedown", "abbr", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;
                this.clear();
                killEventImmediately(e);
                this.close();
                this.selection.focus();
            }));

            selection.on("mousedown", this.bind(function (e) {

                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }

                if (this.opened()) {
                    this.close();
                } else if (this.isInterfaceEnabled()) {
                    this.open();
                }

                killEvent(e);
            }));

            dropdown.on("mousedown", this.bind(function() { this.search.focus(); }));

            selection.on("focus", this.bind(function(e) {
                killEvent(e);
            }));

            this.focusser.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            })).on("blur", this.bind(function() {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                    this.opts.element.trigger($.Event("select2-blur"));
                }
            }));
            this.search.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            }));

            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");
            this.setPlaceholder();

        },

        // single
        clear: function(triggerChange) {
            var data=this.selection.data("select2-data");
            if (data) { // guard against queued quick consecutive clicks
                var placeholderOption = this.getPlaceholderOption();
                this.opts.element.val(placeholderOption ? placeholderOption.val() : "");
                this.selection.find(".select2-chosen").empty();
                this.selection.removeData("select2-data");
                this.setPlaceholder();

                if (triggerChange !== false){
                    this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
                    this.triggerChange({removed:data});
                }
            }
        },

        /**
         * Sets selection based on source element's value
         */
        // single
        initSelection: function () {
            var selected;
            if (this.isPlaceholderOptionSelected()) {
                this.updateSelection(null);
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(selected){
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                    }
                });
            }
        },

        isPlaceholderOptionSelected: function() {
            var placeholderOption;
            if (!this.opts.placeholder) return false; // no placeholder specified so no option should be considered
            return ((placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.is(':selected'))
                || (this.opts.element.val() === "")
                || (this.opts.element.val() === undefined)
                || (this.opts.element.val() === null);
        },

        // single
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {
                    var selected = element.find(":selected");
                    // a single select box always has a value, no need to null check 'selected'
                    callback(self.optionToData(selected));
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var id = element.val();
                    //search in data by id, storing the actual matching item
                    var match = null;
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = equal(id, opts.id(el));
                            if (is_match) {
                                match = el;
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            callback(match);
                        }
                    });
                };
            }

            return opts;
        },

        // single
        getPlaceholder: function() {
            // if a placeholder is specified on a single select without a valid placeholder option ignore it
            if (this.select) {
                if (this.getPlaceholderOption() === undefined) {
                    return undefined;
                }
            }

            return this.parent.getPlaceholder.apply(this, arguments);
        },

        // single
        setPlaceholder: function () {
            var placeholder = this.getPlaceholder();

            if (this.isPlaceholderOptionSelected() && placeholder !== undefined) {

                // check for a placeholder option if attached to a select
                if (this.select && this.getPlaceholderOption() === undefined) return;

                this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));

                this.selection.addClass("select2-default");

                this.container.removeClass("select2-allowclear");
            }
        },

        // single
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var selected = 0, self = this, showSearchInput = true;

            // find the selected element in the result list

            this.findHighlightableChoices().each2(function (i, elm) {
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });

            // and highlight it
            if (noHighlightUpdate !== false) {
                if (initial === true && selected >= 0) {
                    this.highlight(selected);
                } else {
                    this.highlight(0);
                }
            }

            // hide the search box if this is the first we got the results and there are enough of them for search

            if (initial === true) {
                var min = this.opts.minimumResultsForSearch;
                if (min >= 0) {
                    this.showSearch(countResults(data.results) >= min);
                }
            }
        },

        // single
        showSearch: function(showSearchInput) {
            if (this.showSearchInput === showSearchInput) return;

            this.showSearchInput = showSearchInput;

            this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput);
            this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput);
            //add "select2-with-searchbox" to the container if search box is shown
            $(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput);
        },

        // single
        onSelect: function (data, options) {

            if (!this.triggerSelect(data)) { return; }

            var old = this.opts.element.val(),
                oldData = this.data();

            this.opts.element.val(this.id(data));
            this.updateSelection(data);

            this.opts.element.trigger({ type: "select2-selected", val: this.id(data), choice: data });

            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
            this.close();

            if (!options || !options.noFocus)
                this.selection.focus();

            if (!equal(old, this.id(data))) { this.triggerChange({added:data,removed:oldData}); }
        },

        // single
        updateSelection: function (data) {

            var container=this.selection.find(".select2-chosen"), formatted, cssClass;

            this.selection.data("select2-data", data);

            container.empty();
            if (data !== null) {
                formatted=this.opts.formatSelection(data, container, this.opts.escapeMarkup);
            }
            if (formatted !== undefined) {
                container.append(formatted);
            }
            cssClass=this.opts.formatSelectionCssClass(data, container);
            if (cssClass !== undefined) {
                container.addClass(cssClass);
            }

            this.selection.removeClass("select2-default");

            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.container.addClass("select2-allowclear");
            }
        },

        // single
        val: function () {
            var val,
                triggerChange = false,
                data = null,
                self = this,
                oldData = this.data();

            if (arguments.length === 0) {
                return this.opts.element.val();
            }

            val = arguments[0];

            if (arguments.length > 1) {
                triggerChange = arguments[1];
            }

            if (this.select) {
                this.select
                    .val(val)
                    .find(":selected").each2(function (i, elm) {
                        data = self.optionToData(elm);
                        return false;
                    });
                this.updateSelection(data);
                this.setPlaceholder();
                if (triggerChange) {
                    this.triggerChange({added: data, removed:oldData});
                }
            } else {
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                if (!val && val !== 0) {
                    this.clear(triggerChange);
                    return;
                }
                if (this.opts.initSelection === undefined) {
                    throw new Error("cannot call val() if initSelection() is not defined");
                }
                this.opts.element.val(val);
                this.opts.initSelection(this.opts.element, function(data){
                    self.opts.element.val(!data ? "" : self.id(data));
                    self.updateSelection(data);
                    self.setPlaceholder();
                    if (triggerChange) {
                        self.triggerChange({added: data, removed:oldData});
                    }
                });
            }
        },

        // single
        clearSearch: function () {
            this.search.val("");
            this.focusser.val("");
        },

        // single
        data: function(value) {
            var data,
                triggerChange = false;

            if (arguments.length === 0) {
                data = this.selection.data("select2-data");
                if (data == undefined) data = null;
                return data;
            } else {
                if (arguments.length > 1) {
                    triggerChange = arguments[1];
                }
                if (!value) {
                    this.clear(triggerChange);
                } else {
                    data = this.data();
                    this.opts.element.val(!value ? "" : this.id(value));
                    this.updateSelection(value);
                    if (triggerChange) {
                        this.triggerChange({added: value, removed:data});
                    }
                }
            }
        }
    });

    MultiSelect2 = clazz(AbstractSelect2, {

        // multi
        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container select2-container-multi"
            }).html([
                "<ul class='select2-choices'>",
                "  <li class='select2-search-field'>",
                "    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>",
                "  </li>",
                "</ul>",
                "<div class='select2-drop select2-drop-multi select2-display-none'>",
                "   <ul class='select2-results'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // multi
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            // TODO validate placeholder is a string if specified

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install sthe selection initializer
                opts.initSelection = function (element, callback) {

                    var data = [];

                    element.find(":selected").each2(function (i, elm) {
                        data.push(self.optionToData(elm));
                    });
                    callback(data);
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var ids = splitVal(element.val(), opts.separator);
                    //search in data by array of ids, storing matching items in a list
                    var matches = [];
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = $.grep(ids, function(id) {
                                return equal(id, opts.id(el));
                            }).length;
                            if (is_match) {
                                matches.push(el);
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            // reorder matches based on the order they appear in the ids array because right now
                            // they are in the order in which they appear in data array
                            var ordered = [];
                            for (var i = 0; i < ids.length; i++) {
                                var id = ids[i];
                                for (var j = 0; j < matches.length; j++) {
                                    var match = matches[j];
                                    if (equal(id, opts.id(match))) {
                                        ordered.push(match);
                                        matches.splice(j, 1);
                                        break;
                                    }
                                }
                            }
                            callback(ordered);
                        }
                    });
                };
            }

            return opts;
        },

        selectChoice: function (choice) {

            var selected = this.container.find(".select2-search-choice-focus");
            if (selected.length && choice && choice[0] == selected[0]) {

            } else {
                if (selected.length) {
                    this.opts.element.trigger("choice-deselected", selected);
                }
                selected.removeClass("select2-search-choice-focus");
                if (choice && choice.length) {
                    this.close();
                    choice.addClass("select2-search-choice-focus");
                    this.opts.element.trigger("choice-selected", choice);
                }
            }
        },

        // multi
        destroy: function() {
            $("label[for='" + this.search.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);
        },

        // multi
        initContainer: function () {

            var selector = ".select2-choices", selection;

            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);

            var _this = this;
            this.selection.on("click", ".select2-search-choice", function (e) {
                //killEvent(e);
                _this.search[0].focus();
                _this.selectChoice($(this));
            });

            // rewrite labels from original element to focusser
            this.search.attr("id", "s2id_autogen"+nextUid());
            $("label[for='" + this.opts.element.attr("id") + "']")
                .attr('for', this.search.attr('id'));

            this.search.on("input paste", this.bind(function() {
                if (!this.isInterfaceEnabled()) return;
                if (!this.opened()) {
                    this.open();
                }
            }));

            this.search.attr("tabindex", this.elementTabIndex);

            this.keydowns = 0;
            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                ++this.keydowns;
                var selected = selection.find(".select2-search-choice-focus");
                var prev = selected.prev(".select2-search-choice:not(.select2-locked)");
                var next = selected.next(".select2-search-choice:not(.select2-locked)");
                var pos = getCursorInfo(this.search);

                if (selected.length &&
                    (e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
                    var selectedChoice = selected;
                    if (e.which == KEY.LEFT && prev.length) {
                        selectedChoice = prev;
                    }
                    else if (e.which == KEY.RIGHT) {
                        selectedChoice = next.length ? next : null;
                    }
                    else if (e.which === KEY.BACKSPACE) {
                        this.unselect(selected.first());
                        this.search.width(10);
                        selectedChoice = prev.length ? prev : next;
                    } else if (e.which == KEY.DELETE) {
                        this.unselect(selected.first());
                        this.search.width(10);
                        selectedChoice = next.length ? next : null;
                    } else if (e.which == KEY.ENTER) {
                        selectedChoice = null;
                    }

                    this.selectChoice(selectedChoice);
                    killEvent(e);
                    if (!selectedChoice || !selectedChoice.length) {
                        this.open();
                    }
                    return;
                } else if (((e.which === KEY.BACKSPACE && this.keydowns == 1)
                    || e.which == KEY.LEFT) && (pos.offset == 0 && !pos.length)) {

                    this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last());
                    killEvent(e);
                    return;
                } else {
                    this.selectChoice(null);
                }

                if (this.opened()) {
                    switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        // if selectOnBlur == true, select the currently highlighted option
                        if (this.opts.selectOnBlur) {
                            this.selectHighlighted({noFocus:true});
                        }
                        this.close();
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
                 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }

                if (e.which === KEY.ENTER) {
                    if (this.opts.openOnEnter === false) {
                        return;
                    } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                        return;
                    }
                }

                this.open();

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                }

                if (e.which === KEY.ENTER) {
                    // prevent form from being submitted
                    killEvent(e);
                }

            }));

            this.search.on("keyup", this.bind(function (e) {
                this.keydowns = 0;
                this.resizeSearch();
            })
            );

            this.search.on("blur", this.bind(function(e) {
                this.container.removeClass("select2-container-active");
                this.search.removeClass("select2-focused");
                this.selectChoice(null);
                if (!this.opened()) this.clearSearch();
                e.stopImmediatePropagation();
                this.opts.element.trigger($.Event("select2-blur"));
            }));

            this.container.on("click", selector, this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;
                if ($(e.target).closest(".select2-search-choice").length > 0) {
                    // clicked inside a select2 search choice, do not open
                    return;
                }
                this.selectChoice(null);
                this.clearPlaceholder();
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));

            this.container.on("focus", selector, this.bind(function () {
                if (!this.isInterfaceEnabled()) return;
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
                this.clearPlaceholder();
            }));

            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");

            // set the placeholder if necessary
            this.clearSearch();
        },

        // multi
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.search.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // multi
        initSelection: function () {
            var data;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.updateSelection([]);
                this.close();
                // set the placeholder if necessary
                this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(data){
                    if (data !== undefined && data !== null) {
                        self.updateSelection(data);
                        self.close();
                        // set the placeholder if necessary
                        self.clearSearch();
                    }
                });
            }
        },

        // multi
        clearSearch: function () {
            var placeholder = this.getPlaceholder(),
                maxWidth = this.getMaxSearchWidth();

            if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                // we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
                this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));
            } else {
                this.search.val("").width(10);
            }
        },

        // multi
        clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            }
        },

        // multi
        opening: function () {
            this.clearPlaceholder(); // should be done before super so placeholder is not used to search
            this.resizeSearch();

            this.parent.opening.apply(this, arguments);

            this.focusSearch();

            this.updateResults(true);
            this.search.focus();
            this.opts.element.trigger($.Event("select2-open"));
        },

        // multi
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        // multi
        focus: function () {
            this.close();
            this.search.focus();
        },

        // multi
        isFocused: function () {
            return this.search.hasClass("select2-focused");
        },

        // multi
        updateSelection: function (data) {
            var ids = [], filtered = [], self = this;

            // filter out duplicates
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;

            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        },

        // multi
        tokenize: function() {
            var input = this.search.val();
            input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined) {
                this.search.val(input);
                if (input.length > 0) {
                    this.open();
                }
            }

        },

        // multi
        onSelect: function (data, options) {

            if (!this.triggerSelect(data)) { return; }

            this.addSelectedChoice(data);

            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

            if (this.select || !this.opts.closeOnSelect) this.postprocessResults(data, false, this.opts.closeOnSelect===true);

            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                if (this.countSelectableResults()>0) {
                    this.search.width(10);
                    this.resizeSearch();
                    if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
                        // if we reached max selection size repaint the results so choices
                        // are replaced with the max selection reached message
                        this.updateResults(true);
                    }
                    this.positionDropdown();
                } else {
                    // if nothing left to select close
                    this.close();
                    this.search.width(10);
                }
            }

            // since its not possible to select an element that has already been
            // added we do not need to check if this is a new element before firing change
            this.triggerChange({ added: data });

            if (!options || !options.noFocus)
                this.focusSearch();
        },

        // multi
        cancel: function () {
            this.close();
            this.focusSearch();
        },

        addSelectedChoice: function (data) {
            var enableChoice = !data.locked,
                enabledItem = $(
                    "<li class='select2-search-choice'>" +
                    "    <div></div>" +
                    "    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a>" +
                    "</li>"),
                disabledItem = $(
                    "<li class='select2-search-choice select2-locked'>" +
                    "<div></div>" +
                    "</li>");
            var choice = enableChoice ? enabledItem : disabledItem,
                id = this.id(data),
                val = this.getVal(),
                formatted,
                cssClass;

            formatted=this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup);
            if (formatted != undefined) {
                choice.find("div").replaceWith("<div>"+formatted+"</div>");
            }
            cssClass=this.opts.formatSelectionCssClass(data, choice.find("div"));
            if (cssClass != undefined) {
                choice.addClass(cssClass);
            }

            if(enableChoice){
              choice.find(".select2-search-choice-close")
                  .on("mousedown", killEvent)
                  .on("click dblclick", this.bind(function (e) {
                  if (!this.isInterfaceEnabled()) return;

                  $(e.target).closest(".select2-search-choice").fadeOut('fast', this.bind(function(){
                      this.unselect($(e.target));
                      this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                      this.close();
                      this.focusSearch();
                  })).dequeue();
                  killEvent(e);
              })).on("focus", this.bind(function () {
                  if (!this.isInterfaceEnabled()) return;
                  this.container.addClass("select2-container-active");
                  this.dropdown.addClass("select2-drop-active");
              }));
            }

            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);

            val.push(id);
            this.setVal(val);
        },

        // multi
        unselect: function (selected) {
            var val = this.getVal(),
                data,
                index;

            selected = selected.closest(".select2-search-choice");

            if (selected.length === 0) {
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }

            data = selected.data("select2-data");

            if (!data) {
                // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
                // and invoked on an element already removed
                return;
            }

            index = indexOf(this.id(data), val);

            if (index >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select) this.postprocessResults();
            }
            selected.remove();

            this.opts.element.trigger({ type: "removed", val: this.id(data), choice: data });
            this.triggerChange({ removed: data });
        },

        // multi
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var val = this.getVal(),
                choices = this.results.find(".select2-result"),
                compound = this.results.find(".select2-result-with-children"),
                self = this;

            choices.each2(function (i, choice) {
                var id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-selected");
                    // mark all children of the selected parent as selected
                    choice.find(".select2-result-selectable").addClass("select2-selected");
                }
            });

            compound.each2(function(i, choice) {
                // hide an optgroup if it doesnt have any selectable children
                if (!choice.is('.select2-result-selectable')
                    && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                    choice.addClass("select2-selected");
                }
            });

            if (this.highlight() == -1 && noHighlightUpdate !== false){
                self.highlight(0);
            }

            //If all results are chosen render formatNoMAtches
            if(!this.opts.createSearchChoice && !choices.filter('.select2-result:not(.select2-selected)').length > 0){
                if(!data || data && !data.more && this.results.find(".select2-no-results").length === 0) {
                    if (checkFormatter(self.opts.formatNoMatches, "formatNoMatches")) {
                        this.results.append("<li class='select2-no-results'>" + self.opts.formatNoMatches(self.search.val()) + "</li>");
                    }
                }
            }

        },

        // multi
        getMaxSearchWidth: function() {
            return this.selection.width() - getSideBorderPadding(this.search);
        },

        // multi
        resizeSearch: function () {
            var minimumWidth, left, maxWidth, containerLeft, searchWidth,
                sideBorderPadding = getSideBorderPadding(this.search);

            minimumWidth = measureTextWidth(this.search) + 10;

            left = this.search.offset().left;

            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;

            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;

            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth < 40) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth <= 0) {
              searchWidth = minimumWidth;
            }

            this.search.width(searchWidth);
        },

        // multi
        getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, this.opts.separator);
            }
        },

        // multi
        setVal: function (val) {
            var unique;
            if (this.select) {
                this.select.val(val);
            } else {
                unique = [];
                // filter out duplicates
                $(val).each(function () {
                    if (indexOf(this, unique) < 0) unique.push(this);
                });
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
        },

        // multi
        buildChangeDetails: function (old, current) {
            var current = current.slice(0),
                old = old.slice(0);

            // remove intersection from each array
            for (var i = 0; i < current.length; i++) {
                for (var j = 0; j < old.length; j++) {
                    if (equal(this.opts.id(current[i]), this.opts.id(old[j]))) {
                        current.splice(i, 1);
                        i--;
                        old.splice(j, 1);
                        j--;
                    }
                }
            }

            return {added: current, removed: old};
        },


        // multi
        val: function (val, triggerChange) {
            var oldData, self=this, changeDetails;

            if (arguments.length === 0) {
                return this.getVal();
            }

            oldData=this.data();
            if (!oldData.length) oldData=[];

            // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
            if (!val && val !== 0) {
                this.opts.element.val("");
                this.updateSelection([]);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange({added: this.data(), removed: oldData});
                }
                return;
            }

            // val is a list of ids
            this.setVal(val);

            if (this.select) {
                this.opts.initSelection(this.select, this.bind(this.updateSelection));
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(oldData, this.data()));
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("val() cannot be called if initSelection() is not defined");
                }

                this.opts.initSelection(this.opts.element, function(data){
                    var ids=$.map(data, self.id);
                    self.setVal(ids);
                    self.updateSelection(data);
                    self.clearSearch();
                    if (triggerChange) {
                        self.triggerChange(self.buildChangeDetails(oldData, this.data()));
                    }
                });
            }
            this.clearSearch();
        },

        // multi
        onSortStart: function() {
            if (this.select) {
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }

            // collapse search field into 0 width so its container can be collapsed as well
            this.search.width(0);
            // hide the container
            this.searchContainer.hide();
        },

        // multi
        onSortEnd:function() {

            var val=[], self=this;

            // show search and move it to the end of the list
            this.searchContainer.show();
            // make sure the search container is the last item in the list
            this.searchContainer.appendTo(this.searchContainer.parent());
            // since we collapsed the width in dragStarted, we resize it here
            this.resizeSearch();

            // update selection
            this.selection.find(".select2-search-choice").each(function() {
                val.push(self.opts.id($(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
        },

        // multi
        data: function(values, triggerChange) {
            var self=this, ids, old;
            if (arguments.length === 0) {
                 return this.selection
                     .find(".select2-search-choice")
                     .map(function() { return $(this).data("select2-data"); })
                     .get();
            } else {
                old = this.data();
                if (!values) { values = []; }
                ids = $.map(values, function(e) { return self.opts.id(e); });
                this.setVal(ids);
                this.updateSelection(values);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(old, this.data()));
                }
            }
        }
    });

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            method, value, multiple,
            allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search"],
            valueMethods = ["opened", "isFocused", "container", "dropdown"],
            propertyMethods = ["val", "data"],
            methodsMap = { search: "externalSearch" };

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);

                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.prop("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags" in opts) {opts.multiple = multiple = true;}
                }

                select2 = multiple ? new MultiSelect2() : new SingleSelect2();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (indexOf(args[0], allowedMethods) < 0) {
                    throw "Unknown method: " + args[0];
                }

                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined) return;

                method=args[0];

                if (method === "container") {
                    value = select2.container;
                } else if (method === "dropdown") {
                    value = select2.dropdown;
                } else {
                    if (methodsMap[method]) method = methodsMap[method];

                    value = select2[method].apply(select2, args.slice(1));
                }
                if (indexOf(args[0], valueMethods) >= 0
                    || (indexOf(args[0], propertyMethods) && args.length == 1)) {
                    return false; // abort the iteration, ready to return first matched value
                }
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

    // plugin defaults, accessible to users
    $.fn.select2.defaults = {
        width: "copy",
        loadMorePadding: 0,
        closeOnSelect: true,
        openOnEnter: true,
        containerCss: {},
        dropdownCss: {},
        containerCssClass: "",
        dropdownCssClass: "",
        formatResult: function(result, container, query, escapeMarkup) {
            var markup=[];
            markMatch(result.text, query.term, markup, escapeMarkup);
            return markup.join("");
        },
        formatSelection: function (data, container, escapeMarkup) {
            return data ? escapeMarkup(data.text) : undefined;
        },
        sortResults: function (results, container, query) {
            return results;
        },
        formatResultCssClass: function(data) {return undefined;},
        formatSelectionCssClass: function(data, container) {return undefined;},
        formatNoMatches: function () { return "No matches found"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " more character" + (n == 1? "" : "s"); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1? "" : "s"); },
        formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
        formatLoadMore: function (pageNumber) { return "Loading more results..."; },
        formatSearching: function () { return "Searching..."; },
        minimumResultsForSearch: 0,
        minimumInputLength: 0,
        maximumInputLength: null,
        maximumSelectionSize: 0,
        id: function (e) { return e.id; },
        matcher: function(term, text) {
            return stripDiacritics(''+text).toUpperCase().indexOf(stripDiacritics(''+term).toUpperCase()) >= 0;
        },
        separator: ",",
        tokenSeparators: [],
        tokenizer: defaultTokenizer,
        escapeMarkup: defaultEscapeMarkup,
        blurOnChange: false,
        selectOnBlur: false,
        adaptContainerCssClass: function(c) { return c; },
        adaptDropdownCssClass: function(c) { return null; },
        nextSearchTerm: function(selectedObject, currentSearchTerm) { return undefined; }
    };

    $.fn.select2.ajaxDefaults = {
        transport: $.ajax,
        params: {
            type: "GET",
            cache: false,
            dataType: "json"
        }
    };

    // exports
    window.Select2 = {
        query: {
            ajax: ajax,
            local: local,
            tags: tags
        }, util: {
            debounce: debounce,
            markMatch: markMatch,
            escapeMarkup: defaultEscapeMarkup,
            stripDiacritics: stripDiacritics
        }, "class": {
            "abstract": AbstractSelect2,
            "single": SingleSelect2,
            "multi": MultiSelect2
        }
    };

}(jQuery));
(function() {
  $(function() {
    var addAllEl, tagAdderEl;
    tagAdderEl = $("#tag_adder");
    tagAdderEl.select2({
      createSearchChoice: function(term, data) {
        if ($(data).filter(function() {
          return this.text.localeCompare(term) === 0;
        }).length === 0) {
          return {
            id: term,
            text: term
          };
        }
      },
      multiple: true,
      data: [],
      ajax: {
        dataType: 'json',
        url: tagAdderEl.data('url'),
        results: function(data, page) {
          return {
            results: data
          };
        },
        data: function(term, page) {
          return {
            q: term,
            customer_id: $('#portfolio_client_id').val()
          };
        }
      },
      initSelection: function(element, callback) {
        var data, responseA, tags;
        tags = $(element).val().split(',');
        data = [];
        responseA = [];
        return $.ajax({
          dataType: 'json',
          url: tagAdderEl.data('url'),
          data: {
            customer_id: $('#portfolio_client_id').val()
          }
        }).done(function(response) {
          var elem, string, tag, _i, _j, _len, _len1;
          for (_i = 0, _len = tags.length; _i < _len; _i++) {
            tag = tags[_i];
            string = "";
            for (_j = 0, _len1 = response.length; _j < _len1; _j++) {
              elem = response[_j];
              if (elem.id.toString() === tag) {
                string = elem.text;
              }
            }
            data.push({
              id: tag,
              text: string
            });
          }
          return callback(data);
        });
      },
      tokenizer: function(input, selection, callback) {
        var data, part, parts, _i, _len, _results;
        if (input.indexOf(",") < 0) {
          return;
        }
        parts = input.split(",");
        data = [];
        _results = [];
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          if ($.isNumeric(part)) {
            _results.push(callback({
              id: part,
              text: part
            }));
          }
        }
        return _results;
      }
    });
    addAllEl = $("#add_all");
    return addAllEl.click(function() {
      return $.ajax({
        dataType: 'json',
        url: tagAdderEl.data('url'),
        data: {
          customer_id: $('#portfolio_client_id').val()
        }
      }).done(function(data) {
        return tagAdderEl.select2("data", data);
      });
    });
  });

}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//









;
