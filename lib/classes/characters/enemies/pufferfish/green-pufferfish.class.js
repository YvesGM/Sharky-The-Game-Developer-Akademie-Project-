import { GREEN_PUFFERFISH_SWIMMING, GREEN_PUFFERFISH_DEAD, GREEN_PUFFERFISH_TRANSITION, GREEN_PUFFERFISH_BUBBLE_SWIMMING } from "../../../../storage/characters/enemies/pufferfish.storage.js";
import MovableObjectsClass from "../../../world/movable-objects.class.js";

export default class GreenPufferfishClass extends MovableObjectsClass {

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
            this.animateDeath(GREEN_PUFFERFISH_DEAD);
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
            this.animateOnce(GREEN_PUFFERFISH_TRANSITION, 'inflateAnimationDone');

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
            this.animateCharacters(GREEN_PUFFERFISH_BUBBLE_SWIMMING);
            super.drawImg(ctx);
            return;
        }

        this.damage = 25;
        this.animateCharacters(GREEN_PUFFERFISH_SWIMMING);
        super.drawImg(ctx);
    }

    checkInflateState(sharky) {
        if (!sharky) return;

        if (this.isNear(sharky, this.inflateRange)) {
            this.isInflated = true;
            this.damage = 35;
            return;
        }

        this.isInflated = false;
        this.damage = 25;
    }

    move() {
        this.x += this.speed * 0.25 * this.direction;

        if (this.x <= this.startX - this.range || this.x >= this.startX + this.range) {
            this.direction *= -1;
            this.otherDirection = this.direction > 0;
        }
    }

    loadImgStorage() {
        this.drawFrames(GREEN_PUFFERFISH_SWIMMING);
        this.drawFrames(GREEN_PUFFERFISH_DEAD);
        this.drawFrames(GREEN_PUFFERFISH_TRANSITION);
        this.drawFrames(GREEN_PUFFERFISH_BUBBLE_SWIMMING);
    }
}
