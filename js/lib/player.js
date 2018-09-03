// ================================================
// Player
// ------------------------------------------------

game.player = {
    init() {
        let myCanvas = document.querySelector("#mainPlay")
        this.me = new game.classes.Player(myCanvas)
    },

}

{
    class Player {
        constructor(canvas) {
            this.canvas = canvas
            this.ctx = canvas.getContext('2d')
            this.position = {
                tx: 1,
                ty: 1
            }
            this.targetposition = {
                tx: 1,
                ty: 1
            }

        }

        // setPos force-moves the player to the exact position specified
        // by directly changing the position both logically and visually.
        setPos(tx, ty) {
            this.position = {
                tx,
                ty
            }
            let top = game.TILE_SIZE * (ty - game.camera.FirstTile.y)
            let left = game.TILE_SIZE * (tx - game.camera.FirstTile.x)
            this.canvas.style.setProperty('top', `${top}px`)
            this.canvas.style.setProperty('left', `${left}px`)
        }
    }

    game.classes.Player = Player
}
