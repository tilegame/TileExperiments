"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================================
// Websockets 
// ------------------------------------------------
{
  var WebSocketHub =
  /*#__PURE__*/
  function () {
    function WebSocketHub(address) {
      _classCallCheck(this, WebSocketHub);

      this.conn = new WebSocket(address);
      this.conn.onopen = WebSocketHub.DefaultHandleOpen;
      this.conn.onclose = WebSocketHub.DefaultHandleClose;
      this.conn.onmessage = WebSocketHub.DefaultHandleMessage;
      this.uid = 123;
    }

    _createClass(WebSocketHub, [{
      key: "nextId",
      value: function nextId() {
        this.uid = this.uid + 1;
        var copy = this.uid;
        return copy;
      }
    }, {
      key: "send",
      value: function send(MessageString) {
        // Increment the id counter so we can match up the message.
        // let id = this.nextId()
        // Convert the parameters into an array
        var Parameters = [];

        for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          params[_key - 1] = arguments[_key];
        }

        for (var _i = 0; _i < params.length; _i++) {
          var p = params[_i];
          Parameters.push(p);
        } // Convert into a JSON message, according to the server APIs.


        var msg = JSON.stringify({
          // id: id,
          method: MessageString,
          params: Parameters //time: (new Date()).getTime(),

        }); // Send the JSON message across the websocket.

        this.conn.send(msg);
        return;
      }
    }], [{
      key: "DefaultHandleOpen",
      value: function DefaultHandleOpen(evt) {
        console.log("Connection Opened: ".concat(evt.currentTarget.url));
      }
    }, {
      key: "DefaultHandleClose",
      value: function DefaultHandleClose(evt) {
        console.log("Connection Closed: ".concat(evt.currentTarget.url));
      }
    }, {
      key: "DefaultHandleMessage",
      value: function DefaultHandleMessage(evt) {
        var messages = evt.data.split('\n');

        for (var i = 0; i < messages.length; i++) {
          WebSocketHub.HandleJSONMessage(messages[i]);
        }
      }
    }, {
      key: "HandleJSONMessage",
      value: function HandleJSONMessage(IncomingMessage) {
        var msg = JSON.parse(IncomingMessage); // msg.TIME = new Date(msg.time).toTimeString()
        // console.log(msg)

        game.net.HandleMessage(msg);
      }
    }]);

    return WebSocketHub;
  }();

  game.classes.net.WebSocketHub = WebSocketHub; // Set the Alias variable 'ws' to it function.

  ws = function ws(string) {
    var _game$net$ws;

    for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      params[_key2 - 1] = arguments[_key2];
    }

    return (_game$net$ws = game.net.ws).send.apply(_game$net$ws, [string].concat(params));
  };

  var wsreset = function wsreset() {
    game.net.ws.conn.addEventListener('close', function () {
      game.net.StartLocal();
    });
    game.net.ws.conn.close();
  };
} // ================================================
// game.net
// ------------------------------------------------

{
  game.net = {
    init: function init() {
      this.ws = this.ConnectTo(this.DEFAULT_SERVER);
    },
    // Canonical URL of the game websocket server.
    DEFAULT_SERVER: new URL('wss://thebachend.com/ws/echo'),
    // Creates a new WebSocketHub using the specified address.
    ConnectTo: function ConnectTo(address) {
      if (window["WebSocket"]) {
        return new game.classes.net.WebSocketHub(address);
      } else {
        throw new Error("Cannot connect to Websocket at ".concat(address));
      }
    },
    // NOTE! DEFAULT_LOCAL_SERVER definition is a kludge.
    // If you don't know what this is doing: remove it. 
    DEFAULT_LOCAL_SERVER: new URL("ws://".concat(window.location.hostname, ":8090/ws/echo")),
    StartLocal: function StartLocal() {
      this.ws = this.ConnectTo(this.DEFAULT_LOCAL_SERVER);
      game.net.ws.conn.addEventListener('open', function () {
        ws('add', game.MY_USER);
        ws('move', game.MY_USER, 2, 8);
        ws('list');
      });
      return this.ws;
    }
  };
} // ================================================
// game.net.HandleMessage
// ------------------------------------------------

{
  var HandleIncomingMessage = function HandleIncomingMessage(message) {
    if (message.kind === undefined) {
      return;
    }

    var f = funcMap[message.kind];

    if (typeof f !== 'function') {
      throw new Error("message kind not implemented: ".concat(message.kind));
    }

    f(message);
  };

  var handlePlayerList = function handlePlayerList(message) {
    game.player.UpdateList(message.result);
  };

  var handleUpdateTargets = function handleUpdateTargets(message) {
    var _arr = Object.entries(message.result);

    for (var _i2 = 0; _i2 < _arr.length; _i2++) {
      var _arr$_i = _slicedToArray(_arr[_i2], 2),
          name = _arr$_i[0],
          pos = _arr$_i[1];

      game.player.list2[name].TargetPos = pos;
    }
  };

  var handleChat = function handleChat(message) {
    console.log(message);
    var _message$result = message.result,
        User = _message$result.User,
        Message = _message$result.Message; // use setText for lasting messages (until you logout).

    game.player.list.get(User).chatbox.setText(Message); // use doMessage for self-clearing messages.
    // game.player.list.get(User).chatbox.doMessage(Message)
  };

  // function mapping:  (message.kind) -> (function(message))
  var funcMap = {
    'playerlist': handlePlayerList,
    'UpdateTargets': handleUpdateTargets,
    'chat': handleChat // Lookup the function to execute based on the message kind.

  };
  game.net.HandleMessage = HandleIncomingMessage;
} // ================================================
// Sending chat messages with Chat Form.
// ------------------------------------------------

{
  var submitChat = function submitChat() {
    if (!chatbar.value) {
      return false;
    }

    if (!game.net.ws.conn) {
      return false;
    }

    ws('chat', game.MY_USER, chatbar.value);
    chatbar.value = "";
    return false;
  };

  var chatbar = document.querySelector('#ChatBar');
  var chatform = document.querySelector('#ChatInputForm');
  chatform.onsubmit = submitChat;
}