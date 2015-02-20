/**
 * Arrow Graphics
 *
 * @author HyunJun Kim
 * @constructor
 * @param {int} direction - 1: Up, 2: Down, 3: Left, 4: Right
 */
OMNI.Element.Arrow = function (direction) {

    var self = this;

	/** Graphics */
	this.graphics = new PIXI.Sprite(PIXI.Texture.fromFrame("arrow_horizontal"));
    this.graphics.interactive = true;
    this.graphics.pivot = new PIXI.Point(0, this.graphics.height / 2);

    /** Helping Line */
    this.helpingLine;

	/** Tween */
	this.tween = new TWEEN.Tween(this.graphics);
	this.tweenTarget = {x:0, y:0};

	// set direction
	this.direction = direction;

    this.graphics.mouseover = function (e) {
        if (self.helpingLine) {
            self.helpingLine.highlight(true);
        }
    }
    this.graphics.mouseout = function (e) {
        if (self.helpingLine) {
            self.helpingLine.highlight(false);
        }
    }
	
}

OMNI.Element.Arrow.prototype = {

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
    },

    get width() {
        return this.graphics.width;
    },
    set width(value) {
        this.graphics.width = value;
    },

    get height() {
        return this.graphics.height;
    },
    set height(value) {
        this.graphics.height = value;
    },

    get direction() {
        return this._direction;
    },
    set direction(value) {
        this._direction = value;
        switch (value) {
        case 1: // Up
			this.graphics.rotation = Math.PI / 2;
			break;		
		case 2: // Down	
			this.graphics.rotation = - Math.PI / 2;
			break;			
		case 4: // Right
            this.graphics.rotation = - Math.PI;
			//this.graphics.scale = new PIXI.Point(-1,1);
			break;		
		default: // Left	
		}
    }

}

OMNI.Element.Arrow.prototype.updateTween = function(){

	if (this.tween) {

		this.tween.to(this.tweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();

	} else {

		this.graphics.x = this.tweenTarget.x;
		this.graphics.y = this.tweenTarget.y;
	}
}

/**
 *
 * Turn on/off highlight effect of the arrow.
 *
 * @param {boolean} on - If set to true, turn the highlight on. If set to false, turn the highlight off.
 */
OMNI.Element.Arrow.prototype.highlight = function (on) {

    OMNI.Config.Line.HIGHLIGHT_FILTER[0].matrix = OMNI.Config.Line.HIGHLIGHT_MATRIX;

    if (on == true) {
        this.graphics.filters = OMNI.Config.Line.HIGHLIGHT_FILTER;
    } else {
        this.graphics.filters = null;        
    }
}