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