// ================================================
// Canvas Debugging Tools
// ------------------------------------------------


const DebugTools = {

	// Draws an outine around the tile that is closest to the middle.  The
	// location of the middle of each tile is used in the calculation.  Works
	// for Square Tiles where TilSize is the length of a side.
	OutlineMiddleTile(Canvas, TileSize) {
		let w = Canvas.width
		let h = Canvas.height
		let x = (w/2) - ((w/2) % TileSize)
		let y = (h/2) - ((h/2) % TileSize)

		let ctx = Canvas.getContext('2d')
		let saved = ctx.fillStyle
		ctx.fillStyle = 'rgba(255, 0, 0, 0.4)'
		ctx.strokeRect(x, y, TileSize-1, TileSize-1)
		ctx.fillRect(x, y, TileSize-1, TileSize-1)
		ctx.fillStyle = saved
  }
}
