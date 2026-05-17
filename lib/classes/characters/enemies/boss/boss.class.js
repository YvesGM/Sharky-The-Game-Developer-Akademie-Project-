import { BOSS_FLOATING, BOSS_HURT, BOSS_DEAD } from "../../../../storage/characters/enemies/boss.storage.js";
import MovableObjectsClass from "../../../world/movable-objects.class.js";

export default class BossClass extends MovableObjectsClass {

    constructor(x, y, w, h, speed, imgPath) {
        super(x, y, w, h, speed, imgPath);
        this.health = 100;
        this.damage = 25;
        this.isHurt = false;
        this.hurtStartedAt = 0;
        this.direction = -1;
        this.minY = y - 80;
        this.maxY = y + 80;
        this.offset = {
            top: 180,
            right: 90,
            bottom: 110,
            left: 120
        };
        this.loadImgStorage();
    }

    draw(ctx) {
        this.move();
        this.animate();
        super.drawImg(ctx);
    }

    move() {
        if (this.isDead) return;

        this.y += this.speed * 0.25 * this.direction;

        if (this.y <= this.minY) {
            this.direction = 1;
        }

        if (this.y >= this.maxY) {
            this.direction = -1;
        }
    }

    hit() {
        if (this.isDead) return;

        this.health -= this.damage;
        this.isHurt = true;
        this.hurtStartedAt = Date.now();

        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            this.currentImg = 0;
        }
    }

    animate() {
        if (this.isDead) {
            this.animateCharacters(BOSS_DEAD);
            return;
        }

        if (this.isHurt && Date.now() - this.hurtStartedAt < 450) {
            this.animateCharacters(BOSS_HURT);
            return;
        }

        this.isHurt = false;
        this.animateCharacters(BOSS_FLOATING);
    }

    loadImgStorage() {
        this.drawFrames(BOSS_FLOATING);
        this.drawFrames(BOSS_HURT);
        this.drawFrames(BOSS_DEAD);
    }
}
