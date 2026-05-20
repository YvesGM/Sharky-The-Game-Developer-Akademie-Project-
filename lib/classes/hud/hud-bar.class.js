import StaticObjectsClass from "../world/static-objects.class.js";

export default class HudBar extends StaticObjectsClass {

    constructor(x, y, w, h, imgStorage, startIndex = 0) {
        super(x, y, w, h, imgStorage[startIndex]);

        this.imgStorage = imgStorage;
        this.currentIndex = startIndex;
    }

    setImageByIndex(index) {
        let safeIndex = Math.max(0, Math.min(index, this.imgStorage.length - 1));

        if (this.currentIndex === safeIndex) return;

        this.currentIndex = safeIndex;
        this.img.src = this.imgStorage[this.currentIndex];
    }

    draw(ctx) {
        super.drawImg(ctx);
    }
}