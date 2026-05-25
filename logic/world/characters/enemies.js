import { ENEMIES } from "../../../lib/configs/characters/enemy.configs.js"

export default function Enemies(ctx, sharky) {
    drawEnemies(ctx, sharky);
}

function drawEnemies(ctx, sharky) {
    ENEMIES.forEach(enemy => {
        if (enemy.markedForDeletion) return;

        enemy.draw(ctx, sharky);
    });
};