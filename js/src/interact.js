// ================================================
// User Interactions and Event Handlers
// ------------------------------------------------
{
    // The overlay canvas is what the user actually clicks on.
    // Keep this as a variable, because the specific canvas
    // element may change in the future.
    let overlay = document.querySelector('#Overlay')

    // The clickbox is a fancy extra box that it used to show you
    // that you have clicked on a tile.
    let clickbox = document.querySelector('#myclickbox')

    function init() {
        overlay.addEventListener('click', handleClickEvent)
    }

    function handleClickEvent(event) {

        // Get the clicked (x,y) relative to the canvas element.        
        let r = overlay.getBoundingClientRect();
        let x = event.clientX - r.left
        let y = event.clientY - r.top

        // offset pixel position of target tile's upper-left corner.
        // used for adding the target canvas.
        //
        // TODO: this should just update targetbox location and redraw it.
        //
        {
            let left = x - (x % game.TILE_SIZE)
            let top = y - (y % game.TILE_SIZE)
            clickbox.style.top = top + 'px'
            clickbox.style.left = left + 'px'
        }
        // The Tile(x,y) relative to the first tile on the board.
        let OffsetTileX = Math.floor(x / game.TILE_SIZE)
        let OffsetTileY = Math.floor(y / game.TILE_SIZE)

        // Calculate the actual tile.
        let outx = game.camera.FirstTile.x + OffsetTileX
        let outy = game.camera.FirstTile.y + OffsetTileY

        ws('move', game.MY_USER, outx, outy)
        // Debug Message
        // console.log(`you clicked on tile (${outx}, ${outy})`)
    }

    game.interact = {
        init,
        overlay,
        handleClickEvent,
        clickbox,
    }
}
