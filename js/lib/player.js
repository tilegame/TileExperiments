// ================================================
// Player
// ------------------------------------------------

game.player = {
    init() {
        this.canvas = document.querySelector("#MainCharacter")
    },

    moveTo(x,y) {

    }
}

{
    class Player {
        constructor(canvas) {
            this.canvas = canvas
            this.ctx = canvas.getContext('2d')
            this.position = {x:1, y:1}
            this.targetposition = {x:1, y:1}
            
        }
    }

    game.classes.Player = Player
}
