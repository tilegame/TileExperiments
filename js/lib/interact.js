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