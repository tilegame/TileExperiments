// ================================================
// Player
// ------------------------------------------------

game.player = {
    init() {
        // game.player.list is the client's local playerlist.
        this.list = new Map()

        // activeset is used to detect when players have left the area.
        // when a FullPlayerList message is received, this activelist
        // gets filled with the player names.  Then, Refresh() is called
        // to remove any players that aren't in this activelist.
        this.active = new Set()

        this.me = function() {
            return game.player.list.get(game.MY_USER)
        }

    },

    // UpdateList refreshes the playerlist and replaces it with
    // the list provided by the server.
    UpdateList(result) {
        this.active.clear()
        for (let[name,p] of Object.entries(result)) {

            // Create a new player object if it hasn't been added yet.
            if (!this.list.has(name)) {
                this.list.set(name, game.classes.Player.New(name))
            }
            // Retrieve the player object.
            let play = this.list.get(name)

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
            this.active.add(name)
        }
        this.Refresh()
    },

    // check for any names that are no longer active.  Remove them
    // so they don't continue to appear on the screen.
    Refresh() {
        for (let name of this.list.keys()) {
            if (this.active.has(name)) {
                this.active.delete(name)
            } else {
                this.list.get(name).canvas.remove()
                this.list.get(name).chatbox.remove()
                this.list.delete(name)

            }
        }
    }
}

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
            let p = new Player(canvas, name)

            // Add to the player list.
            game.player.list.set(name, p)

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
        Draw() {
            let {X, Y} = this.CurrentPos
            let top = game.TILE_SIZE * (Y - game.camera.FirstTile.y)
            let left = game.TILE_SIZE * (X - game.camera.FirstTile.x)
            this.canvas.style.setProperty('top', `${top}px`)
            this.canvas.style.setProperty('left', `${left}px`)
        }

        // moveTo sets the target position of the player, and sends a 
        // websocket message to the server, informing the server that
        // the player wants to move.
        moveTo(tx, ty) {
            ws('move', this.name, tx, ty)
        }

        // Player.scrollTo centers the camera on the tile that the 
        // player is standing on.
        scrollTo() {
            let {X,Y} = this.CurrentPos
            game.camera.scrollToTile(X,Y)
        }
    }

    game.classes.Player = Player
}
