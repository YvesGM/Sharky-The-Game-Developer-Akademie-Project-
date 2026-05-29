import { COIN } from "../../../storage/entities/collectibles.storage.js";
import StaticObjectsClass from "../../world/static-objects.class.js";

export default class CoinClass extends StaticObjectsClass {

    /**
     * Creates a coin collectible.
     *
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - The width.
     * @param {number} h - The height.
     * @param {string} imgPath - The image path.
     */
    constructor(x, y, w, h, imgPath) {
        super(x, y, w, h, imgPath);
        this.initAnimationValues();
        this.initCoinValues();
        this.initOffset();
        this.loadImgStorage();
    }


    /**
     * Initializes animation values.
     *
     * @returns {void}
     */
    initAnimationValues() {
        this.imageCache = {};
        this.currentImg = 0;
        this.lastFrameTime = null;
    }


    /**
     * Initializes coin values.
     *
     * @returns {void}
     */
    initCoinValues() {
        this.value = 1;
    }


    /**
     * Initializes hitbox offset.
     *
     * @returns {void}
     */
    initOffset() {
        this.offset = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        };
    }


    /**
     * Draws the coin.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    draw(ctx) {
        if (this.isCollected) return;

        this.animate(COIN);
        super.drawImg(ctx);
    }


    /**
     * Loads coin images.
     *
     * @returns {void}
     */
    loadImgStorage() {
        COIN.forEach(path => {
            this.loadImage(path);
        });
    }


    /**
     * Loads one image.
     *
     * @param {string} path - The image path.
     * @returns {void}
     */
    loadImage(path) {
        const storageImg = new Image();

        storageImg.src = path;
        this.imageCache[path] = storageImg;
    }


    /**
     * Animates the coin.
     *
     * @param {string[]} currentStorage - The animation storage.
     * @returns {void}
     */
    animate(currentStorage) {
        const now = Date.now();

        if (!this.lastFrameTime) this.lastFrameTime = now;
        if (now - this.lastFrameTime <= 140) return;

        this.setNextImage(currentStorage);
        this.lastFrameTime = now;
    }


    /**
     * Sets the next animation image.
     *
     * @param {string[]} currentStorage - The animation storage.
     * @returns {void}
     */
    setNextImage(currentStorage) {
        const imgIndex = this.currentImg % currentStorage.length;
        const currentImgPath = currentStorage[imgIndex];

        this.img = this.imageCache[currentImgPath];
        this.currentImg++;
    }
}