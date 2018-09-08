// ================================================
// In-game Chat
// -----------------------------------------------

{
    // stores the mapping of (username -> chatmessage)
    let _chatmap = new Map()

    // Creates a new chatbox. It's message can be changed later.
    function ChatBox(text) {
        let ele = game.toolkit.MakeElement('div', {
          class: "chatbox",
          top: "100px",
          left: "100px",
          style: "text-align: center;",
        }, '#WrapChat')
        ele.textContent = text
        return ele
    }

    game.chat = {
        ChatBox,
    }
}
