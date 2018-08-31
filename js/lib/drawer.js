// ================================================
// Renderer
// ------------------------------------------------

// The Renderer handles the interaction with the canvas,
// abstracting the drawing concepts away from the rest of 
// the game logic.
game.drawer = {
    init() {
        let classNameList = ['.one', '.two', '.three', '.four', '.five', '.six', '.seven', '.eight']
        this.canvasList = []
        for (let i of classNameList) {
            this.canvasList.push(document.querySelector(i))
        }
    }
}
