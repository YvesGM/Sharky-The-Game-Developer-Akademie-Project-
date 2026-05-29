export default class StaticObjectsClass {
    constructor(x, y, w, h, imgPath) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = new Image();
        this.img.src = imgPath;
        this.isCollected = false;
        this.offset = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }

    drawImg(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }

    getHitbox() {
        return {
            x: this.x + this.offset.left,
            y: this.y + this.offset.top,
            w: this.w - this.offset.left - this.offset.right,
            h: this.h - this.offset.top - this.offset.bottom
        };
    }
}