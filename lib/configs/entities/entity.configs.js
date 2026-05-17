import BarriereOne from "../../classes/entities/barriers/barriere-one.class.js";
import BarriereTwo from "../../classes/entities/barriers/barriere-two.class.js";

const tunnelIndex = 3500;
const cliffIndex = 11500;

export const ENTITIES = [
    
    // Tunnel part
    new BarriereTwo(100 + tunnelIndex, 0, 1800, 1700, "../../../assets/img/3. Background/Barrier/1.png"),
    new BarriereOne(0 + tunnelIndex, -150, 800, 500, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(400 + tunnelIndex, 0, 700, 400, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(50 + tunnelIndex, 50, 700, 400, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(1250 + tunnelIndex, 0, 800, 500, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(1100 + tunnelIndex, 80, 700, 400, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereOne(700 + tunnelIndex, 50, 700, 400, "../../../assets/img/3. Background/Barrier/2.png"),
    new BarriereTwo(100 + tunnelIndex, 350, 1800, 750, "../../../assets/img/3. Background/Barrier/1.png"),
    
    // Cliff part
    new BarriereOne(0 + cliffIndex, -150, 500, 750, "../../../assets/img/3. Background/Barrier/3.png"),
    new BarriereOne(0 + cliffIndex, 850, 600, 300, "../../../assets/img/3. Background/Barrier/2.png"),
    
    new BarriereOne(1000 + cliffIndex, -550, 500, 750, "../../../assets/img/3. Background/Barrier/3.png"),
    new BarriereOne(1000 + cliffIndex, 450, 500, 750, "../../../assets/img/3. Background/Barrier/3.png"),
    
    new BarriereOne(2000 + cliffIndex, -80, 500, 750, "../../../assets/img/3. Background/Barrier/3.png"),
    new BarriereOne(2000 + cliffIndex, 850, 500, 750, "../../../assets/img/3. Background/Barrier/3.png"),

]