// ================================================
// Init Canvas
// ------------------------------------------------

let c = document.querySelector('#GameCanvas')
let ctx = c.getContext('2d')

// ================================================
// Downloading Map Data
// ------------------------------------------------

// Atlas: the source image for the visual tiles
// LogicalMap: contains data for types of tile.
let Atlas = {}
let LogicalMap = {}

// Define the location of the json file containing the map.
let prefixURL = "https://fractalbach.github.io/TileExperiments/"
let mapURL = prefixURL + "json/example.json"
let mapURL2 = prefixURL + "tools/ex.json"


fetch(
	mapURL2
).then(
	response => response.json()
).catch(
	error => console.error('Fetch Error:', error)
).then(
	myJson => handleJson(myJson)
)

// handleJson basically just saves the json data into memory.
function handleJson(myJson) {
	Atlas = myJson.Atlas
	LogicalMap = myJson.Map
	console.log("Fetched Map:", myJson)
	BuildMap()
}


// ================================================
// Build Map Sequence
// ------------------------------------------------
// Source: s
// Destination: d
// Position: x | y 
// Width: w
// Height: h
function BuildMap() {
	let sx, sy, sw, sh, dx, dy, dw, dh, val
	sw = Atlas.TileWidth
	sh = Atlas.TileHeight
	dw = 64
	dh = 64
	console.log(dw, dh)

	// Load the tile atlas, which is saved in a single image file.
	let TileAtlas = new Image()
	TileAtlas.src = Atlas.ImagePath

	// Draws the map from a Javascript array object.
	function ArrayToTiles(matrix) {
		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < matrix[i].length; j++) {
				val = matrix[i][j]
				if (val <= 0) {
					continue
				}
				dx = j * dw
				dy = i * dh
				sx = ((val-1) % Atlas.ImageCols) * sw
				sy = div(val-1, Atlas.ImageCols) * sh
				ctx.drawImage(TileAtlas,sx,sy,sw,sh,dx,dy,dw,dh)
			}
		}
	}
	function drawAll() {
		nLayers = LogicalMap.Data.length
		for (var i = 0; i < nLayers; i++) {
			ArrayToTiles(LogicalMap.Data[i])
			console.log(`layer ${i} drawn.`)
		}
	}
	TileAtlas.addEventListener('load', drawAll, false)


}


// ================================================
// Helper Functions
// ------------------------------------------------

// NOTE: This method is only correct for positive numbers.
function div(a, b) {
	return ~~((a-1) / b)
}

