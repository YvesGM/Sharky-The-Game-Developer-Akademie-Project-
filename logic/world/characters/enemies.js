import { ENEMIES } from "../../../lib/configs/characters/enemy.configs.js"

export default function Enemies(ctx, sharky, camera_x) {
    drawEnemies(ctx, sharky, camera_x);
}

function drawEnemies(ctx, sharky, camera_x) {
    ENEMIES.forEach(enemy => {
        if (enemy.markedForDeletion) return;
        
        enemy.draw(ctx, sharky, camera_x);
    });
};