// ================================================
// Drawer  
// ------------------------------------------------

// {
//   it's the kind of drawer that draws,
//    but since it's pretty much a variable,
//    you can also put things in it.  
//
//     So I guess it's a drawer filled with 
//      shelves of drawing functions.
// }

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

        }

    },

    // DrawMap() is called by the fetcher!
    // TODO: split data, For each BLOCK, draw that portion of the map.
    DrawMap() {
        for (let mapblock of this.blocklist) {
            mapblock.FullDraw()
        }
    },

}

// TODO: 
// make class definitions file/folder, and run it BEFORE
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
            for (let row = 0; row < this.th; row++) {
                for (let col = 0; col < this.tw; col++) {
                    let tx = this.tx0 + col
                    let ty = this.ty0 + row
                    let px = col * game.TILE_SIZE
                    let py = row * game.TILE_SIZE
                    game.GetMapTile(tx, ty).draw(this.ctxList[layer], layer, px, py)
                }
            }
        }

    }

    game.classes.MapBlock = MapBlock
}
