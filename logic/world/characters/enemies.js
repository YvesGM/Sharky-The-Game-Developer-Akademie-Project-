import { ENEMIES } from "../../../lib/configs/characters/enemy.configs.js";

/**
 * Draws all active enemies.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Object} sharky - The active Sharky object.
 * @param {number} camera_x - The current camera position.
 * @returns {void}
 */
export default function Enemies(ctx, sharky, camera_x) {
    drawEnemies(ctx, sharky, camera_x);
}


/**
 * Draws every enemy that is not marked for deletion.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Object} sharky - The active Sharky object.
 * @param {number} camera_x - The current camera position.
 * @returns {void}
 */
function drawEnemies(ctx, sharky, camera_x) {
    ENEMIES.forEach(enemy => {
        drawEnemy(ctx, enemy, sharky, camera_x);
    });
}


/**
 * Draws one enemy if it is active.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Object} enemy - The enemy object.
 * @param {Object} sharky - The active Sharky object.
 * @param {number} camera_x - The current camera position.
 * @returns {void}
 */
function drawEnemy(ctx, enemy, sharky, camera_x) {
    if (enemy.markedForDeletion) return;

    enemy.draw(ctx, sharky, camera_x);
}