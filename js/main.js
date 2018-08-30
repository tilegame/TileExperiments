// ================================================
// Init Game
// ------------------------------------------------
var game = {}

// Status is for the loading status of the game.
game.status = {
    init_fetch_complete: false
}

// Magic Variables
game.TILE_SIZE = 64
game.BLOCK_SIZE = 960
game.MAP_JSON_1 = window.location.href + "json/example.json"
game.MAP_JSON_2 = window.location.href + "tools/ex.json"

// Include References to Canvas and Drawing Context
game.canvas = document.querySelector('#GameCanvas')
game.ctx = game.canvas.getContext('2d')

// Atlas: the source image for the visual tiles
game.Atlas = {}

// LogicalMap: contains data for types of tile.
game.LogicalMap = {}

// ================================================
// Downloading Map Data
// ------------------------------------------------

game.FetchMap = (map_url)=>{
    console.log(`Fetching map from: ${map_url}`)
    fetch(map_url).then(response=>response.json()).then(myJson=>game.handleJson(myJson)).catch(error=>console.error('Fetch Error:', error))
}

// handleJson basically just saves the json data into memory.
game.handleJson = (myJson)=>{
    console.log("FetchMap Completed:", myJson)

    // add the JSON data to the game.
    game.Atlas = myJson.Atlas
    game.LogicalMap = myJson.Map

    // Fetch and Load the image for the atlas.
    game.Atlas.img = new Image()
    game.Atlas.img.src = game.Atlas.ImagePath

    // Once the image has been fetched and loaded, drawAll will be called.
    game.Atlas.img.addEventListener('load', game.DrawMap, false)

    // If this is the first time we are fetching the map, then call the "main"
    // function.
    if (game.status.init_fetch_complete !== true) {
        game.status.init_fetch_complete = true
        main()
    }

}

// ================================================
// Drawing the Map
// ------------------------------------------------
// Source: s
// Destination: d
// Position: x | y 
// Width: w
// Height: h
game.DrawLayer = function(matrix) {
    let sx, sy, sw, sh, dx, dy, dw, dh, val
    sw = game.Atlas.TileWidth
    sh = game.Atlas.TileHeight
    dw = game.TILE_SIZE
    dh = game.TILE_SIZE

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            val = matrix[i][j]
            if (val <= 0) {
                continue
            }
            dx = j * dw
            dy = i * dh
            sx = ((val - 1) % game.Atlas.ImageCols) * sw
            sy = div(val - 1, game.Atlas.ImageCols) * sh
            game.ctx.drawImage(game.Atlas.img, sx, sy, sw, sh, dx, dy, dw, dh)
        }
    }
}

game.DrawMap = function() {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height)
    let nLayers = game.LogicalMap.Data.length
    for (let i = 0; i < nLayers; i++) {
        game.DrawLayer(game.LogicalMap.Data[i])
        console.log(`layer ${i} drawn.`)
    }
    DebugTools.OutlineMiddleTile(game.canvas, game.TILE_SIZE)
}

// ================================================
// Helper Functions
// ------------------------------------------------

// NOTE: This method is only correct for positive numbers.
function div(a, b) {
    return ~~((a - 1) / b)
}

// ================================================
// Main
// ------------------------------------------------
function init(event) {
    game.FetchMap(game.MAP_JSON_2)
}
function main(event) {
    console.log("== main started ==")

    game.player = new Player(10,10)
    console.log(game.player)

    game.camera = new Camera()
    console.log(game.camera)

    console.log("== main finished ==")
}
window.addEventListener("load", init);
