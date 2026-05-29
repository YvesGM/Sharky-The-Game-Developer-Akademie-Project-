import { IMAGE_PRELOAD_SOURCES } from "../../lib/configs/image-preload.configs.js";

/**
 * Preloads all configured game images.
 *
 * @param {Function} onProgress - The progress callback.
 * @returns {Promise<void>}
 */
export async function preloadGameImages(onProgress) {
    const imagePaths = getUniqueImagePaths();

    if (imagePaths.length === 0) {
        onProgress?.(100);
        return;
    }

    let loadedImages = 0;

    await Promise.all(
        imagePaths.map(path => preloadImage(path).then(() => {
            loadedImages++;
            onProgress?.(getProgress(loadedImages, imagePaths.length));
        }))
    );
}


/**
 * Returns all unique image paths from the preload source config.
 *
 * @returns {string[]} The image paths.
 */
function getUniqueImagePaths() {
    const paths = IMAGE_PRELOAD_SOURCES
        .flat(Infinity)
        .map(getImagePath)
        .filter(Boolean);

    return [...new Set(paths)];
}


/**
 * Returns an image path from different supported source types.
 *
 * @param {*} source - The image source.
 * @returns {string|null} The image path.
 */
function getImagePath(source) {
    if (typeof source === "string") return source;

    if (source instanceof HTMLImageElement) return source.src;

    if (source?.img instanceof HTMLImageElement) return source.img.src;

    if (typeof source?.img === "string") return source.img;

    if (typeof source?.imgPath === "string") return source.imgPath;

    if (typeof source?.src === "string") return source.src;

    return null;
}


/**
 * Preloads one image.
 *
 * @param {string} path - The image path.
 * @returns {Promise<void>}
 */
function preloadImage(path) {
    return new Promise(resolve => {
        const image = new Image();

        image.onload = () => resolve();
        image.onerror = () => {
            console.warn("Image could not be loaded:", path);
            resolve();
        };

        image.src = path;
    });
}


/**
 * Returns the current loading progress.
 *
 * @param {number} loadedImages - Amount of loaded images.
 * @param {number} totalImages - Amount of total images.
 * @returns {number} The progress in percent.
 */
function getProgress(loadedImages, totalImages) {
    return Math.round((loadedImages / totalImages) * 100);
}