// ================================================
// In-game Chat
// -----------------------------------------------

// document.styleSheets[0].cssRules[0]

{
    // stores the mapping of (username -> chatmessage)
    let _chatmap = new Map()

    // Creates a new chatbox. It's message can be changed later.
    class ChatBox {
        constructor() {
            // the div element that holds the text.
            this.element = game.toolkit.MakeElement('div', {
                class: "chatbox",
            }, '#WrapChat')

            // duration is the amount of time before the chat
            // message gets cleared.
            this.duration = 10000

            // Start off the chat timebomb (which clears the chat)
            this.timebomb()
        }

        // setPos places the div element containing the text at a location
        // that keeps the text centered at that tile.
        setPos(tx, ty) {
            let {x, y} = game.camera.getTileCenterCoords(tx, ty)
            x += game.TILE_SIZE / 2
            //y -= game.TILE_SIZE
            this.element.style.top = `calc(${y}px - 1em`
            this.element.style.left = `calc(${x}px - 33ch)`
        }

        setText(text) {
            this.element.textContent = text
        }

        // doMessage is called by the chat message handler and adds
        // a timer to the text.  It clears previous timers, to prevent 
        // multiple timers from existing at the same time.
        doMessage(text) {
            this.setText(text)
            window.clearTimeout(this.timer)
            this.timebomb()
        }

        // Timebomb creates a new timer that will clear the chat 
        // after some pre-specfied amount of time.
        timebomb() {
            this.timer = window.setTimeout(()=>{
                this.clear()
            }
            , this.duration)
        }

        remove() {
            this.element.remove()
        }

        clear() {
            this.element.textContent = ""
        }

    }

    function lolz() {
        let examples = ['omg, wat.', 'hello there!', 'why am I a red square?', 'hey, you look like me!', "what's going on here?"]
        let l = []
        let i = 0
        for (let name of game.player.list.keys()) {
            i++ 
            if (i < examples.length) {
                ws('chat', name, examples[i])
            }
            l.push(name)
        }
        return l
    }

    game.chat = {
        ChatBox,
        lolz
    }
}
