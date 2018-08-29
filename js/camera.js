// ================================================
// Camera
// ------------------------------------------------

// The camera will remain seperate from the player's position.  In this
// version of the game, the camera is actually determined by the player's
// position, but that will be kept seperate from the class definitions.

class Camera {
    constructor() {
        this.position = new TileLocation(10,10)
        this.viewport = {
            width: game.canvas.width,
            height: game.canvas.height
        }
        this.max_pixel = {
        }
        this.px_max = game.LogicalMap.Width * game.TILE_SIZE
        this.py_max = game.LogicalMap.Height * game.TILE_SIZE
    }

    *VisibleTiles() {
        let n = 10
        while (n > 0) {
            n--
            yield n
        }
    }

}

class TileIterator {
    constructor(matrix) {
        this.x = 0
        this.y = 0
        this.matrix = matrix
    }
}
