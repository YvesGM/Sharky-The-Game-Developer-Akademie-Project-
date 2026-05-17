import Background from "./background/background.js";
import Entities from "./entities/entities.js";
import Collectibles from "./entities/collectibles.js";
import Enemies from "./characters/enemies.js";
import Sharky from "./characters/sharky.js";

let camera_x = 0;
let DEBUG_HITBOXES = true;

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

    ctx.save();
    ctx.translate(-camera_x, 0);

    Background(ctx);
    Entities(ctx);
    Collectibles(ctx);
    Enemies(ctx);

    ctx.restore();
    
    camera_x = Sharky(ctx, camera_x);

    requestAnimationFrame(() => loadWorld(ctx, canvas))
}