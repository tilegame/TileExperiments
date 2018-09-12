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