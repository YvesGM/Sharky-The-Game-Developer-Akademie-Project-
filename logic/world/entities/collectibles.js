import { COINS, POISONS } from "../../../lib/configs/entities/collectibles.configs.js";

/**
 * Draws all collectible objects.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
export default function Collectibles(ctx) {
    drawCollectibles(ctx);
}


/**
 * Draws coins and poison bottles.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawCollectibles(ctx) {
    drawCoins(ctx);
    drawPoisons(ctx);
}


/**
 * Draws all coins.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawCoins(ctx) {
    COINS.forEach(coin => {
        coin.draw(ctx);
    });
}


/**
 * Draws all poison bottles.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawPoisons(ctx) {
    POISONS.forEach(poison => {
        poison.draw(ctx);
    });
}