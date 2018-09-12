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