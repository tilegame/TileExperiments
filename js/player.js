// ================================================
// Player
// ------------------------------------------------


class Player {
	constructor(x, y) {
		this.position = new TileLocation(x,y)
		this.canvas = document.querySelector("#MainCharacter")
	}
}