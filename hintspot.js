/**
 * 힌트스팟은 라인 위의 인덱스를 표현해 줍니다. 
 *
 * @constructor
 */
OMNI.Hintspot = function () {

    /** 그래픽 */
    this.graphics = new PIXI.DisplayObjectContainer();

    this._spotGraphics = this._createHintSpotGraphic(10);
    this._directionBarGraphics = new PIXI.DisplayObjectContainer();

    this.graphics.addChild(this._spotGraphics);
    this.graphics.addChild(this._directionBarGraphics);
    this.graphics.interactive = true;

    // 트윈

    this._tween = new TWEEN.Tween(this.graphics);
    this._targetValues = {
        x: 0,
        y: 0,
        alpha: 1
    };
};

OMNI.Hintspot.prototype = {

    /** 힌트스팟 x 좌표 */
    get x() {
        return this._targetValues.x;
    },
    set x(value) {
        this._targetValues.x = value;
        this._updateTween();
    },

    /** 힌트스팟 y 좌표 */
    get y() {
        return this._targetValues.y;
    },
    set y(value) {
        this._targetValues.y = value;
        this._updateTween();
    },

    /** 힌트스팟 가로 길이 */
    get width() {
        return this.graphics.width;
    },

    /** 힌트스팟 세로 길이 */
    get height() {
        return this._radius * 2 + 2;
    },

    /** 힌트스팟 반지름 */
    set radius(value) {
        this._radius = Math.floor(value) + 5;
        this._spotGraphics.clear();
        this._spotGraphics.beginFill(0xFFFFFF);
        this._spotGraphics.lineStyle(2, 0x000000);
        this._spotGraphics.drawCircle(0, this._radius, this._radius);
    },

    /** 힌트스팟 가시성 */
    get visible() {
        return this._targetValues.alpha > 0;
    },
    set visible(value) {
        if (value == true) {
            this._targetValues.alpha = 1;
        } else {
            this._targetValues.alpha = 0;
        }
        this._updateTween();
    }
}

OMNI.Hintspot.prototype.update = function () {
}

/** 트윈 업데이트 */
OMNI.Hintspot.prototype._updateTween = function () {

    if (this._tween) {

        if (!this._afterFaded) {
            var self = this;
            this._afterFaded = function () {
                self.graphics.visible = false;
            }
        }

        if (this._targetValues.alpha > 0) {

            this.graphics.visible = true;
            this._tween.onComplete(null);

        } else {

            this._tween.onComplete(this._afterFaded);
        }

        this._tween.to(this._targetValues, 300).easing(TWEEN.Easing.Quartic.Out).start();

    } else {

        this.graphics.x = this._targetValues.x;
        this.graphics.y = this._targetValues.y;
        this.graphics.visible = this._targetValues.alpha > 0 ? true : false;
    }
}

/** 힌트스팟을 표시합니다. */
OMNI.Hintspot.prototype.show = function () {
    this.visible = true;
}

/** 힌트스팟을 표시하지 않습니다. */
OMNI.Hintspot.prototype.hide = function () {
    this.visible = false;
}

OMNI.Hintspot.prototype._createHintSpotGraphic = function (radius) {

    var graphics = new PIXI.Graphics();

    graphics.beginFill(0xFFFFFF);
    graphics.lineStyle(2, 0x000000);
    graphics.drawCircle(0, radius, radius);

    return graphics;
}

OMNI.Hintspot.prototype.showDirectionBar = function () {

    if (this.directionBarRight == undefined) {

        this.directionBarRight = new PIXI.Sprite(PIXI.Texture.fromFrame("direction_bar_right"));
        this.directionBarLeft = new PIXI.Sprite(PIXI.Texture.fromFrame("direction_bar_left"));

        this.directionBarLeft.x = -this.directionBarLeft.width;

        this._directionBarGraphics.x = -this._directionBarGraphics.width / 2;

        this.directionBarLeft.interactive = true;
        this.directionBarRight.interactive = true;

        this._directionBarGraphics.addChild(this.directionBarLeft);
        this._directionBarGraphics.addChild(this.directionBarRight);
    }
    this._spotGraphics.visible = false;
    this._directionBarGraphics.visible = true;
}

OMNI.Hintspot.prototype.closeDirectionBar = function () {
    this._spotGraphics.visible = true;
    this._directionBarGraphics.visible = false;
}