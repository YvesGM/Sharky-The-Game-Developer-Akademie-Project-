import { UI_IMAGES } from "../../../lib/storage/hud/game-menu.storage.js";

export function initGameUI({ onStart, onRestart, onFullscreen }) {
    setImage("startButtonImage", UI_IMAGES.START_BUTTON);
    setImage("gameOverText", UI_IMAGES.GAME_OVER_TEXT);
    setImage("winScreenImage", UI_IMAGES.WIN_SCREEN);
    setImage("startScreenImage", UI_IMAGES.START_SCREEN);

    setImage("restartButtonImage", UI_IMAGES.RESTART_BUTTON);
    setImage("fullscreenButtonImage", UI_IMAGES.FULLSCREEN_BUTTON);

    setImage("gameOverRestartButtonImage", UI_IMAGES.RESTART_BUTTON);
    setImage("winRestartButtonImage", UI_IMAGES.RESTART_BUTTON);

    setImage("arrowKeys", UI_IMAGES.ARROW_KEYS);
    setImage("keyDImage", UI_IMAGES.KEY_D);
    setImage("keySpaceImage", UI_IMAGES.KEY_SPACE);
    // setImage("keyRImage", UI_IMAGES.KEY_R);

    document.getElementById("startGameButton")?.addEventListener("click", onStart);
    document.getElementById("restartGameButton")?.addEventListener("click", onRestart);
    document.getElementById("fullscreenGameButton")?.addEventListener("click", onFullscreen);
    document.getElementById("gameOverRestartButton")?.addEventListener("click", onRestart);
    document.getElementById("winRestartButton")?.addEventListener("click", onRestart);

    window.addEventListener("sharkyGameOver", showGameOverScreen);
    window.addEventListener("sharkyGameWon", showWinScreen);
}

export function hideStartScreen() {
    document.getElementById("startScreen")?.classList.add("d_none");
}

export function showGameOverScreen(event) {
    updateScore("gameOverScore", event.detail);
    document.getElementById("gameOverScreen")?.classList.remove("d_none");
}

export function showWinScreen(event) {
    updateScore("winScore", event.detail);
    document.getElementById("winScreen")?.classList.remove("d_none");
}

function updateScore(scoreId, score) {
    const scoreElement = document.getElementById(scoreId);

    if (!scoreElement || !score) return;

    scoreElement.innerHTML = `
        <p>Coins: ${score.coins}</p>
        <p>Giftflaschen: ${score.poison}</p>
        <p>Zeit: ${score.time}</p>
    `;
}

function setImage(id, src) {
    const image = document.getElementById(id);

    if (!image) return;

    image.src = src;
}