export default class MovableObjectsClass {

    /**
     * Creates a movable object.
     *
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - The object width.
     * @param {number} h - The object height.
     * @param {number} speed - The movement speed.
     * @param {string} imgPath - The image path.
     */
    constructor(x, y, w, h, speed, imgPath) {
        this.setPosition(x, y, w, h);
        this.setMovement(speed);
        this.setImage(imgPath);
        this.setAnimationValues();
        this.setDeathValues();
        this.setDefaultOffset();
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
     * Sets the movement values.
     *
     * @param {number} speed - The movement speed.
     * @returns {void}
     */
    setMovement(speed) {
        this.speed = speed;
        this.otherDirection = false;
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
     * Sets the animation values.
     *
     * @returns {void}
     */
    setAnimationValues() {
        this.imageCache = {};
        this.currentImg = 0;
        this.lastFrameTime = null;
    }


    /**
     * Sets the death animation values.
     *
     * @returns {void}
     */
    setDeathValues() {
        this.isDead = false;
        this.markedForDeletion = false;
        this.deathFrame = 0;
        this.lastDeathFrameTime = 0;
    }


    /**
     * Sets the default hitbox offset.
     *
     * @returns {void}
     */
    setDefaultOffset() {
        this.offset = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }


    /**
     * Draws the current object image.
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
        return this.img &&
            this.img.complete &&
            this.img.naturalWidth !== 0;
    }


    /**
     * Draws the image based on the current direction.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    drawImageByDirection(ctx) {
        if (this.otherDirection) {
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
     * Loads all images from one storage.
     *
     * @param {string[]} storage - The image path storage.
     * @returns {void}
     */
    drawFrames(storage) {
        storage.forEach(path => {
            this.loadFrame(path);
        });
    }


    /**
     * Loads one image frame into the cache.
     *
     * @param {string} path - The image path.
     * @returns {void}
     */
    loadFrame(path) {
        const storageImg = new Image();

        storageImg.src = path;
        this.imageCache[path] = storageImg;
    }


    /**
     * Animates the object with the given image storage.
     *
     * @param {string[]} currentStorage - The current animation storage.
     * @returns {void}
     */
    animateCharacters(currentStorage) {
        const now = Date.now();

        if (!this.lastFrameTime) this.lastFrameTime = now;
        if (!this.canAnimate(now, this.lastFrameTime, 100)) return;

        this.setNextAnimationImage(currentStorage);
        this.lastFrameTime = now;
    }


    /**
     * Checks whether an animation frame can change.
     *
     * @param {number} now - The current timestamp.
     * @param {number} lastFrameTime - The last frame timestamp.
     * @param {number} delay - The animation delay.
     * @returns {boolean} Whether the frame can change.
     */
    canAnimate(now, lastFrameTime, delay) {
        return now - lastFrameTime > delay;
    }


    /**
     * Sets the next looping animation image.
     *
     * @param {string[]} currentStorage - The current animation storage.
     * @returns {void}
     */
    setNextAnimationImage(currentStorage) {
        const imgIndex = this.currentImg % currentStorage.length;
        const currentImgPath = currentStorage[imgIndex];

        this.img = this.imageCache[currentImgPath];
        this.currentImg++;
    }


    /**
     * Animates one sequence once.
     *
     * @param {string[]} currentStorage - The current animation storage.
     * @param {string} finishedKey - The finished state key.
     * @returns {void}
     */
    animateOnce(currentStorage, finishedKey) {
        const now = Date.now();

        this.initFinishedKey(finishedKey);
        if (this.handleFinishedAnimation(currentStorage, finishedKey)) return;

        this.updateOnceAnimation(currentStorage, finishedKey, now);
    }


    /**
     * Initializes a finished key if needed.
     *
     * @param {string} finishedKey - The finished state key.
     * @returns {void}
     */
    initFinishedKey(finishedKey) {
        if (this[finishedKey] === undefined) {
            this[finishedKey] = false;
        }
    }


    /**
     * Handles an already finished animation.
     *
     * @param {string[]} currentStorage - The current animation storage.
     * @param {string} finishedKey - The finished state key.
     * @returns {boolean} Whether the animation is finished.
     */
    handleFinishedAnimation(currentStorage, finishedKey) {
        if (!this[finishedKey]) return false;

        this.setLastAnimationImage(currentStorage);
        return true;
    }


    /**
     * Sets the last image of an animation.
     *
     * @param {string[]} currentStorage - The current animation storage.
     * @returns {void}
     */
    setLastAnimationImage(currentStorage) {
        const lastImgPath = currentStorage[currentStorage.length - 1];

        this.img = this.imageCache[lastImgPath];
    }


    /**
     * Updates an animation that should run once.
     *
     * @param {string[]} currentStorage - The current animation storage.
     * @param {string} finishedKey - The finished state key.
     * @param {number} now - The current timestamp.
     * @returns {void}
     */
    updateOnceAnimation(currentStorage, finishedKey, now) {
        if (!this.lastFrameTime) this.lastFrameTime = now;
        if (!this.canAnimate(now, this.lastFrameTime, 100)) return;

        this.setNextOnceImage(currentStorage, finishedKey);
        this.lastFrameTime = now;
    }


    /**
     * Sets the next image of a one-time animation.
     *
     * @param {string[]} currentStorage - The current animation storage.
     * @param {string} finishedKey - The finished state key.
     * @returns {void}
     */
    setNextOnceImage(currentStorage, finishedKey) {
        if (this.currentImg >= currentStorage.length) {
            this.finishOnceAnimation(finishedKey);
            return;
        }

        this.setCurrentOnceImage(currentStorage);
    }


    /**
     * Finishes a one-time animation.
     *
     * @param {string} finishedKey - The finished state key.
     * @returns {void}
     */
    finishOnceAnimation(finishedKey) {
        this[finishedKey] = true;
        this.currentImg = 0;
    }


    /**
     * Sets the current image of a one-time animation.
     *
     * @param {string[]} currentStorage - The current animation storage.
     * @returns {void}
     */
    setCurrentOnceImage(currentStorage) {
        const currentImgPath = currentStorage[this.currentImg];

        this.img = this.imageCache[currentImgPath];
        this.currentImg++;
    }


    /**
     * Animates the death sequence.
     *
     * @param {string[]} currentStorage - The death animation storage.
     * @returns {void}
     */
    animateDeath(currentStorage) {
        const now = Date.now();

        if (!this.lastDeathFrameTime) this.lastDeathFrameTime = now;
        this.updateDeathAnimation(currentStorage, now);
        this.markDeletedAfterDeath(currentStorage);
    }


    /**
     * Updates the death animation frame.
     *
     * @param {string[]} currentStorage - The death animation storage.
     * @param {number} now - The current timestamp.
     * @returns {void}
     */
    updateDeathAnimation(currentStorage, now) {
        if (!this.canAnimate(now, this.lastDeathFrameTime, 120)) return;

        this.setDeathImage(currentStorage);
        this.deathFrame++;
        this.lastDeathFrameTime = now;
    }


    /**
     * Sets the current death image.
     *
     * @param {string[]} currentStorage - The death animation storage.
     * @returns {void}
     */
    setDeathImage(currentStorage) {
        const currentImgPath = currentStorage[this.deathFrame];

        this.img = this.imageCache[currentImgPath];
    }


    /**
     * Marks the object for deletion after death animation.
     *
     * @param {string[]} currentStorage - The death animation storage.
     * @returns {void}
     */
    markDeletedAfterDeath(currentStorage) {
        if (this.deathFrame >= currentStorage.length) {
            this.markedForDeletion = true;
        }
    }


    /**
     * Returns the object hitbox.
     *
     * @param {number} camera_x - The current camera position.
     * @returns {Object} The object hitbox.
     */
    getHitbox(camera_x = 0) {
        return {
            x: this.x + camera_x + this.offset.left,
            y: this.y + this.offset.top,
            w: this.w - this.offset.left - this.offset.right,
            h: this.h - this.offset.top - this.offset.bottom
        };
    }


    /**
     * Checks whether this object collides with another object.
     *
     * @param {Object} obj - The other object.
     * @param {number} camera_x - The current camera position.
     * @returns {boolean} Whether both objects collide.
     */
    isColliding(obj, camera_x = 0) {
        const firstBox = this.getHitbox(camera_x);
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


    /**
     * Checks whether this object is near another object.
     *
     * @param {Object} obj - The other object.
     * @param {number} range - The maximum distance.
     * @returns {boolean} Whether the object is near.
     */
    isNear(obj, range = 500) {
        const ownCenter = this.getCenter(this);
        const objCenter = this.getCenter(obj);
        const distance = this.getDistance(ownCenter, objCenter);

        return distance <= range;
    }


    /**
     * Returns the center point of an object.
     *
     * @param {Object} obj - The object.
     * @returns {Object} The center point.
     */
    getCenter(obj) {
        return {
            x: obj.x + obj.w / 2,
            y: obj.y + obj.h / 2
        };
    }


    /**
     * Returns the distance between two points.
     *
     * @param {Object} firstPoint - The first point.
     * @param {Object} secondPoint - The second point.
     * @returns {number} The distance.
     */
    getDistance(firstPoint, secondPoint) {
        const distanceX = firstPoint.x - secondPoint.x;
        const distanceY = firstPoint.y - secondPoint.y;

        return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    }


    /**
     * Starts the death state.
     *
     * @returns {void}
     */
    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.speed = 0;
        this.damage = 0;
        this.resetDeathAnimation();
    }


    /**
     * Resets the death animation values.
     *
     * @returns {void}
     */
    resetDeathAnimation() {
        this.currentImg = 0;
        this.deathFrame = 0;
        this.lastDeathFrameTime = 0;
    }
}