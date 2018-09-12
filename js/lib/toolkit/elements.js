"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

{
  // Time Bomb is an event that deletes the given element
  // after the specified amount of milliseconds.
  var TimeBomb = function TimeBomb(element, duration) {
    window.setTimeout(function () {
      element.remove();
    }, duration);
  }; // helper function for creating new elements.


  var MakeElement = function MakeElement(ElementType, Attributes, Parent) {
    var ele = document.createElement(ElementType); // Iterate through the attributes and add them.

    if (Attributes !== undefined) {
      var _arr = Object.entries(Attributes);

      for (var _i = 0; _i < _arr.length; _i++) {
        var _arr$_i = _slicedToArray(_arr[_i], 2),
            key = _arr$_i[0],
            val = _arr$_i[1];

        ele.setAttribute(key, val);
      }
    } // Parent can be either an object or a selector string.


    if (Parent !== undefined) {
      switch (_typeof(Parent)) {
        case "object":
          Parent.appendChild(ele);

        case "string":
          document.querySelector(Parent).appendChild(ele);
      }
    }

    return ele;
  };

  game.toolkit = Object.assign({
    TimeBomb: TimeBomb,
    MakeElement: MakeElement
  }, game.toolkit);
}