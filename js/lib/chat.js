"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================================
// In-game Chat
// -----------------------------------------------
// document.styleSheets[0].cssRules[0]
{
  var lolz = function lolz() {
    var examples = ['omg, wat.', 'hello there!', 'why am I a red square?', 'hey, you look like me!', "what's going on here?"];
    var l = [];
    var i = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = game.player.list.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var name = _step.value;
        i++;

        if (i < examples.length) {
          ws('chat', name, examples[i]);
        }

        l.push(name);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return l;
  };

  // stores the mapping of (username -> chatmessage)
  var _chatmap = new Map(); // Creates a new chatbox. It's message can be changed later.


  var ChatBox =
  /*#__PURE__*/
  function () {
    function ChatBox() {
      _classCallCheck(this, ChatBox);

      // the div element that holds the text.
      this.element = game.toolkit.MakeElement('div', {
        class: "chatbox"
      }, '#WrapChat'); // duration is the amount of time before the chat
      // message gets cleared.

      this.duration = 10000; // Start off the chat timebomb (which clears the chat)

      this.timebomb();
    } // setPos places the div element containing the text at a location
    // that keeps the text centered at that tile.


    _createClass(ChatBox, [{
      key: "setPos",
      value: function setPos(tx, ty) {
        var _game$camera$getTileC = game.camera.getTileCenterCoords(tx, ty),
            x = _game$camera$getTileC.x,
            y = _game$camera$getTileC.y; //x += game.TILE_SIZE / 2


        y -= game.TILE_SIZE / 2;
        this.element.style.top = "calc(".concat(y, "px - 1em");
        this.element.style.left = "calc(".concat(x, "px - 33ch)");
      }
    }, {
      key: "setText",
      value: function setText(text) {
        this.element.textContent = text;
      } // doMessage is called by the chat message handler and adds
      // a timer to the text.  It clears previous timers, to prevent 
      // multiple timers from existing at the same time.

    }, {
      key: "doMessage",
      value: function doMessage(text) {
        this.setText(text);
        window.clearTimeout(this.timer);
        this.timebomb();
      } // Timebomb creates a new timer that will clear the chat 
      // after some pre-specfied amount of time.

    }, {
      key: "timebomb",
      value: function timebomb() {
        var _this = this;

        this.timer = window.setTimeout(function () {
          _this.clear();
        }, this.duration);
      }
    }, {
      key: "remove",
      value: function remove() {
        this.element.remove();
      }
    }, {
      key: "clear",
      value: function clear() {
        this.element.textContent = "";
      }
    }]);

    return ChatBox;
  }();

  game.chat = {
    ChatBox: ChatBox,
    lolz: lolz
  };
}