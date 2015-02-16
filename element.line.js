OMNI.Config.Line = {

    // Gap between lines.
    SPACING_X: 20,

    // Gap between elements.
    SPACING_Y: 15,

    LENGTH_MINIMUM: 20,

    HIGHLIGHT_MATRIX: [
        1, 0, 0, 0.5,
        0, 1, 0, 0.5,
        0, 0, 1, 0.5,
        0, 0, 0, 1],
    HIGHLIGHT_FILTER: [new PIXI.ColorMatrixFilter()],

    THICKNESS_MINIMUM: 7,
    THICKNESS_MAXIMUM: 40,
    THICKNESS_INCREMENT: 1.5,
    THICKNESS_INCREMENT_OVERLAP: 0.2
}

/**
 * Represents a line that codes are being placed on. 
 * It expresses the flow of the program. It is the fundamental ingredient of overall logic.
 *
 * @author HyunJun Kim
 * @constructor
 */
OMNI.Element.Line = function () {

    var self = this;

    /** Parent element */
    this.parent;

    /** Graphics */
    this.graphics = new PIXI.DisplayObjectContainer();

    this.lineGraphicsContainer = new PIXI.DisplayObjectContainer();
    this.elementsContainer = new PIXI.DisplayObjectContainer();
    
    this.graphics.addChild(this.lineGraphicsContainer);

    /** Line Graphics */
    this.lineGraphics = this.createLineGraphics();
    this.lineGraphicsContainer.addChild(this.lineGraphics);

    /** Line Hintspot */
    this.hintspot = new OMNI.Element.HintSpot();
    this.hintspot.visible = false;
    this.lineGraphicsContainer.addChild(this.hintspot.graphics);

    /** Line thickness */
    this.lineGraphics.width = OMNI.Config.Line.THICKNESS_MINIMUM;
    this.lineGraphics.height = OMNI.Config.Line.LENGTH_MINIMUM;
    this._thickness = OMNI.Config.Line.THICKNESS_MINIMUM;

    /** connected helper lines */
    this.helperLines = [];

    /** Children elements */
    this.elements = [];

    /** Tween */
    this.tween = new TWEEN.Tween(this.graphics);
    this.lineGraphicsTween = new TWEEN.Tween(this.lineGraphics);
    this.elementsContainerTween = new TWEEN.Tween(this.elementsContainer);

    this.tweenTarget = {
        x: 0,
        y: 0
    };
    this.lineTweenTarget = {
        x: - this.thickness / 2,
        width: this.lineGraphics.width,
        height: this.lineGraphics.height
    };

    this.maximumElementsWidthOfRight = 0;
    this.maximumElementsWidthOfLeft = 0;
    this.maximumElementsHeight = 0;

    this.lineGraphicsContainer.interactive = true;

    if(OMNI.Shared.CC == undefined) {
        this.csc = true;
        OMNI.Shared.CC = 1;
    }

    this.lineGraphicsContainer.mouseover = function (e) {
        
        if (OMNI.Shared.currentOccupied) {
            return;
        } else {
            OMNI.Shared.currentOccupied = self;
        }

        self.onMouseRollOver(e);
    }
    this.lineGraphicsContainer.mouseout = function (e) {
        
        if (OMNI.Shared.currentOccupied != self) {
            return;
        } else {
            OMNI.Shared.currentOccupied = null;
        }

        self.onMouseRollOut(e);
    }

    this.update();
};

OMNI.Element.Line.prototype = {

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

    get height() {
        return this.lineTweenTarget.height;
    },
    set height(value) {
        if(this.lineTweenTarget.height == value) return;
        
        this.lineTweenTarget.height = value;
        this.updateTween();
    },   

    get elementsWidth() {
        return this.maximumElementsWidthOfRight + this.maximumElementsWidthOfLeft;
    },
    get elementsHeight() {
        return this.maximumElementsHeight;
    },

    get elementsWidthOfRight() {
        return this.maximumElementsWidthOfRight;
    },
    get elementsWidthOfLeft() {
        return this.maximumElementsWidthOfLeft;
    },

    get thickness() {
        return this._thickness;
    },
    set thickness(value) {

        this._thickness = value;

        if (!this.parent) {
            this.syncThickness(value); 
        }
    }
}

/**
 *
 * Update size of the current line and align child elements.
 *
 */
OMNI.Element.Line.prototype.update = function () {

    var maximumThickness = OMNI.Config.Line.THICKNESS_MINIMUM;

    // Current line thickness is the maximum thickness in child elements + a.

    for (var i in this.elements) {

        var element = this.elements[i];
        
        if (element instanceof OMNI.Element.Branch) {
            if (element.thickness > maximumThickness) {
                maximumThickness = element.thickness;
            }
        }
    }

    this.thickness = maximumThickness + OMNI.Config.Line.THICKNESS_INCREMENT;
    
    // Align child elements.

    this.maximumElementsWidthOfRight = 0;
    this.maximumElementsWidthOfLeft = 0;

    var accumulatedHeight = this.thickness + OMNI.Config.Line.SPACING_Y;

    for (var i in this.elements) {

        var element = this.elements[i];

        // Align X-Axis

        // Blocks: Center align.
        if (element instanceof OMNI.Element.Block) {

            element.x = - element.width / 2;

            var halfWidth = - element.x;

            if (halfWidth > this.maximumElementsWidthOfRight) {
                this.maximumElementsWidthOfRight = halfWidth;
            }
            if (halfWidth > this.maximumElementsWidthOfLeft) {
                this.maximumElementsWidthOfLeft = halfWidth;
            }

        }

        // Structures: (0, y) align.
        else if (element instanceof OMNI.Element.Branch) {
            element.x = 0;

            if (element.widthOfRight > this.maximumElementsWidthOfRight) {
                this.maximumElementsWidthOfRight = element.widthOfRight;
            }
            if (element.widthOfLeft > this.maximumElementsWidthOfLeft) {
                this.maximumElementsWidthOfLeft = element.widthOfLeft;
            }
        }

        // Align Y-Axis

        element.y = accumulatedHeight;

        accumulatedHeight += element.height + OMNI.Config.Line.SPACING_Y;

    };

    // Update line height

    this.maximumElementsHeight = Math.max(OMNI.Config.Line.LENGTH_MINIMUM, accumulatedHeight + this.thickness);

    this.height = this.maximumElementsHeight;

    // Update parent element

    if (this.parent != undefined) {
        this.parent.update();
    }
}

OMNI.Element.Line.prototype.createLineGraphics = function () {

    var lineGraphics = new PIXI.Graphics();

    lineGraphics.beginFill(0);
    lineGraphics.drawRect(0, 0, 10, 10);

    return lineGraphics;
}

OMNI.Element.Line.prototype.updateTween = function () {

    if (this.tween) {

        this.tween.to(this.tweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();
        this.elementsContainerTween.to(this.tweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();
        this.lineGraphicsTween.to(this.lineTweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();

    } else {

        this.graphics.x = this.tweenTarget.x;
        this.graphics.y = this.tweenTarget.y;
        this.lineGraphics.width = this.lineTweenTarget.width;
        this.lineGraphics.height = this.lineTweenTarget.height;
        this.lineGraphics.x = -this.lineTweenTarget.width / 2;
    }

}

/**
 *
 * Set helper lines such as HelperLine or Arrow
 *
 * @param {Array} helperLines
 */
OMNI.Element.Line.prototype.setHelperLines = function (helperLines) {    

    this.helperLines = [];

    for (var i = 0; i < helperLines.length; i++) {

        var helperLine = helperLines[i];

        if (helperLine instanceof OMNI.Element.HelperLine || helperLine instanceof OMNI.Element.Arrow) {
            this.helperLines.push(helperLine);
            helperLine.helpingLine = this;
        }
    }
}

/**
 *
 * Sync thickness of self and children else lines.
 *
 * @param {OMNI.Element} element - The element to add.
 */
OMNI.Element.Line.prototype.syncThickness = function (thickness) {

    if (thickness > OMNI.Config.Line.THICKNESS_MAXIMUM) {
        thickness = OMNI.Config.Line.THICKNESS_MAXIMUM;
    }

    this.lineTweenTarget.width = thickness;
    this.lineTweenTarget.x = - thickness / 2;

    this.hintspot.radius = thickness / 2;

    // Update child else line

    for (var i in this.elements) {

        var element = this.elements[i];

        if (element instanceof OMNI.Element.Branch) {

            element.elseLine.syncThickness(thickness + OMNI.Config.Line.THICKNESS_INCREMENT_OVERLAP);
            element.ifLine.syncThickness(element.ifLine.thickness);
        }
    }

    this.updateTween();
}

/**
 *
 * Add new element to the line.
 *
 * @param {OMNI.Element} element - The element to add.
 */
OMNI.Element.Line.prototype.addElement = function (element) {

    if (!element) return;

    element.parent = this;

    this.elementsContainer.addChild(element.graphics);
    this.elements.push(element);

    this.update();
}

/**
 *
 * Add new element to specific position of the line.
 *
 * @param {OMNI.Element} element - The element to add.
 * @param {int} index
 */
OMNI.Element.Line.prototype.addElementAt = function (element, index) {

    if (!element) return;

    element.parent = this;

    this.elementsContainer.addChild(element.graphics);
    this.elements.splice(index, 0, element);

    this.update();
}

/**
 *
 * Remove the element from the line.
 *
 * @param {OMNI.Element} element - The element to remove.
 */
OMNI.Element.Line.prototype.removeElement = function (element) {

    if (!element) return;

    var index = this.elements.indexOf(element);

    if (index > -1) {
        element.parent = null;

        this.elementsContainer.removeChild(element.graphics);
        this.elements.splice(index, 1);

        this.update();
    }
}

/**
 *
 * Remove an element from the line at specific position.
 *
 * @param {int} index
 */
OMNI.Element.Line.prototype.removeElementAt = function (index) {

    if (index > -1 && index < this.elements.length) {
        this.elements[index].parent = null;

        this.elementsContainer.removeChild(this.elements[index].graphics);
        this.elements.splice(index, 1);

        this.update();
    }
}

/**
 *
 * Turn on/off highlight effect of the line.
 *
 * @param {boolean} on - If set to true, turn the highlight on. If set to false, turn the highlight off.
 */
OMNI.Element.Line.prototype.highlight = function (on) {

    OMNI.Config.Line.HIGHLIGHT_FILTER[0].matrix = OMNI.Config.Line.HIGHLIGHT_MATRIX;

    if (on == true) {
        this.lineGraphics.filters = OMNI.Config.Line.HIGHLIGHT_FILTER;
    } else {
        this.lineGraphics.filters = null;        
    }

    // Highlight related lines

    for (var i = 0; i < this.helperLines.length; i++) {
        this.helperLines[i].highlight(on);
    }
}

/**
 *
 * Show / Update hintspot at specific position.
 *
 * @param {int} index
 */
OMNI.Element.Line.prototype.showHintspot = function (index) {

    var prevIndex = this.elements.indexOf(this.hintspot);

    // If hintspot is already displaying, remove it.
    if (prevIndex > -1) {
        this.elements.splice(prevIndex, 1);
    }

    var self = this;

    // Add as an element
    this.elements.splice(index, 0, this.hintspot);

    // Add to line container, not elements container. (mouse issue)
    this.hintspot.visible = true;

    this.hintspot.graphics.click = function (e) {
        
        if (OMNI.Shared.mode == 1) {
            self.hintspot.showDirectionBar();

            self.hintspot.directionBarLeft.click = function () {
                self.addElementAt(new OMNI.Element.Branch(false), index);
                self.closeHintspot();
            }

            self.hintspot.directionBarRight.click = function () {
                self.addElementAt(new OMNI.Element.Branch(true), index);
                self.closeHintspot();
            }

        } else if (OMNI.Shared.mode == 2) {
            self.addElementAt(new OMNI.Element.Block(), index);
            self.closeHintspot();
        }
    }

    this.update();
}

/**
 *
 * Close hintspot.
 *
 */
OMNI.Element.Line.prototype.closeHintspot = function () {

    var index = this.elements.indexOf(this.hintspot);

    if (index > -1) {
        this.hintspot.closeDirectionBar();
        this.hintspot.visible = false;
        this.elements.splice(index, 1);

        this._currentHintSpotIndex = -1;

        this.update();
    }
}

/**
 *
 * Get possible hintspot index by local position.
 *
 * @param {number} localX
 * @param {number} localY
 * @return {int} index
 */
OMNI.Element.Line.prototype.getHintspotIndexByPosition = function (localX, localY) {
  
    // If index is not changed in following procedure, index is length of elements.
    var index = this.elements.length;

    var accumulatedHeight = this.thickness + OMNI.Config.Line.SPACING_Y;
    var previousHalfHeight = this.thickness * 2;
    var afterHintspot = false;

    for (var i = 0; i < this.elements.length; i++) {

        var element = this.elements[i];

        if (element instanceof OMNI.Element.HintSpot) {

            afterHintspot = true;

            previousHalfHeight += element.height / 2 + OMNI.Config.Line.SPACING_Y;

        } else {

            if (localY >= accumulatedHeight - OMNI.Config.Line.SPACING_Y - previousHalfHeight) {
                if (localY < accumulatedHeight + element.height / 2) {
                    index = i;
                    break;
                }
            }
            
            previousHalfHeight = element.height / 2;
        }

        accumulatedHeight += element.height + OMNI.Config.Line.SPACING_Y;        
    }

    if (afterHintspot) index --;

    return index;
}

OMNI.Element.Line.prototype.onMouseRollOver = function (event) {

    this.highlight(true);

    this.onMouseMove(event);

    var self = this;

    this.lineGraphicsContainer.mousemove = function (e) {
        self.onMouseMove(e);
    };

}

OMNI.Element.Line.prototype.onMouseRollOut = function (event) {

    this.highlight(false);

    this.lineGraphicsContainer.mousemove = null;

    this.closeHintspot();
}


OMNI.Element.Line.prototype.onMouseMove = function (event) {

    this._localPosition = event.getLocalPosition(this.lineGraphicsContainer, this._localPosition);

    var index = this.getHintspotIndexByPosition(this._localPosition.x, this._localPosition.y);
    
    if (index != this._currentHintSpotIndex) {       
        this.showHintspot(index);
        this._currentHintSpotIndex = index;
    }
}