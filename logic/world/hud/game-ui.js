import { UI_IMAGES } from "../../../lib/storage/hud/game-menu.storage.js";

/**
 * Initializes all game UI images, buttons and events.
 *
 * @param {Object} callbacks - The UI callback functions.
 * @param {Function} callbacks.onStart - The start callback.
 * @param {Function} callbacks.onRestart - The restart callback.
 * @param {Function} callbacks.onFullscreen - The fullscreen callback.
 * @returns {void}
 */
export function initGameUI({ onStart, onRestart, onFullscreen }) {
    initGameImages();
    initGameButtons(onStart, onRestart, onFullscreen);
    initGameEndEvents();
}


/**
 * Hides the start screen.
 *
 * @returns {void}
 */
export function hideStartScreen() {
    document.getElementById("startScreen")?.classList.add("d_none");
}


/**
 * Shows the game over screen.
 *
 * @param {CustomEvent} event - The game over event.
 * @returns {void}
 */
export function showGameOverScreen(event) {
    updateScore("gameOverScore", event.detail);
    document.getElementById("gameOverScreen")?.classList.remove("d_none");
}


/**
 * Shows the win screen.
 *
 * @param {CustomEvent} event - The win event.
 * @returns {void}
 */
export function showWinScreen(event) {
    updateScore("winScore", event.detail);
    document.getElementById("winScreen")?.classList.remove("d_none");
}


/**
 * Initializes all UI image sources.
 *
 * @returns {void}
 */
function initGameImages() {
    setStartScreenImages();
    setButtonImages();
    setControlImages();
}


/**
 * Sets all start screen related images.
 *
 * @returns {void}
 */
function setStartScreenImages() {
    setImage("startButtonImage", UI_IMAGES.START_BUTTON);
    setImage("gameOverText", UI_IMAGES.GAME_OVER_TEXT);
    setImage("winScreenImage", UI_IMAGES.WIN_SCREEN);
    setImage("startScreenImage", UI_IMAGES.START_SCREEN);
}


/**
 * Sets all button related images.
 *
 * @returns {void}
 */
function setButtonImages() {
    setImage("restartButtonImage", UI_IMAGES.RESTART_BUTTON);
    setImage("fullscreenButtonImage", UI_IMAGES.FULLSCREEN_BUTTON);
    setImage("gameOverRestartButtonImage", UI_IMAGES.RESTART_BUTTON);
    setImage("winRestartButtonImage", UI_IMAGES.RESTART_BUTTON);
}


/**
 * Sets all control explanation images.
 *
 * @returns {void}
 */
function setControlImages() {
    setImage("arrowKeys", UI_IMAGES.ARROW_KEYS);
    setImage("keyDImage", UI_IMAGES.KEY_D);
    setImage("keySpaceImage", UI_IMAGES.KEY_SPACE);
}


/**
 * Initializes all game UI button events.
 *
 * @param {Function} onStart - The start callback.
 * @param {Function} onRestart - The restart callback.
 * @param {Function} onFullscreen - The fullscreen callback.
 * @returns {void}
 */
function initGameButtons(onStart, onRestart, onFullscreen) {
    addClickEvent("startGameButton", onStart, true);
    addClickEvent("restartGameButton", onRestart);
    addClickEvent("fullscreenGameButton", onFullscreen);
    addClickEvent("gameOverRestartButton", onRestart);
    addClickEvent("winRestartButton", onRestart);
}


/**
 * Initializes game over and win events.
 *
 * @returns {void}
 */
function initGameEndEvents() {
    window.addEventListener("sharkyGameOver", showGameOverScreen);
    window.addEventListener("sharkyGameWon", showWinScreen);
}


/**
 * Adds one click event to an element.
 *
 * @param {string} id - The element id.
 * @param {Function} callback - The click callback.
 * @param {boolean} disableAfterClick - Whether the element should be disabled after clicking.
 * @returns {void}
 */
function addClickEvent(id, callback, disableAfterClick = false) {
    const button = document.getElementById(id);

    if (!button) return;

    button.addEventListener("click", event => {
        handleButtonClick(event, callback, disableAfterClick);
    });
}

/**
 * Handles one UI button click.
 *
 * @param {MouseEvent} event - The click event.
 * @param {Function} callback - The click callback.
 * @param {boolean} disableAfterClick - Whether the button should be disabled after clicking.
 * @returns {void}
 */
function handleButtonClick(event, callback, disableAfterClick) {
    event.preventDefault();

    const button = event.currentTarget;

    if (disableAfterClick) {
        button.disabled = true;
    }

    button.blur();
    callback();
}


/**
 * Updates one score element.
 *
 * @param {string} scoreId - The score element id.
 * @param {Object} score - The current score object.
 * @returns {void}
 */
function updateScore(scoreId, score) {
    const scoreElement = document.getElementById(scoreId);

    if (!scoreElement || !score) return;

    scoreElement.innerHTML = getScoreTemplate(score);
}


/**
 * Returns the score HTML template.
 *
 * @param {Object} score - The current score object.
 * @returns {string} The score HTML.
 */
function getScoreTemplate(score) {
    return `
        <p>Coins: ${score.coins}</p>
        <p>Poison Bottles: ${score.poison}</p>
        <p>Time: ${score.time}</p>
    `;
}


/**
 * Sets the image source for one image element.
 *
 * @param {string} id - The image element id.
 * @param {string} src - The image source.
 * @returns {void}
 */
function setImage(id, src) {
    const image = document.getElementById(id);

    if (!image) return;

    image.src = src;
}