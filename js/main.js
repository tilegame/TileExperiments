// ================================================
// Drawing the Map
// ------------------------------------------------
// Source: s
// Destination: d
// Position: x | y 
// Width: w
// Height: h

// ================================================
// Helper Functions
// ------------------------------------------------

// NOTE: This method is only correct for positive numbers.
function div(a, b) {
    return ~~((a - 1) / b)
}

// ================================================
// Main
// ------------------------------------------------
game.main = (event)=>{

    // Call the init() function on each of the libraries.
    // Display to console for debugging.

    let LibList = ['player', 'camera', 'drawer', 'debug']
    
    for (lib of LibList) {
        game[lib].init()
        console.log(`${lib} initialized:`, game[lib])
    }

    game.drawer.DrawMap()
    console.log("main done.")
    console.log("game", game)
}

// Start the Fetcher When the Page has loaded.
// The fetcher will call game.main() when the maps have 
// been fetched, and the images have been loaded.
window.addEventListener("load", ()=>{
    game.fetcher.FetchMap(game.fetcher.DEFAULT)
});
