"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// ================================================
// game.player 
// ------------------------------------------------
{
  var init = function init() {
    // game.player.list is the client's local playerlist.
    this.list = new Map(); // activeset is used to detect when players have left the area.
    // when a FullPlayerList message is received, this activelist
    // gets filled with the player names.  Then, Refresh() is called
    // to remove any players that aren't in this activelist.

    this.active = new Set();

    this.me = function () {
      return game.player.list.get(game.MY_USER);
    };
  }; // UpdateList refreshes the playerlist and replaces it with
  // the list provided by the server.


  var UpdateList = function UpdateList(result) {
    this.active.clear();

    var _arr = Object.entries(result);

    for (var _i = 0; _i < _arr.length; _i++) {
      var _arr$_i = _slicedToArray(_arr[_i], 2),
          name = _arr$_i[0],
          _p = _arr$_i[1];

      // Create a new player object if it hasn't been added yet.
      if (!this.list.has(name)) {
        this.list.set(name, game.classes.Player.New(name));
      } // Retrieve the player object.


      var play = this.list.get(name); // Update the position values

      {
        var _p$CurrentPos = _p.CurrentPos,
            X = _p$CurrentPos.X,
            Y = _p$CurrentPos.Y;
        play.setPos(X, Y);
      }
      {
        var _p$TargetPos = _p.TargetPos,
            _X = _p$TargetPos.X,
            _Y = _p$TargetPos.Y;
        play.setTarget(_X, _Y);
      }
      play.Draw(); // Add the name to the Active set so we don't delete it.

      this.active.add(name);
    }

    this.Refresh();
  }; // check for any names that are no longer active.  Remove them
  // so they don't continue to appear on the screen.


  var Refresh = function Refresh() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.list.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var name = _step.value;

        if (this.active.has(name)) {
          this.active.delete(name);
        } else {
          this.list.get(name).canvas.remove();
          this.list.get(name).chatbox.remove();
          this.list.delete(name);
        }
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
  }; // Draws all players based on their current positions.


  var DrawAll = function DrawAll() {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _step2$value = _slicedToArray(_step2.value, 2);

        name = _step2$value[0];
        p = _step2$value[1];
        p.Draw();
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    DrawTargetBox();
  };

  var DrawTargetBox = function DrawTargetBox() {
    var _game$player$me$Targe = game.player.me().TargetPos,
        X = _game$player$me$Targe.X,
        Y = _game$player$me$Targe.Y;

    var _game$camera$getTileT = game.camera.getTileTopLeft(X, Y),
        top = _game$camera$getTileT.top,
        left = _game$camera$getTileT.left;

    targetbox.style.top = top + 'px';
    targetbox.style.left = left + 'px';
  };

  var targetbox = document.querySelector('#myclickbox');
  game.player = {
    init: init,
    UpdateList: UpdateList,
    Refresh: Refresh,
    DrawAll: DrawAll,
    DrawTargetBox: DrawTargetBox
  };
} // ================================================
// Class Player
// ------------------------------------------------

{
  var Player =
  /*#__PURE__*/
  function () {
    function Player(canvas, name) {
      _classCallCheck(this, Player);

      this.name = name;
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.CurrentPos = {
        X: 1,
        Y: 1
      };
      this.TargetPos = {
        X: 1,
        Y: 1
      };
      this.chatbox = new game.chat.ChatBox();
      this.chatbox.setText(this.name);
    } // NewPlayer creates a new canvas for the player at the specified
    // location, and attaches it to the document body.  The player
    // object is returned.


    _createClass(Player, [{
      key: "setPos",
      // setPos force-moves the player to the exact position specified
      // by directly changing the position both logically and visually.
      value: function setPos(X, Y) {
        this.CurrentPos = {
          X: X,
          Y: Y
        };
        this.chatbox.setPos(X, Y);
      } // setTarget simply changes the value of the player's target Position.

    }, {
      key: "setTarget",
      value: function setTarget(X, Y) {
        this.TargetPos = {
          X: X,
          Y: Y
        };
      } // Draw doesn't actually re-draw, but it updates it's location
      // in the CSS, which effectively redraws it.

    }, {
      key: "Draw",
      value: function Draw() {
        var _this$CurrentPos = this.CurrentPos,
            X = _this$CurrentPos.X,
            Y = _this$CurrentPos.Y;
        var top = game.TILE_SIZE * (Y - game.camera.FirstTile.y);
        var left = game.TILE_SIZE * (X - game.camera.FirstTile.x);
        this.canvas.style.setProperty('top', "".concat(top, "px"));
        this.canvas.style.setProperty('left', "".concat(left, "px"));
      } // moveTo sets the target position of the player, and sends a 
      // websocket message to the server, informing the server that
      // the player wants to move.

    }, {
      key: "moveTo",
      value: function moveTo(tx, ty) {
        ws('move', this.name, tx, ty);
      } // Player.scrollTo centers the camera on the tile that the 
      // player is standing on.

    }, {
      key: "scrollTo",
      value: function scrollTo() {
        var _this$CurrentPos2 = this.CurrentPos,
            X = _this$CurrentPos2.X,
            Y = _this$CurrentPos2.Y;
        game.camera.scrollToTile(X, Y);
      }
    }], [{
      key: "New",
      value: function New(name) {
        // Creates a new Canvas.
        var canvas = document.createElement('canvas');
        var attr = {
          width: game.TILE_SIZE,
          height: game.TILE_SIZE,
          class: 'player'
        };

        var _arr2 = Object.entries(attr);

        for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
          var _arr2$_i = _slicedToArray(_arr2[_i2], 2),
              key = _arr2$_i[0],
              val = _arr2$_i[1];

          canvas.setAttribute(key, val);
        }

        document.querySelector('#WrapPlayerLayer').appendChild(canvas); // Creates the player objects and passes it the new canvas.

        var p = new Player(canvas, name); // Add to the player list.

        game.player.list.set(name, p); // Return a reference to the newly created player.

        return p;
      }
    }]);

    return Player;
  }();

  game.classes.Player = Player;
}