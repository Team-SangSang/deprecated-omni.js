/**
 *
 * Helper line is a line which only look like a line (not functional).
 * It works as a helper graphic.
 *
 * @author HyunJun Kim
 * @constructor
 * @param {boolean} orientation - True: vertical, False: horizontal
 */
OMNI.Element.HelperLine = function (orientation) {

    var self = this;

    /** Parent element */
    this.parent;

    /** Orientation */
    this.orientation = orientation;

    /** Graphics */
    this.graphics = this.createLineGraphics();
    this.graphics.interactive = true;

    /** Helping line */
    this.helpingLine;

    // Set initial thickness
    this._thickness = OMNI.Config.Line.MIN_THICKNESS;

    /** Tween */
    this.tween = new TWEEN.Tween(this.graphics);
    this.tweenTarget = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    if (orientation) {
        this.tweenTarget.width = this.thickness;
        this.tweenTarget.height = OMNI.Config.Line.MIN_LENGTH;
    } else {
        this.tweenTarget.width = OMNI.Config.Line.MIN_LENGTH;
        this.tweenTarget.height = this.thickness;
    }

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

    this.updateTween();
};

OMNI.Element.HelperLine.prototype = {

    get width() {
        return this.tweenTarget.width;
    },
    set width(value) {
        if (this.tweenTarget.width == value) return;

        this.tweenTarget.width = value
    },

    get height() {
        return this.tweenTarget.height;
    },
    set height(value) {
        if (this.tweenTarget.height == value) return;

        this.tweenTarget.height = value
    },

    get x() {
        return this.tweenTarget.x;
    },
    set x(value) {
        if (this.tweenTarget.x == value) return;

        this.tweenTarget.x = value;
        this.updateTween();
    },

    get y() {
        return this.tweenTarget.y;
    },
    set y(value) {
        if (this.tweenTarget.y == value) return;

        this.tweenTarget.y = value;
        this.updateTween();
    },

    get thickness() {
        return this._thickness;
    },
    set thickness(value) {
        this._thickness = value;

        if (this.orientation) {
            this.tweenTarget.width = value;
        } else {
            this.tweenTarget.height = value;
        }

        this.updateTween();
    }
}

OMNI.Element.HelperLine.prototype.updateTween = function () {

    if (this.tween) {

        this.tween.to(this.tweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();

    } else {

        this.graphics.x = this.tweenTarget.x;
        this.graphics.y = this.tweenTarget.y;
        this.graphics.width = this.tweenTarget.width;
        this.graphics.height = this.tweenTarget.height;
    }
}

OMNI.Element.HelperLine.prototype.createLineGraphics = function () {

    var lineGraphics = new PIXI.Graphics();

    lineGraphics.beginFill(0);
    lineGraphics.drawRect(0, 0, 10, 10);

    return lineGraphics;
}

/**
 *
 * Turn on/off highlight effect of the line.
 *
 * @param {boolean} on - If set to true, turn the highlight on. If set to false, turn the highlight off.
 */
OMNI.Element.HelperLine.prototype.highlight = function (on) {

    OMNI.Config.Line.HIGHLIGHT_FILTER[0].matrix = OMNI.Config.Line.HIGHLIGHT_MATRIX;

    if (on == true) {
        this.graphics.filters = OMNI.Config.Line.HIGHLIGHT_FILTER;
    } else {
        this.graphics.filters = null;        
    }
}