// ================================================
// Renderer
// ------------------------------------------------

// The Renderer handles the interaction with the canvas,
// abstracting the drawing concepts away from the rest of 
// the game logic.
game.drawer = {

    init() {
        let classNameList = ['.one', '.two', '.three', '.four', '.five', '.six', '.seven', '.eight']
        
        this.canvasList = []
        for (let i of classNameList) {
            this.canvasList.push(document.querySelector(i))
        }

        this.ctxlist = []
        for (let canvas of this.canvasList) {
            this.ctxlist.push(canvas.getContext('2d'))
        }

    },

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

    // TODO: split data, For each BLOCK, draw that portion of the map.
    DrawMap() {
        let c = this.canvasList[5]
        let ctx = this.ctxlist[5]

        ctx.clearRect(0, 0, c.width, c.height)

        let nLayers = game.LogicalMap.Data.length

        for (let i = 0; i < nLayers; i++) {
            this.DrawLayer( ctx, game.LogicalMap.Data[i] )
            console.log(`layer ${i} drawn.`)
        }

        //game.debug.OutlineMiddleTile(game.canvas, game.TILE_SIZE)
    },

}
