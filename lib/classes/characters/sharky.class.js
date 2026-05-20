import { SHARKY_WAITING, SHARKY_LONG_WAITING, SHARKY_SWIMMING, SHARKY_ELECTRIC_SHOCK, SHARKY_FIN_SLAP, SHARKY_BUBBLE_ATTACK, SHARKY_HURT_POISONED, SHARKY_DEAD_POISONED } from "../../storage/characters/sharky.storage.js";
import Keyboard from "../keyboard/keyboard.class.js"
import { sharkyKbFunctions } from "../../../logic/world/keyboard/keyboard.js";
import MovableObjectsClass from "../world/movable-objects.class.js";

export default class SharkyClass extends MovableObjectsClass {

    constructor(x, y, w, h, speed, imgPath) {
        super(x, y, w, h, speed, imgPath);
        this.health = 100;
        this.healthStage = 5;
        this.coins = 0;
        this.poison = 0;
        this.lastHit = 0;
        this.lastAttack = 0;
        this.lastAction = Date.now();
        this.longWaitingDelay = 5000;
        this.electricShockStartedAt = 0;
        this.electricShockDuration = 2500;
        this.currentAnimation = null;
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

        if (this.isElectrocuted()) {
            this.electricShock(ctx);
            return camera_x;
        }

        if (Keyboard.SPACE && this.canAttack()) {
            this.resetWaitingTimer();
            this.startAttack('bubble');
        }

        if (Keyboard.D && this.canAttack()) {
            this.resetWaitingTimer();
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

        if (this.isMoving()) {
            this.resetWaitingTimer();
            return this.swim(ctx, camera_x, gameState);
        } else {
            this.standStill(ctx);
            return camera_x;
        }
    }

    loadImgStorage() {
        this.drawFrames(SHARKY_WAITING)
        this.drawFrames(SHARKY_LONG_WAITING)
        this.drawFrames(SHARKY_SWIMMING)
        this.drawFrames(SHARKY_ELECTRIC_SHOCK)
        this.drawFrames(SHARKY_FIN_SLAP)
        this.drawFrames(SHARKY_BUBBLE_ATTACK)
        this.drawFrames(SHARKY_HURT_POISONED)
        this.drawFrames(SHARKY_DEAD_POISONED)
    }

    setAnimation(animationName) {
        if (this.currentAnimation === animationName) return;

        this.currentAnimation = animationName;
        this.currentImg = 0;
        this.lastFrameTime = null;
    }

    // functionality
    standStill(ctx) {
        if (this.isLongWaiting()) {
            this.setAnimation('longWaiting');
            this.animateCharacters(SHARKY_LONG_WAITING);
        } else {
            this.setAnimation('waiting');
            this.animateCharacters(SHARKY_WAITING);
        }

        super.drawImg(ctx);
    }

    swim(ctx, camera_x, gameState) {
        this.setAnimation('swimming');
        this.animateCharacters(SHARKY_SWIMMING)

        camera_x = sharkyKbFunctions(this, camera_x, gameState);
        super.drawImg(ctx);
        return camera_x;
    }

    isMoving() {
        return Keyboard.UP || Keyboard.DOWN || Keyboard.RIGHT || Keyboard.LEFT;
    }

    resetWaitingTimer() {
        this.lastAction = Date.now();
        // this.currentImg = 0;
    }

    isLongWaiting() {
        return Date.now() - this.lastAction > this.longWaitingDelay;
    }

    // Damage & Death
    hit(damage, enemy = null) {
        if (this.isDead || this.isElectrocuted()) return;
        if (Date.now() - this.lastHit < 900) return;

        this.healthStage--;
        this.lastHit = Date.now();

        if (enemy && enemy.enemyType === 'jellyfish') {
            this.startElectricShock();
        }

        if (this.healthStage <= 0) {
            this.healthStage = 0;
            this.health = 0;
            this.isDead = true;
            this.currentImg = 0;
            return;
        }

        this.health = this.healthStage * 25;
    }

    startElectricShock() {
        this.electricShockStartedAt = Date.now();
        this.setAnimation('electricShock');
    }

    isElectrocuted() {
        return Date.now() - this.electricShockStartedAt < this.electricShockDuration;
    }

    electricShock(ctx) {
        this.animateCharacters(SHARKY_ELECTRIC_SHOCK);
        super.drawImg(ctx);
    }

    // Collecting
    collectCoin(value = 1) {
        this.coins += value;

        if (this.coins > 15) {
            this.coins = 15;
        }
    }

    collectPoison(value = 1) {
        this.poison += value;

        if (this.poison > 5) {
            this.poison = 5;
        }
    }

    // Attacking, Hurting
    canAttack() {
        return Date.now() - this.lastAttack > 650 && !this.isDead;
    }

    startAttack(type) {
        this.attackType = type;
        this.attackStartedAt = Date.now();
        this.lastAttack = Date.now();

        if (type === 'bubble') {
            this.setAnimation('bubbleAttack');
        }

        if (type === 'fin') {
            this.setAnimation('finSlap');
        }
    }

    isAttacking() {
        return this.attackType && Date.now() - this.attackStartedAt < 520;
    }

    attack(ctx) {
        if (this.attackType === 'bubble') {
            this.setAnimation('bubbleAttack');
            this.animateCharacters(SHARKY_BUBBLE_ATTACK);
        }

        if (this.attackType === 'fin') {
            this.setAnimation('finSlap');
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