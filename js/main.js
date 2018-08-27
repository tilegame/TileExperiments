// ================================================
// Init Game
// ------------------------------------------------
var game = {}

// Magic Variables
game.TILE_SIZE = 64

// Include References to Canvas and Drawing Context
game.Canvas = document.querySelector('#GameCanvas')
game.ctx = game.Canvas.getContext('2d')

// Atlas: the source image for the visual tiles
game.Atlas = {}

// LogicalMap: contains data for types of tile.
game.LogicalMap = {}



// ================================================
// Downloading Map Data
// ------------------------------------------------

// handleJson basically just saves the json data into memory.
game.handleJson = (myJson) => {
	console.log("Fetched Map:", myJson)
	
	// add the JSON data to the game.
	game.Atlas = myJson.Atlas
	game.LogicalMap = myJson.Map

	// Fetch and Load the image for the atlas.
	game.Atlas.img = new Image()
	game.Atlas.img.src = game.Atlas.ImagePath
	console.log(game.Atlas.ImagePath)

	// Once the image has been fetched and loaded, drawAll will be called.
	game.Atlas.img.addEventListener('load', game.DrawMap, false)
}

game.FetchMap = function() {

	// Define the location of the json file containing the map.
	let prefix = window.location.href
	let example1 = prefix + "json/example.json"
	let example2 = prefix + "tools/ex.json"
	console.log(`Fetching map from: ${example2}`)

	fetch(
		example2
	).then(
		response => response.json()
	).then(
		myJson => game.handleJson(myJson)
	).catch(
		error => console.error('Fetch Error:', error)
	)
}



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
			sx = ((val-1) % game.Atlas.ImageCols) * sw
			sy = div(val-1, game.Atlas.ImageCols) * sh
			game.ctx.drawImage(game.Atlas.img,sx,sy,sw,sh,dx,dy,dw,dh)
		}
	}
}


game.DrawMap = function() {
	let nLayers = game.LogicalMap.Data.length
	for (let i = 0; i < nLayers; i++) {
		game.DrawLayer(game.LogicalMap.Data[i])
		console.log(`layer ${i} drawn.`)
	}
	DebugTools.OutlineMiddleTile(game.Canvas, game.TILE_SIZE)
}


// ================================================
// Helper Functions
// ------------------------------------------------

// NOTE: This method is only correct for positive numbers.
function div(a, b) {
	return ~~((a-1) / b)
}




// ================================================
// Main
// ------------------------------------------------
function main(event) {
	game.FetchMap()
}
window.addEventListener("load", main);
console.log("main.js loaded");