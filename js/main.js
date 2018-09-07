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
    
    // TODO: unqiue usernames! 
    let MY_USERNAME = 'me'

    // Create the client's main player character
    let x = 5
    let y = 5
    let p = game.classes.Player.New(MY_USERNAME, x, y)
    p.setPos(x, y)
    p.setTarget(x, y)
    p.Draw()
    game.player.me = p

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
