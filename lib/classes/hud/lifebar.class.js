import StaticObjectsClass from "../../classes/world/static-objects.class.js";

export default class Lifebar extends StaticObjectsClass {

    /**
     * Creates a new lifebar object.
     *
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - The object width.
     * @param {number} h - The object height.
     * @param {string} imgPath - The image path.
     */
    constructor(x, y, w, h, imgPath) {
        super(x, y, w, h, imgPath);
    }


    /**
     * Draws the lifebar.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    draw(ctx) {
        super.drawImg(ctx);
    }
}