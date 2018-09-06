// ================================================
// Player
// ------------------------------------------------

game.player = {
    init() {
        let myCanvas = document.querySelector("#mainPlay")
        this.me = new game.classes.Player(myCanvas)
        this.me.name = "me"
        this.me.currentPos = {tx:5, ty:5}
        this.me.targetPos = {tx:5, ty:5}
    },

}

{
    class Player {
        constructor(canvas) {
            this.name = name
            this.canvas = canvas
            this.ctx = canvas.getContext('2d')
            this.currentPos = {
                tx: 1,
                ty: 1
            }
            this.targetPos = {
                tx: 1,
                ty: 1
            }
        }

        // NewPlayer creates a new canvas for the player at the specified
        // location, and attaches it to the document body.  The player
        // object is returned.
        static NewPlayer(name, tx, ty) {

            // Creates a new Canvas.
            let canvas = document.createElement('canvas')
            let attr = {
                width: game.TILE_SIZE,
                height: game.TILE_SIZE,
                top: 0,
                left: 0,
            }
            for (let [key, val] of Object.entries(attr)) {
                canvas.setAttribute(key, val)
            }
            document.querySelector('#WrapPlayerLayer').appendChild(canvas)
            
            // Creates the player objects and passes it the new canvas.
            let p = new Player(canvas)
            p.name = name
            p.currentPos = {tx, ty}

            return p
        }

        // setPos force-moves the player to the exact position specified
        // by directly changing the position both logically and visually.
        setPos(tx, ty) {
            this.currentPos = {
                tx,
                ty
            }
            let top = game.TILE_SIZE * (ty - game.camera.FirstTile.y)
            let left = game.TILE_SIZE * (tx - game.camera.FirstTile.x)
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
