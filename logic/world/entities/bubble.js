import { BUBBLE } from "../../../lib/configs/entities/bubble.configs.js";

/**
 * Draws all bubble objects.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Object} sharky - The active Sharky object.
 * @returns {void}
 */
export default function Bubbles(ctx, sharky) {
    drawBubbles(ctx, sharky);
}


/**
 * Draws every bubble from the bubble storage.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Object} sharky - The active Sharky object.
 * @returns {void}
 */
function drawBubbles(ctx, sharky) {
    BUBBLE.forEach(bubble => {
        bubble.draw(ctx, sharky);
    });
}