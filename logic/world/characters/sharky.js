import { SHARKY } from "../../../lib/configs/characters/sharky.configs.js"

export default function Sharky(ctx, camera_x, gameState) {
    return drawSharky(ctx, camera_x, gameState);
}

function drawSharky(ctx, camera_x, gameState) {
    SHARKY.forEach(char => {
        camera_x = char.draw(ctx, camera_x, gameState);
    });
    return camera_x;
};