// ================================================
// Websockets 
// ------------------------------------------------

{
    class WebSocketHub {
        constructor(address) {
            this.conn = new WebSocket(address);
            this.conn.onopen = WebSocketHub.DefaultHandleOpen
            this.conn.onclose = WebSocketHub.DefaultHandleClose;
            this.conn.onmessage = WebSocketHub.DefaultHandleMessage;
            this.uid = 123
        }

        static DefaultHandleOpen(evt) {
            console.log(`Connection Opened: ${evt.currentTarget.url}`)
        }

        static DefaultHandleClose(evt) {
            console.log(`Connection Closed: ${evt.currentTarget.url}`)
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
            // console.log(msg)
            game.net.HandleMessage(msg)
        }

        nextId() {
            this.uid = this.uid + 1
            let copy = this.uid
            return copy
        }

        send(MessageString, ...params) {
            // Increment the id counter so we can match up the message.
            // let id = this.nextId()

            // Convert the parameters into an array
            let Parameters = []
            for (let p of params) {
                Parameters.push(p)
            }

            // Convert into a JSON message, according to the server APIs.
            let msg = JSON.stringify({
                // id: id,
                method: MessageString,
                params: Parameters,
                //time: (new Date()).getTime(),
            });

            // Send the JSON message across the websocket.
            this.conn.send(msg);
            return
        }
    }
    game.classes.net.WebSocketHub = WebSocketHub

    // Set the Alias variable 'ws' to it function.
    ws = (string,...params)=>game.net.ws.send(string, ...params)
    wsreset = ()=>{        
        game.net.ws.conn.addEventListener('close', function() {
            game.net.StartLocal()
        })
        game.net.ws.conn.close()
    }

}

// ================================================
// game.net
// ------------------------------------------------

{
    game.net = {
        init() {
            this.ws = this.ConnectTo(this.DEFAULT_SERVER)
        },

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

        // NOTE! DEFAULT_LOCAL_SERVER definition is a kludge.
        // If you don't know what this is doing: remove it. 
        DEFAULT_LOCAL_SERVER: new URL(`ws://${window.location.hostname}:8090/ws/echo`),

        StartLocal() {
            this.ws = this.ConnectTo(this.DEFAULT_LOCAL_SERVER)
            game.net.ws.conn.addEventListener('open', function() {
                ws('add', game.MY_USER)
                ws('move', game.MY_USER, 2, 8)
                ws('list')
            })
            return this.ws
        },

    }
}

// ================================================
// game.net.HandleMessage
// ------------------------------------------------
{
    // function mapping:  (message.kind) -> (function(message))
    let funcMap = {
        'playerlist': handlePlayerList,
        'UpdateTargets': handleUpdateTargets,
        'chat': handleChat,
    }

    // Lookup the function to execute based on the message kind.
    function HandleIncomingMessage(message) {
        if (message.kind === undefined) {
            return
        }
        let f = funcMap[message.kind]
        if (typeof (f) !== 'function') {
            throw new Error(`message kind not implemented: ${message.kind}`)
        }
        f(message)
    }

    function handlePlayerList(message) {
        game.player.UpdateList(message.result)

    }

    function handleUpdateTargets(message) {
        for (let[name,pos] of Object.entries(message.result)) {
            game.player.list2[name].TargetPos = pos
        }
    }

    function handleChat(message) {
        console.log(message)
        let {User, Message} = message.result

        // use setText for lasting messages (until you logout).
        game.player.list.get(User).chatbox.setText(Message)

        // use doMessage for self-clearing messages.
        // game.player.list.get(User).chatbox.doMessage(Message)
    }

    game.net.HandleMessage = HandleIncomingMessage
}


// ================================================
// Sending chat messages with Chat Form.
// ------------------------------------------------
{
    let chatbar = document.querySelector('#ChatBar')
    let chatform = document.querySelector('#ChatInputForm')

    function submitChat() {
        if (!chatbar.value) {
            return false
        }
        if (!game.net.ws.conn) {
            return false
        }
        ws('chat', game.MY_USER, chatbar.value)
        chatbar.value = ""
        return false
    }

    chatform.onsubmit = submitChat
}