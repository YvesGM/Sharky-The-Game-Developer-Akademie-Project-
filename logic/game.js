import Keyboard from "../lib/classes/keyboard/keyboard.class.js";
import loadCanvas from "./world/world.js";
import { initGameUI, hideStartScreen } from "./ui/game-ui.js";

let gameStarted = false;

function initializeSharky() {
    initMobileControls();
    
    initGameUI({
        onStart: startGame,
        onRestart: restartGame,
        onFullscreen: toggleFullscreen
    });
}

function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    hideStartScreen();
    loadCanvas();
}

function restartGame() {
    window.location.reload();
}

function toggleFullscreen() {
    const wrapper = document.querySelector(".game_wrapper");
    
    if (!document.fullscreenElement) {
        wrapper?.requestFullscreen();
        return;
    }
    
    document.exitFullscreen();
}

function initMobileControls() {
    const buttons = document.querySelectorAll(".mobile_controls button");
    
    buttons.forEach(button => {
        const key = button.dataset.key;
        
        button.addEventListener("touchstart", (e) => {
            e.preventDefault();
            Keyboard[key] = true;
        });
        
        button.addEventListener("touchend", (e) => {
            e.preventDefault();
            Keyboard[key] = false;
        });
        
        button.addEventListener("mousedown", () => {
            Keyboard[key] = true;
        });
        
        button.addEventListener("mouseup", () => {
            Keyboard[key] = false;
        });
        
        button.addEventListener("mouseleave", () => {
            Keyboard[key] = false;
        });
    });
}

window.addEventListener("load", initializeSharky);

window.addEventListener("keydown", (e) => {
    if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
    }
    
    if (e.keyCode == 32) {
        Keyboard.SPACE = true;
    }
    
    if (e.keyCode == 38) {
        Keyboard.UP = true;
    }
    
    if (e.keyCode == 39) {
        Keyboard.RIGHT = true;
    }
    
    if (e.keyCode == 37) {
        Keyboard.LEFT = true;
    }
    
    if (e.keyCode == 40) {
        Keyboard.DOWN = true;
    }
    
    if (e.keyCode == 68) {
        Keyboard.D = true;
    }
    
    if (e.keyCode == 82) {
        Keyboard.RESTART = true;
        restartGame();
    }
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 32) {
        Keyboard.SPACE = false;
    }
    
    if (e.keyCode == 38) {
        Keyboard.UP = false;
    }
    
    if (e.keyCode == 39) {
        Keyboard.RIGHT = false;
    }
    
    if (e.keyCode == 37) {
        Keyboard.LEFT = false;
    }
    
    if (e.keyCode == 40) {
        Keyboard.DOWN = false;
    }
    
    if (e.keyCode == 68) {
        Keyboard.D = false;
    }
    
    if (e.keyCode == 82) {
        Keyboard.RESTART = false;
    }
});