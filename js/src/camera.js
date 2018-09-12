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
    //     let position = {
    //         x: 10,
    //         y: 10
    //     }

    // The radius (in tiles) around which everything is visible.
    // NOTE: For now, this will not be a circle radius, and instead
    // will be the the side length of a square.
    //     let VIEW_RADIUS = 10

    // The TileLocation of the Tile that is currently at square (0,0).
    // This can be negative if the camera is near the edge of the map.
    let FirstTile = {
        x: 0,
        y: 0
    }

    function setFirstTile(X, Y) {
        FirstTile = {
            x: X,
            y: Y,
        }
    }

    // Scrollable Viewport Element
    // The element that can actually be manipulated using the 
    // scrollTo command.  Originally, this was just the window,
    // but as the HTML structure changes, this element might change.
    let ScrollableViewport = document.querySelector('#GameViewport')

    // Rectangle Bounds. camera position.
    //     function UpdateBounds() {
    //         this.x0 = position.x - VIEW_RADIUS
    //         this.xf = position.x + VIEW_RADIUS
    //         this.y0 = position.y - VIEW_RADIUS
    //         this.yf = position.y + VIEW_RADIUS
    //     }

    // VisibleTiles Generates an Iterator of TileLocations.
    // Later on, this function will accept parameters that define the
    // shape of the visual area (for example, a Circle instead of a Rectangle).
    //     function *VisibleTiles() {
    //         for (let x = this.x0; x < this.xf; x++) {
    //             for (let y = this.y0; y < this.yf; y++) {
    //                 yield({
    //                     x,
    //                     y
    //                 })
    //             }
    //         }
    //     }

    // Scrolls such that the absolute center tile is displayed in the center 
    // of the screen.
    function center() {
        let w = ScrollableViewport.innerWidth
        let h = ScrollableViewport.innerHeight
        let x = game.BLOCK_SIZE * 3 / 2 - w / 2
        let y = game.BLOCK_SIZE * 3 / 2 - h / 2
        ScrollableViewport.scrollTo(x, y)
    }

    // Scrolls such that the specified tile becomes visible
    // at the center of the screen.
    function scrollToTile(a, b) {
        let w = ScrollableViewport.clientWidth
        let h = ScrollableViewport.clientHeight
        let x = (a - FirstTile.x) * game.TILE_SIZE - w / 2
        let y = (b - FirstTile.y) * game.TILE_SIZE - h / 2
        ScrollableViewport.scrollTo(x, y)
    }

    // getTileCenterCoords returns the pixel location of the center 
    // of the specified tile.
    function getTileCenterCoords(a, b) {
        return {
            x: (a - FirstTile.x + 0.5) * game.TILE_SIZE,
            y: (b - FirstTile.y + 0.5) * game.TILE_SIZE,
        }
    }

    // returns the upper-left corner of a tile, which is useful for
    // setting styles like "top" and "left"
    function getTileTopLeft(a, b) {
        return {
            left: (a - FirstTile.x) * game.TILE_SIZE,
            top: (b - FirstTile.y) * game.TILE_SIZE,
        }
    }

    function init() {
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
