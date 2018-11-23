(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("prop-types"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "prop-types"], factory);
	else if(typeof exports === 'object')
		exports["ReactCrop"] = factory(require("react"), require("prop-types"));
	else
		root["ReactCrop"] = factory(root["React"], root["PropTypes"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_102__, __WEBPACK_EXTERNAL_MODULE_103__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(26)('wks')
  , uid        = __webpack_require__(15)
  , Symbol     = __webpack_require__(3).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(3)
  , core      = __webpack_require__(0)
  , ctx       = __webpack_require__(21)
  , hide      = __webpack_require__(8)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(9)
  , IE8_DOM_DEFINE = __webpack_require__(34)
  , toPrimitive    = __webpack_require__(22)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(5) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(10)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(38)
  , defined = __webpack_require__(19);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(4)
  , createDesc = __webpack_require__(12);
module.exports = __webpack_require__(5) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(11);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(37)
  , enumBugKeys = __webpack_require__(27);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(19);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(49);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(11);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(9)
  , dPs         = __webpack_require__(51)
  , enumBugKeys = __webpack_require__(27)
  , IE_PROTO    = __webpack_require__(25)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(35)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(54).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(26)('keys')
  , uid    = __webpack_require__(15);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(4).f
  , has = __webpack_require__(6)
  , TAG = __webpack_require__(1)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(1);

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(3)
  , core           = __webpack_require__(0)
  , LIBRARY        = __webpack_require__(20)
  , wksExt         = __webpack_require__(29)
  , defineProperty = __webpack_require__(4).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(48)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(33)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(20)
  , $export        = __webpack_require__(2)
  , redefine       = __webpack_require__(36)
  , hide           = __webpack_require__(8)
  , has            = __webpack_require__(6)
  , Iterators      = __webpack_require__(13)
  , $iterCreate    = __webpack_require__(50)
  , setToStringTag = __webpack_require__(28)
  , getPrototypeOf = __webpack_require__(40)
  , ITERATOR       = __webpack_require__(1)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(5) && !__webpack_require__(10)(function(){
  return Object.defineProperty(__webpack_require__(35)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(11)
  , document = __webpack_require__(3).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(6)
  , toIObject    = __webpack_require__(7)
  , arrayIndexOf = __webpack_require__(52)(false)
  , IE_PROTO     = __webpack_require__(25)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(24);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(18)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(6)
  , toObject    = __webpack_require__(16)
  , IE_PROTO    = __webpack_require__(25)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(72);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(78);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(37)
  , hiddenKeys = __webpack_require__(27).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(17)
  , createDesc     = __webpack_require__(12)
  , toIObject      = __webpack_require__(7)
  , toPrimitive    = __webpack_require__(22)
  , has            = __webpack_require__(6)
  , IE8_DOM_DEFINE = __webpack_require__(34)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(5) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containCrop = exports.makeAspectCrop = exports.getPixelCrop = exports.Component = exports.default = undefined;

var _toConsumableArray2 = __webpack_require__(45);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getPrototypeOf = __webpack_require__(62);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(66);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(67);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(71);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(89);

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = __webpack_require__(97);

var _extends3 = _interopRequireDefault(_extends2);

var _react = __webpack_require__(102);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(103);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Feature detection
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners
/* globals document, window */
var passiveSupported = false;

try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
    get: function get() {
      passiveSupported = true;return true;
    }
  }));
} catch (err) {} // eslint-disable-line no-empty

var EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

function getClientPos(e) {
  var pageX = void 0;
  var pageY = void 0;

  if (e.touches) {
    pageX = e.touches[0].pageX;
    pageY = e.touches[0].pageY;
  } else {
    pageX = e.pageX;
    pageY = e.pageY;
  }

  return {
    x: pageX,
    y: pageY
  };
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function isCropValid(crop) {
  return crop && crop.width && crop.height && !isNaN(crop.width) && !isNaN(crop.height);
}

function inverseOrd(ord) {
  var inversedOrd = void 0;

  if (ord === 'n') inversedOrd = 's';else if (ord === 'ne') inversedOrd = 'sw';else if (ord === 'e') inversedOrd = 'w';else if (ord === 'se') inversedOrd = 'nw';else if (ord === 's') inversedOrd = 'n';else if (ord === 'sw') inversedOrd = 'ne';else if (ord === 'w') inversedOrd = 'e';else if (ord === 'nw') inversedOrd = 'se';

  return inversedOrd;
}

function makeAspectCrop(crop, imageAspect) {
  if (isNaN(crop.aspect) || isNaN(imageAspect)) {
    console.warn('`crop.aspect` and `imageAspect` need to be numbers in order to make an aspect crop', crop);
    return crop;
  }

  var completeCrop = (0, _extends3.default)({}, crop);

  if (crop.width) {
    completeCrop.height = crop.width / crop.aspect * imageAspect;
  }
  if (crop.height) {
    completeCrop.width = (completeCrop.height || crop.height) * (crop.aspect / imageAspect);
  }

  if (crop.y + (completeCrop.height || crop.height) > 100) {
    completeCrop.height = 100 - crop.y;
    completeCrop.width = completeCrop.height * crop.aspect / imageAspect;
  }

  if (crop.x + (completeCrop.width || crop.width) > 100) {
    completeCrop.width = 100 - crop.x;
    completeCrop.height = completeCrop.width / crop.aspect * imageAspect;
  }

  return completeCrop;
}

function resolveCrop(crop, image) {
  if (crop && crop.aspect && (!crop.width && crop.height || crop.width && !crop.height)) {
    return makeAspectCrop(crop, image.naturalWidth / image.naturalHeight);
  }

  return crop;
}

function getPixelCrop(image, percentCrop) {
  if (!image || !percentCrop) {
    return null;
  }

  var x = Math.round(image.naturalWidth * (percentCrop.x / 100));
  var y = Math.round(image.naturalHeight * (percentCrop.y / 100));
  var width = Math.round(image.naturalWidth * (percentCrop.width / 100));
  var height = Math.round(image.naturalHeight * (percentCrop.height / 100));

  return {
    x: x,
    y: y,
    // Clamp width and height so rounding doesn't cause the crop to exceed bounds.
    width: clamp(width, 0, image.naturalWidth - x),
    height: clamp(height, 0, image.naturalHeight - y)
  };
}

function containCrop(previousCrop, crop, imageAspect) {
  var contained = (0, _extends3.default)({}, crop);

  // Don't let the crop grow on the opposite side when hitting an x image boundary.
  var cropXAdjusted = false;
  if (contained.x + contained.width > 100) {
    contained.width = crop.width + (100 - (crop.x + crop.width));
    contained.x = crop.x + (100 - (crop.x + contained.width));
    cropXAdjusted = true;
  } else if (contained.x < 0) {
    contained.width = crop.x + crop.width;
    contained.x = 0;
    cropXAdjusted = true;
  }

  if (cropXAdjusted && crop.aspect) {
    // Adjust height to the resized width to maintain aspect.
    contained.height = contained.width / crop.aspect * imageAspect;
    // If sizing in up direction we need to pin Y at the point it
    // would be at the boundary.
    if (previousCrop.y > contained.y) {
      contained.y = crop.y + (crop.height - contained.height);
    }
  }

  // Don't let the crop grow on the opposite side when hitting a y image boundary.
  var cropYAdjusted = false;
  if (contained.y + contained.height > 100) {
    contained.height = crop.height + (100 - (crop.y + crop.height));
    contained.y = crop.y + (100 - (crop.y + contained.height));
    cropYAdjusted = true;
  } else if (contained.y < 0) {
    contained.height = crop.y + crop.height;
    contained.y = 0;
    cropYAdjusted = true;
  }

  if (cropYAdjusted && crop.aspect) {
    // Adjust width to the resized height to maintain aspect.
    contained.width = contained.height * crop.aspect / imageAspect;
    // If sizing in up direction we need to pin X at the point it
    // would be at the boundary.
    if (contained.x < crop.x) {
      contained.x = crop.x + (crop.width - contained.width);
    }
  }

  return contained;
}

var ReactCrop = function (_PureComponent) {
  (0, _inherits3.default)(ReactCrop, _PureComponent);

  function ReactCrop() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ReactCrop);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ReactCrop.__proto__ || (0, _getPrototypeOf2.default)(ReactCrop)).call.apply(_ref, [this].concat(args))), _this), _this.window = window, _this.document = document, _this.state = {}, _this.onCropMouseTouchDown = function (e) {
      var _this$props = _this.props,
          crop = _this$props.crop,
          disabled = _this$props.disabled;


      if (disabled) {
        return;
      }

      e.preventDefault(); // Stop drag selection.

      var clientPos = getClientPos(e);

      // Focus for detecting keypress.
      _this.componentRef.focus({ preventScroll: true });

      var ord = e.target.dataset.ord;

      var xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
      var yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

      var cropOffset = void 0;

      if (crop.aspect) {
        cropOffset = _this.getElementOffset(_this.cropSelectRef);
      }

      _this.evData = {
        clientStartX: clientPos.x,
        clientStartY: clientPos.y,
        cropStartWidth: crop.width,
        cropStartHeight: crop.height,
        cropStartX: xInversed ? crop.x + crop.width : crop.x,
        cropStartY: yInversed ? crop.y + crop.height : crop.y,
        xInversed: xInversed,
        yInversed: yInversed,
        xCrossOver: xInversed,
        yCrossOver: yInversed,
        startXCrossOver: xInversed,
        startYCrossOver: yInversed,
        isResize: e.target !== _this.cropSelectRef,
        ord: ord,
        cropOffset: cropOffset
      };

      _this.mouseDownOnCrop = true;
      _this.setState({ cropIsActive: true });
    }, _this.onComponentMouseTouchDown = function (e) {
      var _this$props2 = _this.props,
          crop = _this$props2.crop,
          disabled = _this$props2.disabled,
          keepSelection = _this$props2.keepSelection,
          onChange = _this$props2.onChange;


      if (e.target !== _this.imageRef) {
        return;
      }

      if (disabled || keepSelection && isCropValid(crop)) {
        return;
      }

      e.preventDefault(); // Stop drag selection.

      var clientPos = getClientPos(e);

      // Focus for detecting keypress.
      _this.componentRef.focus({ preventScroll: true });

      var imageOffset = _this.getElementOffset(_this.imageRef);
      var xPc = (clientPos.x - imageOffset.left) / _this.imageRef.width * 100;
      var yPc = (clientPos.y - imageOffset.top) / _this.imageRef.height * 100;

      var nextCrop = {
        aspect: crop ? crop.aspect : undefined,
        x: xPc,
        y: yPc,
        width: 0,
        height: 0
      };

      _this.evData = {
        clientStartX: clientPos.x,
        clientStartY: clientPos.y,
        cropStartWidth: nextCrop.width,
        cropStartHeight: nextCrop.height,
        cropStartX: nextCrop.x,
        cropStartY: nextCrop.y,
        xInversed: false,
        yInversed: false,
        xCrossOver: false,
        yCrossOver: false,
        startXCrossOver: false,
        startYCrossOver: false,
        isResize: true,
        ord: 'nw'
      };

      _this.mouseDownOnCrop = true;
      onChange(nextCrop, getPixelCrop(_this.imageRef, nextCrop));
      _this.setState({ cropIsActive: true });
    }, _this.onDocMouseTouchMove = function (e) {
      var _this$props3 = _this.props,
          crop = _this$props3.crop,
          disabled = _this$props3.disabled,
          onChange = _this$props3.onChange,
          onDragStart = _this$props3.onDragStart;


      onDragStart();

      if (disabled) {
        return;
      }

      if (!_this.mouseDownOnCrop) {
        return;
      }

      e.preventDefault(); // Stop drag selection.

      var _this2 = _this,
          evData = _this2.evData;

      var clientPos = getClientPos(e);

      if (evData.isResize && crop.aspect && evData.cropOffset) {
        clientPos.y = _this.straightenYPath(clientPos.x);
      }

      var xDiffPx = clientPos.x - evData.clientStartX;
      evData.xDiffPc = xDiffPx / _this.imageRef.width * 100;

      var yDiffPx = clientPos.y - evData.clientStartY;
      evData.yDiffPc = yDiffPx / _this.imageRef.height * 100;

      var nextCrop = void 0;

      if (evData.isResize) {
        nextCrop = _this.resizeCrop();
      } else {
        nextCrop = _this.dragCrop();
      }

      if (nextCrop !== crop) {
        onChange(nextCrop, getPixelCrop(_this.imageRef, nextCrop));
      }
    }, _this.onComponentKeyDown = function (e) {
      var _this$props4 = _this.props,
          crop = _this$props4.crop,
          disabled = _this$props4.disabled,
          onChange = _this$props4.onChange,
          onComplete = _this$props4.onComplete;


      if (disabled) {
        return;
      }

      var keyCode = e.which;
      var nudged = false;

      if (!isCropValid(crop)) {
        return;
      }

      var nextCrop = _this.makeNewCrop();

      if (keyCode === ReactCrop.arrowKey.left) {
        nextCrop.x -= ReactCrop.nudgeStep;
        nudged = true;
      } else if (keyCode === ReactCrop.arrowKey.right) {
        nextCrop.x += ReactCrop.nudgeStep;
        nudged = true;
      } else if (keyCode === ReactCrop.arrowKey.up) {
        nextCrop.y -= ReactCrop.nudgeStep;
        nudged = true;
      } else if (keyCode === ReactCrop.arrowKey.down) {
        nextCrop.y += ReactCrop.nudgeStep;
        nudged = true;
      }

      if (nudged) {
        e.preventDefault(); // Stop drag selection.
        nextCrop.x = clamp(nextCrop.x, 0, 100 - nextCrop.width);
        nextCrop.y = clamp(nextCrop.y, 0, 100 - nextCrop.height);

        onChange(nextCrop, getPixelCrop(_this.imageRef, nextCrop));
        onComplete(nextCrop, getPixelCrop(_this.imageRef, nextCrop));
      }
    }, _this.onDocMouseTouchEnd = function () {
      var _this$props5 = _this.props,
          crop = _this$props5.crop,
          disabled = _this$props5.disabled,
          onComplete = _this$props5.onComplete,
          onDragEnd = _this$props5.onDragEnd;


      onDragEnd();

      if (disabled) {
        return;
      }

      if (_this.mouseDownOnCrop) {
        _this.mouseDownOnCrop = false;

        onComplete(crop, getPixelCrop(_this.imageRef, crop));
        _this.setState({ cropIsActive: false });
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ReactCrop, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var options = passiveSupported ? { passive: false } : false;

      this.document.addEventListener('mousemove', this.onDocMouseTouchMove, options);
      this.document.addEventListener('touchmove', this.onDocMouseTouchMove, options);

      this.document.addEventListener('mouseup', this.onDocMouseTouchEnd, options);
      this.document.addEventListener('touchend', this.onDocMouseTouchEnd, options);
      this.document.addEventListener('touchcancel', this.onDocMouseTouchEnd, options);

      if (this.imageRef.complete || this.imageRef.readyState) {
        if (this.imageRef.naturalWidth === 0) {
          // Broken load on iOS, PR #51
          // https://css-tricks.com/snippets/jquery/fixing-load-in-ie-for-cached-images/
          // http://stackoverflow.com/questions/821516/browser-independent-way-to-detect-when-image-has-been-loaded
          var src = this.imageRef.src;

          this.imageRef.src = EMPTY_GIF;
          this.imageRef.src = src;
        } else {
          this.onImageLoad(this.imageRef);
        }
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.crop !== this.props.crop) {
        this.resolveCropAndTriggerChange(this.props.crop, this.imageRef);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.document.removeEventListener('mousemove', this.onDocMouseTouchMove);
      this.document.removeEventListener('touchmove', this.onDocMouseTouchMove);

      this.document.removeEventListener('mouseup', this.onDocMouseTouchEnd);
      this.document.removeEventListener('touchend', this.onDocMouseTouchEnd);
      this.document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);
    }
  }, {
    key: 'onImageLoad',
    value: function onImageLoad(image) {
      var crop = this.resolveCropAndTriggerChange(this.props.crop, image);
      this.props.onImageLoaded(image, getPixelCrop(image, crop));
    }
  }, {
    key: 'getElementOffset',
    value: function getElementOffset(el) {
      var rect = el.getBoundingClientRect();
      var docEl = this.document.documentElement;

      var rectTop = rect.top + this.window.pageYOffset - docEl.clientTop;
      var rectLeft = rect.left + this.window.pageXOffset - docEl.clientLeft;

      return {
        top: rectTop,
        left: rectLeft
      };
    }
  }, {
    key: 'getCropStyle',
    value: function getCropStyle() {
      var crop = this.props.crop;

      return {
        top: crop.y + '%',
        left: crop.x + '%',
        width: crop.width + '%',
        height: crop.height + '%'
      };
    }
  }, {
    key: 'getNewSize',
    value: function getNewSize() {
      var _props = this.props,
          crop = _props.crop,
          minWidth = _props.minWidth,
          maxWidth = _props.maxWidth,
          minHeight = _props.minHeight,
          maxHeight = _props.maxHeight;
      var evData = this.evData;

      var imageAspect = this.imageRef.width / this.imageRef.height;

      // New width.
      var newWidth = evData.cropStartWidth + evData.xDiffPc;

      if (evData.xCrossOver) {
        newWidth = Math.abs(newWidth);
      }

      newWidth = clamp(newWidth, minWidth, maxWidth);

      // New height.
      var newHeight = void 0;

      if (crop.aspect) {
        newHeight = newWidth / crop.aspect * imageAspect;
      } else {
        newHeight = evData.cropStartHeight + evData.yDiffPc;
      }

      if (evData.yCrossOver) {
        // Cap if polarity is inversed and the height fills the y space.
        newHeight = Math.min(Math.abs(newHeight), evData.cropStartY);
      }

      newHeight = clamp(newHeight, minHeight, maxHeight);

      if (crop.aspect) {
        newWidth = clamp(newHeight * crop.aspect / imageAspect, 0, 100);
      }

      return {
        width: newWidth,
        height: newHeight
      };
    }
  }, {
    key: 'resolveCropAndTriggerChange',
    value: function resolveCropAndTriggerChange(crop, image) {
      var resolvedCrop = resolveCrop(crop, image);
      if (resolvedCrop !== crop) {
        this.props.onChange(resolvedCrop, getPixelCrop(image, resolvedCrop));
        this.props.onComplete(resolvedCrop, getPixelCrop(image, resolvedCrop));
      }
      return resolvedCrop;
    }
  }, {
    key: 'dragCrop',
    value: function dragCrop() {
      var nextCrop = this.makeNewCrop();
      var evData = this.evData;

      nextCrop.x = clamp(evData.cropStartX + evData.xDiffPc, 0, 100 - nextCrop.width);
      nextCrop.y = clamp(evData.cropStartY + evData.yDiffPc, 0, 100 - nextCrop.height);
      return nextCrop;
    }
  }, {
    key: 'resizeCrop',
    value: function resizeCrop() {
      var nextCrop = this.makeNewCrop();
      var evData = this.evData;
      var _props2 = this.props,
          crop = _props2.crop,
          minWidth = _props2.minWidth,
          minHeight = _props2.minHeight;
      var ord = evData.ord;

      var imageAspect = this.imageRef.width / this.imageRef.height;

      // On the inverse change the diff so it's the same and
      // the same algo applies.
      if (evData.xInversed) {
        evData.xDiffPc -= evData.cropStartWidth * 2;
      }
      if (evData.yInversed) {
        evData.yDiffPc -= evData.cropStartHeight * 2;
      }

      // New size.
      var newSize = this.getNewSize();

      // Adjust x/y to give illusion of 'staticness' as width/height is increased
      // when polarity is inversed.
      var newX = evData.cropStartX;
      var newY = evData.cropStartY;

      if (evData.xCrossOver) {
        newX = nextCrop.x + (nextCrop.width - newSize.width);
      }

      if (evData.yCrossOver) {
        // This not only removes the little "shake" when inverting at a diagonal, but for some
        // reason y was way off at fast speeds moving sw->ne with fixed aspect only, I couldn't
        // figure out why.
        if (evData.lastYCrossover === false) {
          newY = nextCrop.y - newSize.height;
        } else {
          newY = nextCrop.y + (nextCrop.height - newSize.height);
        }
      }

      var containedCrop = containCrop(this.props.crop, {
        x: newX,
        y: newY,
        width: newSize.width,
        height: newSize.height,
        aspect: nextCrop.aspect
      }, imageAspect);

      // Apply x/y/width/height changes depending on ordinate (fixed aspect always applies both).
      if (nextCrop.aspect || ReactCrop.xyOrds.indexOf(ord) > -1) {
        nextCrop.x = containedCrop.x;
        nextCrop.y = containedCrop.y;
        nextCrop.width = containedCrop.width;
        nextCrop.height = containedCrop.height;
      } else if (ReactCrop.xOrds.indexOf(ord) > -1) {
        nextCrop.x = containedCrop.x;
        nextCrop.width = containedCrop.width;
      } else if (ReactCrop.yOrds.indexOf(ord) > -1) {
        nextCrop.y = containedCrop.y;
        nextCrop.height = containedCrop.height;
      }

      evData.lastYCrossover = evData.yCrossOver;
      this.crossOverCheck();

      // Ensure new dimensions aren't less than min dimensions.
      if (minWidth && nextCrop.width < minWidth) {
        return crop;
      }

      if (minHeight && nextCrop.height < minHeight) {
        return crop;
      }

      return nextCrop;
    }
  }, {
    key: 'straightenYPath',
    value: function straightenYPath(clientX) {
      var evData = this.evData;
      var ord = evData.ord;
      var cropOffset = evData.cropOffset;

      var cropStartWidth = evData.cropStartWidth / 100 * this.imageRef.width;
      var cropStartHeight = evData.cropStartHeight / 100 * this.imageRef.height;
      var k = void 0;
      var d = void 0;

      if (ord === 'nw' || ord === 'se') {
        k = cropStartHeight / cropStartWidth;
        d = cropOffset.top - cropOffset.left * k;
      } else {
        k = -cropStartHeight / cropStartWidth;
        d = cropOffset.top + (cropStartHeight - cropOffset.left * k);
      }

      return k * clientX + d;
    }
  }, {
    key: 'createCropSelection',
    value: function createCropSelection() {
      var _this3 = this;

      var disabled = this.props.disabled;

      var style = this.getCropStyle();

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(n) {
            _this3.cropSelectRef = n;
          },
          style: style,
          className: 'ReactCrop__crop-selection',
          onMouseDown: this.onCropMouseTouchDown,
          onTouchStart: this.onCropMouseTouchDown,
          role: 'presentation'
        },
        !disabled && _react2.default.createElement(
          'div',
          { className: 'ReactCrop__drag-elements' },
          _react2.default.createElement('div', { className: 'ReactCrop__drag-bar ord-n', 'data-ord': 'n' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-bar ord-e', 'data-ord': 'e' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-bar ord-s', 'data-ord': 's' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-bar ord-w', 'data-ord': 'w' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-nw', 'data-ord': 'nw' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-n', 'data-ord': 'n' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-ne', 'data-ord': 'ne' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-e', 'data-ord': 'e' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-se', 'data-ord': 'se' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-s', 'data-ord': 's' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-sw', 'data-ord': 'sw' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-w', 'data-ord': 'w' })
        )
      );
    }
  }, {
    key: 'makeNewCrop',
    value: function makeNewCrop() {
      return (0, _extends3.default)({}, ReactCrop.defaultCrop, this.props.crop);
    }
  }, {
    key: 'crossOverCheck',
    value: function crossOverCheck() {
      var evData = this.evData;


      if (!evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiffPc >= 0 || evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiffPc <= 0) {
        evData.xCrossOver = !evData.xCrossOver;
      }

      if (!evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiffPc >= 0 || evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiffPc <= 0) {
        evData.yCrossOver = !evData.yCrossOver;
      }

      var swapXOrd = evData.xCrossOver !== evData.startXCrossOver;
      var swapYOrd = evData.yCrossOver !== evData.startYCrossOver;

      evData.inversedXOrd = swapXOrd ? inverseOrd(evData.ord) : false;
      evData.inversedYOrd = swapYOrd ? inverseOrd(evData.ord) : false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props3 = this.props,
          children = _props3.children,
          className = _props3.className,
          crossorigin = _props3.crossorigin,
          crop = _props3.crop,
          disabled = _props3.disabled,
          imageAlt = _props3.imageAlt,
          onImageError = _props3.onImageError,
          src = _props3.src,
          style = _props3.style,
          imageStyle = _props3.imageStyle;
      var cropIsActive = this.state.cropIsActive;

      var cropSelection = void 0;

      if (isCropValid(crop)) {
        cropSelection = this.createCropSelection();
      }

      var componentClasses = ['ReactCrop'];

      if (cropIsActive) {
        componentClasses.push('ReactCrop--active');
      }

      if (crop) {
        if (crop.aspect) {
          componentClasses.push('ReactCrop--fixed-aspect');
        }

        // In this case we have to shadow the image, since the box-shadow
        // on the crop won't work.
        if (cropIsActive && (!crop.width || !crop.height)) {
          componentClasses.push('ReactCrop--crop-invisible');
        }
      }

      if (disabled) {
        componentClasses.push('ReactCrop--disabled');
      }

      if (className) {
        componentClasses.push.apply(componentClasses, (0, _toConsumableArray3.default)(className.split(' ')));
      }

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(n) {
            _this4.componentRef = n;
          },
          className: componentClasses.join(' '),
          style: style,
          onTouchStart: this.onComponentMouseTouchDown,
          onMouseDown: this.onComponentMouseTouchDown,
          role: 'presentation',
          tabIndex: '1',
          onKeyDown: this.onComponentKeyDown
        },
        _react2.default.createElement('img', {
          ref: function ref(n) {
            _this4.imageRef = n;
          },
          crossOrigin: crossorigin,
          className: 'ReactCrop__image',
          style: imageStyle,
          src: src,
          onLoad: function onLoad(e) {
            return _this4.onImageLoad(e.target);
          },
          onError: onImageError,
          alt: imageAlt
        }),
        cropSelection,
        children
      );
    }
  }]);
  return ReactCrop;
}(_react.PureComponent);

ReactCrop.xOrds = ['e', 'w'];
ReactCrop.yOrds = ['n', 's'];
ReactCrop.xyOrds = ['nw', 'ne', 'se', 'sw'];

ReactCrop.arrowKey = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

ReactCrop.nudgeStep = 0.2;

ReactCrop.defaultCrop = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

ReactCrop.propTypes = {
  className: _propTypes2.default.string,
  crossorigin: _propTypes2.default.string,
  children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.node), _propTypes2.default.node]),
  crop: _propTypes2.default.shape({
    aspect: _propTypes2.default.number,
    x: _propTypes2.default.number,
    y: _propTypes2.default.number,
    width: _propTypes2.default.number,
    height: _propTypes2.default.number
  }),
  disabled: _propTypes2.default.bool,
  imageAlt: _propTypes2.default.string,
  imageStyle: _propTypes2.default.shape({}),
  keepSelection: _propTypes2.default.bool,
  minWidth: _propTypes2.default.number,
  minHeight: _propTypes2.default.number,
  maxWidth: _propTypes2.default.number,
  maxHeight: _propTypes2.default.number,
  onChange: _propTypes2.default.func.isRequired,
  onImageError: _propTypes2.default.func,
  onComplete: _propTypes2.default.func,
  onImageLoaded: _propTypes2.default.func,
  onDragStart: _propTypes2.default.func,
  onDragEnd: _propTypes2.default.func,
  src: _propTypes2.default.string.isRequired,
  style: _propTypes2.default.shape({})
};

ReactCrop.defaultProps = {
  className: undefined,
  crop: undefined,
  crossorigin: undefined,
  disabled: false,
  imageAlt: '',
  maxWidth: 100,
  maxHeight: 100,
  minWidth: 0,
  minHeight: 0,
  keepSelection: false,
  onComplete: function onComplete() {},
  onImageError: function onImageError() {},
  onImageLoaded: function onImageLoaded() {},
  onDragStart: function onDragStart() {},
  onDragEnd: function onDragEnd() {},
  children: undefined,
  style: undefined,
  imageStyle: undefined
};

exports.default = ReactCrop;
exports.Component = ReactCrop;
exports.getPixelCrop = getPixelCrop;
exports.makeAspectCrop = makeAspectCrop;
exports.containCrop = containCrop;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(46);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(47), __esModule: true };

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(32);
__webpack_require__(55);
module.exports = __webpack_require__(0).Array.from;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(18)
  , defined   = __webpack_require__(19);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(23)
  , descriptor     = __webpack_require__(12)
  , setToStringTag = __webpack_require__(28)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(8)(IteratorPrototype, __webpack_require__(1)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(4)
  , anObject = __webpack_require__(9)
  , getKeys  = __webpack_require__(14);

module.exports = __webpack_require__(5) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(7)
  , toLength  = __webpack_require__(39)
  , toIndex   = __webpack_require__(53);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(18)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3).document && document.documentElement;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx            = __webpack_require__(21)
  , $export        = __webpack_require__(2)
  , toObject       = __webpack_require__(16)
  , call           = __webpack_require__(56)
  , isArrayIter    = __webpack_require__(57)
  , toLength       = __webpack_require__(39)
  , createProperty = __webpack_require__(58)
  , getIterFn      = __webpack_require__(59);

$export($export.S + $export.F * !__webpack_require__(61)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(9);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(13)
  , ITERATOR   = __webpack_require__(1)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(4)
  , createDesc      = __webpack_require__(12);

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(60)
  , ITERATOR  = __webpack_require__(1)('iterator')
  , Iterators = __webpack_require__(13);
module.exports = __webpack_require__(0).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(24)
  , TAG = __webpack_require__(1)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(1)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(63), __esModule: true };

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(64);
module.exports = __webpack_require__(0).Object.getPrototypeOf;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(16)
  , $getPrototypeOf = __webpack_require__(40);

__webpack_require__(65)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(2)
  , core    = __webpack_require__(0)
  , fails   = __webpack_require__(10);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(68);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(69), __esModule: true };

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(70);
var $Object = __webpack_require__(0).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(2);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(5), 'Object', {defineProperty: __webpack_require__(4).f});

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(41);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(73), __esModule: true };

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(32);
__webpack_require__(74);
module.exports = __webpack_require__(29).f('iterator');

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(75);
var global        = __webpack_require__(3)
  , hide          = __webpack_require__(8)
  , Iterators     = __webpack_require__(13)
  , TO_STRING_TAG = __webpack_require__(1)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(76)
  , step             = __webpack_require__(77)
  , Iterators        = __webpack_require__(13)
  , toIObject        = __webpack_require__(7);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(33)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(79), __esModule: true };

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(80);
__webpack_require__(86);
__webpack_require__(87);
__webpack_require__(88);
module.exports = __webpack_require__(0).Symbol;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(3)
  , has            = __webpack_require__(6)
  , DESCRIPTORS    = __webpack_require__(5)
  , $export        = __webpack_require__(2)
  , redefine       = __webpack_require__(36)
  , META           = __webpack_require__(81).KEY
  , $fails         = __webpack_require__(10)
  , shared         = __webpack_require__(26)
  , setToStringTag = __webpack_require__(28)
  , uid            = __webpack_require__(15)
  , wks            = __webpack_require__(1)
  , wksExt         = __webpack_require__(29)
  , wksDefine      = __webpack_require__(30)
  , keyOf          = __webpack_require__(82)
  , enumKeys       = __webpack_require__(83)
  , isArray        = __webpack_require__(84)
  , anObject       = __webpack_require__(9)
  , toIObject      = __webpack_require__(7)
  , toPrimitive    = __webpack_require__(22)
  , createDesc     = __webpack_require__(12)
  , _create        = __webpack_require__(23)
  , gOPNExt        = __webpack_require__(85)
  , $GOPD          = __webpack_require__(43)
  , $DP            = __webpack_require__(4)
  , $keys          = __webpack_require__(14)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(42).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(17).f  = $propertyIsEnumerable;
  __webpack_require__(31).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(20)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(8)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(15)('meta')
  , isObject = __webpack_require__(11)
  , has      = __webpack_require__(6)
  , setDesc  = __webpack_require__(4).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(10)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(14)
  , toIObject = __webpack_require__(7);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(14)
  , gOPS    = __webpack_require__(31)
  , pIE     = __webpack_require__(17);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(24);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(7)
  , gOPN      = __webpack_require__(42).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 86 */
/***/ (function(module, exports) {



/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('asyncIterator');

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30)('observable');

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(90);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(94);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(41);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(91), __esModule: true };

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(92);
module.exports = __webpack_require__(0).Object.setPrototypeOf;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(2);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(93).set});

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(11)
  , anObject = __webpack_require__(9);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(21)(Function.call, __webpack_require__(43).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(95), __esModule: true };

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(96);
var $Object = __webpack_require__(0).Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(2)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(23)});

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(98);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(99), __esModule: true };

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(100);
module.exports = __webpack_require__(0).Object.assign;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(2);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(101)});

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(14)
  , gOPS     = __webpack_require__(31)
  , pIE      = __webpack_require__(17)
  , toObject = __webpack_require__(16)
  , IObject  = __webpack_require__(38)
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(10)(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_102__;

/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_103__;

/***/ })
/******/ ]);
});