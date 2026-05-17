export default class MovableObjectsClass {
    constructor(x, y, w, h, speed, imgPath) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.img = new Image();
        this.img.src = imgPath;
        this.imageCache = {};
        this.currentImg = 0;
        this.lastFrameTime;
        this.otherDirection = false;
    }

    drawImg(ctx) {
        if (!this.img.complete) return
        ctx.save();

        if (this.otherDirection) {
            ctx.translate(this.x + this.w, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, 0, 0, this.w, this.h);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        }

        ctx.restore();
    }

    drawFrames(storage) {
        storage.forEach(path => {
            let storageImg = new Image();
            storageImg.src = path;
            this.imageCache[path] = storageImg;
        });
    }

    animateCharacters(currentStorage) {
        let now = Date.now();

        if (!this.lastFrameTime) this.lastFrameTime = now;

        if (now - this.lastFrameTime > 100) {
            let imgIndex = this.currentImg % currentStorage.length;
            let currentImgPath = currentStorage[imgIndex];
            this.img = this.imageCache[currentImgPath];
            this.currentImg++;
            this.lastFrameTime = now;
        }
    }
}