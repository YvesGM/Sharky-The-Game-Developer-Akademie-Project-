import { BUBBLE } from "../../../lib/configs/entities/bubble.configs.js";

export default function Bubbles(ctx, sharky) {
    drawBubbles(ctx, sharky);
}

function drawBubbles(ctx, sharky) {
    BUBBLE.forEach(ble => {
        ble.draw(ctx, sharky);
    });
};