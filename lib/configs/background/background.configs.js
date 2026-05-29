import BackgroundClass from "../../classes/background/background.class.js";

const viewWidth = 1920;
const repeatBackground = 10;

export const BACKGROUND = [];

for (let i = 0; i < repeatBackground; i++) {

    let x = i * viewWidth;

    // Water
    BACKGROUND.push(
        new BackgroundClass(x, 0, 1920, 1080, i % 2 === 0
            ? "../../../assets/img/3. Background/Layers/5. Water/D1.png"
            : "../../../assets/img/3. Background/layers/5. Water/D2.png"
        )
    );

    // Fondo 1
    BACKGROUND.push(
        new BackgroundClass(x, 0, 1920, 1080, i % 2 === 0
            ? "../../../assets/img/3. Background/Layers/3.Fondo 1/D1.png"
            : "../../../assets/img/3. Background/layers/3.Fondo 1/D2.png"
        )
    );

    // Fondo 2
    BACKGROUND.push(
        new BackgroundClass(x, 0, 1920, 1080, i % 2 === 0
            ? "../../../assets/img/3. Background/Layers/4.Fondo 2/D1.png"
            : "../../../assets/img/3. Background/layers/4.Fondo 2/D2.png"
        )
    );

    // Floor
    BACKGROUND.push(
        new BackgroundClass(x, 0, 1920, 1080, i % 2 === 0
            ? "../../../assets/img/3. Background/Layers/2. Floor/D1.png"
            : "../../../assets/img/3. Background/layers/2. Floor/D2.png"
        )
    );

    // Light
    BACKGROUND.push(
        new BackgroundClass(x, 0, 1920, 1080, i % 2 === 0
            ? "../../../assets/img/3. Background/Layers/1. Light/1.png"
            : "../../../assets/img/3. Background/layers/1. Light/2.png"
        )
    );
}