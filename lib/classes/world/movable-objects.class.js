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

        this.isDead = false;
        this.markedForDeletion = false;
        this.deathFrame = 0;
        this.lastDeathFrameTime = 0;

        this.offset = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }

    drawImg(ctx) {
        if (!this.img || !this.img.complete || this.img.naturalWidth === 0) return;

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

    animateOnce(currentStorage, finishedKey) {
        let now = Date.now();

        if (this[finishedKey] === undefined) {
            this[finishedKey] = false;
        }

        if (this[finishedKey]) {
            let lastImgPath = currentStorage[currentStorage.length - 1];
            this.img = this.imageCache[lastImgPath];
            return;
        }

        if (!this.lastFrameTime) this.lastFrameTime = now;

        if (now - this.lastFrameTime > 100) {
            if (this.currentImg >= currentStorage.length) {
                this[finishedKey] = true;
                this.currentImg = 0;
                return;
            }

            let currentImgPath = currentStorage[this.currentImg];
            this.img = this.imageCache[currentImgPath];
            this.currentImg++;
            this.lastFrameTime = now;
        }
    }

    animateDeath(currentStorage) {
        let now = Date.now();

        if (!this.lastDeathFrameTime) this.lastDeathFrameTime = now;

        if (now - this.lastDeathFrameTime > 120) {
            let currentImgPath = currentStorage[this.deathFrame];
            this.img = this.imageCache[currentImgPath];

            this.deathFrame++;
            this.lastDeathFrameTime = now;
        }

        if (this.deathFrame >= currentStorage.length) {
            this.markedForDeletion = true;
        }
    }

    getHitbox(camera_x = 0) {
        return {
            x: this.x + camera_x + this.offset.left,
            y: this.y + this.offset.top,
            w: this.w - this.offset.left - this.offset.right,
            h: this.h - this.offset.top - this.offset.bottom
        };
    }

    isColliding(obj, camera_x = 0) {
        let a = this.getHitbox(camera_x);
        let b = obj.getHitbox ? obj.getHitbox() : obj;

        return a.x + a.w > b.x &&
            a.x < b.x + b.w &&
            a.y + a.h > b.y &&
            a.y < b.y + b.h;
    }

    isNear(obj, range = 500) {
        let ownCenterX = this.x + this.w / 2;
        let ownCenterY = this.y + this.h / 2;

        let objCenterX = obj.x + obj.w / 2;
        let objCenterY = obj.y + obj.h / 2;

        let distanceX = ownCenterX - objCenterX;
        let distanceY = ownCenterY - objCenterY;

        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        return distance <= range;
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.speed = 0;
        this.damage = 0;
        this.currentImg = 0;
        this.deathFrame = 0;
        this.lastDeathFrameTime = 0;
    }
}