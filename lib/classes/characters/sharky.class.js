import { SHARKY_WAITING, SHARKY_LONG_WAITING, SHARKY_SWIMMING, SHARKY_FIN_SLAP, SHARKY_BUBBLE_ATTACK, SHARKY_HURT_POISONED, SHARKY_DEAD_POISONED } from "../../storage/characters/sharky.storage.js";
import Keyboard from "../keyboard/keyboard.class.js"
import { sharkyKbFunctions } from "../../../logic/world/keyboard/keyboard.js";
import MovableObjectsClass from "../world/movable-objects.class.js";

export default class SharkyClass extends MovableObjectsClass {

    constructor(x, y, w, h, speed, imgPath) {
        super(x, y, w, h, speed, imgPath);
        this.health = 100;
        this.coins = 0;
        this.poison = 0;
        this.lastHit = 0;
        this.lastAttack = 0;
        this.attackType = null;
        this.attackStartedAt = 0;
        this.offset = {
            top: 190,
            right: 80,
            bottom: 100,
            left: 80
        };
        this.loadImgStorage();
    }

    // draw
    draw(ctx, camera_x, gameState) {
        if (this.isDead) {
            this.animateCharacters(SHARKY_DEAD_POISONED);
            super.drawImg(ctx);
            return camera_x;
        }

        if (Keyboard.SPACE && this.canAttack()) {
            this.startAttack('bubble');
        }

        if (Keyboard.D && this.canAttack()) {
            this.startAttack('fin');
        }

        if (this.isAttacking()) {
            this.attack(ctx);
            return camera_x;
        }

        if (this.isHurt()) {
            this.animateCharacters(SHARKY_HURT_POISONED);
            super.drawImg(ctx);
            return camera_x;
        }

        if (Keyboard.UP || Keyboard.DOWN || Keyboard.RIGHT || Keyboard.LEFT) {
            return this.swim(ctx, camera_x);
        } else {
            this.standStill(ctx);
            return camera_x;
        }
    }


    loadImgStorage() {
        this.drawFrames(SHARKY_WAITING)
        this.drawFrames(SHARKY_LONG_WAITING)
        this.drawFrames(SHARKY_SWIMMING)
        this.drawFrames(SHARKY_FIN_SLAP)
        this.drawFrames(SHARKY_BUBBLE_ATTACK)
        this.drawFrames(SHARKY_HURT_POISONED)
        this.drawFrames(SHARKY_DEAD_POISONED)
    }


    // functionality
    standStill(ctx) {
        this.animateCharacters(SHARKY_WAITING);
        super.drawImg(ctx);
    }

    swim(ctx, camera_x, gameState) {
        this.animateCharacters(SHARKY_SWIMMING)

        camera_x = sharkyKbFunctions(this, camera_x, gameState);
        super.drawImg(ctx);
        return camera_x;
    }

    hit(damage) {
        if (Date.now() - this.lastHit < 900 || this.isDead) return;

        this.health -= damage;
        this.lastHit = Date.now();

        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            this.currentImg = 0;
        }
    }

    collectCoin(value = 1) {
        this.coins += value;
    }

    collectPoison(value = 1) {
        this.poison += value;
    }

    canAttack() {
        return Date.now() - this.lastAttack > 650 && !this.isDead;
    }

    startAttack(type) {
        this.attackType = type;
        this.attackStartedAt = Date.now();
        this.lastAttack = Date.now();
        this.currentImg = 0;
    }

    isAttacking() {
        return this.attackType && Date.now() - this.attackStartedAt < 520;
    }

    attack(ctx) {
        if (this.attackType === 'bubble') {
            this.animateCharacters(SHARKY_BUBBLE_ATTACK);
        }

        if (this.attackType === 'fin') {
            this.animateCharacters(SHARKY_FIN_SLAP);
        }

        super.drawImg(ctx);

        if (!this.isAttacking()) {
            this.attackType = null;
        }
    }

    isHurt() {
        return Date.now() - this.lastHit < 450;
    }

    getAttackBox(camera_x = 0) {
        let hitbox = this.getHitbox(camera_x);
        let attackRange = this.attackType === 'bubble' ? 260 : 130;

        if (this.otherDirection) {
            return {
                x: hitbox.x - attackRange,
                y: hitbox.y + 20,
                w: attackRange,
                h: hitbox.h - 40
            };
        }

        return {
            x: hitbox.x + hitbox.w,
            y: hitbox.y + 20,
            w: attackRange,
            h: hitbox.h - 40
        };
    }
}