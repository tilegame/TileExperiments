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

    // TODO: Move these to game.drawer
    // Include References to Canvas and Drawing Context
    canvas: document.querySelector('#GameCanvas'),

    // game.class holds Class definitions.
    class: {},
}

game.ctx = game.canvas.getContext('2d')

console.log("init done.")
