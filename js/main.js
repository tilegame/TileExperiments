// ================================================
// Main
// ------------------------------------------------
game.main = (event)=>{

    // Call the init() function on each of the libraries.
    // Display to console for debugging.

    let LibList = ['net', 'player', 'camera', 'drawer', 'debug', 'interact']

    for (lib of LibList) {
        game[lib].init()
        // console.log(`$ game.${lib}`, game[lib])
    }

    game.drawer.DrawMap()
    // console.log("$ game \n", game)
    
    game.net.ws.conn.addEventListener('open', ()=>{    
        ws('add', game.MY_USER)
        ws('move', game.MY_USER, 2, 8)
        ws('list')
    })
}

// Start the Fetcher When the Page has loaded.
// The fetcher will call game.main() when the maps have 
// been fetched, and the images have been loaded.
window.addEventListener("load", ()=>{
    console.log("window loaded")
    game.fetcher.FetchMap(game.fetcher.DEFAULT)
}
);

// This should be the last .js file to be listed in the html,
// which means it should be the last one to load.
// Check that all definitions have been loaded:

// console.log("$ game.classes \n", game.classes)
