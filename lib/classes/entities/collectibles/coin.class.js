import { COIN } from "../../../storage/entities/collectibles.storage.js";
import StaticObjectsClass from "../../world/static-objects.class.js";

export default class CoinClass extends StaticObjectsClass {

    constructor(x, y, w, h, imgPath) {
        super(x, y, w, h, imgPath);
        this.imageCache = {};
        this.currentImg = 0;
        this.lastFrameTime;
        this.value = 1;
        this.offset = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        };
        this.loadImgStorage();
    }

    draw(ctx) {
        if (this.isCollected) return;
        this.animate(COIN);
        super.drawImg(ctx);
    }

    loadImgStorage() {
        COIN.forEach(path => {
            let storageImg = new Image();
            storageImg.src = path;
            this.imageCache[path] = storageImg;
        });
    }

    animate(currentStorage) {
        let now = Date.now();

        if (!this.lastFrameTime) this.lastFrameTime = now;

        if (now - this.lastFrameTime > 140) {
            let imgIndex = this.currentImg % currentStorage.length;
            let currentImgPath = currentStorage[imgIndex];
            this.img = this.imageCache[currentImgPath];
            this.currentImg++;
            this.lastFrameTime = now;
        }
    }
}
