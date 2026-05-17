import Keyboard from "../lib/classes/keyboard/keyboard.class.js";
import loadCanvas from "./world/world.js"

function initializeSharky() {
    loadCanvas();
}

window.addEventListener("load", initializeSharky)

window.addEventListener("keydown", (e) => {
    if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
    }
    if (e.keyCode == 32) {
        Keyboard.SPACE = true
    }
    if (e.keyCode == 38) {
        Keyboard.UP = true
    }
    if (e.keyCode == 39) {
        Keyboard.RIGHT = true
    }
    if (e.keyCode == 37) {
        Keyboard.LEFT = true
    }
    if (e.keyCode == 40) {
        Keyboard.DOWN = true
    }
    if (e.keyCode == 68) {
        Keyboard.D = true
    }

})

window.addEventListener("keyup", (e) => {

    if (e.keyCode == 32) {
        Keyboard.SPACE = false
    }
    if (e.keyCode == 38) {
        Keyboard.UP = false
    }
    if (e.keyCode == 39) {
        Keyboard.RIGHT = false
    }
    if (e.keyCode == 37) {
        Keyboard.LEFT = false
    }
    if (e.keyCode == 40) {
        Keyboard.DOWN = false
    }
    if (e.keyCode == 68) {
        Keyboard.D = false
    }

})