import Background from "./background/background.js";
import Entities from "./entities/entities.js";
import Collectibles from "./entities/collectibles.js";
import Enemies from "./characters/enemies.js";
import Sharky from "./characters/sharky.js";
import Keyboard from "../../lib/classes/keyboard/keyboard.class.js";
import { SHARKY } from "../../lib/configs/characters/sharky.configs.js";
import { ENEMIES } from "../../lib/configs/characters/enemy.configs.js";
import { ENTITIES } from "../../lib/configs/entities/entity.configs.js";
import { COINS, POISONS } from "../../lib/configs/entities/collectibles.configs.js";

let camera_x = 0;
let DEBUG_HITBOXES = true;

const gameState = {
    status: 'running',
    message: '',

    getSharky() {
        return SHARKY[0];
    },

    isBlocked(sharky, camera) {
        return ENTITIES.some(entity => sharky.isColliding(entity, camera));
    },

    checkCollisions() {
        let sharky = this.getSharky();

        ENEMIES.forEach(enemy => {
            if (!enemy.isDead && sharky.isColliding(enemy, camera_x)) {
                sharky.hit(enemy.damage || 15);
            }
        });
    },

    checkCollectibles() {
        let sharky = this.getSharky();

        COINS.forEach(coin => {
            if (!coin.isCollected && sharky.isColliding(coin, camera_x)) {
                coin.isCollected = true;
                sharky.collectCoin(coin.value);
            }
        });

        POISONS.forEach(poison => {
            if (!poison.isCollected && sharky.isColliding(poison, camera_x)) {
                poison.isCollected = true;
                sharky.collectPoison(poison.value);
            }
        });
    },

    checkAttacks() {
        let sharky = this.getSharky();

        if (!sharky.isAttacking()) return;

        ENEMIES.forEach(enemy => {
            if (enemy.isDead) return;

            let attackBox = sharky.getAttackBox(camera_x);
            let enemyBox = enemy.getHitbox();
            let isHit = attackBox.x + attackBox.w > enemyBox.x &&
                attackBox.x < enemyBox.x + enemyBox.w &&
                attackBox.y + attackBox.h > enemyBox.y &&
                attackBox.y < enemyBox.y + enemyBox.h;

            if (!isHit) return;

            if (enemy.health !== undefined) {
                if (sharky.attackType === 'bubble' && sharky.poison > 0) {
                    enemy.hit();
                    sharky.poison--;
                }
                return;
            }

            if (sharky.attackType === 'fin') {
                enemy.isDead = true;
            }
        });
    },

    checkStatus() {
        let sharky = this.getSharky();
        let boss = ENEMIES.find(enemy => enemy.health !== undefined);

        if (sharky.isDead) {
            this.status = 'gameOver';
            this.message = 'Game Over - R zum Neustarten';
            return;
        }

        if (boss && boss.isDead) {
            this.status = 'won';
            this.message = 'Gewonnen - Boss besiegt';
            return;
        }

        this.status = 'running';
        this.message = '';
    },

    restart() {
        window.location.reload();
    }
}

export default function loadCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const ctxResolution = window.devicePixelRatio;
    canvas.width = 1920 * ctxResolution;
    canvas.height = 1080 * ctxResolution;

    ctx.scale(ctxResolution, ctxResolution);

    loadWorld(ctx, canvas);
}

function loadWorld(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (Keyboard.RESTART && gameState.status === 'gameOver') {
        gameState.restart();
    }

    if (gameState.status === 'running') {
        gameState.checkCollectibles();
        gameState.checkCollisions();
        gameState.checkAttacks();
        gameState.checkStatus();
    }

    ctx.save();
    ctx.translate(-camera_x, 0);

    Background(ctx);
    Entities(ctx);
    Collectibles(ctx);
    Enemies(ctx);

    if (DEBUG_HITBOXES) {
        drawWorldHitboxes(ctx);
    }

    ctx.restore();

    camera_x = Sharky(ctx, camera_x);

    if (DEBUG_HITBOXES) {
        drawSharkyHitbox(ctx);
    }
    
    drawHud(ctx);

    requestAnimationFrame(() => loadWorld(ctx, canvas))
}

function drawHud(ctx) {
    let sharky = gameState.getSharky();
    let boss = ENEMIES.find(enemy => enemy.health !== undefined);

    drawBar(ctx, 40, 38, 420, 34, sharky.health, 100, 'Health');
    drawBar(ctx, 40, 88, 260, 28, sharky.poison, 5, 'Poison');

    ctx.font = '34px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Coins: ${sharky.coins}/${COINS.length}`, 40, 165);

    if (boss && !boss.isDead && camera_x > 14500) {
        drawBar(ctx, 1240, 38, 620, 34, boss.health, 100, 'Boss');
    };

    if (gameState.message) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(0, 0, 1920, 1080);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = '72px Arial';
        ctx.fillText(gameState.message, 960, 520);
        ctx.restore();
    };
}

function drawBar(ctx, x, y, w, h, value, maxValue, label) {
    let percent = Math.max(0, Math.min(value / maxValue, 1));

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, w * percent, h);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = '22px Arial';
    ctx.fillText(`${label}: ${value}`, x, y - 8);
    ctx.restore();
}

function drawWorldHitboxes(ctx) {
    ENTITIES.forEach(entity => {
        drawDebugBox(ctx, entity, '#ff0000', 'Entity');
    });

    ENEMIES.forEach(enemy => {
        if (enemy.isDead) return;

        if (typeof enemy.getHitbox === 'function') {
            drawDebugBox(ctx, enemy.getHitbox(), '#ff00ff', 'Enemy');
        } else {
            drawDebugBox(ctx, enemy, '#ff00ff', 'Enemy');
        }
    });

    COINS.forEach(coin => {
        if (coin.isCollected) return;
        drawDebugBox(ctx, coin, '#ffff00', 'Coin');
    });

    POISONS.forEach(poison => {
        if (poison.isCollected) return;
        drawDebugBox(ctx, poison, '#00ff00', 'Poison');
    });
}

function drawSharkyHitbox(ctx) {
    let sharky = gameState.getSharky();

    if (typeof sharky.getHitbox === 'function') {
        drawDebugBox(ctx, sharky.getHitbox(camera_x), '#00ffff', 'Sharky');
        return;
    }

    drawDebugBox(ctx, sharky, '#00ffff', 'Sharky');
}

function drawDebugBox(ctx, box, color, label = '') {
    if (!box) return;

    let x = box.x;
    let y = box.y;
    let w = box.w ?? box.width;
    let h = box.h ?? box.height;

    if (
        x === undefined ||
        y === undefined ||
        w === undefined ||
        h === undefined
    ) {
        return;
    }

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = color;
    ctx.font = '18px Arial';
    ctx.fillText(label, x, y - 6);
    ctx.restore();
}