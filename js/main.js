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

/*
0: grass
1: dirt
2: tree
3: tree-top
4: bush
*/

let layerString = `
222222222
211111112
213131312
211111112
213111312
211111112
213131312
211111112
222222222
`
let layer0 = [
	[1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,2,0,2,0,2,0,1], // line of trees
	[1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,2,0,2,0,2,0,1], // line of trees
	[1,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1]
]

// load the map data from JSON file. This has to be over HTTPS,  otherwise
// chrome will get angry because of CORS
fetch(
	"https://fractalbach.github.io/TileExperiments/json/example.json"
).then(
	response => response.json()
).then(
	myJson => console.log(myJson)
)

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

// Uses a string to convert the javascript array object NOTE: treats all 0 as
// empty squares. Subtracts 1 from all other numbers.  So the first square
// that will be taken from a picture will be "1".
function StringToTiles(StringData) {
	// removes all empty spaces, lines, etc from the string.
	StringData = StringData.replace(/\s/g, '')
	let q = 0
	sy = 0
	for (let i=0; i<LogicalMap.w; i++) {
		for (let j=0; j<LogicalMap.h; j++) {
			dx = i * dw
			dy = j * dh
			q = parseInt(StringData[LocToInt(i,j)])
			sx = (q - 1) * sw
			ctx.drawImage(TileAtlas,sx,sy,sw,sh,dx,dy,dw,dh)
		}
	}
}


function LocToInt(i, j) {
	return i * (LogicalMap.w) + j
}


// =================================

TileAtlas.onload = ()=> {
	StringToTiles(layerString);
}
//StringToTiles()

// =================================