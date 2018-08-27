// ================================================
// Camera
// ------------------------------------------------

// The camera will remain seperate from the player's position.  In this
// version of the game, the camera is actually determined by the player's
// position, but that will be kept seperate from the class definitions.

class Camera {
	constructor() {
		this.x = 10
		this.y = 10
		this.width = game.canvas.width
		this.height = game.canvas.height
		this.maxX = game.LogicalMap.Width * game.TILE_SIZE
		this.maxY = game.LogicalMap.Height * game.TILE_SIZE
	}
	
	//function* makeTileIterator(start = 0, end = )

}

class TileIterator {
	constructor(matrix) {
		this.x = 0
		this.y = 0
		this.matrix = matrix
	}
}


console.log("camera.js loaded")

