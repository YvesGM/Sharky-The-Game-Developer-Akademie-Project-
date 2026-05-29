import Keyboard from "../../../lib/classes/keyboard/keyboard.class.js"
import { RIGHT_BOUND, LEFT_BOUND } from "../../../lib/configs/camera/camera.configs.js";
import { MAX_CAMERA } from "../../../lib/configs/world.configs.js";

const SHARKY_MIN_X = 0;
const SHARKY_MAX_X = 1520;
const SHARKY_MIN_Y = -170;
const SHARKY_MAX_Y = 760;
const WALL_SLIDE_SPEED_FACTOR = 0.5;

export function sharkyKbFunctions(sharky, camera, gameState) {
    let oldX = sharky.x;
    let oldY = sharky.y;
    let oldCamera = camera;

    if (Keyboard.RIGHT) {
        camera = moveRight(sharky, camera);
        sharky.otherDirection = false;

        if (isBlocked(sharky, camera, gameState)) {
            sharky.x = oldX;
            camera = oldCamera;

            slideDownAtWall(sharky, camera, oldY, gameState);
        }
    }

    oldX = sharky.x;
    oldY = sharky.y;
    oldCamera = camera;

    if (Keyboard.LEFT) {
        camera = moveLeft(sharky, camera);
        sharky.otherDirection = true;

        if (isBlocked(sharky, camera, gameState)) {
            sharky.x = oldX;
            camera = oldCamera;

            slideDownAtWall(sharky, camera, oldY, gameState);
        }
    }

    oldY = sharky.y;

    if (Keyboard.UP) {
        sharky.y -= sharky.speed;

        applySharkyBounds(sharky);

        if (isBlocked(sharky, camera, gameState)) {
            sharky.y = oldY;
        }
    }

    oldY = sharky.y;

    if (Keyboard.DOWN) {
        sharky.y += sharky.speed;

        applySharkyBounds(sharky);

        if (isBlocked(sharky, camera, gameState)) {
            sharky.y = oldY;
        }
    }

    camera = applyCameraBounds(camera);
    applySharkyBounds(sharky);

    return camera;
}

function moveRight(sharky, camera) {
    sharky.x += sharky.speed;

    if (sharky.x > RIGHT_BOUND) {
        sharky.x = RIGHT_BOUND;
        camera += sharky.speed;
    } else {
        camera += sharky.speed * 0.5;
    }

    return applyCameraBounds(camera);
}

function moveLeft(sharky, camera) {
    sharky.x -= sharky.speed;

    if (sharky.x < LEFT_BOUND && camera > 0) {
        sharky.x = LEFT_BOUND;
        camera -= sharky.speed;
    }

    return applyCameraBounds(camera);
}

function slideDownAtWall(sharky, camera, oldY, gameState) {
    if (!Keyboard.DOWN) return;

    sharky.y += sharky.speed * WALL_SLIDE_SPEED_FACTOR;

    applySharkyBounds(sharky);

    if (isBlocked(sharky, camera, gameState)) {
        sharky.y = oldY;
    }
}

function isBlocked(sharky, camera, gameState) {
    return gameState && gameState.isBlocked(sharky, camera);
}

function applyCameraBounds(camera) {
    if (camera < 0) camera = 0;
    if (camera > MAX_CAMERA) camera = MAX_CAMERA;

    return camera;
}

function applySharkyBounds(sharky) {
    if (sharky.x < SHARKY_MIN_X) sharky.x = SHARKY_MIN_X;
    if (sharky.x > SHARKY_MAX_X) sharky.x = SHARKY_MAX_X;
    if (sharky.y < SHARKY_MIN_Y) sharky.y = SHARKY_MIN_Y;
    if (sharky.y > SHARKY_MAX_Y) sharky.y = SHARKY_MAX_Y;
}