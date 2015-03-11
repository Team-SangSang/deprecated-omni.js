OMNI.Config.Line = {

    // 라인 간 최소 간격
    SPACE_LINE: 20,

    // 라인 위의 요소 간 간격
    SPACE_ELEMENTS: 15,

    // 라인의 최소 길이
    MIN_LENGTH: 20,

    // 라인의 최소 굵기
    MIN_THICKNESS: 7,

    // 라인의 최대 굵기
    MAX_THICKNESS: 20,

    // 라인 굵기 증가량
    THICKNESS_INCREMENT: 1.5,

    // 라인 하이라이트 관련 값들

    HIGHLIGHT_MATRIX: [
        1, 0, 0, 0.5,
        0, 1, 0, 0.5,
        0, 0, 1, 0.5,
        0, 0, 0, 1],

    HIGHLIGHT_FILTER: [new PIXI.ColorMatrixFilter()],
}

/**
 * 라인에는 코드 블록과 흐름 제어 블록이 추가될 수 있습니다. 라인은 그 자체로 하나의 함수처럼 독립되어 동작합니다.
 *
 * @constructor
 */
OMNI.Line = function () {

    var self = this;

    /** 이 라인이 속해 있는 작업 환경 */
    this.workspace;

    /** 그래픽 */
    this.graphics = new PIXI.DisplayObjectContainer();

    /** 이 라인이 속해 있는 요소 */
    this.parent;

    /** 라인에 속해 있는 요소들 */
    this.children = [];

    // 선 그래픽과 힌트 스팟

    this._lineGraphicsContainer = new PIXI.DisplayObjectContainer(); 
    this._lineGraphicsContainer.interactive = true;

    this._lineGraphics = this._createLineGraphics();
    this._hintspot = new OMNI.Hintspot();
    this._hintspot.hide();
    
    this._lineGraphicsContainer.addChild(this._lineGraphics);
    this._lineGraphicsContainer.addChild(this._hintspot.graphics);
    this.graphics.addChild(this._lineGraphicsContainer);

    this._thickness = OMNI.Config.Line.MIN_THICKNESS;
    this._pseudoThickness = OMNI.Config.Line.MIN_THICKNESS;

    // 트윈

    this._positionTween = new TWEEN.Tween(this.graphics);
    this._graphicsTween = new TWEEN.Tween(this._lineGraphics);

    this._targetPositionValues = {
        x: 0,
        y: 0
    };

    this._targetGraphicValues = {
        x: - this.thickness / 2,
        width: this._lineGraphics.width,
        height: this._lineGraphics.height
    };

    // 돌출부 크기

    this._leftProminentWidth = 0;
    this._rightProminentWidth = 0;

    // 이벤트

    this._lineGraphicsContainer.mouseover = function (e) {
        if (OMNI.Shared.currentOccupied) { return; } 
        else { OMNI.Shared.currentOccupied = self; }
        self._onMouseRollOver(e);
    }
    this._lineGraphicsContainer.mouseout = function (e) { 
        if (OMNI.Shared.currentOccupied != self) { return;} 
        else { OMNI.Shared.currentOccupied = null; }
        self._onMouseRollOut(e);
    }

    this.update();
};

OMNI.Line.prototype = {

    /** 라인의 x 좌표 */
    get x() {
        return this._targetPositionValues.x;
    },    
    set x(value) {        
        this._targetPositionValues.x = value;
        this._updateTweens();
    },

    /** 라인의 y 좌표 */
    get y() {
        return this._targetPositionValues.y;
    },
    set y(value) {        
        this._targetPositionValues.y = value;
        this._updateTweens();
    },

    /** 라인의 길이 */
    get height() {
        return this._targetGraphicValues.height;
    },
    set height(value) {        
        this._targetGraphicValues.height = value;
        this._updateTweens();
    },

    /** 자식의 길이 */
    get childrenHeight() {
        return this._childrenHeight;
    },

    /** 라인의 총 가로 너비 */
    get width() {
        return this.leftProminentWidth + this.thickness + this.rightProminentWidth;
    },

    /** 라인의 두께 */
    get thickness() {
        return this._thickness;
    },
    set thickness(value) {
        if (value > OMNI.Config.Line.MAX_THICKNESS) {
            value = OMNI.Config.Line.MAX_THICKNESS;
        }
        this._pseudoThickness = 0;
        this._thickness = value;
        this._targetGraphicValues.width = value;
        this._targetGraphicValues.x = - value / 2;
        this._updateTweens();
    },
    get pseudoThickness() {
        return this._pseudoThickness;
    },
    set pseudoThickness(value) {
        this._pseudoThickness = value;
        this._targetGraphicValues.width = value;
        this._targetGraphicValues.x = - value / 2;
        this._updateTweens();
    },

    /** 라인의 왼쪽 돌출부 길이 */
    get leftProminentWidth() {
        return this._leftProminentWidth;
    },

    /** 라인의 오른쪽 돌출부 길이 */
    get rightProminentWidth() {
        return this._rightProminentWidth;
    },

    /** 라인 하이라이트 */
    get highlight() {
        return this._highlight;
    },
    set highlight(value) {
        OMNI.Config.Line.HIGHLIGHT_FILTER[0].matrix = OMNI.Config.Line.HIGHLIGHT_MATRIX;
        this._highlight = value;
        if (value) {
            this._lineGraphics.filters = OMNI.Config.Line.HIGHLIGHT_FILTER;
        } else {
            this._lineGraphics.filters = null;        
        }
    }
}

/**
 *
 * 라인에 요소를 추가합니다.
 *
 * @param {OMNI.Element} child - 추가할 요소
 */
OMNI.Line.prototype.addElement = function (child) {

    this.addElementAt(child, this.children.length);
}

/**
 *
 * 라인의 특정 인덱스에 요소를 추가합니다.
 *
 * @param {OMNI.Element} child - 추가할 요소.
 * @param {int} index - 추가할 위치
 */
OMNI.Line.prototype.addElementAt = function (child, index) {

    if (!child) { return };

    if (child instanceof OMNI.Branch) {
        child.parent = this;
    } else if (child instanceof OMNI.Block.Entity) {
        child.connectedLine = this;
    }

    this.children.splice(index, 0, child);

    this.update();
}

/**
 *
 * 라인에서 특정 요소를 제거합니다.
 *
 * @param {OMNI.Element} child - 제거할 요소.
 */
OMNI.Line.prototype.removeElement = function (child) {

    var index = this.children.indexOf(child);

    if (index > -1) {

        if (child instanceof OMNI.Branch) {
            child.parent = null;
        }

        this.children.splice(index, 1);

        this.update();
    }
}

OMNI.Line.prototype.getScript = function() {
    var buffer = "";    
    for(var i = 0 ; i < this.children.length; i++) {
        var element = this.children[i];
        if(element instanceof OMNI.Hintspot){
            continue;
        }
        buffer += element.getScript() + "\n";
    }
    return buffer;
}

OMNI.Line.prototype.export = function() {
    var extBuf = "";
    var thisno = OMNI.Shared.lineNo++;
    var buffer = "l,"+ (thisno);
    for(var i = 0 ; i < this.children.length; i++) {
        var element = this.children[i];
        if(element instanceof OMNI.Hintspot){
            continue;
        }
        var eleExp = element.export();
        if (element instanceof OMNI.Block.Entity){
            buffer += ",b:" + eleExp[0];
        } else if (element instanceof OMNI.Branch){
            buffer += ",r:" + eleExp[0];
        }
        
        extBuf += eleExp[1] + "|";
    }
    return [thisno, extBuf + buffer];    
}

/**
 * 라인을 최신 상태로 업데이트합니다.
 * 
 * @param {boolean} ascending - 이벤트가 향하고 있는 방향을 나타냅니다.
 */
OMNI.Line.prototype.update = function (ascending) {

    if (ascending === undefined) {
        ascending = true;
    }

    // 부모 업데이트로 가는 중이면
    if (ascending) {

        this._updateSize();

        if (this.parent) {
            this.parent.update(true);

            return;
        }
    }
   
    this._updatePosition();

    for (var i in this.children) {
        this.children[i].update(false);
    }
}


/** 라인의 굵기와 길이를 업데이트합니다. */
OMNI.Line.prototype._updateSize = function () {

    var maximumThickness = OMNI.Config.Line.MIN_THICKNESS;

    var accumulatedHeight = OMNI.Config.Line.SPACE_ELEMENTS;

    this._leftProminentWidth = 0;
    this._rightProminentWidth = 0;

    for (var i in this.children) {

        var child = this.children[i];

        var childLeftProminentWidth = 0;
        var childRightProminentWidth = 0;
        var childHeight;

        if (child instanceof OMNI.Block.Entity) {

            childLeftProminentWidth = child.width / 2 + child.leftProminentWidth;
            childRightProminentWidth = child.width / 2 + child.rightProminentWidth;
            childHeight = child.groupHeight;
        }

        else if (child instanceof OMNI.Branch) {

            if (child.thickness > maximumThickness) {
                maximumThickness = child.thickness; 
            }

            childLeftProminentWidth = child.leftProminentWidth;
            childRightProminentWidth = child.rightProminentWidth;
            childHeight = child.height;
        } 

        else if (child instanceof OMNI.Hintspot) {

            childHeight = child.height;
        }

        if (this._leftProminentWidth < childLeftProminentWidth) {
            this._leftProminentWidth = childLeftProminentWidth;
        }

        if (this._rightProminentWidth < childRightProminentWidth) {
            this._rightProminentWidth = childRightProminentWidth;
        }

        accumulatedHeight += childHeight + OMNI.Config.Line.SPACE_ELEMENTS;
    }

    this.height = Math.max(OMNI.Config.Line.MIN_LENGTH, accumulatedHeight);
    this._childrenHeight = this.height;
    this.thickness = maximumThickness + OMNI.Config.Line.THICKNESS_INCREMENT;

    this._hintspot.radius = this.thickness / 2;
}


/** 라인 바로 하위 요소들의 위치를 업데이트합니다. */
OMNI.Line.prototype._updatePosition = function () {

    var accumulatedHeight = OMNI.Config.Line.SPACE_ELEMENTS;

    var globalPosition = this;

    for (var i in this.children) {

        var child = this.children[i];
        var childHeight;

        if (child instanceof OMNI.Block.Entity) {

            childHeight = child.groupHeight;

            child.x = globalPosition.x;
            child.y = globalPosition.y + accumulatedHeight + child.groupHeight - child.height;

            child.updateOnlyPosition();
        }

        else if (child instanceof OMNI.Branch) {

            childHeight = child.height;

            child.x = globalPosition.x;
            child.y = globalPosition.y + accumulatedHeight + child.entryBlock.groupHeight - child.entryBlock.height;

            child._updatePosition(true);
        } 

        else if (child instanceof OMNI.Hintspot) {

            childHeight = child.height;

            child.x = 0;
            child.y = accumulatedHeight;
        }

        accumulatedHeight += childHeight + OMNI.Config.Line.SPACE_ELEMENTS;
    }   
}


/** 트윈을 업데이트합니다. */
OMNI.Line.prototype._updateTweens = function () {

    if (this._positionTween) {
        this._positionTween.to(this._targetPositionValues, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();
    } else {
        this.graphics.x = this._targetPositionValues.x;
        this.graphics.y = this._targetPositionValues.y;
    }

    if (this._graphicsTween) {
        this._graphicsTween.to(this._targetGraphicValues, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();
    } else {
        this._lineGraphics.width = this._targetGraphicValues.width;
        this._lineGraphics.height = this._targetGraphicValues.height;
        this._lineGraphics.x = - this._targetGraphicValues.width / 2;
    }
}


/** 초기 라인의 그래픽을 생성합니다. */
OMNI.Line.prototype._createLineGraphics = function () {

    var lineGraphics = new PIXI.Graphics();

    lineGraphics.beginFill(0x000000);
    lineGraphics.drawRect(0, 0, OMNI.Config.Line.MIN_THICKNESS, OMNI.Config.Line.MIN_LENGTH);

    return lineGraphics;
}


/** 힌트 스팟을 특정 위치에 보여줍니다. */
OMNI.Line.prototype._showHintspot = function (index) {

    var self = this;

    var existingIndex = this.children.indexOf(this._hintspot);    
    if (existingIndex > -1) {
        this.children.splice(existingIndex, 1);
    }

    this.children.splice(index, 0, this._hintspot);
    this._hintspot.show();
    
    this._hintspot.graphics.mouseup = function (e) {

        if (OMNI.Shared.mode == 2) {

            if (OMNI.Shared.selectedBlock) {

                // 여기에 블록 추가하는 명령을 짜면 된다.
                self.addElementAt(OMNI.Shared.selectedBlock, index);
                OMNI.Shared.selectedBlock = null;
            }
        }

    }

    this._hintspot.graphics.click = function (e) {
        
        if (OMNI.Shared.mode == 1) {
            self._hintspot.showDirectionBar();

            self._hintspot.directionBarLeft.click = function () {
                var branch = OMNI.Shared.workspace.createBranch(false);
                self.addElementAt(branch, index);
                self._hideHintspot();
            }

            self._hintspot.directionBarRight.click = function () {
                var branch = OMNI.Shared.workspace.createBranch(true);
                self.addElementAt(branch, index);
                self._hideHintspot();
            }

        } else if (OMNI.Shared.mode == 2) {

            self._hintspot.closeDirectionBar();
        }
    }

    this.update();
}


/** 힌트 스팟을 닫습니다. */
OMNI.Line.prototype._hideHintspot = function () {

    var existingIndex = this.children.indexOf(this._hintspot);

    if (existingIndex > -1) {
        
        this.children.splice(existingIndex, 1);
        this._currentHintSpotIndex = -1;

        this._hintspot.hide();
        this._hintspot.closeDirectionBar();
        this.update();
    }
}


/** 로컬 좌표로 요소의 인덱스를 구합니다.*/
OMNI.Line.prototype._getElementIndexByPosition = function (localX, localY) {
  
    var index = this.children.length;

    var accumulatedHeight = OMNI.Config.Line.SPACE_ELEMENTS;
    var previousHalfHeight = 100000;
    var afterHintspot = false;

    for (var i = 0; i < this.children.length; i++) {

        var child = this.children[i];
        var childHeight;

        if (child instanceof OMNI.Hintspot) {

            afterHintspot = true;
            childHeight = child.height;
            previousHalfHeight += child.height / 2 + OMNI.Config.Line.SPACE_ELEMENTS;

        } else {

            if (child instanceof OMNI.Block.Entity) {
                accumulatedHeight += child.groupHeight - child.height;
                previousHalfHeight += child.groupHeight - child.height;
                childHeight = child.height;
            } 
            else if (child instanceof OMNI.Branch) {
                childHeight = child.height;
            }

            if (localY >= accumulatedHeight - OMNI.Config.Line.SPACE_ELEMENTS - previousHalfHeight) {
                if (localY < accumulatedHeight + childHeight / 2) {
                    index = i;
                    break;
                }
            }
            
            previousHalfHeight = childHeight / 2;
        }

        accumulatedHeight += childHeight + OMNI.Config.Line.SPACE_ELEMENTS;        
    }

    if (afterHintspot) { index --; }

    return index;
}

OMNI.Line.prototype._onMouseRollOver = function (event) {

    this.highlight = true;

    this._onMouseMove(event);

    var self = this;

    this._lineGraphicsContainer.mousemove = function (e) {
        self._onMouseMove(e);
    };

}

OMNI.Line.prototype._onMouseRollOut = function (event) {

    this.highlight = false;

    this._lineGraphicsContainer.mousemove = null;

    this._hideHintspot();
}


OMNI.Line.prototype._onMouseMove = function (event) {

    this._localPosition = event.getLocalPosition(this._lineGraphicsContainer, this._localPosition);

    var index = this._getElementIndexByPosition(this._localPosition.x, this._localPosition.y);
    
    if (index != this._currentHintSpotIndex) {
        this._showHintspot(index);
        this._currentHintSpotIndex = index;
    }
}