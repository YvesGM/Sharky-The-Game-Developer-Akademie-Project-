import { HUD } from "../../../lib/configs/hud/hud.configs.js";
import { SHARKY } from "../../../lib/configs/characters/sharky.configs.js";

/**
 * Updates and draws the complete HUD.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
export default function hud(ctx) {
    updateHUD();
    drawHUD(ctx);
}


/**
 * Updates all HUD bars based on Sharky's values.
 *
 * @returns {void}
 */
function updateHUD() {
    const sharky = SHARKY[0];

    updateLifebar(sharky);
    updateCoinbar(sharky);
    updatePoisonbar(sharky);
}


/**
 * Updates the life bar image.
 *
 * @param {Object} sharky - The active Sharky object.
 * @returns {void}
 */
function updateLifebar(sharky) {
    HUD.lifebar.setImageByIndex(sharky.healthStage);
}


/**
 * Updates the coin bar image.
 *
 * @param {Object} sharky - The active Sharky object.
 * @returns {void}
 */
function updateCoinbar(sharky) {
    const coinIndex = Math.floor(sharky.coins / 3);

    HUD.coinbar.setImageByIndex(coinIndex);
}


/**
 * Updates the poison bar image.
 *
 * @param {Object} sharky - The active Sharky object.
 * @returns {void}
 */
function updatePoisonbar(sharky) {
    HUD.poisonbar.setImageByIndex(sharky.poison);
}


/**
 * Draws all HUD bars.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawHUD(ctx) {
    HUD.lifebar.draw(ctx);
    HUD.coinbar.draw(ctx);
    HUD.poisonbar.draw(ctx);
}