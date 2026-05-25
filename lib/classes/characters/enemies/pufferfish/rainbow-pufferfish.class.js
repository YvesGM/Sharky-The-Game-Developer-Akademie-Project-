import { RAINBOW_PUFFERFISH_SWIMMING, RAINBOW_PUFFERFISH_DEAD, RAINBOW_PUFFERFISH_TRANSITION, RAINBOW_PUFFERFISH_BUBBLE_SWIMMING } from "../../../../storage/characters/enemies/pufferfish.storage.js";

import MovableObjectsClass from "../../../world/movable-objects.class.js";

export default class RainbowPufferfishClass extends MovableObjectsClass {

    constructor(x, y, w, h, speed, imgPath) {
        super(x, y, w, h, speed, imgPath);
        this.startX = x;
        this.range = 420;
        this.direction = -1;
        this.damage = 25;
        this.inflateRange = 500;
        this.isInflating = false;
        this.isInflated = false;
        this.inflateAnimationDone = false;
        this.offset = {
            top: 15,
            right: 0,
            bottom: 45,
            left: 10
        };
        this.loadImgStorage();
    }

    draw(ctx, sharky) {
        if (this.isDead) {
            this.animateDeath(RAINBOW_PUFFERFISH_DEAD);
            super.drawImg(ctx);
            return;
        }

        this.move();

        if (sharky && this.isNear(sharky, this.inflateRange) && !this.isInflated && !this.isInflating) {
            this.isInflating = true;
            this.inflateAnimationDone = false;
            this.currentImg = 0;
        }

        if (this.isInflating) {
            this.animateOnce(RAINBOW_PUFFERFISH_TRANSITION, 'inflateAnimationDone');

            if (this.inflateAnimationDone) {
                this.isInflating = false;
                this.isInflated = true;
                this.currentImg = 0;
            }

            super.drawImg(ctx);
            return;
        }

        if (this.isInflated) {
            this.damage = 35;
            this.animateCharacters(RAINBOW_PUFFERFISH_BUBBLE_SWIMMING);
            super.drawImg(ctx);
            return;
        }

        this.damage = 25;
        this.animateCharacters(RAINBOW_PUFFERFISH_SWIMMING);
        super.drawImg(ctx);
    }

    move() {
        this.x += this.speed * 0.25 * this.direction;

        if (this.x <= this.startX - this.range || this.x >= this.startX + this.range) {
            this.direction *= -1;
            this.otherDirection = this.direction > 0;
        }
    }

    loadImgStorage() {
        this.drawFrames(RAINBOW_PUFFERFISH_SWIMMING);
        this.drawFrames(RAINBOW_PUFFERFISH_DEAD);
        this.drawFrames(RAINBOW_PUFFERFISH_TRANSITION);
        this.drawFrames(RAINBOW_PUFFERFISH_BUBBLE_SWIMMING);
    }
}