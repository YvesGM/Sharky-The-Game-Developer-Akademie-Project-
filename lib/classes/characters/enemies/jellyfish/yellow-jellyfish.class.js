import { YELLOW_JELLYFISH_SWIMMING, YELLOW_JELLYFISH_DEAD, YELLOW_JELLYFISH_SUPER_DEAD, YELLOW_JELLYFISH_SUPER_DANGEROUS } from "../../../../storage/characters/enemies/jellyfish.storage.js";
import MovableObjectsClass from "../../../world/movable-objects.class.js";

export default class YellowJellyfishClass extends MovableObjectsClass {

    constructor(x, y, w, h, speed, imgPath) {
        super(x, y, w, h, speed, imgPath);
        this.enemyType = 'jellyfish';
        this.startX = x;
        this.startY = y;
        this.minY = 40;
        this.maxY = 980;
        this.speed = this.randomBetween(speed * 0.4, speed * 0.8);
        this.range = this.randomBetween(240, 430);
        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.driftRangeX = this.randomBetween(20, 70);
        this.driftDirection = Math.random() < 0.5 ? -1 : 1;
        this.horizontalSpeedFactor = this.randomBetween(0.04, 0.1);
        this.damage = 25;

        this.isSuperDangerous = false;
        this.superDangerousStartedAt = 0;
        this.superDangerousDuration = 2500;

        this.wasSuperDangerousBeforeDeath = false;

        this.offset = {
            top: 20,
            right: 50,
            bottom: 50,
            left: 50
        };

        this.loadImgStorage();
    }


    draw(ctx) {
        if (this.isDead) {
            let deathStorage = this.wasSuperDangerousBeforeDeath
                ? YELLOW_JELLYFISH_SUPER_DEAD
                : YELLOW_JELLYFISH_DEAD;

            this.animateDeath(deathStorage);
            super.drawImg(ctx);
            return;
        }

        this.move();

        if (this.isSuperDangerousActive()) {
            this.animateCharacters(YELLOW_JELLYFISH_SUPER_DANGEROUS);
            super.drawImg(ctx);
            return;
        }

        this.isSuperDangerous = false;
        this.animateCharacters(YELLOW_JELLYFISH_SWIMMING);
        super.drawImg(ctx);
    }


    move() {
        this.y += this.speed * 0.38 * this.direction;
        this.x += this.speed * this.horizontalSpeedFactor * this.driftDirection;

        if (this.y <= this.startY - this.range) {
            this.y = this.startY - this.range;
            this.direction = 1;
        }

        if (this.y >= this.startY + this.range) {
            this.y = this.startY + this.range;
            this.direction = -1;
        }

        if (this.x <= this.startX - this.driftRangeX) {
            this.x = this.startX - this.driftRangeX;
            this.driftDirection = 1;
        }

        if (this.x >= this.startX + this.driftRangeX) {
            this.x = this.startX + this.driftRangeX;
            this.driftDirection = -1;
        }

        if (this.y <= this.minY) {
            this.y = this.minY;
            this.direction = 1;
        }

        if (this.y + this.h >= this.maxY) {
            this.y = this.maxY - this.h;
            this.direction = -1;
        }

        this.otherDirection = this.driftDirection > 0;
    }

    startSuperDangerous() {
        if (this.isDead) return;

        this.isSuperDangerous = true;
        this.superDangerousStartedAt = Date.now();
        this.setAnimationState('superDangerous');
    }

    isSuperDangerousActive() {
        return this.isSuperDangerous &&
            Date.now() - this.superDangerousStartedAt < this.superDangerousDuration;
    }

    die() {
        if (this.isDead) return;

        this.wasSuperDangerousBeforeDeath = this.isSuperDangerousActive();

        super.die();
    }

    setAnimationState(animationName) {
        if (this.currentAnimation === animationName) return;

        this.currentAnimation = animationName;
        this.currentImg = 0;
        this.lastFrameTime = null;
    }

    loadImgStorage() {
        this.drawFrames(YELLOW_JELLYFISH_SWIMMING);
        this.drawFrames(YELLOW_JELLYFISH_DEAD);
        this.drawFrames(YELLOW_JELLYFISH_SUPER_DEAD);
        this.drawFrames(YELLOW_JELLYFISH_SUPER_DANGEROUS);
    }

    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
}