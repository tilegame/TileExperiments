// ================================================
// Camera
// ------------------------------------------------

/*
The camera will remain seperate from the player's position.  In this
version of the game, the camera is actually determined by the player's
position, but that will be kept seperate from the class definitions.

The Camera determines the tiles that are visible at any given point
in time, and generates iterators for use by the Renderer.
*/
{
    // The tile where the camera is centered.
    this.position = {
        x: 10,
        y: 10
    }

    // The radius (in tiles) around which everything is visible.
    // NOTE: For now, this will not be a circle radius, and instead
    // will be the the side length of a square.
    this.VIEW_RADIUS = 10

    // The TileLocation of the Tile that is currently at square (0,0).
    // This can be negative if the camera is near the edge of the map.
    this.FirstTile = {
        x: 0,
        y: 0
    }

    function setFirstTile(X, Y) {
        this.FirstTile = {
            x: X,
            y: Y,
        }
    }

    // Scrollable Viewport Element
    // The element that can actually be manipulated using the 
    // scrollTo command.  Originally, this was just the window,
    // but as the HTML structure changes, this element might change.
    this.ScrollableViewport = document.querySelector('#GameViewport')

    // Rectangle Bounds. camera position.
    function UpdateBounds() {
        this.x0 = this.position.x - this.VIEW_RADIUS
        this.xf = this.position.x + this.VIEW_RADIUS
        this.y0 = this.position.y - this.VIEW_RADIUS
        this.yf = this.position.y + this.VIEW_RADIUS
    }

    // VisibleTiles Generates an Iterator of TileLocations.
    // Later on, this function will accept parameters that define the
    // shape of the visual area (for example, a Circle instead of a Rectangle).
    function *VisibleTiles() {
        for (let x = this.x0; x < this.xf; x++) {
            for (let y = this.y0; y < this.yf; y++) {
                yield({
                    x,
                    y
                })
            }
        }
    }

    // Scrolls such that the absolute center tile is displayed in the center 
    // of the screen.
    function center() {
        let w = this.ScrollableViewport.innerWidth
        let h = this.ScrollableViewport.innerHeight
        let x = game.BLOCK_SIZE * 3 / 2 - w / 2
        let y = game.BLOCK_SIZE * 3 / 2 - h / 2
        this.ScrollableViewport.scrollTo(x, y)
    }

    // Scrolls such that the specified tile becomes visible
    // at the center of the screen.
    function scrollToTile(a, b) {
        let w = this.ScrollableViewport.clientWidth
        let h = this.ScrollableViewport.clientHeight
        let x = (a - this.FirstTile.x) * game.TILE_SIZE - w / 2
        let y = (b - this.FirstTile.y) * game.TILE_SIZE - h / 2
        this.ScrollableViewport.scrollTo(x, y)
    }

    // getTileCenterCoords returns the pixel location of the center 
    // of the specified tile.
    function getTileCenterCoords(a, b) {
        return {
            x: (a - this.FirstTile.x + 0.5) * game.TILE_SIZE,
            y: (b - this.FirstTile.y + 0.5) * game.TILE_SIZE,
        }
    }

    // returns the upper-left corner of a tile, which is useful for
    // setting styles like "top" and "left"
    function getTileTopLeft(a, b) {
        return {
            left: (a - this.FirstTile.x) * game.TILE_SIZE,
            top: (b - this.FirstTile.y) * game.TILE_SIZE,
        }
    }

    function init() {
        UpdateBounds()
    }

    game.camera = {
        init,
        FirstTile,
        setFirstTile,
        scrollToTile,
        getTileCenterCoords,
        getTileTopLeft,
        ScrollableViewport,
    }
}
