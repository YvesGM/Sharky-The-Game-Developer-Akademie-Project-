import { BACKGROUND } from "../../../lib/configs/background/background.configs.js";

/**
 * Draws all background objects.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
export default function Background(ctx) {
    drawBackground(ctx);
}


/**
 * Draws every background object from the background storage.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawBackground(ctx) {
    BACKGROUND.forEach(backgroundObject => {
        backgroundObject.draw(ctx);
    });
}