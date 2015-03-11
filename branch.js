 /**
 *
 * 브랜치는 프로그램의 흐름을 여러 갈래로 나누어 제어하는 역할을 합니다.
 * 
 * @constructor
 * @param {boolean} orientation - True: Right, False: Left 
 */
OMNI.Branch = function (orientation, entry, tline, fline) {

    var self = this;

    /** 이 브랜치가 속한 라인 */
    this.parent;

    this._thickness = OMNI.Config.Line.MIN_THICKNESS;

    /* 컨디션 블록 */
    var definition = OMNI.Config.Block.Predefined.BRANCH;
    if(entry === undefined) {
        this.entryBlock = new OMNI.Block.Entity(definition[0], definition[1], definition[3],definition[4], {acc:definition[5]});
    } else {
        this.entryBlock = entry;
    }
    /** 라인 */
    if(tline === undefined) {
        this.trueLine = new OMNI.Line();
    } else {
        this.trueLine = tline;
    }
    if(fline === undefined) {
        this.falseLine = new OMNI.Line();
    } else {
        this.falseLine = fline;
    }
    //console.log(this.trueLine, this.falseLine)
    this.horizontal_top = new OMNI.Element.HelperLine(false);
    this.horizontal_bottom = new OMNI.Element.HelperLine(false);

    // 화살표
    this._arrow = new OMNI.Element.Arrow(0);

    if (orientation == false) {
        this._arrow.direction = 4;
    } else {
        this._arrow.direction = 3;
    }

    this._orientation = orientation;

    this.entryBlock.connectedLine = this;
    this.trueLine.parent = this;
    this.falseLine.parent = this;
    this.horizontal_top.parent = this;
    this.horizontal_bottom.parent = this;
     
    this._targetValues = {
        x: 0, 
        y: 0
    };

    this.update();
};

OMNI.Branch.prototype = {

    /** 브랜치의 x 좌표 */
    get x() {
        return this._targetValues.x;
    },
    set x(value) {
        this._targetValues.x = value;
    },

    /** 브랜치의 y 좌표 */
    get y() {
        return this._targetValues.y;
    },
    set y(value) {        
        this._targetValues.y = value;
    },

    /** 브랜치의 가로 길이 */
    get width() {
        return this.leftProminentWidth + this.rightProminentWidth;
    },

    /** 브랜치의 세로 길이 */
    get height() {
        return this.targetHeight;
    },

    /** 브랜치의 왼쪽 돌출부 길이 */
    get leftProminentWidth() {
        if (this.orientation) {
            return Math.max(this.falseLine.leftProminentWidth, this.entryBlock.width / 2 + this.entryBlock.leftProminentWidth);
        } else {
            return this.horizontal_top.width + this.trueLine.leftProminentWidth;
        }
    },

    /** 브랜치의 오른쪽 돌출부 길이 */
    get rightProminentWidth() {
        if (this.orientation) {
            return this.horizontal_top.width + this.trueLine.rightProminentWidth;
        } else {
            return Math.max(this.falseLine.rightProminentWidth, this.entryBlock.width / 2 + this.entryBlock.rightProminentWidth);
        }
    },

    /** 브랜치를 구성하고 있는 선의 두께 */
    get thickness() {
        return this._thickness;
    },
    set thickness(value) {
        this._thickness = value;
        this.trueLine.thickness = value;
        this.falseLine.thickness = value;
        this.horizontal_top.thickness = value;
        this.horizontal_bottom.thickness = value;
    },

    /** 브랜치의 방향 */
    get orientation() {
        return this._orientation;
    },
    set orientation(value) {
        this._orientation = value;
        if (value == false) {
            this._arrow.direction = 4;
        } else {
            this._arrow.direction = 3;
        }
        this.update();
    }

}
OMNI.Branch.prototype.getScript = function () {
    var buff = "if ("+this.entryBlock.getScript()+") {\n";
    buff += this.trueLine.getScript() + "\n} else {\n";
    buff += this.falseLine.getScript() + "\n}\n";
    return buff;
}
OMNI.Branch.prototype.export = function () {

    // export for entry block
    var entryExp = this.entryBlock.export();
    var trueExp = this.trueLine.export();
    var falseExp = this.falseLine.export();

    var extBuf = entryExp[1] + "|" + trueExp[1] + "|" + falseExp[1] + "|";
    var thisno = OMNI.Shared.branchNo ++;
    var buffer = "r," + thisno + "," + this.orientation + "," + entryExp[0] + "," + trueExp[0] + "," + falseExp[0];    
    return [thisno, extBuf + buffer];
}


OMNI.Branch.prototype.update = function (ascending) {

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

    this.entryBlock.update(false);
    this.trueLine.update(false);
    this.falseLine.update(false);
}

/** 브랜치의 대표 굵기를 업데이트합니다. */
OMNI.Branch.prototype._updateSize = function () {

    var maximumThickness = Math.max(this.trueLine.thickness, this.falseLine.thickness);    

    var maximumLineHeight = Math.max(this.trueLine.childrenHeight, this.falseLine.childrenHeight + this.entryBlock.height);    

    var maximumLineWidth;

    if (this.orientation) {
        maximumLineWidth = Math.max(this.entryBlock.width / 2, this.falseLine.rightProminentWidth);
        maximumLineWidth += Math.max(this.trueLine.leftProminentWidth, OMNI.Config.Line.MIN_LENGTH) + OMNI.Config.Line.SPACE_LINE;
    } else {
        maximumLineWidth = Math.max(this.entryBlock.width / 2, this.falseLine.leftProminentWidth);
        maximumLineWidth += Math.max(this.trueLine.rightProminentWidth, OMNI.Config.Line.MIN_LENGTH) + OMNI.Config.Line.SPACE_LINE;
    }

    this.thickness = maximumThickness;

    this.trueLine.height = maximumLineHeight;
    this.falseLine.height = maximumLineHeight - this.entryBlock.height + 1;

    this.horizontal_top.width = maximumLineWidth;
    this.horizontal_bottom.width = maximumLineWidth;
    this.targetHeight = this.falseLine.height + this.entryBlock.groupHeight + this.thickness;
}


/** 브랜치의 위치를 업데이트합니다. */
OMNI.Branch.prototype._updatePosition = function () {

    if (this.parent instanceof OMNI.Line) {

        var parentThickness = Math.max(this.parent.thickness, this.parent.pseudoThickness);

        if(this.falseLine.thickness < parentThickness) {
            this.falseLine.pseudoThickness = parentThickness;
        }
    }

    this.entryBlock.x = this._targetValues.x;
    this.entryBlock.y = this._targetValues.y;

    if (this.orientation) {

        this.horizontal_top.x = this._targetValues.x - this.thickness / 2;
        this.horizontal_top.y = this._targetValues.y + (this.entryBlock.height - OMNI.Config.Block.TERMINAL_HEIGHT - this.horizontal_top.thickness) / 2;

        this.horizontal_bottom.x = this.horizontal_top.x;
        this.horizontal_bottom.y = this.horizontal_top.y + this.trueLine.height - this.thickness;

        this.trueLine.x = this._targetValues.x + this.horizontal_top.width - this.thickness / 2;
        this.trueLine.y = this.horizontal_top.y;

        this.falseLine.x = this._targetValues.x;
        this.falseLine.y = this.entryBlock.y + this.entryBlock.height;

        this._arrow.y = this.horizontal_bottom.y + this.thickness / 2;
    }

    else {

        this.horizontal_top.x = this._targetValues.x - this.horizontal_top.width + this.thickness / 2;
        this.horizontal_top.y = this._targetValues.y + (this.entryBlock.height - OMNI.Config.Block.TERMINAL_HEIGHT - this.horizontal_top.thickness) / 2;

        this.horizontal_bottom.x = this.horizontal_top.x;
        this.horizontal_bottom.y = this.horizontal_top.y + this.trueLine.height - this.thickness;

        this.trueLine.x = this._targetValues.x - this.horizontal_top.width + this.thickness / 2;
        this.trueLine.y = this.horizontal_top.y;

        this.falseLine.x = this._targetValues.x;
        this.falseLine.y = this.entryBlock.y + this.entryBlock.height;

        this._arrow.y = this.horizontal_bottom.y + this.thickness / 2;
    }
}