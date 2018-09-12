"use strict";

// ================================================
// Init Game Object
// ------------------------------------------------
var game = {
  // Fetcher is used for downloading map data.
  fetcher: {},
  // Atlas: the source image for the visual tiles
  Atlas: {},
  // LogicalMap: contains data for types of tile.
  LogicalMap: {},
  // Magic Variables
  TILE_SIZE: 64,
  BLOCK_SIZE: 960,
  // Holds class definitions
  classes: {
    net: {}
  },
  // toolkit holds helper functions
  toolkit: {},
  // Global Enum Values.
  enums: {
    GROUND_LAYER: 0,
    ABOVE_LAYER: 1
  },
  // Default Player Username
  MY_USER: "user" + new Date().getTime().toString().slice(-7, -2)
};
var ws;
console.log("init done");
"use strict";

// ================================================
// Main
// ------------------------------------------------
game.main = function (event) {
  // Call the init() function on each of the libraries.
  // Display to console for debugging.
  var LibList = ['net', 'player', 'camera', 'drawer', 'debug', 'interact'];

  for (var _i = 0; _i < LibList.length; _i++) {
    var lib = LibList[_i];
    game[lib].init(); // console.log(`$ game.${lib}`, game[lib])
  }

  game.drawer.DrawMap(); // console.log("$ game \n", game)

  game.net.ws.conn.addEventListener('open', function () {
    ws('add', game.MY_USER);
    ws('move', game.MY_USER, 2, 8);
    ws('list');
  });
}; // Start the Fetcher When the Page has loaded.
// The fetcher will call game.main() when the maps have 
// been fetched, and the images have been loaded.


window.addEventListener("load", function () {
  console.log("window loaded");
  game.fetcher.FetchMap(game.fetcher.DEFAULT);
}); // This should be the last .js file to be listed in the html,
// which means it should be the last one to load.
// Check that all definitions have been loaded:
// console.log("$ game.classes \n", game.classes)
"use strict";

// ================================================
// Camera
// ------------------------------------------------

/*
The camera will remain seperate from the player's position.  In this
version of the game, the camera is actually determined by the player's
position, but that will be kept seperate from the class definitions.

The Camera determines the tiles that are visible at any given point
in time, and generates iterators for use by the Renderer.
*/
{
  var setFirstTile = function setFirstTile(X, Y) {
    FirstTile = {
      x: X,
      y: Y
    };
  }; // Scrollable Viewport Element
  // The element that can actually be manipulated using the 
  // scrollTo command.  Originally, this was just the window,
  // but as the HTML structure changes, this element might change.


  // Rectangle Bounds. camera position.
  //     function UpdateBounds() {
  //         this.x0 = position.x - VIEW_RADIUS
  //         this.xf = position.x + VIEW_RADIUS
  //         this.y0 = position.y - VIEW_RADIUS
  //         this.yf = position.y + VIEW_RADIUS
  //     }
  // VisibleTiles Generates an Iterator of TileLocations.
  // Later on, this function will accept parameters that define the
  // shape of the visual area (for example, a Circle instead of a Rectangle).
  //     function *VisibleTiles() {
  //         for (let x = this.x0; x < this.xf; x++) {
  //             for (let y = this.y0; y < this.yf; y++) {
  //                 yield({
  //                     x,
  //                     y
  //                 })
  //             }
  //         }
  //     }
  // Scrolls such that the absolute center tile is displayed in the center 
  // of the screen.
  var center = function center() {
    var w = ScrollableViewport.innerWidth;
    var h = ScrollableViewport.innerHeight;
    var x = game.BLOCK_SIZE * 3 / 2 - w / 2;
    var y = game.BLOCK_SIZE * 3 / 2 - h / 2;
    ScrollableViewport.scrollTo(x, y);
  }; // Scrolls such that the specified tile becomes visible
  // at the center of the screen.


  var scrollToTile = function scrollToTile(a, b) {
    var w = ScrollableViewport.clientWidth;
    var h = ScrollableViewport.clientHeight;
    var x = (a - FirstTile.x) * game.TILE_SIZE - w / 2;
    var y = (b - FirstTile.y) * game.TILE_SIZE - h / 2;
    ScrollableViewport.scrollTo(x, y);
  }; // getTileCenterCoords returns the pixel location of the center 
  // of the specified tile.


  var getTileCenterCoords = function getTileCenterCoords(a, b) {
    return {
      x: (a - FirstTile.x + 0.5) * game.TILE_SIZE,
      y: (b - FirstTile.y + 0.5) * game.TILE_SIZE
    };
  }; // returns the upper-left corner of a tile, which is useful for
  // setting styles like "top" and "left"


  var getTileTopLeft = function getTileTopLeft(a, b) {
    return {
      left: (a - FirstTile.x) * game.TILE_SIZE,
      top: (b - FirstTile.y) * game.TILE_SIZE
    };
  };

  var init = function init() {};

  // The tile where the camera is centered.
  //     let position = {
  //         x: 10,
  //         y: 10
  //     }
  // The radius (in tiles) around which everything is visible.
  // NOTE: For now, this will not be a circle radius, and instead
  // will be the the side length of a square.
  //     let VIEW_RADIUS = 10
  // The TileLocation of the Tile that is currently at square (0,0).
  // This can be negative if the camera is near the edge of the map.
  var FirstTile = {
    x: 0,
    y: 0
  };
  var ScrollableViewport = document.querySelector('#GameViewport');
  game.camera = {
    init: init,
    FirstTile: FirstTile,
    setFirstTile: setFirstTile,
    scrollToTile: scrollToTile,
    getTileCenterCoords: getTileCenterCoords,
    getTileTopLeft: getTileTopLeft,
    ScrollableViewport: ScrollableViewport
  };
}
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
"use strict";

// ================================================
// Canvas Debugging Tools
// ------------------------------------------------
game.debug = {
  init: function init() {},
  // Draws an outine around the tile that is closest to the middle.  The
  // location of the middle of each tile is used in the calculation.  Works
  // for Square Tiles where TilSize is the length of a side.
  OutlineMiddleTile: function OutlineMiddleTile(Canvas, TileSize) {
    var w = Canvas.width;
    var h = Canvas.height;
    var x = w / 2 - w / 2 % TileSize;
    var y = h / 2 - h / 2 % TileSize;
    var ctx = Canvas.getContext('2d');
    var saved = ctx.fillStyle;
    ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
    ctx.strokeRect(x, y, TileSize - 1, TileSize - 1);
    ctx.fillRect(x, y, TileSize - 1, TileSize - 1);
    ctx.fillStyle = saved;
  }
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================================
// Drawer  
// ------------------------------------------------
// {
//   it's the kind of drawer that draws,
//    but since it's pretty much a variable,
//    you can also put things in it.  
//
//     So I guess it's a drawer filled with 
//      shelves of drawing functions.
// }
// TODO: Rename/Move this file to game.graphics.mapblock
{
  var init = function init() {
    // Width and Height of the mapblock will be the same,
    // since the MapBlocks are squares. 
    var tw = TILES_PER_BLOCK;
    var th = TILES_PER_BLOCK;

    for (var row = 0; row < NUM_ROWS; row++) {
      for (var col = 0; col < NUM_COLS; col++) {
        // The starting positions are defined in a special way 
        // because of the placement of the blocks (3 columns).
        // this will change when the positioning changes. 
        var tx0 = col * TILES_PER_BLOCK;
        var ty0 = row * TILES_PER_BLOCK; // Add the canvas list (each of the layers).

        var canvasList = []; // Get the div element that holds the canvases

        var blockElement = WRAP.children[row].children[col]; // Iterate through the layers to retrieve the canvas elements.

        for (var layer = 0; layer < NUM_LAYERS; layer++) {
          canvasList.push(blockElement.children[layer]);
        } // Create the MapBlock object.


        var block = new game.classes.MapBlock(canvasList, tx0, ty0, tw, th); // TODO: replace blocklist with GridOfMapBlocks
        //
        // add it to the blocklist. 

        blocklist.push(block); // Add the MapBlock to the GridOfMapBlocks

        game.drawer.GridOfMapBlocks.Add(row, col, block);
      }
    }
  }; // Retrieves the MapBlock element based on the position.


  var GetMapBlockElement = function GetMapBlockElement(col, row) {
    var ROW = WRAP.getElementsByClassName('row')[row];
    return ROW.getElementsByClassName('block')[col];
  }; // DrawMap() is called by the fetcher!
  // TODO: split data, For each BLOCK, draw that portion of the map.


  var DrawMap = function DrawMap() {
    for (var _i = 0; _i < blocklist.length; _i++) {
      var mapblock = blocklist[_i];
      mapblock.FullDraw();
    }
  }; // calc Next First Tile is a helper function to determine what
  // the new "FirstTile" of the visual screen is 'logically'.
  // 
  // factorX, factorY should be -1, 0, or 1
  //
  // In the future, this can become more sophisicated, and include
  // things like checks for world boundary limits.
  //


  var calcNextFirstTile = function calcNextFirstTile(factorX, factorY) {
    var _game$camera$FirstTil = game.camera.FirstTile,
        X = _game$camera$FirstTil.x,
        Y = _game$camera$FirstTil.y;
    X += factorX * TILES_PER_BLOCK;
    Y += factorY * TILES_PER_BLOCK;
    return {
      X: X,
      Y: Y
    };
  }; // This is basically just an extention of the calcNextFirstTile
  // function, but it actually changes the FirstTile.


  var updateFirstTileByFactor = function updateFirstTileByFactor(factorX, factorY) {
    var _calcNextFirstTile = calcNextFirstTile(factorX, factorY),
        X = _calcNextFirstTile.X,
        Y = _calcNextFirstTile.Y;

    game.camera.setFirstTile(X, Y);
  };

  var ShiftDown = function ShiftDown() {
    // scroll to keep the same tile in view.
    var v = document.querySelector('#GameViewport');
    savedView = v.scrollTop; // move the DOM elements around.

    row0 = WRAP.getElementsByClassName('row')[0];
    WRAP.appendChild(row0); // update the camera variables

    updateFirstTileByFactor(0, 1); // Redraw players and stuff.

    game.player.DrawAll(); // Swap the logical mapblocks,
    // Calculate the new position of the first tile in each block. 
    // Redefine the mapblock and redraw it.
    //

    var arr = game.drawer.GridOfMapBlocks.ShiftDown();
    var newY = 2 * TILES_PER_BLOCK + game.camera.FirstTile.y;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = arr.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        i = _step.value;
        arr[i].RedefineAndDraw(arr[i].tx0, newY);
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

    console.log(game.drawer.GridOfMapBlocks);
    v.scrollTop = savedView - game.BLOCK_SIZE;
  };

  var ShiftUp = function ShiftUp() {
    calcNextFirstTile(0, -1);
  };

  var ShiftLeft = function ShiftLeft() {
    calcNextFirstTile(-1, 0);
  };

  var ShiftRight = function ShiftRight() {
    calcNextFirstTile(1, 0);
  };

  // rows of mapblocks in visual map
  var NUM_ROWS = 3; // columns of mapblocks in visual map.

  var NUM_COLS = 3; // layers per mapblock 

  var NUM_LAYERS = 2; // Create a blocklist, which holds all of the mapblocks.
  // add references to the relevent canvases,
  // and calculate the tiles they hold.

  var blocklist = []; // The element that holds the map-related canvases 

  var WRAP = document.querySelector("#VisualMap"); // Calculate the side length of a MapBlock, in units of TILES.

  var TILES_PER_BLOCK = Math.floor(game.BLOCK_SIZE / game.TILE_SIZE);
  game.drawer = {
    init: init,
    blocklist: blocklist,
    DrawMap: DrawMap,
    GetMapBlockElement: GetMapBlockElement,
    ShiftDown: ShiftDown,
    ShiftUp: ShiftUp,
    ShiftLeft: ShiftLeft,
    ShiftRight: ShiftRight,
    TILES_PER_BLOCK: TILES_PER_BLOCK
  };
} // ================================================
// Class MapBlock  
// ------------------------------------------------

{
  // The MapBlock class will be added to game.defs, but will mainly be
  // used by the game.drawer and game.camera functions.
  var MapBlock =
  /*#__PURE__*/
  function () {
    function MapBlock(canvasList, tx0, ty0, tw, th) {
      _classCallCheck(this, MapBlock);

      // The canvas list is an array of canvas elements, each one of them
      // refers to the same area of visual space, at different layers.
      // the 0th entry in this array is the ground: the first to be drawn.
      this.canvasList = canvasList;
      this.ctxList = []; // keep references to each MapBlock's canvas.

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = canvasList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var canvas = _step2.value;
          this.ctxList.push(canvas.getContext('2d'));
        } // the rectangle defines the portion of the overall map.
        // the mapblock is like a chunk of that map, and its bounds are
        // defined using a rectangle.
        // (the unit is tiles)

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

      this.tx0 = tx0;
      this.ty0 = ty0;
      this.tw = tw;
      this.th = th;
      this.txf = tx0 + tw;
      this.tyf = ty0 + th;
    }

    _createClass(MapBlock, [{
      key: "Clear",
      value: function Clear() {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.canvasList.keys()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _i2 = _step3.value;
            var c = this.canvasList[_i2];
            var ctx = this.ctxList[_i2];
            ctx.clearRect(0, 0, c.width, c.height);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }, {
      key: "FullDraw",
      value: function FullDraw() {
        this.DrawLayer(game.enums.GROUND_LAYER);
        this.DrawLayer(game.enums.ABOVE_LAYER);
      }
    }, {
      key: "DrawLayer",
      value: function DrawLayer(layer) {
        for (var row = 0; row < this.th; row++) {
          for (var col = 0; col < this.tw; col++) {
            var tx = this.tx0 + col;
            var ty = this.ty0 + row;
            var px = col * game.TILE_SIZE;
            var py = row * game.TILE_SIZE;
            var tile = game.GetMapTile(tx, ty);

            if (tile !== undefined) {
              tile.draw(this.ctxList[layer], layer, px, py);
            }
          }
        }
      } // RedefineAndDraw assigns new bounds to the MapBlock, clears it,
      // then redraws it. This is primarily used when using one of the 
      // Shift functions.
      //
      // X and Y refer to the first logical tile within the MapBlock.
      // Everything else will be updated accordingly.

    }, {
      key: "RedefineAndDraw",
      value: function RedefineAndDraw(X, Y) {
        this.tx0 = X;
        this.ty0 = Y;
        this.txf = this.tx0 + this.tw;
        this.tyf = this.ty0 + this.th;
        this.Clear();
        this.FullDraw();
      }
    }]);

    return MapBlock;
  }();

  game.classes.MapBlock = MapBlock;
} // ================================================
// GridOfMapBlocks  
// ------------------------------------------------

{
  var Add = function Add(A, B, thing) {
    m[A][B] = thing;
  };

  var SwapRows = function SwapRows(A, B) {
    var saved = m[A];
    m[A] = m[B];
    m[B] = saved;
  };

  var SwapCols = function SwapCols(A, B) {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = m.keys()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _row = _step4.value;
        var saved = m[_row][A];
        m[_row][A] = m[_row][B];
        m[_row][B] = saved;
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  }; // Returns an array of the  in the column.


  var GetCol = function GetCol(A) {
    var out = [];
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = m.keys()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _row2 = _step5.value;
        out.push(m[_row2][A]);
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    return out;
  };

  var GetRow = function GetRow(A) {
    return m[A];
  }; // The Shift functions will move the rows & columsn around,
  // and return a list of the elements that were 
  // 'shifted off the edge'.
  // 
  // Basically, you want to redraw each of those mapblocks,
  // and can do so using a for-of loop.
  //


  var _ShiftDown = function _ShiftDown() {
    SwapRows(0, 2);
    SwapRows(0, 1);
    return m[2];
  };

  var _ShiftUp = function _ShiftUp() {
    SwapRows(0, 2);
    SwapRows(0, 1);
    return m[0];
  };

  var _ShiftLeft = function _ShiftLeft() {
    SwapCols(0, 2);
    SwapCols(0, 1);
    return GetCol(0);
  };

  var _ShiftRight = function _ShiftRight() {
    SwapCols(0, 2);
    SwapCols(1, 2);
    return GetCol(2);
  };

  // GridOfMapBlocks is a 2-d array of MapBlock objects.
  // The configuration of this grid should match the visual one
  // in the DOM. 
  var m = new Array(3);

  for (var row = 0; row < 3; row++) {
    m[row] = new Array(3);
  }

  game.drawer.GridOfMapBlocks = {
    m: m,
    Add: Add,
    ShiftDown: _ShiftDown,
    ShiftUp: _ShiftUp,
    ShiftLeft: _ShiftLeft,
    ShiftRight: _ShiftRight,
    GetRow: GetRow,
    GetCol: GetCol
  };
}
"use strict";

// ================================================
// Fetcher: Downloading Map Data
// ------------------------------------------------
// Default Locations for fetching the Map Data.
game.fetcher = {
  // Keeps track of the initial map fetch.
  FIRST_DONE: false,
  // URLs of various different experimental maps.
  JSON_URLS: {
    1: "json/example.json",
    2: "tools/ex.json",
    3: "tools/hundred.json"
  },
  // The Default map to load for FetchMap() 
  DEFAULT: window.location.href + "tools/hundred.json",
  // TODO: return a Promise that the image will load,
  //       then do a .then(DrawMap())
  //
  FetchMap: function FetchMap(map_url) {
    var _this = this;

    console.log("Fetching map from: ".concat(map_url));
    fetch(map_url).then(function (response) {
      return response.json();
    }).then(function (myJson) {
      _this.handleJson(myJson);
    }).catch(function (error) {
      console.error('Fetch Error:', error);
    });
  },
  // handleJson basically just saves the json data into memory.
  handleJson: function handleJson(myJson) {
    console.log("FetchMap Completed:", myJson); // add the JSON data to the game.

    game.Atlas = myJson.Atlas;
    game.LogicalMap = myJson.Map; // Prepare the TileMatrix

    this.MakeMapIntoTileMatrix(); // Fetch and Load the image for the atlas.

    this.FetchAtlasImage(game.Atlas.ImagePath);
  },
  FetchAtlasImage: function FetchAtlasImage(path) {
    // TODO: make json into relative paths.
    path = window.location + "img/tiles.png";
    console.log("Fetching image from: ".concat(path)); // Once the image has been fetched and loaded, the map can be drawn.

    game.AtlasImage = new Image();
    game.AtlasImage.src = "img/tiles.png";
    game.AtlasImage.addEventListener('load', this.TriggerDraw, false);
  },
  TriggerDraw: function TriggerDraw() {
    // If this is not the initial fetch, just draw the map.
    if (this.FIRST_DONE === true) {
      game.drawer.DrawMap();
      return;
    } // Call the "main" function if this is the first fetch.


    this.FIRST_DONE = true;
    console.log("Image Fetch Done:", game.AtlasImage);
    game.main();
  },
  MakeMapIntoTileMatrix: function MakeMapIntoTileMatrix() {
    // Create a matrix of Tiles, based on the LogicalMap of values.
    // Basically, converts the values into Tile objects that can be used later.
    var h = game.LogicalMap.Height;
    var w = game.LogicalMap.Width; // Create an empty (w x h) matrix.

    var matrix = new Array(h);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = matrix.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var i = _step.value;
        matrix[i] = new Array(w);
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

    for (var row = 0; row < h; row++) {
      for (var col = 0; col < w; col++) {
        // Create the Tile.
        var t = new game.classes.Tile(col, row); // Assign layer information
        // TODO!!
        // Change the JSON format, then change this!

        t.layers[game.enums.GROUND_LAYER] = game.LogicalMap.Data[0][row][col];
        t.layers[game.enums.ABOVE_LAYER] = game.LogicalMap.Data[1][row][col]; // Save the tile into the TileMatrix.

        matrix[row][col] = t;
      }
    } // Save the filled matrix into an accessible location.


    game.TileMatrix = matrix; // Helper function for retrieving map tiles.

    game.GetMapTile = function (tx, ty) {
      if (tx >= w || ty >= h) {
        return undefined;
      }

      return game.TileMatrix[ty][tx];
    };
  }
};
"use strict";

// ================================================
// User Interactions and Event Handlers
// ------------------------------------------------
{
  var init = function init() {
    overlay.addEventListener('click', handleClickEvent);
  };

  var handleClickEvent = function handleClickEvent(event) {
    // Get the clicked (x,y) relative to the canvas element.        
    var r = overlay.getBoundingClientRect();
    var x = event.clientX - r.left;
    var y = event.clientY - r.top; // offset pixel position of target tile's upper-left corner.
    // used for adding the target canvas.
    //
    // TODO: this should just update targetbox location and redraw it.
    //

    {
      var left = x - x % game.TILE_SIZE;
      var top = y - y % game.TILE_SIZE;
      clickbox.style.top = top + 'px';
      clickbox.style.left = left + 'px';
    } // The Tile(x,y) relative to the first tile on the board.

    var OffsetTileX = Math.floor(x / game.TILE_SIZE);
    var OffsetTileY = Math.floor(y / game.TILE_SIZE); // Calculate the actual tile.

    var outx = game.camera.FirstTile.x + OffsetTileX;
    var outy = game.camera.FirstTile.y + OffsetTileY;
    ws('move', game.MY_USER, outx, outy); // Debug Message
    // console.log(`you clicked on tile (${outx}, ${outy})`)
  };

  // The overlay canvas is what the user actually clicks on.
  // Keep this as a variable, because the specific canvas
  // element may change in the future.
  var overlay = document.querySelector('#Overlay'); // The clickbox is a fancy extra box that it used to show you
  // that you have clicked on a tile.

  var clickbox = document.querySelector('#myclickbox');
  game.interact = {
    init: init,
    overlay: overlay,
    handleClickEvent: handleClickEvent,
    clickbox: clickbox
  };
}
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
  var submitChat = function submitChat(event) {
    if (!chatbar.value) {
      return false;
    }

    if (!game.net.ws.conn) {
      return false;
    }

    ws('chat', game.MY_USER, chatbar.value);
    chatbar.value = "";
    chatbar.blur();
    return false;
  };

  var chatbar = document.querySelector('#ChatBar');
  var chatform = document.querySelector('#ChatInputForm');
  chatform.onsubmit = submitChat;
}
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
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================================
// Tiles
// ------------------------------------------------
{
  // in future, tile might hold more data than just this.
  var Tile =
  /*#__PURE__*/
  function () {
    function Tile(tx, ty) {
      _classCallCheck(this, Tile);

      this.x = tx;
      this.y = ty; // holds tiletype for each layer.

      this.layers = {};
    }

    _createClass(Tile, [{
      key: "isEmpty",
      value: function isEmpty(layername) {
        return this.layers[layername] === 0 || this.layers[layername] === undefined;
      }
    }, {
      key: "getAtlasLocation",
      value: function getAtlasLocation(layerName) {
        var val = this.layers[layerName];
        return {
          x: (val - 1) % game.Atlas.ImageCols * game.Atlas.TileWidth,
          y: Math.floor((val - 1) / game.Atlas.ImageCols) * game.Atlas.TileHeight
        };
      } // TODO: 
      // This probably shouldn't be a method of class Tile,
      // and should instead be a function in game.drawer

    }, {
      key: "draw",
      value: function draw(ctx, layer, px, py) {
        if (this.isEmpty(layer)) {
          return;
        }

        var s = this.getAtlasLocation(layer);
        ctx.drawImage(game.AtlasImage, s.x, s.y, game.Atlas.TileWidth, game.Atlas.TileHeight, px, py, game.TILE_SIZE, game.TILE_SIZE);
      }
    }]);

    return Tile;
  }();

  game.classes.Tile = Tile;
}
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

//# sourceMappingURL=game.js.map