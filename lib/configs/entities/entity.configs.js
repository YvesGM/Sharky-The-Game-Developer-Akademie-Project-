import BarriereOne from "../../classes/entities/barriers/barriere-one.class.js";
import BarriereTwo from "../../classes/entities/barriers/barriere-two.class.js";

const tunnelIndex = 3600;
const cliffIndex = 11500;

export const ENTITIES = [
    // Tunnel part - Up
    new BarriereTwo(100 + tunnelIndex, -1060, 2000, 1500, "../../../assets/img/3. Background/Barrier/1.png"),
    new BarriereOne(1000 + tunnelIndex, -350, 800, 500, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(500 + tunnelIndex, -350, 800, 500, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(0 + tunnelIndex, -150, 800, 500, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(400 + tunnelIndex, 0, 700, 400, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(50 + tunnelIndex, 50, 700, 400, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(1250 + tunnelIndex, 0, 800, 500, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(1550 + tunnelIndex, -100, 800, 500, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(1100 + tunnelIndex, 150, 700, 400, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(700 + tunnelIndex, 50, 700, 400, "../../../assets/img/3. Background/Barrier/2.png"),

    // Tunnel part - Down
    new BarriereTwo(100 + tunnelIndex, 780, 2000, 5000, "../../../assets/img/3. Background/Barrier/1.png"),
    new BarriereOne(1000 + tunnelIndex, 750, 800, 500, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(1500 + tunnelIndex, 750, 800, 500, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(300 + tunnelIndex, 850, 800, 500, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(0 + tunnelIndex, 700, 800, 500, "../../../assets/img/3. Background/Barrier/2.png"),

    // Cliff part
    new BarriereOne(0 + cliffIndex, -150, 500, 750, "../../../assets/img/3. Background/Barrier/3.png"),
    new BarriereOne(0 + cliffIndex, 850, 600, 300, "../../../assets/img/3. Background/Barrier/2.png"),

    new BarriereOne(1000 + cliffIndex, -550, 500, 750, "../../../assets/img/3. Background/Barrier/3.png"),
    new BarriereOne(1000 + cliffIndex, 450, 500, 750, "../../../assets/img/3. Background/Barrier/3.png"),

    new BarriereOne(2000 + cliffIndex, -80, 500, 750, "../../../assets/img/3. Background/Barrier/3.png"),
    new BarriereOne(2000 + cliffIndex, 850, 500, 750, "../../../assets/img/3. Background/Barrier/3.png")
];