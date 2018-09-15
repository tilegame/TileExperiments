// ================================================
// game.player 
// ------------------------------------------------

{
    function init() {}

    // playermap contains the map: (username -> Player)
    // Username is a string.
    // Player is a "Class Player" object. 
    let playermap = new Map()

    // activeset is used to detect when players have left the area.
    // when a FullPlayerList message is received, this activelist
    // gets filled with the player names.  Then, Refresh() is called
    // to remove any players that aren't in this activelist.
    let activeset = new Set()

    function me() {
        return game.player.playermap.get(game.MY_USER)
    }

    // UpdateList refreshes the playerlist and replaces it with
    // the list provided by the server.
    function UpdateList(result) {
        activeset.clear()
        for (let[name,p] of Object.entries(result)) {

            // Create a new player object if it hasn't been added yet.
            if (!playermap.has(name)) {
                playermap.set(name, game.classes.Player.New(name))
            }
            // Retrieve the player object.
            let play = playermap.get(name)

            // Update the position values
            {
                let {X, Y} = p.CurrentPos
                play.setPos(X, Y)
            }
            {
                let {X, Y} = p.TargetPos
                play.setTarget(X, Y)
            }
            play.Draw()

            // Add the name to the Active set so we don't delete it.
            activeset.add(name)
        }
        this.Refresh()
    }

    // check for any names that are no longer active.  Remove them
    // so they don't continue to appear on the screen.
    function Refresh() {
        for (let name of playermap.keys()) {
            if (activeset.has(name)) {
                activeset.delete(name)
            } else {
                playermap.get(name).canvas.remove()
                playermap.get(name).chatbox.remove()
                playermap.delete(name)

            }
        }
    }

    // Draws all players based on their current positions.
    function DrawAll() {
        for ([name,p] of playermap) {
            p.Draw()
        }
        DrawTargetBox()
    }

    let targetbox = document.querySelector('#myclickbox')

    // Draws a square to indicate the destination of the client's 
    // main chracter.  If the target is, for any reason, off the 
    // visable map, then it won't be drawn. 
    function DrawTargetBox() {
        let {X, Y} = game.player.me().TargetPos
        let {X: PX, Y: PY} = game.player.me().CurrentPos

        // If the player is standing on the targetbox, there is 
        // no need to display it.
        if ((PX == X) && (PY == Y)) {
            targetbox.style.setProperty('display', 'none')
            return
        }

        // If the tile is not visible, make the targetbox 
        // invisible. 
        if (!game.camera.isTileVisible(X, Y)) {
            targetbox.style.setProperty('display', 'none')
            return
        }

        let {top, left} = game.camera.getTileTopLeft(X, Y)
        targetbox.style.top = top + 'px'
        targetbox.style.left = left + 'px'
        targetbox.style.setProperty('display', '')
    }

    game.player = {
        me,
        playermap,
        init,
        UpdateList,
        Refresh,
        DrawAll,
        DrawTargetBox,
    }

}

// ================================================
// Class Player
// ------------------------------------------------

{
    class Player {
        constructor(canvas, name) {
            this.name = name
            this.canvas = canvas
            this.ctx = canvas.getContext('2d')
            this.CurrentPos = {
                X: 1,
                Y: 1
            }
            this.TargetPos = {
                X: 1,
                Y: 1
            }
            this.chatbox = new game.chat.ChatBox()
            this.chatbox.setText(this.name)
        }

        // NewPlayer creates a new canvas for the player at the specified
        // location, and attaches it to the document body.  The player
        // object is returned.
        static New(name) {

            // Creates a new Canvas.
            let canvas = document.createElement('canvas')
            let attr = {
                width: game.TILE_SIZE,
                height: game.TILE_SIZE,
                class: 'player',
            }
            for (let[key,val] of Object.entries(attr)) {
                canvas.setAttribute(key, val)
            }
            document.querySelector('#WrapPlayerLayer').appendChild(canvas)

            // Creates the player objects and passes it the new canvas.
            let p = new Player(canvas,name)

            // Draws the default cat on the player canvas.
            game.TheCat.draw(p.ctx, 'W', 'JUMPING', 2)

            // Add to the player list.
            game.player.playermap.set(name, p)

            // Return a reference to the newly created player.
            return p
        }

        // setPos force-moves the player to the exact position specified
        // by directly changing the position both logically and visually.
        setPos(X, Y) {
            this.CurrentPos = {
                X,
                Y
            }
            this.chatbox.setPos(X, Y)
        }

        // setTarget simply changes the value of the player's target Position.
        setTarget(X, Y) {
            this.TargetPos = {
                X,
                Y
            }
        }

        // Draw doesn't actually re-draw, but it updates it's location
        // in the CSS, which effectively redraws it.
        // Hides the player if they aren't on the map. 
        Draw() {
            let {X, Y} = this.CurrentPos
            if (!game.camera.isTileVisible(X, Y)) {
                this.canvas.style.setProperty('display', 'none')
                return
            }

            let {top, left} = game.camera.getTileTopLeft(X, Y)
            this.canvas.style.setProperty('top', `${top}px`)
            this.canvas.style.setProperty('left', `${left}px`)
            this.canvas.style.setProperty('display', '')
        }

        // Player.scrollTo centers the camera on the tile that the 
        // player is standing on.
        scrollTo() {
            let {X, Y} = this.CurrentPos
            game.camera.scrollToTile(X, Y)
        }
    }

    game.classes.Player = Player
}
