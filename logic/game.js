import Keyboard from "../lib/classes/keyboard/keyboard.class.js";
import loadCanvas from "./world/world.js";
import { initGameUI, hideStartScreen } from "./world/hud/game-ui.js";
import { AUDIO_MANAGER } from "../lib/configs/audio/audio.configs.js";
import { initLegalUI } from "./world/legals/legal-ui.js";
import { initSoundCreditsUI } from "./world/legals/sound-credits-ui.js";

let gameStarted = false;

const blockedKeyCodes = [32, 37, 38, 39, 40];

const keyboardMap = {
    32: "SPACE",
    38: "UP",
    39: "RIGHT",
    37: "LEFT",
    40: "DOWN",
    68: "D",
    82: "RESTART"
};

/**
 * Initializes the game setup after the page has loaded.
 *
 * @returns {void}
 */
function initializeSharky() {
    initMobileControls();
    initLegalUI();
    initSoundCreditsUI();

    initGameUI({
        onStart: startGame,
        onRestart: restartGame,
        onFullscreen: toggleFullscreen
    });
}


/**
 * Starts the game once, hides the start screen, starts the audio and loads the canvas.
 *
 * @returns {void}
 */
function startGame() {
    if (gameStarted) return;

    gameStarted = true;

    loadAudio();
    hideStartScreen();
    loadCanvas();
}

/**
 * Stops menu music, plays the button click sound and starts the background music.
 *
 * @returns {void}
 */
function loadAudio() {
    AUDIO_MANAGER.stopAllMusic();
    AUDIO_MANAGER.play("buttonClick");
    AUDIO_MANAGER.playMusic("background");
}


/**
 * Reloads the current page to restart the game.
 *
 * @returns {void}
 */
function restartGame() {
    AUDIO_MANAGER.play("buttonClick");
    window.location.reload();
}


/**
 * Toggles fullscreen mode for the game wrapper.
 *
 * @returns {void}
 */
function toggleFullscreen() {
    const wrapper = document.querySelector(".game_wrapper");

    if (!document.fullscreenElement) {
        wrapper?.requestFullscreen();
        return;
    }

    document.exitFullscreen();
}


/**
 * Initializes all mobile control buttons.
 *
 * @returns {void}
 */
function initMobileControls() {
    const buttons = document.querySelectorAll(".mobile_controls button[data-key]");

    buttons.forEach(initMobileButtonEvents);
}


/**
 * Adds touch and mouse events to one mobile control button.
 *
 * @param {HTMLButtonElement} button - The mobile control button.
 * @returns {void}
 */
function initMobileButtonEvents(button) {
    button.addEventListener("touchstart", handleMobilePress);
    button.addEventListener("touchend", handleMobileRelease);
    button.addEventListener("mousedown", handleMobilePress);
    button.addEventListener("mouseup", handleMobileRelease);
    button.addEventListener("mouseleave", handleMobileRelease);
}


/**
 * Handles pressing a mobile control button.
 *
 * @param {Event} event - The press event.
 * @returns {void}
 */
function handleMobilePress(event) {
    event.preventDefault();
    setMobileButtonState(event.currentTarget, true);
}


/**
 * Handles releasing a mobile control button.
 *
 * @param {Event} event - The release event.
 * @returns {void}
 */
function handleMobileRelease(event) {
    event.preventDefault();
    setMobileButtonState(event.currentTarget, false);
}


/**
 * Sets a mobile control key state.
 *
 * @param {HTMLButtonElement} button - The mobile control button.
 * @param {boolean} isPressed - Whether the button is pressed.
 * @returns {void}
 */
function setMobileButtonState(button, isPressed) {
    const key = button.dataset.key;

    Keyboard[key] = isPressed;
}


/**
 * Handles pressed keyboard keys.
 *
 * @param {KeyboardEvent} event - The keydown event.
 * @returns {void}
 */
function handleKeyDown(event) {
    preventGameKeyScroll(event);
    setKeyboardState(event.keyCode, true);
    restartGameByKey(event.keyCode);
}


/**
 * Handles released keyboard keys.
 *
 * @param {KeyboardEvent} event - The keyup event.
 * @returns {void}
 */
function handleKeyUp(event) {
    setKeyboardState(event.keyCode, false);
}


/**
 * Prevents browser scrolling for game keys.
 *
 * @param {KeyboardEvent} event - The keyboard event.
 * @returns {void}
 */
function preventGameKeyScroll(event) {
    if (blockedKeyCodes.includes(event.keyCode)) {
        event.preventDefault();
    }
}


/**
 * Sets the keyboard state for a mapped key.
 *
 * @param {number} keyCode - The pressed or released key code.
 * @param {boolean} isPressed - Whether the key is pressed.
 * @returns {void}
 */
function setKeyboardState(keyCode, isPressed) {
    const keyboardKey = keyboardMap[keyCode];

    if (keyboardKey) {
        Keyboard[keyboardKey] = isPressed;
    }
}


/**
 * Restarts the game when the restart key is pressed.
 *
 * @param {number} keyCode - The pressed key code.
 * @returns {void}
 */
function restartGameByKey(keyCode) {
    if (keyCode === 82) {
        restartGame();
    }
}

window.addEventListener("load", initializeSharky);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);