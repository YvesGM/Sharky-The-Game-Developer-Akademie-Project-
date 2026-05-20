import { YELLOW_JELLYFISH_SWIMMING } from "../../../../storage/characters/enemies/jellyfish.storage.js";
import MovableObjectsClass from "../../../world/movable-objects.class.js";

export default class YellowJellyfishClass extends MovableObjectsClass {

    constructor(x, y, w, h, speed, imgPath) {
        super(x, y, w, h, speed, imgPath);
        this.enemyType = 'jellyfish';
        this.startY = y;
        this.range = 170;
        this.direction = 1;
        this.damage = 20;
        this.offset = {
            top: 30,
            right: 50,
            bottom: 50,
            left: 50
        };
        this.loadImgStorage();
    }

    // draw
    draw(ctx) {
        this.move();
        this.animateCharacters(YELLOW_JELLYFISH_SWIMMING)
        super.drawImg(ctx);
    }

    move() {
        this.y += this.speed * 0.25 * this.direction;

        if (this.y <= this.startY - this.range || this.y >= this.startY + this.range) {
            this.direction *= -1;
            this.otherDirection = this.direction > 0;
        }
    }

    loadImgStorage() {
        this.drawFrames(YELLOW_JELLYFISH_SWIMMING)
    }
}