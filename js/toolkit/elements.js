{
    // Time Bomb is an event that deletes the given element
    // after the specified amount of milliseconds.
    function TimeBomb(element, duration) {
        window.setTimeout(function() {
            element.remove()
        }, duration)
    }

    // helper function for creating new elements.
    function MakeElement(ElementType, Attributes, Parent) {
        let ele = document.createElement(ElementType)

        // Iterate through the attributes and add them.
        if (Attributes !== undefined) {
            for (let[key,val] of Object.entries(Attributes)) {
                ele.setAttribute(key, val)
            }
        }

        // Parent can be either an object or a selector string.
        if (Parent !== undefined) {
            switch (typeof (Parent)) {
            case "object":
                Parent.appendChild(ele)
            case "string":
                document.querySelector(Parent).appendChild(ele)
            }
        }

        return ele
    }

    game.toolkit = Object.assign({
        TimeBomb,
        MakeElement,
    }, game.toolkit)
}
