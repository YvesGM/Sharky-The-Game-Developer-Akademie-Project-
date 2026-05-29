import { RED_PUFFERFISH_SWIMMING, RED_PUFFERFISH_DEAD, RED_PUFFERFISH_TRANSITION, RED_PUFFERFISH_BUBBLE_SWIMMING } from "../../../../storage/characters/enemies/pufferfish.storage.js";
import MovableObjectsClass from "../../../world/movable-objects.class.js";

export default class RedPufferfishClass extends MovableObjectsClass {

    constructor(x, y, w, h, speed, imgPath) {
        super(x, y, w, h, speed, imgPath);

        this.startX = x;
        this.startY = y;
        this.speed = this.randomBetween(speed * 0.6, speed * 1.0);
        this.rangeX = this.randomBetween(260, 500);
        this.rangeY = this.randomBetween(80, 180);
        this.minY = 40;
        this.maxY = 980;
        this.verticalSpeedFactor = this.randomBetween(0.18, 0.35);
        this.directionX = Math.random() < 0.5 ? -1 : 1;
        this.directionY = Math.random() < 0.5 ? -1 : 1;
        this.damage = 25;
        this.otherDirection = this.directionX > 0;

        this.inflateRange = 7500;
        this.inflateState = 'normal';
        this.inflateAnimation = RED_PUFFERFISH_TRANSITION;
        this.deflateAnimation = [...RED_PUFFERFISH_TRANSITION].reverse();

        this.offset = {
            top: 15,
            right: 0,
            bottom: 45,
            left: 10
        };

        this.loadImgStorage();
    }

    draw(ctx, sharky, camera_x) {
        if (this.isDead) {
            this.animateDeath(RED_PUFFERFISH_DEAD);
            super.drawImg(ctx);
            return;
        }

        this.move();
        this.updateInflateState(sharky, camera_x);

        if (this.inflateState === 'inflating') {
            this.damage = 25;
            this.animateOnce(this.inflateAnimation, 'inflateDone');

            if (this.inflateDone) {
                this.inflateState = 'inflated';
                this.inflateDone = false;
                this.currentImg = 0;
                this.lastFrameTime = null;
            }

            super.drawImg(ctx);
            return;
        }

        if (this.inflateState === 'deflating') {
            this.damage = 25;
            this.animateOnce(this.deflateAnimation, 'deflateDone');

            if (this.deflateDone) {
                this.inflateState = 'normal';
                this.deflateDone = false;
                this.currentImg = 0;
                this.lastFrameTime = null;
            }

            super.drawImg(ctx);
            return;
        }

        if (this.inflateState === 'inflated') {
            this.damage = 35;
            this.animateCharacters(RED_PUFFERFISH_BUBBLE_SWIMMING);
            super.drawImg(ctx);
            return;
        }

        this.damage = 25;
        this.animateCharacters(RED_PUFFERFISH_SWIMMING);
        super.drawImg(ctx);
    }

    updateInflateState(sharky, camera_x) {
        if (!sharky) return;

        let sharkyWorldX = sharky.x + camera_x;
        let sharkyWorldY = sharky.y;

        let fishCenterX = this.x + this.w / 2;
        let fishCenterY = this.y + this.h / 2;

        let sharkyCenterX = sharkyWorldX + sharky.w / 2;
        let sharkyCenterY = sharkyWorldY + sharky.h / 2;

        let distanceX = fishCenterX - sharkyCenterX;
        let distanceY = fishCenterY - sharkyCenterY;

        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        let sharkyIsNear = distance <= this.inflateRange;

        if (sharkyIsNear && this.inflateState === 'normal') {
            this.startInflating();
            return;
        }

        if (!sharkyIsNear && this.inflateState === 'inflated') {
            this.startDeflating();
            return;
        }
    }

    startInflating() {
        this.inflateState = 'inflating';
        this.inflateDone = false;
        this.deflateDone = false;
        this.currentImg = 0;
        this.lastFrameTime = null;
    }

    startDeflating() {
        this.inflateState = 'deflating';
        this.inflateDone = false;
        this.deflateDone = false;
        this.currentImg = 0;
        this.lastFrameTime = null;
    }

    move() {
        this.x += this.speed * 0.35 * this.directionX;
        this.y += this.speed * this.verticalSpeedFactor * this.directionY;

        if (this.x <= this.startX - this.rangeX) {
            this.x = this.startX - this.rangeX;
            this.directionX = 1;
        }

        if (this.x >= this.startX + this.rangeX) {
            this.x = this.startX + this.rangeX;
            this.directionX = -1;
        }

        if (this.y <= this.startY - this.rangeY) {
            this.y = this.startY - this.rangeY;
            this.directionY = 1;
        }

        if (this.y >= this.startY + this.rangeY) {
            this.y = this.startY + this.rangeY;
            this.directionY = -1;
        }

        if (this.y <= this.minY) {
            this.y = this.minY;
            this.directionY = 1;
        }

        if (this.y + this.h >= this.maxY) {
            this.y = this.maxY - this.h;
            this.directionY = -1;
        }

        this.otherDirection = this.directionX > 0;
    }

    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    loadImgStorage() {
        this.drawFrames(RED_PUFFERFISH_SWIMMING);
        this.drawFrames(RED_PUFFERFISH_DEAD);
        this.drawFrames(RED_PUFFERFISH_TRANSITION);
        this.drawFrames(RED_PUFFERFISH_BUBBLE_SWIMMING);
        this.drawFrames(this.deflateAnimation);
    }
}