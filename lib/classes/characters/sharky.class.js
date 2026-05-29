import {
    SHARKY_WAITING,
    SHARKY_LONG_WAITING,
    SHARKY_SWIMMING,
    SHARKY_ELECTRIC_SHOCK,
    SHARKY_FIN_SLAP,
    SHARKY_BUBBLE_ATTACK,
    SHARKY_POISON_BUBBLE_ATTACK,
    SHARKY_HURT_POISONED,
    SHARKY_DEAD_POISONED
} from "../../storage/characters/sharky.storage.js";
import Keyboard from "../keyboard/keyboard.class.js";
import { sharkyKbFunctions } from "../../../logic/world/keyboard/keyboard.js";
import MovableObjectsClass from "../world/movable-objects.class.js";

export default class SharkyClass extends MovableObjectsClass {

    /**
     * Creates Sharky.
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
        this.initStats();
        this.initTimers();
        this.initShockValues();
        this.initAttackValues();
        this.initOffset();
        this.loadImgStorage();
    }


    /**
     * Initializes Sharky's stats.
     *
     * @returns {void}
     */
    initStats() {
        this.health = 100;
        this.healthStage = 5;
        this.coins = 0;
        this.poison = 0;
        this.totalPoisonCollected = 0;
    }


    /**
     * Initializes timer values.
     *
     * @returns {void}
     */
    initTimers() {
        this.lastHit = 0;
        this.lastAttack = 0;
        this.lastAction = Date.now();
        this.currentAnimation = null;
        this.longWaitingDelay = 10000;
    }


    /**
     * Initializes electric shock values.
     *
     * @returns {void}
     */
    initShockValues() {
        this.electricShockStartedAt = 0;
        this.electricShockDuration = 1600;
        this.pendingShockDamage = null;
        this.pendingShockEnemy = null;
        this.pendingShockAt = 0;
        this.invulnerableUntil = 0;
        this.jellyfishGraceDuration = 1200;
    }


    /**
     * Initializes attack values.
     *
     * @returns {void}
     */
    initAttackValues() {
        this.attackType = null;
        this.attackStartedAt = 0;
        this.attackDuration = 0;
        this.currentAttackId = 0;
        this.bubbleSpawned = false;
        this.isPoisonBubbleAttack = false;
    }


    /**
     * Initializes hitbox offset.
     *
     * @returns {void}
     */
    initOffset() {
        this.offset = {
            top: 190,
            right: 80,
            bottom: 100,
            left: 80
        };
    }


    /**
     * Draws and updates Sharky.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {number} camera_x - The camera position.
     * @param {Object} gameState - The current game state.
     * @returns {number} The updated camera position.
     */
    draw(ctx, camera_x, gameState) {
        this.handlePendingShockDamage();

        if (this.drawDeadState(ctx)) return camera_x;
        if (this.drawElectricShockState(ctx)) return camera_x;
        if (this.startKeyboardAttack()) return this.drawAttackState(ctx, camera_x);
        if (this.drawAttackIfActive(ctx)) return camera_x;
        if (this.drawHurtState(ctx)) return camera_x;

        return this.drawMovementState(ctx, camera_x, gameState);
    }


    /**
     * Draws dead state if needed.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {boolean} Whether dead state was drawn.
     */
    drawDeadState(ctx) {
        if (!this.isDead) return false;

        this.animateCharacters(SHARKY_DEAD_POISONED);
        super.drawImg(ctx);
        return true;
    }


    /**
     * Draws electric shock state if needed.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {boolean} Whether shock state was drawn.
     */
    drawElectricShockState(ctx) {
        if (!this.isElectrocuted()) return false;

        this.electricShock(ctx);
        return true;
    }


    /**
     * Starts an attack from keyboard input.
     *
     * @returns {boolean} Whether an attack was started.
     */
    startKeyboardAttack() {
        if (Keyboard.SPACE && this.canAttack()) {
            this.startBubbleAttack();
            return true;
        }

        return this.startFinAttackByKey();
    }


    /**
     * Starts bubble attack by key.
     *
     * @returns {void}
     */
    startBubbleAttack() {
        this.resetWaitingTimer();
        this.startAttack('bubble');
    }


    /**
     * Starts fin attack by key.
     *
     * @returns {boolean} Whether fin attack was started.
     */
    startFinAttackByKey() {
        if (!Keyboard.D || !this.canAttack()) return false;

        this.resetWaitingTimer();
        this.startAttack('fin');
        return true;
    }


    /**
     * Draws attack directly after starting.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {number} camera_x - The camera position.
     * @returns {number} The camera position.
     */
    drawAttackState(ctx, camera_x) {
        this.attack(ctx);
        return camera_x;
    }


    /**
     * Draws attack if currently active.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {boolean} Whether attack state was drawn.
     */
    drawAttackIfActive(ctx) {
        if (!this.isAttacking()) return false;

        this.attack(ctx);
        return true;
    }


    /**
     * Draws hurt state if needed.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {boolean} Whether hurt state was drawn.
     */
    drawHurtState(ctx) {
        if (!this.isHurt()) return false;

        this.animateCharacters(SHARKY_HURT_POISONED);
        super.drawImg(ctx);
        return true;
    }


    /**
     * Draws moving or waiting state.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {number} camera_x - The camera position.
     * @param {Object} gameState - The current game state.
     * @returns {number} The updated camera position.
     */
    drawMovementState(ctx, camera_x, gameState) {
        if (this.isMoving()) {
            this.resetWaitingTimer();
            return this.swim(ctx, camera_x, gameState);
        }

        this.standStill(ctx);
        return camera_x;
    }


    /**
     * Loads all Sharky image storages.
     *
     * @returns {void}
     */
    loadImgStorage() {
        this.drawFrames(SHARKY_WAITING);
        this.drawFrames(SHARKY_LONG_WAITING);
        this.drawFrames(SHARKY_SWIMMING);
        this.drawFrames(SHARKY_ELECTRIC_SHOCK);
        this.drawFrames(SHARKY_FIN_SLAP);
        this.drawFrames(SHARKY_BUBBLE_ATTACK);
        this.drawFrames(SHARKY_POISON_BUBBLE_ATTACK);
        this.drawFrames(SHARKY_HURT_POISONED);
        this.drawFrames(SHARKY_DEAD_POISONED);
    }


    /**
     * Sets animation if it changed.
     *
     * @param {string} animationName - The animation name.
     * @returns {void}
     */
    setAnimation(animationName) {
        if (this.currentAnimation === animationName) return;

        this.currentAnimation = animationName;
        this.currentImg = 0;
        this.lastFrameTime = null;
    }


    /**
     * Draws waiting animation.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    standStill(ctx) {
        if (this.isLongWaiting()) {
            this.drawLongWaiting(ctx);
            return;
        }

        this.drawWaiting(ctx);
    }


    /**
     * Draws normal waiting animation.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    drawWaiting(ctx) {
        this.setAnimation('waiting');
        this.animateCharacters(SHARKY_WAITING);
        super.drawImg(ctx);
    }


    /**
     * Draws long waiting animation.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    drawLongWaiting(ctx) {
        this.setAnimation('longWaiting');
        this.animateCharacters(SHARKY_LONG_WAITING);
        super.drawImg(ctx);
    }


    /**
     * Draws swimming animation and movement.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {number} camera_x - The camera position.
     * @param {Object} gameState - The current game state.
     * @returns {number} The updated camera position.
     */
    swim(ctx, camera_x, gameState) {
        this.setAnimation('swimming');
        this.animateCharacters(SHARKY_SWIMMING);
        camera_x = sharkyKbFunctions(this, camera_x, gameState);
        super.drawImg(ctx);
        return camera_x;
    }


    /**
     * Checks whether Sharky is moving.
     *
     * @returns {boolean} Whether Sharky is moving.
     */
    isMoving() {
        return Keyboard.UP || Keyboard.DOWN || Keyboard.RIGHT || Keyboard.LEFT;
    }


    /**
     * Resets waiting timer.
     *
     * @returns {void}
     */
    resetWaitingTimer() {
        this.lastAction = Date.now();
    }


    /**
     * Checks whether long waiting is active.
     *
     * @returns {boolean} Whether long waiting is active.
     */
    isLongWaiting() {
        return Date.now() - this.lastAction > this.longWaitingDelay;
    }


    /**
     * Applies damage to Sharky.
     *
     * @param {number} damage - The damage value.
     * @param {Object|null} enemy - The enemy object.
     * @returns {void}
     */
    hit(damage, enemy = null) {
        const now = Date.now();

        if (!this.canReceiveHit(now)) return;

        this.applyHealthDamage();
        this.lastHit = Date.now();
        this.applyHitEffect(enemy);
        this.updateHealthAfterHit();
    }


    /**
     * Checks whether Sharky can receive damage.
     *
     * @param {number} now - The current timestamp.
     * @returns {boolean} Whether damage can be received.
     */
    canReceiveHit(now) {
        if (this.isDead) return false;
        if (now < this.invulnerableUntil) return false;
        if (this.isElectrocuted()) return false;

        return now - this.lastHit >= 900;
    }


    /**
     * Applies health stage damage.
     *
     * @returns {void}
     */
    applyHealthDamage() {
        this.healthStage--;
    }


    /**
     * Applies hit effect based on enemy.
     *
     * @param {Object|null} enemy - The enemy object.
     * @returns {void}
     */
    applyHitEffect(enemy) {
        if (enemy && enemy.enemyType === 'jellyfish') {
            this.applyJellyfishHit(enemy);
            return;
        }

        this.invulnerableUntil = Date.now() + 900;
    }


    /**
     * Applies jellyfish hit effect.
     *
     * @param {Object} enemy - The jellyfish enemy.
     * @returns {void}
     */
    applyJellyfishHit(enemy) {
        this.startElectricShock();
        this.invulnerableUntil = Date.now() +
            this.electricShockDuration +
            this.jellyfishGraceDuration;

        this.applyJellyfishKnockback(enemy);
    }


    /**
     * Applies jellyfish knockback.
     *
     * @param {Object} enemy - The jellyfish enemy.
     * @returns {void}
     */
    applyJellyfishKnockback(enemy) {
        if (enemy.x < this.x) {
            this.x += 40;
            return;
        }

        this.x -= 40;
    }


    /**
     * Updates health values after hit.
     *
     * @returns {void}
     */
    updateHealthAfterHit() {
        if (this.healthStage <= 0) {
            this.dieByDamage();
            return;
        }

        this.health = this.healthStage * 25;
    }


    /**
     * Sets Sharky dead by damage.
     *
     * @returns {void}
     */
    dieByDamage() {
        this.healthStage = 0;
        this.health = 0;
        this.isDead = true;
        this.currentImg = 0;
    }


    /**
     * Starts electric shock.
     *
     * @returns {void}
     */
    startElectricShock() {
        this.electricShockStartedAt = Date.now();
        this.setAnimation('electricShock');
    }


    /**
     * Checks whether Sharky is electrocuted.
     *
     * @returns {boolean} Whether Sharky is electrocuted.
     */
    isElectrocuted() {
        return Date.now() - this.electricShockStartedAt <
            this.electricShockDuration;
    }


    /**
     * Draws electric shock animation.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    electricShock(ctx) {
        this.animateCharacters(SHARKY_ELECTRIC_SHOCK);
        super.drawImg(ctx);
    }


    /**
     * Schedules shock damage.
     *
     * @param {number} damage - The damage value.
     * @param {Object} enemy - The enemy object.
     * @param {number} delay - The damage delay.
     * @returns {void}
     */
    scheduleShockDamage(damage, enemy, delay = 350) {
        if (this.isDead) return;

        this.pendingShockDamage = damage;
        this.pendingShockEnemy = enemy;
        this.pendingShockAt = Date.now() + delay;
    }


    /**
     * Handles pending shock damage.
     *
     * @returns {void}
     */
    handlePendingShockDamage() {
        if (!this.pendingShockDamage) return;
        if (Date.now() < this.pendingShockAt) return;

        this.applyPendingShockDamage();
    }


    /**
     * Applies pending shock damage.
     *
     * @returns {void}
     */
    applyPendingShockDamage() {
        const damage = this.pendingShockDamage;
        const enemy = this.pendingShockEnemy;

        this.clearPendingShockDamage();
        this.hit(damage, enemy);
    }


    /**
     * Clears pending shock values.
     *
     * @returns {void}
     */
    clearPendingShockDamage() {
        this.pendingShockDamage = null;
        this.pendingShockEnemy = null;
        this.pendingShockAt = 0;
    }


    /**
     * Collects coins.
     *
     * @param {number} value - The coin value.
     * @returns {void}
     */
    collectCoin(value = 1) {
        this.coins += value;
        this.limitCoins();
    }


    /**
     * Limits coin amount.
     *
     * @returns {void}
     */
    limitCoins() {
        if (this.coins > 15) {
            this.coins = 15;
        }
    }


    /**
     * Collects poison.
     *
     * @param {number} value - The poison value.
     * @returns {void}
     */
    collectPoison(value = 1) {
        this.poison += value;
        this.totalPoisonCollected += value;
        this.limitPoison();
    }


    /**
     * Limits poison amount.
     *
     * @returns {void}
     */
    limitPoison() {
        if (this.poison > 5) {
            this.poison = 5;
        }
    }


    /**
     * Checks whether Sharky can attack.
     *
     * @returns {boolean} Whether Sharky can attack.
     */
    canAttack() {
        return Date.now() - this.lastAttack > 650 && !this.isDead;
    }


    /**
     * Starts an attack.
     *
     * @param {string} type - The attack type.
     * @returns {void}
     */
    startAttack(type) {
        this.setAttackStartValues(type);

        if (type === 'bubble') this.initBubbleAttack();
        if (type === 'fin') this.initFinAttack();
    }


    /**
     * Sets general attack start values.
     *
     * @param {string} type - The attack type.
     * @returns {void}
     */
    setAttackStartValues(type) {
        this.attackType = type;
        this.attackStartedAt = Date.now();
        this.lastAttack = Date.now();
        this.currentAttackId = (this.currentAttackId || 0) + 1;
        this.bubbleSpawned = false;
    }


    /**
     * Initializes bubble attack.
     *
     * @returns {void}
     */
    initBubbleAttack() {
        this.isPoisonBubbleAttack = this.poison >= 5;
        this.attackDuration = 750;
        this.setBubbleAnimation();
    }


    /**
     * Sets bubble attack animation.
     *
     * @returns {void}
     */
    setBubbleAnimation() {
        if (this.isPoisonBubbleAttack) {
            this.setAnimation('poisonBubbleAttack');
            return;
        }

        this.setAnimation('bubbleAttack');
    }


    /**
     * Initializes fin attack.
     *
     * @returns {void}
     */
    initFinAttack() {
        this.isPoisonBubbleAttack = false;
        this.attackDuration = 900;
        this.setAnimation('finSlap');
    }


    /**
     * Checks whether Sharky is attacking.
     *
     * @returns {boolean} Whether Sharky is attacking.
     */
    isAttacking() {
        return this.attackType &&
            Date.now() - this.attackStartedAt < this.attackDuration;
    }


    /**
     * Draws attack animation.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    attack(ctx) {
        this.animateAttack();
        super.drawImg(ctx);
        this.clearFinishedAttack();
    }


    /**
     * Animates current attack.
     *
     * @returns {void}
     */
    animateAttack() {
        if (this.attackType === 'bubble') {
            this.animateBubbleAttack();
            return;
        }

        this.animateFinAttack();
    }


    /**
     * Animates bubble attack.
     *
     * @returns {void}
     */
    animateBubbleAttack() {
        if (this.isPoisonBubbleAttack) {
            this.animatePoisonBubbleAttack();
            return;
        }

        this.animateNormalBubbleAttack();
    }


    /**
     * Animates poison bubble attack.
     *
     * @returns {void}
     */
    animatePoisonBubbleAttack() {
        this.setAnimation('poisonBubbleAttack');
        this.animateCharacters(SHARKY_POISON_BUBBLE_ATTACK);
    }


    /**
     * Animates normal bubble attack.
     *
     * @returns {void}
     */
    animateNormalBubbleAttack() {
        this.setAnimation('bubbleAttack');
        this.animateCharacters(SHARKY_BUBBLE_ATTACK);
    }


    /**
     * Animates fin attack.
     *
     * @returns {void}
     */
    animateFinAttack() {
        if (this.attackType !== 'fin') return;

        this.setAnimation('finSlap');
        this.animateCharacters(SHARKY_FIN_SLAP);
    }


    /**
     * Clears attack if finished.
     *
     * @returns {void}
     */
    clearFinishedAttack() {
        if (this.isAttacking()) return;

        this.attackType = null;
        this.isPoisonBubbleAttack = false;
    }


    /**
     * Checks whether fin hit can apply.
     *
     * @returns {boolean} Whether fin hit can apply.
     */
    canApplyFinHit() {
        if (this.attackType !== 'fin') return false;

        const attackTime = Date.now() - this.attackStartedAt;

        return attackTime >= 450 && attackTime <= 820;
    }


    /**
     * Checks whether a bubble can spawn.
     *
     * @returns {boolean} Whether a bubble can spawn.
     */
    canSpawnBubble() {
        if (this.attackType !== 'bubble') return false;

        const attackTime = Date.now() - this.attackStartedAt;

        return attackTime >= 600;
    }


    /**
     * Checks whether Sharky is hurt.
     *
     * @returns {boolean} Whether Sharky is hurt.
     */
    isHurt() {
        return Date.now() - this.lastHit < 450;
    }


    /**
     * Returns Sharky's attack box.
     *
     * @param {number} camera_x - The camera position.
     * @returns {Object} The attack box.
     */
    getAttackBox(camera_x = 0) {
        const hitbox = this.getHitbox(camera_x);
        const attackData = this.getAttackBoxData(hitbox);

        return this.createAttackBox(hitbox, attackData);
    }


    /**
     * Returns attack box data.
     *
     * @param {Object} hitbox - Sharky's hitbox.
     * @returns {Object} The attack box data.
     */
    getAttackBoxData(hitbox) {
        return {
            range: this.attackType === 'bubble' ? this.w * 2.15 : 190,
            heightOffset: this.attackType === 'bubble' ? 10 : 5,
            height: hitbox.h
        };
    }


    /**
     * Creates the attack box.
     *
     * @param {Object} hitbox - Sharky's hitbox.
     * @param {Object} attackData - The attack box data.
     * @returns {Object} The attack box.
     */
    createAttackBox(hitbox, attackData) {
        if (this.otherDirection) {
            return this.createLeftAttackBox(hitbox, attackData);
        }

        return this.createRightAttackBox(hitbox, attackData);
    }


    /**
     * Creates left attack box.
     *
     * @param {Object} hitbox - Sharky's hitbox.
     * @param {Object} attackData - The attack box data.
     * @returns {Object} The attack box.
     */
    createLeftAttackBox(hitbox, attackData) {
        return {
            x: hitbox.x - attackData.range,
            y: hitbox.y + attackData.heightOffset,
            w: attackData.range,
            h: attackData.height - attackData.heightOffset * 2
        };
    }


    /**
     * Creates right attack box.
     *
     * @param {Object} hitbox - Sharky's hitbox.
     * @param {Object} attackData - The attack box data.
     * @returns {Object} The attack box.
     */
    createRightAttackBox(hitbox, attackData) {
        return {
            x: hitbox.x + hitbox.w,
            y: hitbox.y + attackData.heightOffset,
            w: attackData.range,
            h: attackData.height - attackData.heightOffset * 2
        };
    }
}