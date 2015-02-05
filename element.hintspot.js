/**
 *
 * 힌트 스팟
 *
 */
OMNI.Element.HintSpot = function() {

    this.graphics = new PIXI.DisplayObjectContainer();

    this.spot = new PIXI.Graphics();
    this.spot.beginFill(0xFFFFFF);
    this.spot.lineStyle(2, 0x000000);
    this.spot.drawCircle(0, 0, OMNI.Graphics.LINE_THICKNESS / 2);

    this.directionBar = new PIXI.DisplayObjectContainer();

    this.graphics.interactive = true;
    this.graphics.addChild(this.spot);    
    this.graphics.addChild(this.directionBar);
};

// public 메서드
OMNI.Element.HintSpot.prototype = {
    
    get width () { return this._radius; },
    set width (value) {
        this.radius = value / 2;
    },

    get height () { return this._radius; },
    set height (value) {
        this.radius = value / 2;
    },

    set radius (value) {
        this._radius = Math.floor(value) + 5;

        this.spot.clear();
        this.spot.beginFill(0xFFFFFF);
        this.spot.lineStyle(3, 0x000000);
        this.spot.drawCircle(0, 0, this._radius);
    },

    get x () { return this.graphics.x; },
    set x (value) { this.graphics.x = value; },

    get y () { return this.graphics.y; },
    set y (value) { this.graphics.y = value; }

}

OMNI.Element.HintSpot.prototype.showDirectionBar = function() {

    if (this.directionBarRight == undefined) {        

        this.directionBarRight = new PIXI.Sprite(PIXI.Texture.fromFrame("direction_bar_right"));
        this.directionBarLeft = new PIXI.Sprite(PIXI.Texture.fromFrame("direction_bar_left"));

        this.directionBarLeft.x = - this.directionBarLeft.width;
        this.directionBarLeft.y = - this.directionBarLeft.height / 2;

        this.directionBarRight.y = - this.directionBarRight.height / 2;

        this.directionBar.x = - this.directionBar.width / 2;
        this.directionBar.y = - this.directionBar.height / 2;

        this.directionBarLeft.interactive = true;
        this.directionBarRight.interactive = true;

        this.directionBar.addChild(this.directionBarLeft);
        this.directionBar.addChild(this.directionBarRight);
    }
    this.spot.visible = false;
    this.directionBar.visible = true;
}

OMNI.Element.HintSpot.prototype.closeDirectionBar = function() {
    this.spot.visible = true;
    this.directionBar.visible = false;
}