import { COINS, POISONS } from "../../../lib/configs/entities/collectibles.configs.js"

export default function Collectibles(ctx) {
    drawCollectibles(ctx);
}

function drawCollectibles(ctx) {
    COINS.forEach(coin => {
        coin.draw(ctx);
    });

    POISONS.forEach(poison => {
        poison.draw(ctx);
    });
};
