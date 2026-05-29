import { ENTITIES } from "../../../lib/configs/entities/entity.configs.js";

/**
 * Draws all entity objects.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
export default function Entities(ctx) {
    drawEntities(ctx);
}


/**
 * Draws every entity from the entity storage.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawEntities(ctx) {
    ENTITIES.forEach(entity => {
        entity.draw(ctx);
    });
}