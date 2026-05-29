import {
    RAINBOW_PUFFERFISH_SWIMMING,
    RAINBOW_PUFFERFISH_DEAD,
    RAINBOW_PUFFERFISH_TRANSITION,
    RAINBOW_PUFFERFISH_BUBBLE_SWIMMING
} from "../../../../storage/characters/enemies/pufferfish.storage.js";
import MovableObjectsClass from "../../../world/movable-objects.class.js";

export default class RainbowPufferfishClass extends MovableObjectsClass {

    /**
     * Creates a rainbow pufferfish enemy.
     *
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - The width.
     * @param {number} h - The height.
     * @param {number} speed - The movement speed.
     * @param {string} imgPath - The image path.
     */
    constructor(x, y, w, h, speed, imgPath) {
        super(x, y, w, h, speed, imgPath);
        this.initMovementValues(x, y, speed);
        this.initInflateValues();
        this.initOffset();
        this.loadImgStorage();
    }


    /**
     * Initializes movement values.
     *
     * @param {number} x - The start x position.
     * @param {number} y - The start y position.
     * @param {number} speed - The base speed.
     * @returns {void}
     */
    initMovementValues(x, y, speed) {
        this.startX = x;
        this.startY = y;
        this.speed = this.randomBetween(speed * 0.75, speed * 1.2);
        this.rangeX = this.randomBetween(260, 500);
        this.rangeY = this.randomBetween(80, 180);
        this.minY = 40;
        this.maxY = 980;
        this.initDirectionValues();
    }


    /**
     * Initializes direction values.
     *
     * @returns {void}
     */
    initDirectionValues() {
        this.verticalSpeedFactor = this.randomBetween(0.08, 0.18);
        this.directionX = Math.random() < 0.5 ? -1 : 1;
        this.directionY = Math.random() < 0.5 ? -1 : 1;
        this.damage = 25;
        this.otherDirection = this.directionX > 0;
    }


    /**
     * Initializes inflate values.
     *
     * @returns {void}
     */
    initInflateValues() {
        this.inflateRange = 7500;
        this.inflateState = 'normal';
        this.inflateAnimation = RAINBOW_PUFFERFISH_TRANSITION;
        this.deflateAnimation = [...RAINBOW_PUFFERFISH_TRANSITION].reverse();
    }


    /**
     * Initializes hitbox offset.
     *
     * @returns {void}
     */
    initOffset() {
        this.offset = {
            top: 15,
            right: 0,
            bottom: 45,
            left: 10
        };
    }


    /**
     * Draws and updates the pufferfish.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {Object} sharky - The Sharky object.
     * @param {number} camera_x - The camera position.
     * @returns {void}
     */
    draw(ctx, sharky, camera_x) {
        if (this.drawDeathIfNeeded(ctx)) return;

        this.move();
        this.updateInflateState(sharky, camera_x);
        this.drawInflateState(ctx);
    }


    /**
     * Draws death state if needed.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {boolean} Whether death was drawn.
     */
    drawDeathIfNeeded(ctx) {
        if (!this.isDead) return false;

        this.animateDeath(RAINBOW_PUFFERFISH_DEAD);
        super.drawImg(ctx);
        return true;
    }


    /**
     * Draws the current inflate state.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    drawInflateState(ctx) {
        if (this.drawInflating(ctx)) return;
        if (this.drawDeflating(ctx)) return;
        if (this.drawInflated(ctx)) return;

        this.drawNormal(ctx);
    }


    /**
     * Draws inflating state.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {boolean} Whether state was drawn.
     */
    drawInflating(ctx) {
        if (this.inflateState !== 'inflating') return false;

        this.damage = 25;
        this.animateOnce(this.inflateAnimation, 'inflateDone');
        this.finishInflatingIfNeeded();
        super.drawImg(ctx);
        return true;
    }


    /**
     * Draws deflating state.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {boolean} Whether state was drawn.
     */
    drawDeflating(ctx) {
        if (this.inflateState !== 'deflating') return false;

        this.damage = 25;
        this.animateOnce(this.deflateAnimation, 'deflateDone');
        this.finishDeflatingIfNeeded();
        super.drawImg(ctx);
        return true;
    }


    /**
     * Draws inflated state.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {boolean} Whether state was drawn.
     */
    drawInflated(ctx) {
        if (this.inflateState !== 'inflated') return false;

        this.damage = 35;
        this.animateCharacters(RAINBOW_PUFFERFISH_BUBBLE_SWIMMING);
        super.drawImg(ctx);
        return true;
    }


    /**
     * Draws normal swimming state.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    drawNormal(ctx) {
        this.damage = 25;
        this.animateCharacters(RAINBOW_PUFFERFISH_SWIMMING);
        super.drawImg(ctx);
    }


    /**
     * Finishes inflating if animation is done.
     *
     * @returns {void}
     */
    finishInflatingIfNeeded() {
        if (!this.inflateDone) return;

        this.inflateState = 'inflated';
        this.inflateDone = false;
        this.resetAnimation();
    }


    /**
     * Finishes deflating if animation is done.
     *
     * @returns {void}
     */
    finishDeflatingIfNeeded() {
        if (!this.deflateDone) return;

        this.inflateState = 'normal';
        this.deflateDone = false;
        this.resetAnimation();
    }


    /**
     * Updates inflate state based on Sharky distance.
     *
     * @param {Object} sharky - The Sharky object.
     * @param {number} camera_x - The camera position.
     * @returns {void}
     */
    updateInflateState(sharky, camera_x) {
        if (!sharky) return;

        const sharkyIsNear = this.isSharkyNear(sharky, camera_x);
        this.changeInflateState(sharkyIsNear);
    }


    /**
     * Checks whether Sharky is near.
     *
     * @param {Object} sharky - The Sharky object.
     * @param {number} camera_x - The camera position.
     * @returns {boolean} Whether Sharky is near.
     */
    isSharkyNear(sharky, camera_x) {
        const distance = this.getDistanceToSharky(sharky, camera_x);

        return distance <= this.inflateRange;
    }


    /**
     * Returns distance to Sharky.
     *
     * @param {Object} sharky - The Sharky object.
     * @param {number} camera_x - The camera position.
     * @returns {number} The distance.
     */
    getDistanceToSharky(sharky, camera_x) {
        const fishCenter = this.getCenter(this);
        const sharkyCenter = this.getSharkyCenter(sharky, camera_x);

        return this.getDistance(fishCenter, sharkyCenter);
    }


    /**
     * Returns Sharky's center position.
     *
     * @param {Object} sharky - The Sharky object.
     * @param {number} camera_x - The camera position.
     * @returns {Object} Sharky's center.
     */
    getSharkyCenter(sharky, camera_x) {
        return {
            x: sharky.x + camera_x + sharky.w / 2,
            y: sharky.y + sharky.h / 2
        };
    }


    /**
     * Changes inflate state.
     *
     * @param {boolean} sharkyIsNear - Whether Sharky is near.
     * @returns {void}
     */
    changeInflateState(sharkyIsNear) {
        if (sharkyIsNear && this.inflateState === 'normal') this.startInflating();
        if (!sharkyIsNear && this.inflateState === 'inflated') this.startDeflating();
    }


    /**
     * Starts inflating.
     *
     * @returns {void}
     */
    startInflating() {
        this.inflateState = 'inflating';
        this.resetInflateAnimation();
    }


    /**
     * Starts deflating.
     *
     * @returns {void}
     */
    startDeflating() {
        this.inflateState = 'deflating';
        this.resetInflateAnimation();
    }


    /**
     * Resets inflate animation.
     *
     * @returns {void}
     */
    resetInflateAnimation() {
        this.inflateDone = false;
        this.deflateDone = false;
        this.resetAnimation();
    }


    /**
     * Moves the pufferfish.
     *
     * @returns {void}
     */
    move() {
        this.moveByDirection();
        this.applyHorizontalBounds();
        this.applyVerticalBounds();
        this.applyWorldBounds();
        this.otherDirection = this.directionX > 0;
    }


    /**
     * Moves by current direction.
     *
     * @returns {void}
     */
    moveByDirection() {
        this.x += this.speed * 0.35 * this.directionX;
        this.y += this.speed * this.verticalSpeedFactor * this.directionY;
    }


    /**
     * Applies horizontal bounds.
     *
     * @returns {void}
     */
    applyHorizontalBounds() {
        if (this.x <= this.startX - this.rangeX) this.setLeftBound();
        if (this.x >= this.startX + this.rangeX) this.setRightBound();
    }


    /**
     * Applies vertical bounds.
     *
     * @returns {void}
     */
    applyVerticalBounds() {
        if (this.y <= this.startY - this.rangeY) this.setTopBound();
        if (this.y >= this.startY + this.rangeY) this.setBottomBound();
    }


    /**
     * Applies world bounds.
     *
     * @returns {void}
     */
    applyWorldBounds() {
        if (this.y <= this.minY) this.setMinY();
        if (this.y + this.h >= this.maxY) this.setMaxY();
    }


    /**
     * Sets left bound.
     *
     * @returns {void}
     */
    setLeftBound() {
        this.x = this.startX - this.rangeX;
        this.directionX = 1;
    }


    /**
     * Sets right bound.
     *
     * @returns {void}
     */
    setRightBound() {
        this.x = this.startX + this.rangeX;
        this.directionX = -1;
    }


    /**
     * Sets top bound.
     *
     * @returns {void}
     */
    setTopBound() {
        this.y = this.startY - this.rangeY;
        this.directionY = 1;
    }


    /**
     * Sets bottom bound.
     *
     * @returns {void}
     */
    setBottomBound() {
        this.y = this.startY + this.rangeY;
        this.directionY = -1;
    }


    /**
     * Sets minimum y position.
     *
     * @returns {void}
     */
    setMinY() {
        this.y = this.minY;
        this.directionY = 1;
    }


    /**
     * Sets maximum y position.
     *
     * @returns {void}
     */
    setMaxY() {
        this.y = this.maxY - this.h;
        this.directionY = -1;
    }


    /**
     * Resets animation values.
     *
     * @returns {void}
     */
    resetAnimation() {
        this.currentImg = 0;
        this.lastFrameTime = null;
    }


    /**
     * Returns a random value between min and max.
     *
     * @param {number} min - The minimum value.
     * @param {number} max - The maximum value.
     * @returns {number} The random value.
     */
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }


    /**
     * Loads all image storages.
     *
     * @returns {void}
     */
    loadImgStorage() {
        this.drawFrames(RAINBOW_PUFFERFISH_SWIMMING);
        this.drawFrames(RAINBOW_PUFFERFISH_DEAD);
        this.drawFrames(RAINBOW_PUFFERFISH_TRANSITION);
        this.drawFrames(RAINBOW_PUFFERFISH_BUBBLE_SWIMMING);
        this.drawFrames(this.deflateAnimation);
    }
}