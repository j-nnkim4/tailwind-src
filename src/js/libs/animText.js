module.exports.AnimText = function() {

    this.init = function(x, y, scale, speed, life, text, color, font, lineWidth = 12, track) {
        this.x = x;
        this.y = y;
        this.track = track;
        this.color = color;
        this.scale = scale;
        this.startScale = this.scale;
        this.maxScale = scale * 1.5;
        this.scaleSpeed = 0.7;
        this.speed = speed;
        this.life = life;
        this.text = text;
        this.lineWidth = lineWidth;
        this.font = font || "Hammersmith One";
    };

    this.update = function(delta) {
        if (this.life) {
            this.life -= delta;
            this.y -= this.speed * delta;
            this.scale += this.scaleSpeed * delta;
            if (this.scale >= this.maxScale) {
                this.scale = this.maxScale;
                this.scaleSpeed *= -1;
            } else if (this.scale <= this.startScale) {
                this.scale = this.startScale;
                this.scaleSpeed = 0;
            }
            if (this.life <= 0) {
                this.life = 0;
            }
        }
    };

    this.render = function(ctxt, xOff, yOff) {
        var wx = this.track ? (this.track.xWiggle || 0) : 0;
        var wy = this.track ? (this.track.yWiggle || 0) : 0;
        ctxt.fillStyle = this.color;
        ctxt.font = this.scale + "px " + this.font;
        if (this.lineWidth > 0) {
            ctxt.strokeStyle = "#2b2d30";
            ctxt.lineWidth = this.lineWidth;
            ctxt.strokeText(this.text, this.x + wx - xOff, this.y + wy - yOff);
        }
        ctxt.fillText(this.text, this.x + wx - xOff, this.y + wy - yOff);
    };

}

module.exports.TextManager = function() {
    this.texts = [];

    this.update = function(delta, ctxt, xOff, yOff) {
        ctxt.textBaseline = "middle";
        ctxt.textAlign = "center";
        for (var i = 0; i < this.texts.length; ++i) {
            if (this.texts[i].life) {
                this.texts[i].update(delta);
                this.texts[i].render(ctxt, xOff, yOff);
            }
        }
    };

    this.showText = function(x, y, scale, speed, life, text, color, font, lineWidth, track) {
        var tmpText;
        for (var i = 0; i < this.texts.length; ++i) {
            if (!this.texts[i].life) {
                tmpText = this.texts[i];
                break;
            }
        }
        if (!tmpText) {
            tmpText = new module.exports.AnimText();
            this.texts.push(tmpText);
        }
        tmpText.init(x, y, scale, speed, life, text, color, font, lineWidth, track);
    };
}
