import GreenPufferfishClass from "../../classes/characters/enemies/pufferfish/green-pufferfish.class.js";
import RedPufferfishClass from "../../classes/characters/enemies/pufferfish/red-pufferfish.class.js";
import RainbowPufferfishClass from "../../classes/characters/enemies/pufferfish/rainbow-pufferfish.class.js";

import LilaJellyfishClass from "../../classes/characters/enemies/jellyfish/lila-jellyfish.class.js";
import YellowJellyfishClass from "../../classes/characters/enemies/jellyfish/yellow-jellyfish.class.js";
import BossClass from "../../classes/characters/enemies/boss/boss.class.js";

const firstWaveX = 1500;
const secondWaveX = 5800;
const thirdWaveX = 10300;

export const ENEMIES = [
    
    // first Enemy-Wave
    new RainbowPufferfishClass(1600 + firstWaveX, 750, 220, 220, 10, "./assets/img/2.Enemy/1.Pufferfish/1.Swim/3.swim1.png"),
    new YellowJellyfishClass(0 + firstWaveX, 530, 300, 300, 10, "./assets/img/2.Enemy/2 Jellyfish/Regular damage/Yellow 1.png"),
    new LilaJellyfishClass(800 + firstWaveX, 150, 350, 350, 10, "./assets/img/2.Enemy/2 Jellyfish/Regular damage/Lila 1.png"),
    
    // second Enemy-Wave
    new GreenPufferfishClass(400 + secondWaveX, 800, 240, 240, 10, "./assets/img/2.Enemy/1.Pufferfish/1.Swim/1.swim1.png"),
    new GreenPufferfishClass(700 + secondWaveX, 200, 180, 180, 10, "./assets/img/2.Enemy/1.Pufferfish/1.Swim/1.swim1.png"),
    new RedPufferfishClass(1100 + secondWaveX, 500, 210, 210, 10, "./assets/img/2.Enemy/1.Pufferfish/1.Swim/2.swim1.png"),
    new YellowJellyfishClass(1800 + secondWaveX, 430, 280, 280, 10, "./assets/img/2.Enemy/2 Jellyfish/Regular damage/Yellow 1.png"),
    new RainbowPufferfishClass(2600 + secondWaveX, 750, 190, 190, 10, "./assets/img/2.Enemy/1.Pufferfish/1.Swim/3.swim1.png"),
    new LilaJellyfishClass(2800 + secondWaveX, 180, 360, 360, 10, "./assets/img/2.Enemy/2 Jellyfish/Regular damage/Lila 1.png"),
    new RedPufferfishClass(3600 + secondWaveX, 50, 190, 190, 10, "./assets/img/2.Enemy/1.Pufferfish/1.Swim/2.swim1.png"),
    new RainbowPufferfishClass(3600 + secondWaveX, 750, 220, 220, 10, "./assets/img/2.Enemy/1.Pufferfish/1.Swim/3.swim1.png"),
    new GreenPufferfishClass(4200 + secondWaveX, 850, 200, 200, 10, "./assets/img/2.Enemy/1.Pufferfish/1.Swim/1.swim1.png"),
    new YellowJellyfishClass(5000 + secondWaveX, 280, 320, 320, 10, "./assets/img/2.Enemy/2 Jellyfish/Regular damage/Yellow 1.png"),

    // third Enemy-Wave
    new LilaJellyfishClass(0 + thirdWaveX, 160, 340, 340, 10, "./assets/img/2.Enemy/2 Jellyfish/Regular damage/Lila 1.png"),
    new RedPufferfishClass(900 + thirdWaveX, 720, 210, 210, 10, "./assets/img/2.Enemy/1.Pufferfish/1.Swim/2.swim1.png"),
    new YellowJellyfishClass(1800 + thirdWaveX, 300, 330, 330, 10, "./assets/img/2.Enemy/2 Jellyfish/Regular damage/Yellow 1.png"),
    new RainbowPufferfishClass(3800 + thirdWaveX, 650, 230, 230, 10, "./assets/img/2.Enemy/1.Pufferfish/1.Swim/3.swim1.png"),

    // Final Boss
    new BossClass(17100, 210, 750, 750, 10, "./assets/img/2.Enemy/3 Final Enemy/2.floating/1.png")
]