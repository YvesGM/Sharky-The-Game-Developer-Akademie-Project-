import { SHARKY } from "../../../lib/configs/characters/sharky.configs.js";

/**
 * Draws Sharky and returns the updated camera position.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} camera_x - The current camera position.
 * @param {Object} gameState - The current game state.
 * @returns {number} The updated camera position.
 */
export default function Sharky(ctx, camera_x, gameState) {
    return drawSharky(ctx, camera_x, gameState);
}


/**
 * Draws every Sharky character and updates the camera.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} camera_x - The current camera position.
 * @param {Object} gameState - The current game state.
 * @returns {number} The updated camera position.
 */
function drawSharky(ctx, camera_x, gameState) {
    SHARKY.forEach(character => {
        camera_x = character.draw(ctx, camera_x, gameState);
    });

    return camera_x;
}