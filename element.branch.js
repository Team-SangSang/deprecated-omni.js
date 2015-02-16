 /**
 *
 * Branch element is literally a branch that splits one line into two.
 * In Omni.js, branch component works as 'if statement', which diverges by a specific condition.
 * 
 * @author HyunJun Kim
 * @constructor
 * @param {boolean} orientation - True: Right, False: Left 
 */
OMNI.Element.Branch = function (orientation) {

    var self = this;

    /** Parent line */
    this.parent;

    /** Graphics */
    this.graphics = new PIXI.DisplayObjectContainer();
    this.ifContainer = new PIXI.DisplayObjectContainer();
    this.elseContainer = new PIXI.DisplayObjectContainer();

    this._thickness = OMNI.Config.Line.THICKNESS_MINIMUM;

    /* Entry block(condition block) */
    this.entry = new OMNI.Element.Block();

    /** Splited lines */
    this.ifLine = new OMNI.Element.Line();
    this.elseLine = new OMNI.Element.Line();

    /** horizontal helper lines */
    this.horizontal_top = new OMNI.Element.HelperLine(false);
    this.horizontal_bottom = new OMNI.Element.HelperLine(false);

    /** helper arrow sprite */
    this.arrow = new OMNI.Element.Arrow(0);

    if (orientation == false) {
        this.arrow.direction = 4;
    } else {
        this.arrow.direction = 3;
    }

    // Set initial orientation value
    this.orientation_ = orientation;

    // Set parent of children to this.
    this.entry.parent = this;
    this.ifLine.parent = this;
    this.elseLine.parent = this;
    this.horizontal_top.parent = this;
    this.horizontal_bottom.parent = this;

    this.ifContainer.addChild(this.horizontal_top.graphics);
    this.ifContainer.addChild(this.horizontal_bottom.graphics);
    this.ifContainer.addChild(this.ifLine.graphics);
    this.ifContainer.addChild(this.arrow.graphics);

    this.elseContainer.addChild(this.elseLine.graphics);

    this.graphics.addChild(this.ifContainer);
    this.graphics.addChild(this.elseContainer);
    this.graphics.addChild(this.ifLine.elementsContainer);
    this.graphics.addChild(this.elseLine.elementsContainer);
    this.graphics.addChild(this.entry.graphics);

    // Set event listeners

    this.ifContainer.interactive = true;
    this.elseContainer.interactive = true;

    this.ifContainer.mouseover = function (eventData) {
        self.highlightIf(true);
    };
    this.ifContainer.mouseout = function (eventData) {
        self.highlightIf(false);
    };
    this.elseContainer.mouseover = function (eventData) {
        self.highlightElse(true);
    };
    this.elseContainer.mouseout = function (eventData) {
        self.highlightElse(false);
    };
    this.entry.mouseover = function (eventData) {
        self.highlightEntry(true);
    };
    this.entry.mouseout = function (eventData) {
        self.highlightEntry(false);
    };

    /** Tween */
    this.tween = new TWEEN.Tween(this.graphics);    
    this.tweenTarget = {x:0, y:0};

    this.update();
};

OMNI.Element.Branch.prototype = {

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
    },

    get width() {
        return this.widthOfLeft + this.widthOfRight;
    },
    get height() {
        return this.targetHeight;
    },
    get widthOfLeft() {
        if (this.orientation) {
            return Math.max(this.elseLine.elementsWidthOfLeft, this.entry.width / 2);
        } else {
            return this.horizontal_top.width + this.ifLine.elementsWidthOfLeft;
        }
    },
    get widthOfRight() {
        if (this.orientation) {
            return this.horizontal_top.width + this.ifLine.elementsWidthOfRight;
        } else {
            return Math.max(this.elseLine.elementsWidthOfRight, this.entry.width / 2);
        }
    },

    get thickness() {
        return this._thickness;
    },
    set thickness(value) {
        this._thickness = value;
        this.ifLine.thickness = value;
        this.elseLine.thickness = value;
        this.horizontal_top.thickness = value;
        this.horizontal_bottom.thickness = value;
    },

    get orientation() {
        return this.orientation_;
    },
    set orientation(value) {
        this.orientation_ = value;
        if (value == false) {
            this.arrow.direction = 4;
        } else {
            this.arrow.direction = 3;
        }
        this.update();
    }

}

/**
 *
 * Update size of the current branch and align child elements.
 *
 */
OMNI.Element.Branch.prototype.update = function () {

    // The thickness of branch is determined by maximum thickness of its two child lines.
    // line set thickness -> update all children structures. by not 'thickness' but direct setting.

    var maximumThickness = Math.max(this.ifLine.thickness, this.elseLine.thickness);

    this.thickness = maximumThickness;

    // Align entry block to center.

    this.entry.x = - this.entry.width / 2;
    this.entry.y = 0;

    // Vertical height is determined by maximum height of its two child lines.

    var maximumLineHeight = Math.max(this.ifLine.elementsHeight, this.elseLine.elementsHeight);

    this.ifLine.height = maximumLineHeight;
    this.elseLine.height = maximumLineHeight  + this.thickness;

    // Horizontal width determination.

    var maximumLineWidth;

    if (this.orientation == true) {
        maximumLineWidth = Math.max(this.entry.width / 2, this.elseLine.elementsWidthOfRight);
        maximumLineWidth += Math.max(this.ifLine.elementsWidthOfLeft, OMNI.Config.Line.LENGTH_MINIMUM) + OMNI.Config.Line.SPACING_X;
    } else {
        maximumLineWidth = Math.max(this.entry.width / 2, this.elseLine.elementsWidthOfLeft);
        maximumLineWidth += Math.max(this.ifLine.elementsWidthOfRight, OMNI.Config.Line.LENGTH_MINIMUM) + OMNI.Config.Line.SPACING_X;
    }

    this.horizontal_top.width = maximumLineWidth;
    this.horizontal_bottom.width = maximumLineWidth;

    // Align lines.

    // Right
    if (this.orientation == true) {

        this.horizontal_top.x = 0;
        this.horizontal_top.y = (this.entry.height - this.horizontal_top.height) / 2;

        this.horizontal_bottom.x = this.horizontal_top.x;
        this.horizontal_bottom.y = this.horizontal_top.y + maximumLineHeight + this.thickness;

        this.ifLine.x = maximumLineWidth - this.thickness / 2;
        this.ifLine.y = this.horizontal_top.y + this.thickness;

        this.elseLine.x = 0;
        this.elseLine.y = this.ifLine.y;

        this.arrow.y = this.horizontal_bottom.y - this.arrow.height / 2 + this.thickness / 2;
    }

    // Left
    else {

        this.horizontal_top.x = - this.horizontal_top.width;
        this.horizontal_top.y = (this.entry.height - this.horizontal_top.height) / 2;

        this.horizontal_bottom.x = this.horizontal_top.x;
        this.horizontal_bottom.y = this.horizontal_top.y + maximumLineHeight + this.thickness;

        this.ifLine.x = - maximumLineWidth + this.thickness / 2;;
        this.ifLine.y = this.horizontal_top.y + this.thickness;

        this.elseLine.x = 0;
        this.elseLine.y = this.ifLine.y;

        this.arrow.y = this.horizontal_bottom.y - this.arrow.height / 2 + this.thickness / 2;
    }

    this.targetHeight = maximumLineHeight + this.entry.height / 2 + this.thickness + OMNI.Config.Line.SPACING_Y + 10;

    // Update parent line

    if (this.parent != undefined) {
        this.parent.update();
    }
}


OMNI.Element.Branch.prototype.updateTween = function () {

    if (this.tween) {

        this.tween.to(this.tweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();

    } else {

        this.graphics.x = this.tweenTarget.x;
        this.graphics.y = this.tweenTarget.y;
    }
}

/**
 *
 * 진입점에 하이라이트 효과를 준다.
 *
 */
OMNI.Element.Branch.prototype.highlightEntry = function (on) {
    if (on) {
        this.entry.highlight(true);
    } else {
        this.entry.highlight(false);
    }
}


/**
 *
 * if라인에 하이라이트 효과를 준다.
 *
 */
OMNI.Element.Branch.prototype.highlightIf = function (on) {
    if (on) {
        this.ifLine.highlight(true);
        this.horizontal_top.highlight(true);
        this.horizontal_bottom.highlight(true);
        this.arrow.highlight(true);
    } else {
        this.ifLine.highlight(false);
        this.horizontal_top.highlight(false);
        this.horizontal_bottom.highlight(false);
        this.arrow.highlight(false);
    }
}

/**
 *
 * else라인에 하이라이트 효과를 준다.
 *
 */
OMNI.Element.Branch.prototype.highlightElse = function (on) {

    if (on) {
        this.elseLine.highlight(true);
    } else {
        this.elseLine.highlight(false);
    }

}