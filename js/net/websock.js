// ================================================
// Websockets
// ------------------------------------------------

{
    class WebSocketHub {
        constructor() {
            this.conn = new WebSocket("wss://thebachend.com/ws/echo");
            this.conn.onclose = WebSocketHub.DefaultHandleClose;
            this.conn.onmessage = WebSocketHub.DefaultHandleMessage;
            this.uid = 123
        }

        static DefaultHandleClose(evt) {
            console.log("Connection closed.");
        }

        static DefaultHandleMessage(evt) {
            let messages = evt.data.split('\n');
            for (let i = 0; i < messages.length; i++) {
                WebSocketHub.HandleJSONMessage(messages[i])
            }
        }

        static HandleJSONMessage(IncomingMessage) {
            let msg = JSON.parse(IncomingMessage)
            msg.TIME = new Date(msg.TIME).toTimeString()
            console.log(msg)
        }

        nextId() {
            this.uid = this.uid + 1
            let copy = this.uid
            return copy
        }

        send(MessageString) {
            // Increment the id counter so we can match up the message.
            let id = this.nextId()

            // Convert into a JSON message, according to the server APIs.
            let msg = JSON.stringify({
                num: id,
                time: (new Date()).getTime(),
                msg: MessageString,
            });

            // Send the JSON message across the websocket.
            return this.conn.send(msg);
        }
    }
    game.classes.net.WebSocketHub = WebSocketHub
}

game.net = {
    init() {
        // Before Creating the WebSocketHub, test to make sure the browser supports it.
        if (window["WebSocket"]) {
            this.ws = new game.classes.net.WebSocketHub();
        } else {
            console.log("Cannot connect to Websocket");
        }
    },

}
