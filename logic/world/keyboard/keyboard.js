import Keyboard from "../../../lib/classes/keyboard/keyboard.class.js"
import { RIGHT_BOUND, LEFT_BOUND } from "../../../lib/configs/camera/camera.configs.js";
import { MAX_CAMERA } from "../../../lib/configs/world.configs.js";

export function sharkyKbFunctions(sharky, camera, gameState) {
    let oldX = sharky.x;
    let oldY = sharky.y;
    let oldCamera = camera;

    if (Keyboard.RIGHT) {
        if (camera > MAX_CAMERA) camera = MAX_CAMERA;

        sharky.x += sharky.speed
        if (sharky.x > RIGHT_BOUND) {
            sharky.x = RIGHT_BOUND;
            camera += sharky.speed;
        } else {
            camera += sharky.speed * 0.5;
        }
        sharky.otherDirection = false;
    }

    if (Keyboard.LEFT) {
        sharky.x -= sharky.speed
        if (sharky.x < LEFT_BOUND && camera > 0) {
            sharky.x = LEFT_BOUND;
            camera -= sharky.speed;
        }
        sharky.otherDirection = true;
    }

    if (Keyboard.UP) {
        sharky.y -= sharky.speed
    }

    if (Keyboard.DOWN) {
        sharky.y += sharky.speed
    }

    if (camera < 0) camera = 0;
    if (camera > MAX_CAMERA) camera = MAX_CAMERA;
    if (sharky.x < 0) sharky.x = 0;
    if (sharky.x > 1520) sharky.x = 1520;
    if (sharky.y < -80) sharky.y = -80;
    if (sharky.y > 760) sharky.y = 760;

    if (gameState && gameState.isBlocked(sharky, camera)) {
        sharky.x = oldX;
        sharky.y = oldY;
        camera = oldCamera;
    }

    return camera
}