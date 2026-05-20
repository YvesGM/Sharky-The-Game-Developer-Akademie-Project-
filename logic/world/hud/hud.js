import { HUD } from "../../../lib/configs/hud/hud.configs.js";
import { SHARKY } from "../../../lib/configs/characters/sharky.configs.js";

export default function hud(ctx) {
    updateHUD();
    drawHUD(ctx);
};

function updateHUD() {
    let sharky = SHARKY[0];

    updateLifebar(sharky);
    updateCoinbar(sharky);
    updatePoisonbar(sharky);
}

function updateLifebar(sharky) {
    HUD.lifebar.setImageByIndex(sharky.healthStage);
}

function updateCoinbar(sharky) {
    let coinIndex = Math.floor(sharky.coins / 3);

    HUD.coinbar.setImageByIndex(coinIndex);
}

function updatePoisonbar(sharky) {
    HUD.poisonbar.setImageByIndex(sharky.poison);
}

function drawHUD(ctx) {
    HUD.lifebar.draw(ctx);
    HUD.coinbar.draw(ctx);
    HUD.poisonbar.draw(ctx);
};