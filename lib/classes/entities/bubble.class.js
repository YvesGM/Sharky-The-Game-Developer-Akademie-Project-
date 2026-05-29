export default class Bubble {

    /**
     * Creates a new bubble object.
     *
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - The bubble width.
     * @param {number} h - The bubble height.
     * @param {number} speed - The bubble speed.
     * @param {number} direction - The movement direction.
     * @param {string[]} imgStorage - The animation image storage.
     * @param {number} damage - The bubble damage.
     * @param {string} type - The bubble type.
     */
    constructor(x, y, w, h, speed, direction, imgStorage, damage = 10, type = 'normal') {
        this.setPosition(x, y, w, h);
        this.setMovement(speed, direction);
        this.setBubbleData(imgStorage, damage, type);
        this.setAnimationData(x);
        this.loadImgStorage();
    }


    /**
     * Sets the bubble position and size.
     *
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - The bubble width.
     * @param {number} h - The bubble height.
     * @returns {void}
     */
    setPosition(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }


    /**
     * Sets the bubble movement values.
     *
     * @param {number} speed - The bubble speed.
     * @param {number} direction - The movement direction.
     * @returns {void}
     */
    setMovement(speed, direction) {
        this.speed = speed;
        this.direction = direction;
    }


    /**
     * Sets the bubble data.
     *
     * @param {string[]} imgStorage - The image storage.
     * @param {number} damage - The bubble damage.
     * @param {string} type - The bubble type.
     * @returns {void}
     */
    setBubbleData(imgStorage, damage, type) {
        this.imgStorage = imgStorage;
        this.damage = damage;
        this.type = type;
    }


    /**
     * Sets the animation values.
     *
     * @param {number} startX - The start x position.
     * @returns {void}
     */
    setAnimationData(startX) {
        this.imageCache = {};
        this.currentImg = 0;
        this.lastFrameTime = 0;
        this.startX = startX;
        this.range = 800;
        this.markedForDeletion = false;
    }


    /**
     * Updates and draws the bubble.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    draw(ctx) {
        this.move();
        this.animate();
        this.drawImg(ctx);
    }


    /**
     * Moves the bubble.
     *
     * @returns {void}
     */
    move() {
        this.x += this.speed * this.direction;

        if (Math.abs(this.x - this.startX) > this.range) {
            this.markedForDeletion = true;
        }
    }


    /**
     * Draws the current bubble image.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    drawImg(ctx) {
        if (!this.canDrawImage()) return;

        ctx.save();
        this.drawImageByDirection(ctx);
        ctx.restore();
    }


    /**
     * Checks whether the current image can be drawn.
     *
     * @returns {boolean} Whether the image can be drawn.
     */
    canDrawImage() {
        return this.img && this.img.complete && this.img.naturalWidth !== 0;
    }


    /**
     * Draws the image based on movement direction.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    drawImageByDirection(ctx) {
        if (this.direction < 0) {
            this.drawMirroredImage(ctx);
            return;
        }

        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }


    /**
     * Draws the image mirrored.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    drawMirroredImage(ctx) {
        ctx.translate(this.x + this.w, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, 0, this.w, this.h);
    }


    /**
     * Loads all bubble images.
     *
     * @returns {void}
     */
    loadImgStorage() {
        this.imgStorage.forEach(path => {
            this.loadImage(path);
        });

        this.img = this.imageCache[this.imgStorage[0]];
    }


    /**
     * Loads one image into the cache.
     *
     * @param {string} path - The image path.
     * @returns {void}
     */
    loadImage(path) {
        const img = new Image();

        img.src = path;
        this.imageCache[path] = img;
    }


    /**
     * Animates the bubble.
     *
     * @returns {void}
     */
    animate() {
        const now = Date.now();

        if (!this.lastFrameTime) this.lastFrameTime = now;
        if (now - this.lastFrameTime <= 100) return;

        this.setNextImage();
        this.lastFrameTime = now;
    }


    /**
     * Sets the next animation image.
     *
     * @returns {void}
     */
    setNextImage() {
        const imgIndex = this.currentImg % this.imgStorage.length;
        const currentImgPath = this.imgStorage[imgIndex];

        this.img = this.imageCache[currentImgPath];
        this.currentImg++;
    }


    /**
     * Returns the bubble hitbox.
     *
     * @returns {Object} The bubble hitbox.
     */
    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        };
    }


    /**
     * Checks whether the bubble collides with another object.
     *
     * @param {Object} obj - The other object.
     * @returns {boolean} Whether both objects collide.
     */
    isColliding(obj) {
        const firstBox = this.getHitbox();
        const secondBox = obj.getHitbox ? obj.getHitbox() : obj;

        return this.isBoxColliding(firstBox, secondBox);
    }


    /**
     * Checks whether two hitboxes overlap.
     *
     * @param {Object} firstBox - The first hitbox.
     * @param {Object} secondBox - The second hitbox.
     * @returns {boolean} Whether both hitboxes overlap.
     */
    isBoxColliding(firstBox, secondBox) {
        return firstBox.x + firstBox.w > secondBox.x &&
            firstBox.x < secondBox.x + secondBox.w &&
            firstBox.y + firstBox.h > secondBox.y &&
            firstBox.y < secondBox.y + secondBox.h;
    }
}