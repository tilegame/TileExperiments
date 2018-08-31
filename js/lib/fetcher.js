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
    DEFAULT: window.location.href + "tools/hundred.json",

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

        // Fetch and Load the image for the atlas.
        this.FetchAtlasImage(game.Atlas.ImagePath)

    },

    FetchAtlasImage(path) {
        console.log(`Fetching image from: ${path}`)
        game.Atlas.img = new Image()
        game.Atlas.img.src = game.Atlas.ImagePath

        // Once the image has been fetched and loaded, drawAll will be called.
        game.Atlas.img.addEventListener('load', this.TriggerDraw, false)

    },

    TriggerDraw() {
        // If this is not the initial fetch, just draw the map.
        if (this.FIRST_DONE === true) {
            game.drawer.DrawMap()
            return
        }
        // Call the "main" function if this is the first fetch.
        this.FIRST_DONE = true
        console.log(`Image Fetch Done:`, game.Atlas.img)
        game.main()
    },

}
