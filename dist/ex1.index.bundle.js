
var myLib = 
  (() => {
    var __webpack_modules__ = ({
      "./example/ex1/entry.js":
        ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
          "use strict";
          eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _message_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./message.js */ \"./example/ex1/message.js\");\n/* harmony import */ var _index_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.html */ \"./example/ex1/index.html\");\n/* harmony import */ var _index_html__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_index_html__WEBPACK_IMPORTED_MODULE_1__);\n\r\n\r\nconsole.log(_message_js__WEBPACK_IMPORTED_MODULE_0__.default);\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\r\n    message: _message_js__WEBPACK_IMPORTED_MODULE_0__.default,\r\n    html: (_index_html__WEBPACK_IMPORTED_MODULE_1___default())\r\n});\n\n//# sourceURL=webpack://myLib/./example/ex1/entry.js?");

        }),
      "./example/ex1/message.js":
        ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
          "use strict";
          eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _name_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./name.js */ \"./example/ex1/name.js\");\n\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (`hello ${_name_js__WEBPACK_IMPORTED_MODULE_0__.name}!`);\r\n\n\n//# sourceURL=webpack://myLib/./example/ex1/message.js?");

        }),
      "./example/ex1/name.js":
        ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
          "use strict";
          eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"name\": () => /* binding */ name\n/* harmony export */ });\nconst name = 'world';\r\n\n\n//# sourceURL=webpack://myLib/./example/ex1/name.js?");

        })
    });

    // The module cache
    var __webpack_module_cache__ = {};
    // The require function
    function __webpack_require__(moduleId) {
      // Check if module is in cache
      if (__webpack_module_cache__[moduleId]) {
        return __webpack_module_cache__[moduleId].exports;

      }
      // Create a new module (and put it into the cache)
      var module = __webpack_module_cache__[moduleId] = {
        // no module.id needed
        // no module.loaded needed
        exports: {}

      };

      // Execute the module function
      __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

      // Return the exports of the module
      return module.exports;

    }

    /************************************************************************/
    /* webpack/runtime/compat get default export */
    (() => {
      // getDefaultExport function for compatibility with non-harmony modules
      __webpack_require__.n = (module) => {
        var getter = module && module.__esModule ?
          () => module['default'] :
          () => module;
        __webpack_require__.d(getter, { a: getter });
        return getter;
      };
    })();

    /* webpack/runtime/define property getters */
    (() => {
      // define getter functions for harmony exports
      __webpack_require__.d = (exports, definition) => {
        for (var key in definition) {
          if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
          }
        }
      };
    })();

    /* webpack/runtime/hasOwnProperty shorthand */
    (() => {
      __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
    })();

    /* webpack/runtime/make namespace object */
    (() => {
      // define __esModule on exports
      __webpack_require__.r = (exports) => {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
          Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
      };
    })();

    /************************************************************************/
    // Load entry module and return exports
    return __webpack_require__("./example/ex1/entry.js");

  })()
  ;