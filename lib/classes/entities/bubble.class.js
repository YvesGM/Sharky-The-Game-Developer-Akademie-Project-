export default class Bubble {
    constructor(x, y, w, h, speed, direction, imgStorage, damage = 10, type = 'normal') {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.direction = direction;
    this.imgStorage = imgStorage;

    this.damage = damage;
    this.type = type;

    this.imageCache = {};
    this.currentImg = 0;
    this.lastFrameTime = 0;
    this.startX = x;
    this.range = 800;
    this.markedForDeletion = false;

    this.loadImgStorage();
}

    draw(ctx) {
        this.move();
        this.animate();
        this.drawImg(ctx);
    }

    move() {
        this.x += this.speed * this.direction;

        if (Math.abs(this.x - this.startX) > this.range) {
            this.markedForDeletion = true;
        }
    }

    drawImg(ctx) {
        if (!this.img || !this.img.complete || this.img.naturalWidth === 0) return;

        ctx.save();

        if (this.direction < 0) {
            ctx.translate(this.x + this.w, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, 0, 0, this.w, this.h);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        }

        ctx.restore();
    }

    loadImgStorage() {
        this.imgStorage.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });

        this.img = this.imageCache[this.imgStorage[0]];
    }

    animate() {
        let now = Date.now();

        if (!this.lastFrameTime) this.lastFrameTime = now;

        if (now - this.lastFrameTime > 100) {
            let imgIndex = this.currentImg % this.imgStorage.length;
            let currentImgPath = this.imgStorage[imgIndex];

            this.img = this.imageCache[currentImgPath];
            this.currentImg++;
            this.lastFrameTime = now;
        }
    }

    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        };
    }

    isColliding(obj) {
        let a = this.getHitbox();
        let b = obj.getHitbox ? obj.getHitbox() : obj;

        return a.x + a.w > b.x &&
            a.x < b.x + b.w &&
            a.y + a.h > b.y &&
            a.y < b.y + b.h;
    }
}