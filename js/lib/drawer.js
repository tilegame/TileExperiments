// ================================================
// Drawer
// ------------------------------------------------

/*
The Drawer handles the interaction with the canvas,
abstracting the drawing concepts away from the rest of 
the game logic.

requires: 
    Atlas
    LogicalMap
    camera

*/
game.drawer = {

    init() {

        // Number of Layers to save as MapBlocks 
        let NUM_LAYERS = 2

        // Number of blocks per layer.
        let NUM_BLOCKS = 9

        // Calculate the side length of a MapBlock, in units of TILES.
        let TILES_PER_BLOCK = Math.floor(game.BLOCK_SIZE / game.TILE_SIZE)

        // Create a blocklist, which holds all of the mapblocks.
        // add references to the relevent canvases,
        // and calculate the tiles they hold.
        this.blocklist = []

        for (let i = 0; i < NUM_BLOCKS; i++) {

            // The starting positions are defined in a special way 
            // because of the placement of the blocks (3 columns).
            // this will change when the positioning changes. 
            let tx0 = TILES_PER_BLOCK * (i % 3)
            let ty0 = TILES_PER_BLOCK * Math.floor(i / 3)

            // Width and Height of the mapblock will be the same,
            // since the MapBlocks are squares. 
            let tw = TILES_PER_BLOCK
            let th = TILES_PER_BLOCK

            // Add the canvas list (each of the layers).
            let canvasList = []

            // Iterate through the layers to retrieve the canvas elements.
            for (let layer = 0; layer < NUM_LAYERS; layer++) {
                let selector = `#WrapLayer${layer} > canvas.block${i}`
                let canvas = document.querySelector(selector)
                canvasList.push(canvas)
            }

            // Create the MapBlock and add it to the blocklist. 
            let block = new game.classes.MapBlock(canvasList,tx0,ty0,tw,th)
            this.blocklist.push(block)
            console.log(block)

        }
    },

    //     DrawLayer(ctx, matrix) {
    //         let sx, sy, sw, sh, dx, dy, dw, dh, val
    //         sw = game.Atlas.TileWidth
    //         sh = game.Atlas.TileHeight
    //         dw = game.TILE_SIZE
    //         dh = game.TILE_SIZE

    //         for (let i = 0; i < matrix.length; i++) {
    //             for (let j = 0; j < matrix[i].length; j++) {
    //                 val = matrix[i][j]
    //                 if (val <= 0) {
    //                     continue
    //                 }
    //                 dx = j * dw
    //                 dy = i * dh
    //                 sx = ((val - 1) % game.Atlas.ImageCols) * sw
    //                 sy = div(val - 1, game.Atlas.ImageCols) * sh
    //                 ctx.drawImage(game.Atlas.img, sx, sy, sw, sh, dx, dy, dw, dh)
    //             }
    //         }
    //     },

    // DrawTile draws the tile at {px,py} relative to the canvas given.
    // ctx: canvas 2d context.
    // TileValue: type of tile to draw, based on Atlas.
    // px and py: in units of PIXELS.

    //     DrawBlock(BlockNum) {
    //         let c = this.canvasList[BlockNum]
    //         let ctx = this.ctxlist[BlockNum]

    //         ctx.clearRect(0, 0, c.width, c.height)

    //         let nLayers = game.LogicalMap.Data.length

    //         for (let i = 0; i < nLayers; i++) {
    //             this.DrawLayer(ctx, game.LogicalMap.Data[i])
    //             console.log(`drawer: block ${BlockNum}: layer ${i} was drawn.`)
    //         }
    //     },

    // DrawMap() is called by the fetcher!
    // TODO: split data, For each BLOCK, draw that portion of the map.
    DrawMap() {
        for (let mapblock of this.blocklist) {
            mapblock.FullDraw()
        }
    },

}

// TODO: move this to a class definitions file/folder, and run it BEFORE
// initializing the "libs"

// The MapBlock class will be added to game.defs, but will mainly be
// used by the game.drawer and game.camera functions.
{

    class MapBlock {
        constructor(canvasList, tx0, ty0, tw, th) {

            // The canvas list is an array of canvas elements, each one of them
            // refers to the same area of visual space, at different layers.
            // the 0th entry in this array is the ground: the first to be drawn.
            this.canvasList = canvasList
            this.ctxList = []

            // keep references to each MapBlock's canvas.
            for (let canvas of canvasList) {
                this.ctxList.push(canvas.getContext('2d'))
            }

            // the rectangle defines the portion of the overall map.
            // the mapblock is like a chunk of that map, and its bounds are
            // defined using a rectangle.
            // (the unit is tiles)
            this.tx0 = tx0
            this.ty0 = ty0
            this.tw = tw
            this.th = th
            this.txf = tx0 + tw
            this.tyf = ty0 + th

        }

        Clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }

        // TODO: move this elsewhere once player drawing has been added.
        //       or call player.draw(), or find a good way to express the fact
        //       that players are drawn in between certain layers.
        FullDraw() {
            this.DrawLayer(game.enums.GROUND_LAYER)
            this.DrawLayer(game.enums.ABOVE_LAYER)
        }

        DrawLayer(layer) {
            let row = 0
            let col = 0
            for (let ty = this.ty0; ty < this.tyf; ty++) {
                col = 0
                for (let tx = this.tx0; tx < this.txf; tx++) {
                    let px = col * game.TILE_SIZE
                    let py = row * game.TILE_SIZE
                    game.GetMapTile(tx, ty).draw(this.ctxList[layer], layer, px, py)
                    col++
                }
                row++
            }
        }

    }

    game.classes.MapBlock = MapBlock
}
