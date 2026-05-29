import StaticObjectsClass from "../world/static-objects.class.js";

export default class HudBar extends StaticObjectsClass {

    /**
     * Creates a new HUD bar.
     *
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - The bar width.
     * @param {number} h - The bar height.
     * @param {string[]} imgStorage - The image storage.
     * @param {number} startIndex - The start image index.
     */
    constructor(x, y, w, h, imgStorage, startIndex = 0) {
        super(x, y, w, h, imgStorage[startIndex]);

        this.imgStorage = imgStorage;
        this.currentIndex = startIndex;
    }


    /**
     * Sets the current HUD image by index.
     *
     * @param {number} index - The new image index.
     * @returns {void}
     */
    setImageByIndex(index) {
        const safeIndex = this.getSafeIndex(index);

        if (this.currentIndex === safeIndex) return;

        this.currentIndex = safeIndex;
        this.img.src = this.imgStorage[this.currentIndex];
    }


    /**
     * Returns a valid image index.
     *
     * @param {number} index - The requested image index.
     * @returns {number} The safe image index.
     */
    getSafeIndex(index) {
        return Math.max(0, Math.min(index, this.imgStorage.length - 1));
    }


    /**
     * Draws the HUD bar.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    draw(ctx) {
        super.drawImg(ctx);
    }
}