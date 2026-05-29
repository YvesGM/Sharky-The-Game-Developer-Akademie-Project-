import { BOSS_FLOATING, BOSS_HURT, BOSS_DEAD, BOSS_INTRO, BOSS_ATTACK } from "../../../../storage/characters/enemies/boss.storage.js";
import MovableObjectsClass from "../../../world/movable-objects.class.js";

export default class BossClass extends MovableObjectsClass {

    constructor(x, y, w, h, speed, imgPath) {
        super(x, y, w, h, speed, imgPath);

        this.health = 100;
        this.maxHealth = 100;
        this.damage = 25;

        this.bossState = 'sleeping';

        this.isHurt = false;
        this.hurtStartedAt = 0;
        this.hurtDuration = 450;

        this.isAttacking = false;
        this.attackStartedAt = 0;
        this.attackDuration = 900;
        this.lastAttack = 0;
        this.attackCooldown = 2200;

        this.introDone = false;
        this.introFinished = false;

        this.spawnX = x;
        this.spawnY = y;

        this.minX = x - 260;
        this.maxX = x + 260;
        this.minY = y - 120;
        this.maxY = y + 120;

        this.targetX = x;
        this.targetY = y;
        this.nextTargetAt = 0;

        this.fightStartX = x - 1100;

        this.offset = {
            top: 220,
            right: 70,
            bottom: 110,
            left: 40
        };

        this.loadImgStorage();
    }

    draw(ctx, sharky, camera_x) {
        this.updateState(sharky, camera_x);

        if (this.bossState === 'sleeping') {
            return;
        }

        if (this.bossState === 'fighting') {
            this.moveRandom();
            this.tryAttack(sharky, camera_x);
        }

        this.animateBoss();
        super.drawImg(ctx);
    }

    updateState(sharky, camera_x) {
        if (this.isDead) {
            this.bossState = 'dead';
            return;
        }

        if (!sharky) return;

        let sharkyWorldX = sharky.x + camera_x;

        if (this.bossState === 'sleeping' && sharkyWorldX >= this.fightStartX) {
            this.startIntro();
            return;
        }

        if (this.bossState === 'intro' && this.introFinished) {
            this.bossState = 'fighting';
            this.currentImg = 0;
            this.lastFrameTime = null;
        }
    }

    startIntro() {
        this.bossState = 'intro';
        this.introFinished = false;
        this.currentImg = 0;
        this.lastFrameTime = null;

        let firstIntroImg = this.imageCache[BOSS_INTRO[0]];

        if (firstIntroImg) {
            this.img = firstIntroImg;
        }
    }

    moveRandom() {
        let now = Date.now();

        if (now > this.nextTargetAt) {
            this.targetX = this.randomBetween(this.minX, this.maxX);
            this.targetY = this.randomBetween(this.minY, this.maxY);
            this.nextTargetAt = now + this.randomBetween(900, 1800);
        }

        this.x += (this.targetX - this.x) * 0.015;
        this.y += (this.targetY - this.y) * 0.015;

        this.otherDirection = this.targetX > this.x;
    }

    tryAttack(sharky, camera_x) {
        if (!sharky) return;
        if (this.isHurt) return;

        let now = Date.now();

        if (now - this.lastAttack < this.attackCooldown) return;

        let sharkyWorldX = sharky.x + camera_x;
        let distanceX = Math.abs((this.x + this.w / 2) - (sharkyWorldX + sharky.w / 2));
        let distanceY = Math.abs((this.y + this.h / 2) - (sharky.y + sharky.h / 2));

        if (distanceX < 650 && distanceY < 350) {
            this.startAttack();
        }
    }

    startAttack() {
        this.isAttacking = true;
        this.attackStartedAt = Date.now();
        this.lastAttack = Date.now();
        this.currentImg = 0;
        this.lastFrameTime = null;
    }

    hit(damage = 10) {
        if (this.isDead) return;
        if (this.bossState === 'sleeping' || this.bossState === 'intro') return;

        this.health -= damage;
        this.isHurt = true;
        this.hurtStartedAt = Date.now();
        this.isAttacking = false;
        this.currentImg = 0;
        this.lastFrameTime = null;

        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            this.bossState = 'dead';
            this.currentImg = 0;
            this.lastFrameTime = null;
            this.deathFrame = 0;
            this.lastDeathFrameTime = 0;
        }
    }

    animateBoss() {
        if (this.bossState === 'dead') {
            this.animateDeath(BOSS_DEAD);
            return;
        }

        if (this.bossState === 'intro') {
            this.animateOnce(BOSS_INTRO, 'introFinished');
            return;
        }

        if (this.isHurt && Date.now() - this.hurtStartedAt < this.hurtDuration) {
            this.animateCharacters(BOSS_HURT);
            return;
        }

        this.isHurt = false;

        if (this.isAttacking) {
            this.animateCharacters(BOSS_ATTACK);

            if (Date.now() - this.attackStartedAt > this.attackDuration) {
                this.isAttacking = false;
                this.currentImg = 0;
                this.lastFrameTime = null;
            }

            return;
        }

        this.animateCharacters(BOSS_FLOATING);
    }

    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    loadImgStorage() {
        this.drawFrames(BOSS_FLOATING);
        this.drawFrames(BOSS_HURT);
        this.drawFrames(BOSS_DEAD);
        this.drawFrames(BOSS_INTRO);
        this.drawFrames(BOSS_ATTACK);
    }

    canApplyAttackHit() {
        if (!this.isAttacking) return false;

        let attackTime = Date.now() - this.attackStartedAt;

        return attackTime >= 450 && attackTime <= 750;
    }
}