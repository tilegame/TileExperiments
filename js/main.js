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
    game.debug.OutlineMiddleTile(game.canvas, game.TILE_SIZE)
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
game.main = (event)=>{

    // Call the init() function on each of the libraries.
    // Display to console for debugging.

    let LibList = ['player', 'camera', 'drawer', 'debug']
    
    for (lib of LibList) {
        game[lib].init()
        console.log(`${lib} initialized:`, game[lib])
    }
}

// Start the Fetcher When the Page has loaded.
// The fetcher will call game.main() when the maps have 
// been fetched, and the images have been loaded.
window.addEventListener("load", ()=>{
    game.fetcher.FetchMap(game.fetcher.DEFAULT)
});
