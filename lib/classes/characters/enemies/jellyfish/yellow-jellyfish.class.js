import {
    YELLOW_JELLYFISH_SWIMMING,
    YELLOW_JELLYFISH_DEAD,
    YELLOW_JELLYFISH_SUPER_DEAD,
    YELLOW_JELLYFISH_SUPER_DANGEROUS
} from "../../../../storage/characters/enemies/jellyfish.storage.js";
import MovableObjectsClass from "../../../world/movable-objects.class.js";

export default class YellowJellyfishClass extends MovableObjectsClass {

    /**
     * Creates a yellow jellyfish enemy.
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
        this.initJellyfishValues(x, y, speed);
        this.initSuperDangerousValues();
        this.initOffset();
        this.loadImgStorage();
    }


    /**
     * Initializes movement and damage values.
     *
     * @param {number} x - The start x position.
     * @param {number} y - The start y position.
     * @param {number} speed - The base speed.
     * @returns {void}
     */
    initJellyfishValues(x, y, speed) {
        this.enemyType = 'jellyfish';
        this.startX = x;
        this.startY = y;
        this.minY = 40;
        this.maxY = 980;
        this.speed = this.randomBetween(speed * 0.4, speed * 0.8);
        this.range = this.randomBetween(240, 430);
        this.damage = 25;
        this.initDriftValues();
    }


    /**
     * Initializes horizontal drift values.
     *
     * @returns {void}
     */
    initDriftValues() {
        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.driftRangeX = this.randomBetween(20, 70);
        this.driftDirection = Math.random() < 0.5 ? -1 : 1;
        this.horizontalSpeedFactor = this.randomBetween(0.04, 0.1);
    }


    /**
     * Initializes super dangerous values.
     *
     * @returns {void}
     */
    initSuperDangerousValues() {
        this.isSuperDangerous = false;
        this.superDangerousStartedAt = 0;
        this.superDangerousDuration = 1800;
        this.wasSuperDangerousBeforeDeath = false;
    }


    /**
     * Initializes the hitbox offset.
     *
     * @returns {void}
     */
    initOffset() {
        this.offset = {
            top: 20,
            right: 50,
            bottom: 50,
            left: 50
        };
    }


    /**
     * Draws and updates the jellyfish.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    draw(ctx) {
        if (this.isDead) {
            this.drawDeath(ctx);
            return;
        }

        this.move();
        this.drawCurrentState(ctx);
    }


    /**
     * Draws the death animation.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    drawDeath(ctx) {
        const deathStorage = this.getDeathStorage();

        this.animateDeath(deathStorage);
        super.drawImg(ctx);
    }


    /**
     * Returns the correct death storage.
     *
     * @returns {string[]} The death image storage.
     */
    getDeathStorage() {
        return this.wasSuperDangerousBeforeDeath
            ? YELLOW_JELLYFISH_SUPER_DEAD
            : YELLOW_JELLYFISH_DEAD;
    }


    /**
     * Draws the current alive state.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    drawCurrentState(ctx) {
        if (this.isSuperDangerousActive()) {
            this.animateCharacters(YELLOW_JELLYFISH_SUPER_DANGEROUS);
            super.drawImg(ctx);
            return;
        }

        this.isSuperDangerous = false;
        this.animateCharacters(YELLOW_JELLYFISH_SWIMMING);
        super.drawImg(ctx);
    }


    /**
     * Moves the jellyfish.
     *
     * @returns {void}
     */
    move() {
        this.moveVertical();
        this.moveHorizontal();
        this.applyVerticalRange();
        this.applyHorizontalRange();
        this.applyWorldBounds();
        this.otherDirection = this.driftDirection > 0;
    }


    /**
     * Moves vertically.
     *
     * @returns {void}
     */
    moveVertical() {
        this.y += this.speed * 0.38 * this.direction;
    }


    /**
     * Moves horizontally.
     *
     * @returns {void}
     */
    moveHorizontal() {
        this.x += this.speed * this.horizontalSpeedFactor * this.driftDirection;
    }


    /**
     * Applies the vertical movement range.
     *
     * @returns {void}
     */
    applyVerticalRange() {
        if (this.y <= this.startY - this.range) this.setTopRange();
        if (this.y >= this.startY + this.range) this.setBottomRange();
    }


    /**
     * Applies the horizontal movement range.
     *
     * @returns {void}
     */
    applyHorizontalRange() {
        if (this.x <= this.startX - this.driftRangeX) this.setLeftRange();
        if (this.x >= this.startX + this.driftRangeX) this.setRightRange();
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
     * Sets the top movement range.
     *
     * @returns {void}
     */
    setTopRange() {
        this.y = this.startY - this.range;
        this.direction = 1;
    }


    /**
     * Sets the bottom movement range.
     *
     * @returns {void}
     */
    setBottomRange() {
        this.y = this.startY + this.range;
        this.direction = -1;
    }


    /**
     * Sets the left movement range.
     *
     * @returns {void}
     */
    setLeftRange() {
        this.x = this.startX - this.driftRangeX;
        this.driftDirection = 1;
    }


    /**
     * Sets the right movement range.
     *
     * @returns {void}
     */
    setRightRange() {
        this.x = this.startX + this.driftRangeX;
        this.driftDirection = -1;
    }


    /**
     * Sets the minimum y position.
     *
     * @returns {void}
     */
    setMinY() {
        this.y = this.minY;
        this.direction = 1;
    }


    /**
     * Sets the maximum y position.
     *
     * @returns {void}
     */
    setMaxY() {
        this.y = this.maxY - this.h;
        this.direction = -1;
    }


    /**
     * Starts the super dangerous state.
     *
     * @returns {void}
     */
    startSuperDangerous() {
        if (this.isDead) return;

        this.isSuperDangerous = true;
        this.superDangerousStartedAt = Date.now();
        this.setAnimationState('superDangerous');
    }


    /**
     * Checks whether super dangerous is active.
     *
     * @returns {boolean} Whether super dangerous is active.
     */
    isSuperDangerousActive() {
        return this.isSuperDangerous &&
            Date.now() - this.superDangerousStartedAt < this.superDangerousDuration;
    }


    /**
     * Starts the death state.
     *
     * @returns {void}
     */
    die() {
        if (this.isDead) return;

        this.wasSuperDangerousBeforeDeath = this.isSuperDangerousActive();
        super.die();
    }


    /**
     * Sets the current animation state.
     *
     * @param {string} animationName - The animation name.
     * @returns {void}
     */
    setAnimationState(animationName) {
        if (this.currentAnimation === animationName) return;

        this.currentAnimation = animationName;
        this.currentImg = 0;
        this.lastFrameTime = null;
    }


    /**
     * Loads all image storages.
     *
     * @returns {void}
     */
    loadImgStorage() {
        this.drawFrames(YELLOW_JELLYFISH_SWIMMING);
        this.drawFrames(YELLOW_JELLYFISH_DEAD);
        this.drawFrames(YELLOW_JELLYFISH_SUPER_DEAD);
        this.drawFrames(YELLOW_JELLYFISH_SUPER_DANGEROUS);
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
}