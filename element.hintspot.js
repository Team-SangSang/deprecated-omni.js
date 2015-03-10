/**
 * Hintspot is guide element which previews index on the line.
 * It also provide direction bar to determine what direction structure should head to.
 *
 * @author HyunJun Kim
 * @constructor
 */
OMNI.Element.HintSpot = function () {

    /** Graphics */
    this.graphics = new PIXI.DisplayObjectContainer();

    /** Spot graphics */
    this.spot = this.createHintSpotGraphic(OMNI.Config.Line.THICKNESS_MINIMUM);
    this.graphics.addChild(this.spot);

    /** Direction graphics */
    this.directionBar = new PIXI.DisplayObjectContainer();
    this.graphics.addChild(this.directionBar);

    this.graphics.interactive = true;

    /** Tween */
    this.tween = new TWEEN.Tween(this.graphics);
    this.tweenTarget = {
        x: 0,
        y: 0,
        alpha: 1
    };
};

OMNI.Element.HintSpot.prototype = {

    get width() {
        return this.graphics.width;
    },
    set width(value) {
        this.radius = value / 2;
    },

    get height() {
        return this._radius * 2 + 2;
    },
    set height(value) {
        this.radius = value / 2;
    },

    set radius(value) {
        this._radius = Math.floor(value) + 5;
        this.spot.clear();
        this.spot.beginFill(0xFFFFFF);
        this.spot.lineStyle(2, 0x000000);
        this.spot.drawCircle(0, this._radius, this._radius);
    },

    get visible() {
        return this.tweenTarget.alpha > 0;
    },
    set visible(value) {
        if (value == true) {
            this.tweenTarget.alpha = 1;
        } else {
            this.tweenTarget.alpha = 0;
        }
        this.updateTween();
    },

    get x() {
        return this.tweenTarget.x;
    },
    set x(value) {
        this.tweenTarget.x = value;
        this.updateTween();
    },

    get y() {
        return this.tweenTarget.y;
    },
    set y(value) {
        this.tweenTarget.y = value;
        this.updateTween();
    }

}

OMNI.Element.HintSpot.prototype.update = function () {
    
}

OMNI.Element.HintSpot.prototype.updateTween = function () {

    if (this.tween) {

        // After alpha is set to zero, automatically set its visible to false.
        if (!this._afterFaded) {
            var self = this;
            this._afterFaded = function () {
                self.graphics.visible = false;
            }
        }

        if (this.tweenTarget.alpha > 0) {
            this.graphics.visible = true;
            this.tween.onComplete(null);
        } else {
            this.tween.onComplete(this._afterFaded);
        }

        this.tween.to(this.tweenTarget, 300).easing(TWEEN.Easing.Quartic.Out).start();

    } else {

        this.graphics.x = this.tweenTarget.x;
        this.graphics.y = this.tweenTarget.y;
        this.graphics.visible = this.tweenTarget.alpha > 0 ? true : false;
    }
}

OMNI.Element.HintSpot.prototype.createHintSpotGraphic = function (radius) {

    var graphics = new PIXI.Graphics();

    graphics.beginFill(0xFFFFFF);
    graphics.lineStyle(2, 0x000000);
    graphics.drawCircle(0, radius, radius);

    return graphics;
}

OMNI.Element.HintSpot.prototype.showDirectionBar = function () {

    if (this.directionBarRight == undefined) {

        this.directionBarRight = new PIXI.Sprite(PIXI.Texture.fromFrame("direction_bar_right"));
        this.directionBarLeft = new PIXI.Sprite(PIXI.Texture.fromFrame("direction_bar_left"));

        this.directionBarLeft.x = -this.directionBarLeft.width;
        //this.directionBarLeft.y = -this.directionBarLeft.height / 2;

        //this.directionBarRight.y = -this.directionBarRight.height / 2;

        this.directionBar.x = -this.directionBar.width / 2;
        //this.directionBar.y = -this.directionBar.height / 2;

        this.directionBarLeft.interactive = true;
        this.directionBarRight.interactive = true;

        this.directionBar.addChild(this.directionBarLeft);
        this.directionBar.addChild(this.directionBarRight);
    }
    this.spot.visible = false;
    this.directionBar.visible = true;
}

OMNI.Element.HintSpot.prototype.closeDirectionBar = function () {
    this.spot.visible = true;
    this.directionBar.visible = false;
}