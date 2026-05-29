export default class StaticObjectsClass {

    /**
     * Creates a static object.
     *
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - The object width.
     * @param {number} h - The object height.
     * @param {string} imgPath - The image path.
     */
    constructor(x, y, w, h, imgPath) {
        this.setPosition(x, y, w, h);
        this.setImage(imgPath);
        this.setDefaultValues();
    }


    /**
     * Sets the object position and size.
     *
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - The object width.
     * @param {number} h - The object height.
     * @returns {void}
     */
    setPosition(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }


    /**
     * Sets the object image.
     *
     * @param {string} imgPath - The image path.
     * @returns {void}
     */
    setImage(imgPath) {
        this.img = new Image();
        this.img.src = imgPath;
    }


    /**
     * Sets default object values.
     *
     * @returns {void}
     */
    setDefaultValues() {
        this.isCollected = false;
        this.offset = this.getDefaultOffset();
    }


    /**
     * Returns the default hitbox offset.
     *
     * @returns {Object} The default offset.
     */
    getDefaultOffset() {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }


    /**
     * Draws the object image.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    drawImg(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }


    /**
     * Returns the object hitbox.
     *
     * @returns {Object} The object hitbox.
     */
    getHitbox() {
        return {
            x: this.x + this.offset.left,
            y: this.y + this.offset.top,
            w: this.w - this.offset.left - this.offset.right,
            h: this.h - this.offset.top - this.offset.bottom
        };
    }
}