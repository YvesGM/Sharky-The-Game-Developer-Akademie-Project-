import { GREEN_PUFFERFISH_SWIMMING } from "../../../../storage/characters/enemies/pufferfish.storage.js";
import MovableObjectsClass from "../../../world/movable-objects.class.js";

export default class GreenPufferfishClass extends MovableObjectsClass {

    constructor(x, y, w, h, speed, imgPath) {
        super(x, y, w, h, speed, imgPath);
        this.startX = x;
        this.range = 260;
        this.direction = -1;
        this.damage = 15;
        this.offset = {
            top: 15,
            right: 0,
            bottom: 45,
            left: 10
        };
        this.loadImgStorage();
    }

    // draw
    draw(ctx) {
        this.move();
        this.animateCharacters(GREEN_PUFFERFISH_SWIMMING)
        super.drawImg(ctx);
    }

    move() {
        this.x += this.speed * 0.25 * this.direction;

        if (this.x <= this.startX - this.range || this.x >= this.startX + this.range) {
            this.direction *= -1;
            this.otherDirection = this.direction > 0;
        }
    }

    loadImgStorage() {
        this.drawFrames(GREEN_PUFFERFISH_SWIMMING)
    }
}
