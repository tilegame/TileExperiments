/*
tiles.png
0: empty
1: grass
2: dirt
3: tree
4: tree-top
5: bush
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
