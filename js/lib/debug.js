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