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
        net: {},
    },

    // Global Enum Values.
    enums: {
        GROUND_LAYER: 0,
        ABOVE_LAYER: 1,
    },

}

// TODO: 
// find a better name for this alias.
// currently using this just because it's easy to type.
// 
// gs: Game Send
// gs is an alias for game.net.ws.send() 
var gs = (string)=>game.net.ws.send(string)

console.log("init done")
