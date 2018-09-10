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

// TODO: Rename/Move this file to game.graphics.mapblock

{
    // Create a blocklist, which holds all of the mapblocks.
    // add references to the relevent canvases,
    // and calculate the tiles they hold.
    let blocklist = []

    // The element that holds the map-related canvases 
    const WRAP = document.querySelector(`#VisualMap`)

    const NUM_ROWS = 3
    // rows of mapblocks in visual map
    const NUM_COLS = 3
    // columns of mapblocks in visual map.
    const NUM_LAYERS = 2
    // layers per mapblock 

    // Calculate the side length of a MapBlock, in units of TILES.
    let TILES_PER_BLOCK = Math.floor(game.BLOCK_SIZE / game.TILE_SIZE)

    function init() {

        // Width and Height of the mapblock will be the same,
        // since the MapBlocks are squares. 
        let tw = TILES_PER_BLOCK
        let th = TILES_PER_BLOCK

        for (let row = 0; row < NUM_ROWS; row++) {

            for (let col = 0; col < NUM_COLS; col++) {

                // The starting positions are defined in a special way 
                // because of the placement of the blocks (3 columns).
                // this will change when the positioning changes. 
                let tx0 = col * TILES_PER_BLOCK
                let ty0 = row * TILES_PER_BLOCK

                // Add the canvas list (each of the layers).
                let canvasList = []

                // Get the div element that holds the canvases
                let blockElement = WRAP.children[row].children[col]

                // Iterate through the layers to retrieve the canvas elements.
                for (let layer = 0; layer < NUM_LAYERS; layer++) {
                    canvasList.push(blockElement.children[layer])
                }

                // Create the MapBlock and add it to the blocklist. 
                let block = new game.classes.MapBlock(canvasList,tx0,ty0,tw,th)
                blocklist.push(block)
            }
        }
    }

    // Retrieves the MapBlock element based on the position.
    function GetMapBlockElement(col, row) {
        let ROW = WRAP.getElementsByClassName('row')[row]
        return ROW.getElementsByClassName('block')[col]
    }

    // DrawMap() is called by the fetcher!
    // TODO: split data, For each BLOCK, draw that portion of the map.
    function DrawMap() {
        for (let mapblock of blocklist) {
            mapblock.FullDraw()
        }
    }

    // calc Next First Tile is a helper function to determine what
    // the new "FirstTile" of the visual screen is 'logically'.
    // 
    // factorX, factorY should be -1, 0, or 1
    //
    // In the future, this can become more sophisicated, and include
    // things like checks for world boundary limits.
    //
    function calcNextFirstTile(factorX, factorY) {
        let {x: X, y: Y} = game.camera.FirstTile
        X += factorX * TILES_PER_BLOCK
        Y += factorY * TILES_PER_BLOCK
        return {
            X,
            Y
        }
    }

    // This is basically just an extention of the calcNextFirstTile
    // function, but it actually changes the FirstTile.
    function updateFirstTileByFactor(factorX, factorY) {
        let {X, Y} = calcNextFirstTile(factorX, factorY)
        game.camera.setFirstTile(X, Y)
    }

    function ShiftDown() {

        // scroll to keep the same tile in view.
        let v = document.querySelector('#GameViewport')
        savedView = v.scrollTop

        // move the DOM elements around.
        row0 = WRAP.getElementsByClassName('row')[0]
        WRAP.appendChild(row0)

        // update the camera variables
        updateFirstTileByFactor(0, 1)

        // Redraw players and stuff.
        game.player.DrawAll()

        v.scrollTop = savedView - game.BLOCK_SIZE

    }

    function ShiftUp() {
        calcNextFirstTile(0, -1)
    }

    function ShiftLeft() {
        calcNextFirstTile(-1, 0)

    }

    function ShiftRight() {
        calcNextFirstTile(1, 0)
    }

    game.drawer = {
        init,
        blocklist,
        DrawMap,
        GetMapBlockElement,
        ShiftDown,
        ShiftUp,
        ShiftLeft,
        ShiftRight,
        TILES_PER_BLOCK,
    }
}

// ================================================
// Class MapBlock  
// ------------------------------------------------
{
    // The MapBlock class will be added to game.defs, but will mainly be
    // used by the game.drawer and game.camera functions.
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
