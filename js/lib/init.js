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