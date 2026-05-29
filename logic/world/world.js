import Background from "./background/background.js";
import Entities from "./entities/entities.js";
import Collectibles from "./entities/collectibles.js";
import Enemies from "./characters/enemies.js";
import Sharky from "./characters/sharky.js";
import Bubble from "../../lib/classes/entities/bubble.class.js";
import Keyboard from "../../lib/classes/keyboard/keyboard.class.js";
import HUD from "./hud/hud.js";

import { SHARKY } from "../../lib/configs/characters/sharky.configs.js";
import { ENEMIES } from "../../lib/configs/characters/enemy.configs.js";
import { ENTITIES } from "../../lib/configs/entities/entity.configs.js";
import { COINS, POISONS } from "../../lib/configs/entities/collectibles.configs.js";
import { BUBBLES, BUBBLE_IMAGES, POISON_BUBBLE_IMAGES } from "../../lib/configs/entities/bubble.configs.js";
import { AUDIO_MANAGER } from "../../lib/configs/audio/audio.configs.js";

let camera_x = 0;
let debugHitboxes = false;
let bossIntroSoundPlayed = false;

const gameState = {
    status: 'running',
    message: '',
    endEventDispatched: false,
    startedAt: Date.now(),
    endedAt: null,

    /**
     * Returns the current Sharky instance.
     *
     * @returns {Object} The active Sharky object.
     */
    getSharky() {
        return SHARKY[0];
    },

    /**
     * Checks whether Sharky is blocked by an entity.
     *
     * @param {Object} sharky - The active Sharky object.
     * @param {number} camera - The current camera position.
     * @returns {boolean} Whether Sharky is blocked.
     */
    isBlocked(sharky, camera) {
        return ENTITIES.some(entity => sharky.isColliding(entity, camera));
    },

    /**
     * Checks all enemy collisions.
     *
     * @returns {void}
     */
    checkCollisions() {
        checkGameCollisions();
    },

    /**
     * Checks all collectible collisions.
     *
     * @returns {void}
     */
    checkCollectibles() {
        checkGameCollectibles();
    },

    /**
     * Checks all active attacks.
     *
     * @returns {void}
     */
    checkAttacks() {
        checkGameAttacks();
    },

    /**
     * Checks the current game status.
     *
     * @returns {void}
     */
    checkStatus() {
        checkGameStatus();
    },

    /**
     * Spawns a bubble attack.
     *
     * @returns {void}
     */
    spawnBubble() {
        spawnGameBubble();
    },

    /**
     * Updates all active bubbles.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @returns {void}
     */
    updateBubbles(ctx) {
        updateGameBubbles(ctx);
    },

    /**
     * Finishes the game and dispatches the final event.
     *
     * @param {string} eventName - The event name to dispatch.
     * @returns {void}
     */
    finishGame(eventName) {
        finishCurrentGame(eventName);
    },

    /**
     * Returns the final game score.
     *
     * @returns {Object} The score values.
     */
    getScore() {
        return getCurrentScore();
    },

    /**
     * Formats seconds into a minute string.
     *
     * @param {number} seconds - The time in seconds.
     * @returns {string} The formatted time.
     */
    formatTime(seconds) {
        return formatGameTime(seconds);
    },

    /**
     * Restarts the game.
     *
     * @returns {void}
     */
    restart() {
        window.location.reload();
    }
};


/**
 * Initializes the canvas and starts the game loop.
 *
 * @returns {void}
 */
export default function loadCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    setCanvasResolution(canvas, ctx);
    loadWorld(ctx, canvas);
}


/**
 * Sets the canvas resolution based on the device pixel ratio.
 *
 * @param {HTMLCanvasElement} canvas - The game canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function setCanvasResolution(canvas, ctx) {
    const ctxResolution = window.devicePixelRatio;

    canvas.width = 1920 * ctxResolution;
    canvas.height = 1080 * ctxResolution;
    ctx.scale(ctxResolution, ctxResolution);
}


/**
 * Runs one frame of the game loop.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {HTMLCanvasElement} canvas - The game canvas.
 * @returns {void}
 */
function loadWorld(ctx, canvas) {
    clearCanvas(ctx, canvas);

    if (handleRestartKey()) return;

    updateRunningGame();
    drawGameWorld(ctx);
    updateGameCamera(ctx);
    drawGameOverlay(ctx);
    requestAnimationFrame(() => loadWorld(ctx, canvas));
}


/**
 * Clears the current canvas frame.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {HTMLCanvasElement} canvas - The game canvas.
 * @returns {void}
 */
function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


/**
 * Handles restart input from the keyboard.
 *
 * @returns {boolean} Whether the game was restarted.
 */
function handleRestartKey() {
    if (!Keyboard.RESTART) return false;

    gameState.restart();
    return true;
}


/**
 * Updates game logic while the game is running.
 *
 * @returns {void}
 */
function updateRunningGame() {
    if (gameState.status !== 'running') return;

    checkBossIntroSound();

    gameState.checkCollectibles();
    gameState.checkCollisions();
    gameState.checkAttacks();
    gameState.checkStatus();
}

/**
 * Plays the boss intro sound once when the boss intro starts.
 *
 * @returns {void}
 */
function checkBossIntroSound() {
    const boss = ENEMIES.find(enemy => enemy.health !== undefined);

    if (!boss) return;
    if (bossIntroSoundPlayed) return;

    if (isBossIntroActive(boss)) {
        AUDIO_MANAGER.play("bossIntro");
        bossIntroSoundPlayed = true;
    }
}

/**
 * Checks whether the boss intro is currently active.
 *
 * @param {Object} boss - The boss enemy object.
 * @returns {boolean} Whether the boss intro is active.
 */
function isBossIntroActive(boss) {
    return boss.bossState === 'intro' ||
        boss.bossState === 'appearing' ||
        boss.bossState === 'fighting';
}


/**
 * Draws all translated world elements.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawGameWorld(ctx) {
    ctx.save();
    ctx.translate(-camera_x, 0);
    drawTranslatedWorld(ctx);
    ctx.restore();
}


/**
 * Draws all world objects inside the camera translation.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawTranslatedWorld(ctx) {
    Background(ctx);
    Entities(ctx);
    Collectibles(ctx);
    Enemies(ctx, gameState.getSharky(), camera_x);
    gameState.updateBubbles(ctx);

    drawDebugWorldIfEnabled(ctx);
}


/**
 * Updates the camera based on Sharky's position.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function updateGameCamera(ctx) {
    camera_x = Sharky(ctx, camera_x, gameState);
}


/**
 * Draws all fixed overlay elements.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawGameOverlay(ctx) {
    drawDebugSharkyIfEnabled(ctx);
    HUD(ctx);
    drawBossHud(ctx);
}


/**
 * Draws world hitboxes when debug mode is enabled.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawDebugWorldIfEnabled(ctx) {
    if (debugHitboxes) {
        drawWorldHitboxes(ctx);
    }
}


/**
 * Draws Sharky's hitbox when debug mode is enabled.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawDebugSharkyIfEnabled(ctx) {
    if (debugHitboxes) {
        drawSharkyHitbox(ctx);
    }
}


/**
 * Checks all collisions between Sharky and enemies.
 *
 * @returns {void}
 */
function checkGameCollisions() {
    const sharky = gameState.getSharky();

    ENEMIES.forEach(enemy => {
        checkSingleEnemyCollision(sharky, enemy);
    });
}


/**
 * Checks one enemy collision with Sharky.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function checkSingleEnemyCollision(sharky, enemy) {
    if (enemy.isDead) return;
    if (!sharky.isColliding(enemy, camera_x)) return;

    handleEnemyCollision(sharky, enemy);
}


/**
 * Handles one active enemy collision.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function handleEnemyCollision(sharky, enemy) {
    if (isBossEnemy(enemy)) {
        handleBossCollision(sharky, enemy);
        return;
    }

    handleNormalEnemyCollision(sharky, enemy);
}


/**
 * Handles a collision with the boss enemy.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The boss enemy object.
 * @returns {void}
 */
function handleBossCollision(sharky, enemy) {
    if (enemy.bossState !== 'fighting') return;

    if (enemy.canApplyAttackHit && enemy.canApplyAttackHit()) {
        sharky.hit(enemy.damage || 25, enemy);
        AUDIO_MANAGER.play("hurt");
    }
}


/**
 * Handles a collision with a normal enemy.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function handleNormalEnemyCollision(sharky, enemy) {
    if (canSkipJellyfishFinCollision(sharky, enemy)) return;

    const now = Date.now();

    if (!sharky.canReceiveHit(now)) return;

    if (enemy.enemyType === 'jellyfish') {
        AUDIO_MANAGER.play("shock");
        enemy.startSuperDangerous();
        sharky.hit(enemy.damage || 15, enemy);
        return;
    }

    AUDIO_MANAGER.play("hurt");
    sharky.hit(enemy.damage || 15, enemy);
}

/**
 * Plays the matching enemy collision sound.
 *
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function playEnemyCollisionSound(enemy) {
    if (enemy.enemyType === 'jellyfish') {
        AUDIO_MANAGER.play("shock");
        return;
    }

    AUDIO_MANAGER.play("hurt");
}


/**
 * Checks whether a jellyfish fin collision should be skipped.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The enemy object.
 * @returns {boolean} Whether the collision should be skipped.
 */
function canSkipJellyfishFinCollision(sharky, enemy) {
    return enemy.enemyType === 'jellyfish' &&
        sharky.attackType === 'fin' &&
        sharky.isAttacking();
}


/**
 * Starts the dangerous jellyfish state when needed.
 *
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function startJellyfishDanger(enemy) {
    if (enemy.enemyType === 'jellyfish') {
        enemy.startSuperDangerous();
    }
}


/**
 * Checks all collectible collisions.
 *
 * @returns {void}
 */
function checkGameCollectibles() {
    const sharky = gameState.getSharky();

    COINS.forEach(coin => collectItem(sharky, coin, 'collectCoin'));
    POISONS.forEach(poison => collectItem(sharky, poison, 'collectPoison'));
}


/**
 * Collects one collectible item.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} item - The collectible item.
 * @param {string} collectMethod - The Sharky collect method.
 * @returns {void}
 */
function collectItem(sharky, item, collectMethod) {
    if (item.isCollected) return;
    if (!sharky.isColliding(item, camera_x)) return;

    item.isCollected = true;
    sharky[collectMethod](item.value);

    playCollectSound(collectMethod);
}

/**
 * Plays the matching collectible sound.
 *
 * @param {string} collectMethod - The Sharky collect method.
 * @returns {void}
 */
function playCollectSound(collectMethod) {
    if (collectMethod === 'collectCoin') {
        AUDIO_MANAGER.play("coin");
        return;
    }

    if (collectMethod === 'collectPoison') {
        AUDIO_MANAGER.play("bottle");
    }
}


/**
 * Checks all current Sharky attacks.
 *
 * @returns {void}
 */
function checkGameAttacks() {
    const sharky = gameState.getSharky();

    if (!sharky.isAttacking()) return;

    spawnBubbleAttackIfReady(sharky);
    ENEMIES.forEach(enemy => checkEnemyAttackHit(sharky, enemy));
}


/**
 * Spawns a bubble attack when Sharky is allowed to.
 *
 * @param {Object} sharky - The active Sharky object.
 * @returns {void}
 */
function spawnBubbleAttackIfReady(sharky) {
    if (sharky.attackType === 'bubble' && sharky.canSpawnBubble()) {
        gameState.spawnBubble();
    }
}


/**
 * Checks whether one enemy is hit by Sharky's attack.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function checkEnemyAttackHit(sharky, enemy) {
    if (enemy.isDead) return;
    if (!isEnemyHitByAttack(sharky, enemy)) return;

    handleEnemyAttackHit(sharky, enemy);
}


/**
 * Checks if Sharky's attack box hits an enemy.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The enemy object.
 * @returns {boolean} Whether the enemy is hit.
 */
function isEnemyHitByAttack(sharky, enemy) {
    const attackBox = sharky.getAttackBox(camera_x);
    const enemyBox = enemy.getHitbox();

    return isBoxColliding(attackBox, enemyBox);
}


/**
 * Checks collision between two boxes.
 *
 * @param {Object} firstBox - The first hitbox.
 * @param {Object} secondBox - The second hitbox.
 * @returns {boolean} Whether both boxes overlap.
 */
function isBoxColliding(firstBox, secondBox) {
    return firstBox.x + firstBox.w > secondBox.x &&
        firstBox.x < secondBox.x + secondBox.w &&
        firstBox.y + firstBox.h > secondBox.y &&
        firstBox.y < secondBox.y + secondBox.h;
}


/**
 * Handles a successful attack hit on an enemy.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function handleEnemyAttackHit(sharky, enemy) {
    if (isBossEnemy(enemy)) {
        handleBossAttackHit(sharky, enemy);
        return;
    }

    handleNormalAttackHit(sharky, enemy);
}


/**
 * Handles an attack hit against the boss.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The boss enemy object.
 * @returns {void}
 */
function handleBossAttackHit(sharky, enemy) {
    if (sharky.attackType !== 'fin') return;
    if (!canApplyCurrentFinHit(sharky, enemy)) return;

    enemy.lastHitAttackId = sharky.currentAttackId;
    enemy.hit(12);

    AUDIO_MANAGER.play("bossHit");
}


/**
 * Handles an attack hit against a normal enemy.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function handleNormalAttackHit(sharky, enemy) {
    if (enemy.enemyType === 'jellyfish') {
        handleJellyfishAttackHit(sharky, enemy);
        return;
    }

    handleFinEnemyKill(sharky, enemy);
}


/**
 * Handles an attack hit against a jellyfish.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The jellyfish enemy object.
 * @returns {void}
 */
function handleJellyfishAttackHit(sharky, enemy) {
    if (sharky.attackType === 'fin') {
        handleJellyfishFinHit(sharky, enemy);
        return;
    }

    if (sharky.attackType === 'bubble') return;
}


/**
 * Handles a fin hit against a jellyfish.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The jellyfish enemy object.
 * @returns {void}
 */
function handleJellyfishFinHit(sharky, enemy) {
    if (!canApplyCurrentFinHit(sharky, enemy)) return;

    enemy.lastHitAttackId = sharky.currentAttackId;
    enemy.startSuperDangerous();

    AUDIO_MANAGER.play("shock");

    sharky.scheduleShockDamage(enemy.damage || 15, enemy, 350);
}


/**
 * Handles killing a normal enemy with a fin attack.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function handleFinEnemyKill(sharky, enemy) {
    if (sharky.attackType !== 'fin') return;
    if (!canApplyCurrentFinHit(sharky, enemy)) return;

    enemy.lastHitAttackId = sharky.currentAttackId;
    enemy.die();

    AUDIO_MANAGER.play("enemyDead");
}


/**
 * Checks whether the current fin attack can hit an enemy.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} enemy - The enemy object.
 * @returns {boolean} Whether the attack can be applied.
 */
function canApplyCurrentFinHit(sharky, enemy) {
    if (!sharky.canApplyFinHit()) return false;

    return enemy.lastHitAttackId !== sharky.currentAttackId;
}


/**
 * Checks whether an enemy is a boss enemy.
 *
 * @param {Object} enemy - The enemy object.
 * @returns {boolean} Whether the enemy is a boss.
 */
function isBossEnemy(enemy) {
    return enemy.health !== undefined;
}


/**
 * Checks the current win or lose status.
 *
 * @returns {void}
 */
function checkGameStatus() {
    const sharky = gameState.getSharky();
    const boss = ENEMIES.find(enemy => enemy.health !== undefined);

    if (handleSharkyDeath(sharky)) return;
    if (handleBossDeath(boss)) return;

    setRunningStatus();
}


/**
 * Handles Sharky's death state.
 *
 * @param {Object} sharky - The active Sharky object.
 * @returns {boolean} Whether Sharky is dead.
 */
function handleSharkyDeath(sharky) {
    if (!sharky.isDead) return false;

    setFinishedStatus('gameOver', 'Game Over - Press R to Restart');

    AUDIO_MANAGER.stopAllMusic();
    AUDIO_MANAGER.play("gameOver");

    gameState.finishGame('sharkyGameOver');
    return true;
}


/**
 * Handles the boss death state.
 *
 * @param {Object} boss - The boss enemy object.
 * @returns {boolean} Whether the boss is dead.
 */
function handleBossDeath(boss) {
    if (!boss || !boss.isDead) return false;

    setFinishedStatus('won', 'You Won - Boss Defeated');

    AUDIO_MANAGER.stopAllMusic();
    AUDIO_MANAGER.play("win");

    gameState.finishGame('sharkyGameWon');
    return true;
}


/**
 * Sets a finished game status.
 *
 * @param {string} status - The new game status.
 * @param {string} message - The status message.
 * @returns {void}
 */
function setFinishedStatus(status, message) {
    gameState.status = status;
    gameState.message = message;
}


/**
 * Sets the game status to running.
 *
 * @returns {void}
 */
function setRunningStatus() {
    gameState.status = 'running';
    gameState.message = '';
}


/**
 * Spawns a new bubble object.
 *
 * @returns {void}
 */
function spawnGameBubble() {
    const sharky = gameState.getSharky();

    if (sharky.bubbleSpawned) return;

    createBubbleFromSharky(sharky);
    playBubbleSound(sharky);

    sharky.bubbleSpawned = true;
}

/**
 * Plays the matching bubble attack sound.
 *
 * @param {Object} sharky - The active Sharky object.
 * @returns {void}
 */
function playBubbleSound(sharky) {
    if (sharky.isPoisonBubbleAttack) {
        AUDIO_MANAGER.play("poisonBubble");
        return;
    }

    AUDIO_MANAGER.play("bubble");
}


/**
 * Creates one bubble based on Sharky's position.
 *
 * @param {Object} sharky - The active Sharky object.
 * @returns {void}
 */
function createBubbleFromSharky(sharky) {
    const bubbleSize = getBubbleSize();
    const bubbleData = getBubbleData(sharky);
    const bubblePosition = getBubblePosition(sharky, bubbleSize, bubbleData.direction);

    pushBubbleToStorage(bubblePosition, bubbleSize, bubbleData);
}


/**
 * Returns the default bubble size.
 *
 * @returns {Object} The bubble size.
 */
function getBubbleSize() {
    return {
        w: 120,
        h: 120
    };
}


/**
 * Returns all bubble data based on Sharky's attack.
 *
 * @param {Object} sharky - The active Sharky object.
 * @returns {Object} The bubble data.
 */
function getBubbleData(sharky) {
    const isPoisonBubble = sharky.isPoisonBubbleAttack;

    return {
        direction: sharky.otherDirection ? -1 : 1,
        images: isPoisonBubble ? POISON_BUBBLE_IMAGES : BUBBLE_IMAGES,
        damage: isPoisonBubble ? 35 : 10,
        type: isPoisonBubble ? 'poison' : 'normal'
    };
}


/**
 * Returns the bubble start position.
 *
 * @param {Object} sharky - The active Sharky object.
 * @param {Object} size - The bubble size.
 * @param {number} direction - The bubble direction.
 * @returns {Object} The bubble position.
 */
function getBubblePosition(sharky, size, direction) {
    const sharkyBox = sharky.getHitbox(camera_x);

    return {
        x: getBubbleX(sharkyBox, size, direction),
        y: sharkyBox.y + sharkyBox.h / 2 - size.h / 2
    };
}


/**
 * Returns the bubble x position.
 *
 * @param {Object} sharkyBox - Sharky's hitbox.
 * @param {Object} size - The bubble size.
 * @param {number} direction - The bubble direction.
 * @returns {number} The bubble x position.
 */
function getBubbleX(sharkyBox, size, direction) {
    return direction > 0
        ? sharkyBox.x + sharkyBox.w
        : sharkyBox.x - size.w;
}


/**
 * Adds a new bubble to the bubble storage.
 *
 * @param {Object} position - The bubble position.
 * @param {Object} size - The bubble size.
 * @param {Object} bubbleData - The bubble data.
 * @returns {void}
 */
function pushBubbleToStorage(position, size, bubbleData) {
    BUBBLES.push(
        new Bubble(
            position.x,
            position.y,
            size.w,
            size.h,
            12,
            bubbleData.direction,
            bubbleData.images,
            bubbleData.damage,
            bubbleData.type
        )
    );
}


/**
 * Updates and removes all bubbles.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function updateGameBubbles(ctx) {
    BUBBLES.forEach(bubble => updateSingleBubble(ctx, bubble));
    removeDeletedBubbles();
}


/**
 * Updates one bubble.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Object} bubble - The bubble object.
 * @returns {void}
 */
function updateSingleBubble(ctx, bubble) {
    if (bubble.markedForDeletion) return;

    bubble.draw(ctx);
    ENEMIES.forEach(enemy => checkBubbleEnemyHit(bubble, enemy));
}


/**
 * Checks whether one bubble hits one enemy.
 *
 * @param {Object} bubble - The bubble object.
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function checkBubbleEnemyHit(bubble, enemy) {
    if (bubble.markedForDeletion) return;
    if (enemy.isDead) return;
    if (!bubble.isColliding(enemy)) return;

    handleBubbleEnemyHit(bubble, enemy);
}


/**
 * Handles a successful bubble hit.
 *
 * @param {Object} bubble - The bubble object.
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function handleBubbleEnemyHit(bubble, enemy) {
    if (isBossEnemy(enemy)) {
        hitBossWithBubble(bubble, enemy);
        return;
    }

    hitNormalEnemyWithBubble(bubble, enemy);
}


/**
 * Applies bubble damage to the boss.
 *
 * @param {Object} bubble - The bubble object.
 * @param {Object} enemy - The boss enemy object.
 * @returns {void}
 */
function hitBossWithBubble(bubble, enemy) {
    enemy.hit(bubble.damage || 10);
    AUDIO_MANAGER.play("bossHit");

    bubble.markedForDeletion = true;
}


/**
 * Applies a bubble hit to a normal enemy.
 *
 * @param {Object} bubble - The bubble object.
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function hitNormalEnemyWithBubble(bubble, enemy) {
    if (enemy.enemyType === 'jellyfish') {
        enemy.die();
        AUDIO_MANAGER.play("enemyDead");
    }

    bubble.markedForDeletion = true;
}


/**
 * Removes all bubbles marked for deletion.
 *
 * @returns {void}
 */
function removeDeletedBubbles() {
    for (let i = BUBBLES.length - 1; i >= 0; i--) {
        removeBubbleIfDeleted(i);
    }
}


/**
 * Removes one bubble if it is marked for deletion.
 *
 * @param {number} index - The bubble index.
 * @returns {void}
 */
function removeBubbleIfDeleted(index) {
    if (BUBBLES[index].markedForDeletion) {
        BUBBLES.splice(index, 1);
    }
}


/**
 * Finishes the current game once.
 *
 * @param {string} eventName - The event name to dispatch.
 * @returns {void}
 */
function finishCurrentGame(eventName) {
    if (gameState.endEventDispatched) return;

    gameState.endedAt = Date.now();
    gameState.endEventDispatched = true;
    dispatchGameEndEvent(eventName);
}


/**
 * Dispatches the game end event.
 *
 * @param {string} eventName - The event name to dispatch.
 * @returns {void}
 */
function dispatchGameEndEvent(eventName) {
    window.dispatchEvent(new CustomEvent(eventName, {
        detail: gameState.getScore()
    }));
}


/**
 * Returns the current score values.
 *
 * @returns {Object} The score values.
 */
function getCurrentScore() {
    const sharky = gameState.getSharky();
    const duration = getGameDuration();

    return {
        coins: sharky.coins,
        poison: sharky.totalPoisonCollected || 0,
        time: gameState.formatTime(duration)
    };
}


/**
 * Returns the current game duration in seconds.
 *
 * @returns {number} The duration in seconds.
 */
function getGameDuration() {
    const endTime = gameState.endedAt || Date.now();

    return Math.floor((endTime - gameState.startedAt) / 1000);
}


/**
 * Formats seconds as minutes and seconds.
 *
 * @param {number} seconds - The time in seconds.
 * @returns {string} The formatted time.
 */
function formatGameTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;

    return `${minutes}:${restSeconds.toString().padStart(2, '0')}`;
}


/**
 * Draws the boss HUD when the boss is fighting.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawBossHud(ctx) {
    const boss = ENEMIES.find(enemy => enemy.health !== undefined);

    if (!canDrawBossHud(boss)) return;

    drawBossBar(ctx, 1240, 38, 620, 34, boss.health, boss.maxHealth, 'Boss');
}


/**
 * Checks whether the boss HUD can be drawn.
 *
 * @param {Object} boss - The boss enemy object.
 * @returns {boolean} Whether the boss HUD can be drawn.
 */
function canDrawBossHud(boss) {
    if (!boss) return false;
    if (boss.isDead) return false;

    return boss.bossState === 'fighting';
}


/**
 * Draws the complete boss health bar.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} x - The x position.
 * @param {number} y - The y position.
 * @param {number} w - The bar width.
 * @param {number} h - The bar height.
 * @param {number} value - The current value.
 * @param {number} maxValue - The maximum value.
 * @param {string} label - The bar label.
 * @returns {void}
 */
function drawBossBar(ctx, x, y, w, h, value, maxValue, label) {
    const percent = Math.max(0, Math.min(value / maxValue, 1));

    ctx.save();
    drawBossBarBackground(ctx, x, y, w, h);
    drawBossBarValue(ctx, x, y, w, h, percent);
    drawBossBarBorder(ctx, x, y, w, h);
    drawBossBarLabel(ctx, x, y, value, label);
    ctx.restore();
}


/**
 * Draws the boss bar background.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} x - The x position.
 * @param {number} y - The y position.
 * @param {number} w - The bar width.
 * @param {number} h - The bar height.
 * @returns {void}
 */
function drawBossBarBackground(ctx, x, y, w, h) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(x, y, w, h);
}


/**
 * Draws the boss bar value.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} x - The x position.
 * @param {number} y - The y position.
 * @param {number} w - The bar width.
 * @param {number} h - The bar height.
 * @param {number} percent - The current percentage.
 * @returns {void}
 */
function drawBossBarValue(ctx, x, y, w, h, percent) {
    ctx.fillStyle = 'rgba(160, 0, 0, 0.95)';
    ctx.fillRect(x, y, w * percent, h);
}


/**
 * Draws the boss bar border.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} x - The x position.
 * @param {number} y - The y position.
 * @param {number} w - The bar width.
 * @param {number} h - The bar height.
 * @returns {void}
 */
function drawBossBarBorder(ctx, x, y, w, h) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);
}


/**
 * Draws the boss bar label.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} x - The x position.
 * @param {number} y - The y position.
 * @param {number} value - The current boss health.
 * @param {string} label - The label text.
 * @returns {void}
 */
function drawBossBarLabel(ctx, x, y, value, label) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px "Luckiest Guy"';
    ctx.fillText(`${label}: ${value}`, x, y - 10);
}


/**
 * Draws all world debug hitboxes.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawWorldHitboxes(ctx) {
    drawEntityHitboxes(ctx);
    drawEnemyHitboxes(ctx);
    drawCoinHitboxes(ctx);
    drawPoisonHitboxes(ctx);
}


/**
 * Draws entity hitboxes.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawEntityHitboxes(ctx) {
    ENTITIES.forEach(entity => {
        drawDebugBox(ctx, entity, '#ff0000', 'Entity');
    });
}


/**
 * Draws enemy hitboxes.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawEnemyHitboxes(ctx) {
    ENEMIES.forEach(enemy => {
        drawSingleEnemyHitbox(ctx, enemy);
    });
}


/**
 * Draws one enemy hitbox.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Object} enemy - The enemy object.
 * @returns {void}
 */
function drawSingleEnemyHitbox(ctx, enemy) {
    if (enemy.isDead) return;

    if (typeof enemy.getHitbox === 'function') {
        drawDebugBox(ctx, enemy.getHitbox(), '#ff00ff', 'Enemy');
        return;
    }

    drawDebugBox(ctx, enemy, '#ff00ff', 'Enemy');
}


/**
 * Draws all coin hitboxes.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawCoinHitboxes(ctx) {
    COINS.forEach(coin => {
        if (!coin.isCollected) {
            drawDebugBox(ctx, coin, '#ffff00', 'Coin');
        }
    });
}


/**
 * Draws all poison hitboxes.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawPoisonHitboxes(ctx) {
    POISONS.forEach(poison => {
        if (!poison.isCollected) {
            drawDebugBox(ctx, poison, '#00ff00', 'Poison');
        }
    });
}


/**
 * Draws Sharky's debug hitbox.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @returns {void}
 */
function drawSharkyHitbox(ctx) {
    const sharky = gameState.getSharky();

    if (typeof sharky.getHitbox === 'function') {
        drawDebugBox(ctx, sharky.getHitbox(0), '#00ffff', 'Sharky');
        return;
    }

    drawDebugBox(ctx, sharky, '#00ffff', 'Sharky');
}


/**
 * Draws one debug box.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Object} debugBox - The debug box object.
 * @param {string} color - The debug color.
 * @param {string} label - The debug label.
 * @returns {void}
 */
function drawDebugBox(ctx, debugBox, color, label = '') {
    if (!debugBox) return;

    const box = getDebugBoxValues(debugBox);

    if (!isValidDebugBox(box)) return;

    drawDebugBoxShape(ctx, box, color);
    drawDebugBoxLabel(ctx, box, color, label);
}


/**
 * Returns normalized debug box values.
 *
 * @param {Object} debugBox - The debug box object.
 * @returns {Object} The normalized debug box.
 */
function getDebugBoxValues(debugBox) {
    return {
        x: debugBox.x,
        y: debugBox.y,
        w: debugBox.w ?? debugBox.width,
        h: debugBox.h ?? debugBox.height
    };
}


/**
 * Checks whether a debug box has valid values.
 *
 * @param {Object} box - The debug box values.
 * @returns {boolean} Whether the debug box is valid.
 */
function isValidDebugBox(box) {
    return box.x !== undefined &&
        box.y !== undefined &&
        box.w !== undefined &&
        box.h !== undefined;
}


/**
 * Draws the debug box shape.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Object} box - The debug box values.
 * @param {string} color - The debug color.
 * @returns {void}
 */
function drawDebugBoxShape(ctx, box, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x, box.y, box.w, box.h);
    ctx.restore();
}


/**
 * Draws the debug box label.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Object} box - The debug box values.
 * @param {string} color - The debug color.
 * @param {string} label - The debug label.
 * @returns {void}
 */
function drawDebugBoxLabel(ctx, box, color, label) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = '18px "Luckiest Guy"';
    ctx.fillText(label, box.x, box.y - 6);
    ctx.restore();
}