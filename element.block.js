/**
 *
 * 블록
 *
 */
OMNI.Element.Block = function () {

    // 부모 객체(라인)
    this.parent;

    var size = Math.random() * 60 + 45;

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(Math.random() * 0xFFFFFF);
    this.graphics.lineStyle(2, 0x000000);
    this.graphics.drawRect(0, 0, size, size / 4);

    this.graphics.x = -size / 2;

    this.graphics.interactive = true;

    // 트윈
    this.tween = new TWEEN.Tween(this.graphics);
    this.tweenTarget = {
        x: 0,
        y: 0,
        width: this.graphics.width,
        height: this.graphics.height
    };

};

OMNI.Element.Block.prototype = {

    get width() {
        return this.tweenTarget.width;
    },
    set width(value) {
        if(this.tweenTarget.width == value) return;

        this.tweenTarget.width = value
    },

    get height() {
        return this.tweenTarget.height;
    },
    set height(value) {
        if(this.tweenTarget.height == value) return;
        
        this.tweenTarget.height = value
    },

    get x() {
        return this.tweenTarget.x;
    },
    set x(value) {
        if(this.tweenTarget.x == value) return;
        
        this.tweenTarget.x = value;
        this.updateTween();
    },

    get y() {
        return this.tweenTarget.y;
    },
    set y(value) {
        if(this.tweenTarget.y == value) return;
        
        this.tweenTarget.y = value;
        this.updateTween();
    }

}

/**
 *
 * 그래픽, 위치 업데이트
 *
 */
OMNI.Element.Block.prototype.update = function () {
    // TODO
}

/**
 *
 * 트윈 업데이트
 *
 */
OMNI.Element.Block.prototype.updateTween = function () {

    if (this.tween) {
        this.tween.to(this.tweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();

    } else {

        this.graphics.x = this.tweenTarget.x;
        this.graphics.y = this.tweenTarget.y;
        this.graphics.width = this.tweenTarget.width;
        this.graphics.height = this.tweenTarget.height;
    }
}

/**
 *
 * 블록에 하이라이트 효과를 준다.
 *
 */
OMNI.Element.Block.prototype.highlight = function (on) {
    // TODO
}