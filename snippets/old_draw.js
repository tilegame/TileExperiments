/* Snippet: Old Drawing Functions.  */


var ye_olde_drawer = {

    DrawLayer(ctx, matrix) {
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
                ctx.drawImage(game.Atlas.img, sx, sy, sw, sh, dx, dy, dw, dh)
            }
        }
    },

// DrawTile draws the tile at {px,py} relative to the canvas given.
// ctx: canvas 2d context.
// TileValue: type of tile to draw, based on Atlas.
// px and py: in units of PIXELS.

    DrawBlock(BlockNum) {
        let c = this.canvasList[BlockNum]
        let ctx = this.ctxlist[BlockNum]

        ctx.clearRect(0, 0, c.width, c.height)

        let nLayers = game.LogicalMap.Data.length

        for (let i = 0; i < nLayers; i++) {
            this.DrawLayer(ctx, game.LogicalMap.Data[i])
            console.log(`drawer: block ${BlockNum}: layer ${i} was drawn.`)
        }
    },




}