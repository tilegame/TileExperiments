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

        // blockList holds each of the Map Blocks.  
        // Each one corresponds to the 8 sections visible in the game.
        this.blockList = new Array(9)

        // Layer 1: 
        // Make a list of 'selectors' for the layer1 canvas elements.
        let classNameList = new Array(9)
        for (let i = 0; i < 9; i++) {
            classNameList[i] = '#WrapLayer0 > canvas.block' + i
        }

        // Calculate the side length of a MapBlock, in units of TILES.
        let TilesPerBlock = Math.floor(game.BLOCK_SIZE / game.TILE_SIZE)

        // Create the MapBlocks!
        for (let i of this.blockList.keys()) {

            // Grab a reference to the relevent canvas.
            let canvas = document.querySelector(classNameList[i])

            // Slice up the game.TileMatrix and put them into MapBlocks
            // This determines the x0,y0,xf,yf bounds used to slice.
            let x0 = (i % 3) * TilesPerBlock
            let y0 = Math.floor(i / 3) * TilesPerBlock
            let xf = x0 + TilesPerBlock
            let yf = y0 + TilesPerBlock

            // make a square matrix with side length of 'TilesPerBlock'.
            // Slices the rows, then slices the columns. Chop chop!
            let matrix = game.TileMatrix.slice(y0, yf)
            for (let row of matrix.keys()) {
                matrix[row] = matrix[row].slice(x0, xf)
            }
            this.blockList[i] = new game.classes.MapBlock(canvas,matrix)
            this.blockList[i].FullDraw()
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
    DrawMap() {//game.debug.OutlineMiddleTile(game.canvas, game.TILE_SIZE)
    //         for (let i of this.blockList.keys()) {
    //             this.blockList[i].FullDraw()
    //             console.log(`block ${i} drawn`)
    //         }
    },

}

// TODO: move this to a class definitions file/folder, and run it BEFORE
// initializing the "libs"

// The MapBlock class will be added to game.defs, but will mainly be
// used by the game.drawer and game.camera functions.
{

    class MapBlock {
        constructor(canvas, matrix) {

            // keep references to each MapBlock's canvas.
            this.canvas = canvas
            this.ctx = this.canvas.getContext('2d')

            // save the matrix of tiles.
            this.matrix = matrix

        }

        Clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }

        // TODO: move this elsewhere once player drawing has been added.
        //       or call player.draw(), or find a good way to express the fact
        //       that players are drawn in between certain layers.
        FullDraw() {
            this.DrawLayer("ground")
            this.DrawLayer("above")
        }

        DrawLayer(layer) {
            // Iterate through the tiles, drawing each one.
            for (let[ty,row] of this.matrix.entries()) {
                for (let[tx,tile] of row.entries()) {
                    let px = tx * game.TILE_SIZE
                    let py = ty * game.TILE_SIZE
                    tile.draw(this.ctx, layer, px, py)
                }
            }
        }

    }

    game.classes.MapBlock = MapBlock
}
