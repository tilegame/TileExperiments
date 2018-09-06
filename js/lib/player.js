// ================================================
// Player
// ------------------------------------------------

game.player = {
    init() {
        // game.player.list is the client's local playerlist.
        this.list = {}
    },

    UpdateList(result) {
        for (let [name, p] of Object.entries(result)) {
            
            // Create a new player object if it hasn't been added yet.
            if (this.list[name] === undefined) {
                this.list[name] = game.classes.Player.New(name)
            }

            // Update the position values
            this.list[name].CurrentPos = p.CurrentPos
            this.list[name].TargetPos = p.TargetPos
            this.list[name].Draw()
        }        
    },
}

{
    class Player {
        constructor(canvas) {
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
            let p = new Player(canvas)
            p.name = name

            // Add to the player list.
            game.player.list[name] = p

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
    }

    game.classes.Player = Player
}
