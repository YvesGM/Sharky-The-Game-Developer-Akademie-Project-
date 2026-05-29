import BackgroundClass from "../../classes/background/background.class.js";

const viewWidth = 1920;
const repeatBackground = 10;

const backgroundLayers = [
    {
        name: "Water",
        firstImage: "../../../assets/img/3. Background/Layers/5. Water/D1.png",
        secondImage: "../../../assets/img/3. Background/Layers/5. Water/D2.png"
    },
    {
        name: "Fondo 1",
        firstImage: "../../../assets/img/3. Background/Layers/3.Fondo 1/D1.png",
        secondImage: "../../../assets/img/3. Background/Layers/3.Fondo 1/D2.png"
    },
    {
        name: "Fondo 2",
        firstImage: "../../../assets/img/3. Background/Layers/4.Fondo 2/D1.png",
        secondImage: "../../../assets/img/3. Background/Layers/4.Fondo 2/D2.png"
    },
    {
        name: "Floor",
        firstImage: "../../../assets/img/3. Background/Layers/2. Floor/D1.png",
        secondImage: "../../../assets/img/3. Background/Layers/2. Floor/D2.png"
    },
    {
        name: "Light",
        firstImage: "../../../assets/img/3. Background/Layers/1. Light/1.png",
        secondImage: "../../../assets/img/3. Background/Layers/1. Light/2.png"
    }
];

export const BACKGROUND = [];

initBackground();


/**
 * Initializes all background objects.
 *
 * @returns {void}
 */
function initBackground() {
    for (let i = 0; i < repeatBackground; i++) {
        addBackgroundLayerSet(i);
    }
}


/**
 * Adds all background layers for one screen segment.
 *
 * @param {number} index - The current background index.
 * @returns {void}
 */
function addBackgroundLayerSet(index) {
    const x = index * viewWidth;

    backgroundLayers.forEach(layer => {
        addBackgroundLayer(layer, index, x);
    });
}


/**
 * Adds one background layer.
 *
 * @param {Object} layer - The background layer config.
 * @param {number} index - The current background index.
 * @param {number} x - The x position.
 * @returns {void}
 */
function addBackgroundLayer(layer, index, x) {
    BACKGROUND.push(
        new BackgroundClass(x, 0, 1920, 1080, getLayerImage(layer, index))
    );
}


/**
 * Returns the correct alternating layer image.
 *
 * @param {Object} layer - The background layer config.
 * @param {number} index - The current background index.
 * @returns {string} The image path.
 */
function getLayerImage(layer, index) {
    return index % 2 === 0
        ? layer.firstImage
        : layer.secondImage;
}