import {
    BOSS_FLOATING,
    BOSS_HURT,
    BOSS_DEAD,
    BOSS_INTRO,
    BOSS_ATTACK
} from "../../../../storage/characters/enemies/boss.storage.js";
import MovableObjectsClass from "../../../world/movable-objects.class.js";

export default class BossClass extends MovableObjectsClass {

    /**
     * Creates the boss enemy.
     *
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - The width.
     * @param {number} h - The height.
     * @param {number} speed - The speed.
     * @param {string} imgPath - The image path.
     */
    constructor(x, y, w, h, speed, imgPath) {
        super(x, y, w, h, speed, imgPath);
        this.initBossStats();
        this.initBossStates();
        this.initBossMovement(x, y);
        this.initBossOffset();
        this.loadImgStorage();
    }


    /**
     * Initializes boss health and damage.
     *
     * @returns {void}
     */
    initBossStats() {
        this.health = 100;
        this.maxHealth = 100;
        this.damage = 25;
    }


    /**
     * Initializes boss state values.
     *
     * @returns {void}
     */
    initBossStates() {
        this.bossState = 'sleeping';
        this.isHurt = false;
        this.hurtStartedAt = 0;
        this.hurtDuration = 450;
        this.isAttacking = false;
        this.initAttackValues();
        this.initIntroValues();
    }


    /**
     * Initializes boss attack values.
     *
     * @returns {void}
     */
    initAttackValues() {
        this.attackStartedAt = 0;
        this.attackDuration = 900;
        this.lastAttack = 0;
        this.attackCooldown = 2200;
    }


    /**
     * Initializes intro values.
     *
     * @returns {void}
     */
    initIntroValues() {
        this.introDone = false;
        this.introFinished = false;
    }


    /**
     * Initializes boss movement values.
     *
     * @param {number} x - The spawn x position.
     * @param {number} y - The spawn y position.
     * @returns {void}
     */
    initBossMovement(x, y) {
        this.spawnX = x;
        this.spawnY = y;
        this.initBossRange(x, y);
        this.targetX = x;
        this.targetY = y;
        this.nextTargetAt = 0;
        this.fightStartX = x - 1100;
    }


    /**
     * Initializes boss movement range.
     *
     * @param {number} x - The spawn x position.
     * @param {number} y - The spawn y position.
     * @returns {void}
     */
    initBossRange(x, y) {
        this.minX = x - 260;
        this.maxX = x + 260;
        this.minY = y - 120;
        this.maxY = y + 120;
    }


    /**
     * Initializes boss offset.
     *
     * @returns {void}
     */
    initBossOffset() {
        this.offset = {
            top: 220,
            right: 70,
            bottom: 110,
            left: 40
        };
    }


    /**
     * Draws and updates the boss.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {Object} sharky - The Sharky object.
     * @param {number} camera_x - The camera position.
     * @returns {void}
     */
    draw(ctx, sharky, camera_x) {
        this.updateState(sharky, camera_x);

        if (this.bossState === 'sleeping') return;

        this.updateFightState(sharky, camera_x);
        this.animateBoss();
        super.drawImg(ctx);
    }


    /**
     * Updates fighting logic.
     *
     * @param {Object} sharky - The Sharky object.
     * @param {number} camera_x - The camera position.
     * @returns {void}
     */
    updateFightState(sharky, camera_x) {
        if (this.bossState !== 'fighting') return;

        this.moveRandom();
        this.tryAttack(sharky, camera_x);
    }


    /**
     * Updates boss state.
     *
     * @param {Object} sharky - The Sharky object.
     * @param {number} camera_x - The camera position.
     * @returns {void}
     */
    updateState(sharky, camera_x) {
        if (this.setDeadState()) return;
        if (!sharky) return;

        this.checkIntroStart(sharky, camera_x);
        this.checkIntroFinished();
    }


    /**
     * Sets dead state if boss is dead.
     *
     * @returns {boolean} Whether boss is dead.
     */
    setDeadState() {
        if (!this.isDead) return false;

        this.bossState = 'dead';
        return true;
    }


    /**
     * Checks whether the intro should start.
     *
     * @param {Object} sharky - The Sharky object.
     * @param {number} camera_x - The camera position.
     * @returns {void}
     */
    checkIntroStart(sharky, camera_x) {
        const sharkyWorldX = sharky.x + camera_x;

        if (this.bossState === 'sleeping' && sharkyWorldX >= this.fightStartX) {
            this.startIntro();
        }
    }


    /**
     * Checks whether the intro is finished.
     *
     * @returns {void}
     */
    checkIntroFinished() {
        if (this.bossState !== 'intro' || !this.introFinished) return;

        this.bossState = 'fighting';
        this.resetAnimation();
    }


    /**
     * Starts the boss intro.
     *
     * @returns {void}
     */
    startIntro() {
        this.bossState = 'intro';
        this.introFinished = false;
        this.resetAnimation();
        this.setFirstIntroImage();
    }


    /**
     * Sets the first intro image.
     *
     * @returns {void}
     */
    setFirstIntroImage() {
        const firstIntroImg = this.imageCache[BOSS_INTRO[0]];

        if (firstIntroImg) {
            this.img = firstIntroImg;
        }
    }


    /**
     * Moves the boss randomly.
     *
     * @returns {void}
     */
    moveRandom() {
        this.updateRandomTarget();
        this.moveToTarget();
        this.otherDirection = this.targetX > this.x;
    }


    /**
     * Updates the random target.
     *
     * @returns {void}
     */
    updateRandomTarget() {
        const now = Date.now();

        if (now <= this.nextTargetAt) return;

        this.targetX = this.randomBetween(this.minX, this.maxX);
        this.targetY = this.randomBetween(this.minY, this.maxY);
        this.nextTargetAt = now + this.randomBetween(900, 1800);
    }


    /**
     * Moves towards the target.
     *
     * @returns {void}
     */
    moveToTarget() {
        this.x += (this.targetX - this.x) * 0.015;
        this.y += (this.targetY - this.y) * 0.015;
    }


    /**
     * Tries to start an attack.
     *
     * @param {Object} sharky - The Sharky object.
     * @param {number} camera_x - The camera position.
     * @returns {void}
     */
    tryAttack(sharky, camera_x) {
        if (!this.canTryAttack(sharky)) return;
        if (!this.isSharkyInAttackRange(sharky, camera_x)) return;

        this.startAttack();
    }


    /**
     * Checks whether boss can try an attack.
     *
     * @param {Object} sharky - The Sharky object.
     * @returns {boolean} Whether boss can try attack.
     */
    canTryAttack(sharky) {
        if (!sharky) return false;
        if (this.isHurt) return false;

        return Date.now() - this.lastAttack >= this.attackCooldown;
    }


    /**
     * Checks whether Sharky is in attack range.
     *
     * @param {Object} sharky - The Sharky object.
     * @param {number} camera_x - The camera position.
     * @returns {boolean} Whether Sharky is in range.
     */
    isSharkyInAttackRange(sharky, camera_x) {
        const distance = this.getSharkyDistance(sharky, camera_x);

        return distance.x < 650 && distance.y < 350;
    }


    /**
     * Returns the distance to Sharky.
     *
     * @param {Object} sharky - The Sharky object.
     * @param {number} camera_x - The camera position.
     * @returns {Object} The distance values.
     */
    getSharkyDistance(sharky, camera_x) {
        const sharkyWorldX = sharky.x + camera_x;

        return {
            x: Math.abs((this.x + this.w / 2) - (sharkyWorldX + sharky.w / 2)),
            y: Math.abs((this.y + this.h / 2) - (sharky.y + sharky.h / 2))
        };
    }


    /**
     * Starts an attack.
     *
     * @returns {void}
     */
    startAttack() {
        this.isAttacking = true;
        this.attackStartedAt = Date.now();
        this.lastAttack = Date.now();
        this.resetAnimation();
    }


    /**
     * Applies damage to the boss.
     *
     * @param {number} damage - The damage value.
     * @returns {void}
     */
    hit(damage = 10) {
        if (!this.canReceiveDamage()) return;

        this.health -= damage;
        this.startHurtState();
        this.checkDeathAfterHit();
    }


    /**
     * Checks whether boss can receive damage.
     *
     * @returns {boolean} Whether boss can receive damage.
     */
    canReceiveDamage() {
        if (this.isDead) return false;

        return this.bossState !== 'sleeping' && this.bossState !== 'intro';
    }


    /**
     * Starts hurt state.
     *
     * @returns {void}
     */
    startHurtState() {
        this.isHurt = true;
        this.hurtStartedAt = Date.now();
        this.isAttacking = false;
        this.resetAnimation();
    }


    /**
     * Checks death after hit.
     *
     * @returns {void}
     */
    checkDeathAfterHit() {
        if (this.health > 0) return;

        this.health = 0;
        this.isDead = true;
        this.bossState = 'dead';
        this.resetDeathState();
    }


    /**
     * Resets death state values.
     *
     * @returns {void}
     */
    resetDeathState() {
        this.resetAnimation();
        this.deathFrame = 0;
        this.lastDeathFrameTime = 0;
    }


    /**
     * Animates the boss.
     *
     * @returns {void}
     */
    animateBoss() {
        if (this.animateDeadState()) return;
        if (this.animateIntroState()) return;
        if (this.animateHurtState()) return;
        if (this.animateAttackState()) return;

        this.animateCharacters(BOSS_FLOATING);
    }


    /**
     * Animates dead state.
     *
     * @returns {boolean} Whether this state was animated.
     */
    animateDeadState() {
        if (this.bossState !== 'dead') return false;

        this.animateDeath(BOSS_DEAD);
        return true;
    }


    /**
     * Animates intro state.
     *
     * @returns {boolean} Whether this state was animated.
     */
    animateIntroState() {
        if (this.bossState !== 'intro') return false;

        this.animateOnce(BOSS_INTRO, 'introFinished');
        return true;
    }


    /**
     * Animates hurt state.
     *
     * @returns {boolean} Whether this state was animated.
     */
    animateHurtState() {
        if (!this.isHurt || !this.isHurtActive()) return false;

        this.animateCharacters(BOSS_HURT);
        return true;
    }


    /**
     * Checks whether hurt state is active.
     *
     * @returns {boolean} Whether hurt state is active.
     */
    isHurtActive() {
        return Date.now() - this.hurtStartedAt < this.hurtDuration;
    }


    /**
     * Animates attack state.
     *
     * @returns {boolean} Whether this state was animated.
     */
    animateAttackState() {
        this.isHurt = false;

        if (!this.isAttacking) return false;

        this.animateCharacters(BOSS_ATTACK);
        this.finishAttackIfNeeded();
        return true;
    }


    /**
     * Finishes attack when duration is over.
     *
     * @returns {void}
     */
    finishAttackIfNeeded() {
        if (Date.now() - this.attackStartedAt <= this.attackDuration) return;

        this.isAttacking = false;
        this.resetAnimation();
    }


    /**
     * Resets animation values.
     *
     * @returns {void}
     */
    resetAnimation() {
        this.currentImg = 0;
        this.lastFrameTime = null;
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


    /**
     * Loads all image storages.
     *
     * @returns {void}
     */
    loadImgStorage() {
        this.drawFrames(BOSS_FLOATING);
        this.drawFrames(BOSS_HURT);
        this.drawFrames(BOSS_DEAD);
        this.drawFrames(BOSS_INTRO);
        this.drawFrames(BOSS_ATTACK);
    }


    /**
     * Checks whether attack damage can be applied.
     *
     * @returns {boolean} Whether attack hit can apply.
     */
    canApplyAttackHit() {
        if (!this.isAttacking) return false;

        const attackTime = Date.now() - this.attackStartedAt;

        return attackTime >= 450 && attackTime <= 750;
    }
}