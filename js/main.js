// Define the dimensions of the Visual map in terms of pixels.
let VisualMap = {
	"w": 300,
	"h": 300
}

// Define the logical map in terms of NUMBER OF TILES.
let LogicalMap = {
	"w": 9,
	"h": 9
}
let AtlasData = {}
let MapData = {}


// load the map data from JSON file. This has to be over HTTPS,  otherwise
// chrome will get angry because of CORS
fetch(
	"https://fractalbach.github.io/TileExperiments/json/example.json"
).then(
	response => response.json()
).catch(
	error => console.error('Fetch Error:', error)
).then(
	myJson => handleJson(myJson)
)

// handleJson basically just saves the json data into memory.
function handleJson(myJson) {
	MapData = myJson.Map
	AtlasData = myJson.Atlas
	console.log(myJson)
}

// Create reference variables to the game canvas.
let c = document.querySelector('#GameCanvas')
let ctx = c.getContext('2d')

// Source: s
// Destination: d
// Position: x | y 
// Width: w
// Height: h
let sx, sy, sw, sh, dx, dy, dw, dh
sw = 64
sh = 64
dw = sw 
dh = sh

// Load the tile atlas, which is saved in a single image file.
let TileAtlas = new Image(sw*5, sh)
TileAtlas.src = "img/tiles.png"


// Draws the map from a Javascript array object.
function ArrayToTiles() {
	sy = 0
	for (let i=0; i<layer0.length; i++) {
		for (let j=0; j<layer0[i].length; j++) {
			dx = i * dw
			dy = j * dh
			sx = layer0[i][j] * sw
			ctx.drawImage(TileAtlas,sx,sy,sw,sh,dx,dy,dw,dh)
		}
	}
}

function LocToInt(i, j) {
	return i * (LogicalMap.w) + j
}

function NumToLoc(n, cols) {
	return {
		"x": ~~((n-1) / cols),
		"y": (n-1) % cols
	}
}


// =================================

TileAtlas.onload = ()=> {
	StringToTiles(layerString);
}
//StringToTiles()

// =================================