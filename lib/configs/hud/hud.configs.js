import HudBar from "../../classes/hud/hud-bar.class.js";
import { LIFEBAR, COINBAR, POISONBAR } from "../../storage/hud/hud.storage.js";

export const HUD = {
        lifebar: new HudBar( 50, 0, 600, 160, LIFEBAR, 4 ),
        coinbar: new HudBar( 80, 150, 350, 100, COINBAR, 0 ),
        poisonbar: new HudBar( 80, 250, 350, 100, POISONBAR, 0 )
};