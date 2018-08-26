// Define the location of the json file containing the map.
let mapURL = "https://fractalbach.github.io/TileExperiments/json/example.json"
let mapURL2 = "https://fractalbach.github.io/TileExperiments/tools/ex.json"

// Canvas is basically the Visual Map.
let c = document.querySelector('#GameCanvas')
let ctx = c.getContext('2d')
let VisualMap = {
	"w": 300,
	"h": 300
}

// Atlas is the source image for tile data,
// LogicalMap contains actual data.
let Atlas = {}
let LogicalMap = {}

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

// About the variables used:
//
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
				console.log(`(${i}, ${j}) v:${val}, x,y = (${sx}, ${sy})`)
				ctx.drawImage(TileAtlas,sx,sy,sw,sh,dx,dy,dw,dh)
			}
		}
	}

	TileAtlas.onload = ()=> {
		nLayers = LogicalMap.Data.length
		for (var i = 0; i < nLayers; i++) {
			ArrayToTiles(LogicalMap.Data[i]);
			console.log(`layer ${i} drawn.`)
		}
	}

}

// function LocToInt(i, j, cols) {
// 	return i * (LogicalMap.w) + j
// }

// NOTE: only correct for positive numbers.
function div(a, b) {
	return ~~((a-1) / b)

}

function NumToLoc(n, cols) {
	return {
		"x": ~~((n-1) / cols),
		"y": (n-1) % cols
	}
}


// =================================

//StringToTiles()

// =================================