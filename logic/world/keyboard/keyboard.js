import Keyboard from "../../../lib/classes/keyboard/keyboard.class.js";
import { RIGHT_BOUND, LEFT_BOUND } from "../../../lib/configs/camera/camera.configs.js";
import { MAX_CAMERA } from "../../../lib/configs/world.configs.js";

const SHARKY_MIN_X = 0;
const SHARKY_MAX_X = 1520;
const SHARKY_MIN_Y = -170;
const SHARKY_MAX_Y = 760;
const WALL_SLIDE_SPEED_FACTOR = 0.5;

/**
 * Handles Sharky's keyboard movement and returns the updated camera position.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {number} camera - The current camera position.
 * @param {Object} gameState - The current game state.
 * @returns {number} The updated camera position.
 */
export function sharkyKbFunctions(sharky, camera, gameState) {
    camera = handleRightMovement(sharky, camera, gameState);
    camera = handleLeftMovement(sharky, camera, gameState);
    handleUpMovement(sharky, camera, gameState);
    handleDownMovement(sharky, camera, gameState);

    camera = applyCameraBounds(camera);
    applySharkyBounds(sharky);

    return camera;
}


/**
 * Handles Sharky's right movement.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {number} camera - The current camera position.
 * @param {Object} gameState - The current game state.
 * @returns {number} The updated camera position.
 */
function handleRightMovement(sharky, camera, gameState) {
    if (!Keyboard.RIGHT) return camera;

    const oldState = getMovementState(sharky, camera);
    camera = moveRight(sharky, camera);
    sharky.otherDirection = false;

    return handleHorizontalBlock(sharky, camera, oldState, gameState);
}


/**
 * Handles Sharky's left movement.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {number} camera - The current camera position.
 * @param {Object} gameState - The current game state.
 * @returns {number} The updated camera position.
 */
function handleLeftMovement(sharky, camera, gameState) {
    if (!Keyboard.LEFT) return camera;

    const oldState = getMovementState(sharky, camera);
    camera = moveLeft(sharky, camera);
    sharky.otherDirection = true;

    return handleHorizontalBlock(sharky, camera, oldState, gameState);
}


/**
 * Handles blocked horizontal movement.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {number} camera - The current camera position.
 * @param {Object} oldState - The previous movement state.
 * @param {Object} gameState - The current game state.
 * @returns {number} The updated camera position.
 */
function handleHorizontalBlock(sharky, camera, oldState, gameState) {
    if (!isBlocked(sharky, camera, gameState)) return camera;

    restoreHorizontalState(sharky, oldState);
    slideDownAtWall(sharky, oldState.camera, oldState.y, gameState);

    return oldState.camera;
}


/**
 * Handles Sharky's upward movement.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {number} camera - The current camera position.
 * @param {Object} gameState - The current game state.
 * @returns {void}
 */
function handleUpMovement(sharky, camera, gameState) {
    if (!Keyboard.UP) return;

    const oldY = sharky.y;
    sharky.y -= sharky.speed;
    applySharkyBounds(sharky);

    resetYIfBlocked(sharky, camera, oldY, gameState);
}


/**
 * Handles Sharky's downward movement.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {number} camera - The current camera position.
 * @param {Object} gameState - The current game state.
 * @returns {void}
 */
function handleDownMovement(sharky, camera, gameState) {
    if (!Keyboard.DOWN) return;

    const oldY = sharky.y;
    sharky.y += sharky.speed;
    applySharkyBounds(sharky);

    resetYIfBlocked(sharky, camera, oldY, gameState);
}


/**
 * Returns the current movement state.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {number} camera - The current camera position.
 * @returns {Object} The current movement state.
 */
function getMovementState(sharky, camera) {
    return {
        x: sharky.x,
        y: sharky.y,
        camera: camera
    };
}


/**
 * Restores Sharky's horizontal movement state.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {Object} oldState - The previous movement state.
 * @returns {void}
 */
function restoreHorizontalState(sharky, oldState) {
    sharky.x = oldState.x;
}


/**
 * Resets Sharky's y position if movement is blocked.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {number} camera - The current camera position.
 * @param {number} oldY - The previous y position.
 * @param {Object} gameState - The current game state.
 * @returns {void}
 */
function resetYIfBlocked(sharky, camera, oldY, gameState) {
    if (isBlocked(sharky, camera, gameState)) {
        sharky.y = oldY;
    }
}


/**
 * Moves Sharky to the right and updates the camera.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {number} camera - The current camera position.
 * @returns {number} The updated camera position.
 */
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


/**
 * Moves Sharky to the left and updates the camera.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {number} camera - The current camera position.
 * @returns {number} The updated camera position.
 */
function moveLeft(sharky, camera) {
    sharky.x -= sharky.speed;

    if (sharky.x < LEFT_BOUND && camera > 0) {
        sharky.x = LEFT_BOUND;
        camera -= sharky.speed;
    }

    return applyCameraBounds(camera);
}


/**
 * Lets Sharky slide down when blocked at a wall.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {number} camera - The current camera position.
 * @param {number} oldY - The previous y position.
 * @param {Object} gameState - The current game state.
 * @returns {void}
 */
function slideDownAtWall(sharky, camera, oldY, gameState) {
    if (!Keyboard.DOWN) return;

    sharky.y += sharky.speed * WALL_SLIDE_SPEED_FACTOR;
    applySharkyBounds(sharky);
    resetYIfBlocked(sharky, camera, oldY, gameState);
}


/**
 * Checks whether Sharky is blocked by the game state.
 *
 * @param {Object} sharky - The Sharky object.
 * @param {number} camera - The current camera position.
 * @param {Object} gameState - The current game state.
 * @returns {boolean} Whether Sharky is blocked.
 */
function isBlocked(sharky, camera, gameState) {
    return gameState && gameState.isBlocked(sharky, camera);
}


/**
 * Applies the camera bounds.
 *
 * @param {number} camera - The current camera position.
 * @returns {number} The bounded camera position.
 */
function applyCameraBounds(camera) {
    if (camera < 0) camera = 0;
    if (camera > MAX_CAMERA) camera = MAX_CAMERA;

    return camera;
}


/**
 * Applies Sharky's movement bounds.
 *
 * @param {Object} sharky - The Sharky object.
 * @returns {void}
 */
function applySharkyBounds(sharky) {
    if (sharky.x < SHARKY_MIN_X) sharky.x = SHARKY_MIN_X;
    if (sharky.x > SHARKY_MAX_X) sharky.x = SHARKY_MAX_X;
    if (sharky.y < SHARKY_MIN_Y) sharky.y = SHARKY_MIN_Y;
    if (sharky.y > SHARKY_MAX_Y) sharky.y = SHARKY_MAX_Y;
}