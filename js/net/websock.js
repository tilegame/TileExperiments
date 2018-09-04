// ================================================
// Websockets 
// ------------------------------------------------

{
    class WebSocketHub {
        constructor(address) {
            this.conn = new WebSocket(address);
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
            // msg.TIME = new Date(msg.time).toTimeString()
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
                ID: id,
                msg: MessageString,
                //time: (new Date()).getTime(),
            });

            // Send the JSON message across the websocket.
            this.conn.send(msg);
            return id
        }
    }
    game.classes.net.WebSocketHub = WebSocketHub
}

// ================================================
// game.net
// ------------------------------------------------

{
    game.net = {

        // Canonical URL of the game websocket server.
        DEFAULT_SERVER: new URL('wss://thebachend.com/ws/echo'),

        // Creates a new WebSocketHub using the specified address.
        ConnectTo(address) {
            if (window["WebSocket"]) {
                return new game.classes.net.WebSocketHub(address)
            } else {
                throw new Error(`Cannot connect to Websocket at ${address}`)
            }
        },

        init() {
            this.ws = this.ConnectTo(this.DEFAULT_SERVER)
        },

        // NOTE! DEFAULT_LOCAL_SERVER definition is a kludge.
        // If you don't know what this is doing: remove it. 
        DEFAULT_LOCAL_SERVER: new URL(`ws://${window.location.hostname}:8090/ws/echo`),

        StartLocal() {
            this.ws = this.ConnectTo(this.DEFAULT_LOCAL_SERVER)
            return this.ws
        },

    }
}
