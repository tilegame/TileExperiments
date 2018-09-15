// ================================================
// Fetcher: Downloading Map Data
// ------------------------------------------------

// Default Locations for fetching the Map Data.
game.fetcher = {

    // Keeps track of the initial map fetch.
    FIRST_DONE: false,

    // URLs of various different experimental maps.
    JSON_URLS: {
        1: "json/example.json",
        2: "tools/ex.json",
        3: "tools/hundred.json",
    },

    // The Default map to load for FetchMap() 
    DEFAULT: window.location.origin + "/tools/hundred.json",

    // TODO: return a Promise that the image will load,
    //       then do a .then(DrawMap())
    //
    FetchMap(map_url) {
        console.log(`Fetching map from: ${map_url}`)
        fetch(map_url).then((response)=>{
            return response.json()
        }
        ).then((myJson)=>{
            this.handleJson(myJson)
        }
        ).catch(error=>{
            console.error('Fetch Error:', error)
        }
        )
    },

    // handleJson basically just saves the json data into memory.
    handleJson(myJson) {
        console.log("FetchMap Completed:", myJson)

        // add the JSON data to the game.
        game.Atlas = myJson.Atlas
        game.LogicalMap = myJson.Map

        // Prepare the TileMatrix
        this.MakeMapIntoTileMatrix()

        // Fetch and Load the image for the atlas.
        this.FetchAtlasImage(game.Atlas.ImagePath)

    },

    FetchAtlasImage(path) {

        // TODO: make json into relative paths.
        path = window.location + "img/tiles.png"

        console.log(`Fetching image from: ${path}`)

        // Once the image has been fetched and loaded, the map can be drawn.
        game.AtlasImage = new Image()
        game.AtlasImage.src = "img/tiles.png"
        game.AtlasImage.addEventListener('load', this.TriggerDraw, false)

    },

    TriggerDraw() {
        // If this is not the initial fetch, just draw the map.
        if (this.FIRST_DONE === true) {
            game.drawer.DrawMap()
            return
        }
        // Call the "main" function if this is the first fetch.
        this.FIRST_DONE = true
        console.log(`Image Fetch Done:`, game.AtlasImage)
        game.main()
    },

    MakeMapIntoTileMatrix() {

        // Create a matrix of Tiles, based on the LogicalMap of values.
        // Basically, converts the values into Tile objects that can be used later.
        let h = game.LogicalMap.Height
        let w = game.LogicalMap.Width

        // Create an empty (w x h) matrix.
        let matrix = new Array(h)
        for (let i of matrix.keys()) {
            matrix[i] = new Array(w)
        }

        for (let row = 0; row < h; row++) {
            for (let col = 0; col < w; col++) {

                // Create the Tile.
                let t = new game.classes.Tile(col,row)

                // Assign layer information
                // TODO!!
                // Change the JSON format, then change this!
                t.layers[game.enums.GROUND_LAYER] = game.LogicalMap.Data[0][row][col]
                t.layers[game.enums.ABOVE_LAYER] = game.LogicalMap.Data[1][row][col]

                // Save the tile into the TileMatrix.
                matrix[row][col] = t

            }
        }
        // Save the filled matrix into an accessible location.
        game.TileMatrix = matrix
        // Helper function for retrieving map tiles.
        game.GetMapTile = (tx,ty)=>{
            if ((tx >= w) || (ty >= h)) {
                return undefined
            }
            return game.TileMatrix[ty][tx]
        }
    },

}
