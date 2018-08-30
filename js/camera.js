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

class Camera {
    constructor() {
        // The tile where the camera is centered.
        this.position = new TileLocation(10,10)

        // The radius (in tiles) around which everything is visible.
        // NOTE: For now, this will not be a circle radius, and instead
        // will be the the side length of a square.
        this.VIEW_RADIUS = 10

        // Rectangle Bounds.
        // Values used frequently by the generators, these should be 
        // updated whenever the camera position changes.
        this.UpdateBounds()
    }

    // Update calculates the bounds based on the current camera position.
    UpdateBounds() {
        this.x0 = this.position.x - this.VIEW_RADIUS
        this.xf = this.position.x + this.VIEW_RADIUS
        this.y0 = this.position.y - this.VIEW_RADIUS
        this.yf = this.position.y + this.VIEW_RADIUS
    }

    // VisibleTiles Generates an Iterator of TileLocations.
    // Later on, this function will accept parameters that define the
    // shape of the visual area (for example, a Circle instead of a Rectangle).
    *VisibleTiles() {
        for (let x = this.x0; x < this.xf; x++) {
            for (let y = this.y0; y < this.yf; y++) {
                yield(new TileLocation(x,y))
            }
        }
    }

    

}
