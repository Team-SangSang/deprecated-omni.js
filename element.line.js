/**
 *
 * 동작하는 세로선
 *
 */
OMNI.Element.Line = function() {

    // 부모 객체(element 거나 없음)
    this.parent;

    // 그래픽
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0);
    this.graphics.drawRect(0, 0, 10, 10);

    // 구성 요소
    this.elements = [];
    this.elementsContainer = new PIXI.DisplayObjectContainer();

    this.maximimElementWidthOfRight = 0;
    this.maximimElementWidthOfLeft = 0;

    this.graphics.width = OMNI.Graphics.LINE_THICKNESS;
    this.graphics.height = OMNI.Graphics.MIN_LINE_LENGTH * 2;
    this.graphics.interactive = true;

    this.update();
};

// public 메서드
OMNI.Element.Line.prototype = {

    get width () { return this.graphics.width; },
    set width (value) { this.graphics.width = value; },

    get height () { return this.graphics.height; },
    set height (value) { this.graphics.height = value; },

    get x () { return this.graphics.x; },
    set x (value) {
        this.graphics.x = value;
        this.elementsContainer.x = value;
    },

    get y () { return this.graphics.y; },
    set y (value) {
        this.graphics.y = value;
        this.elementsContainer.y = value;
    },

    get elementsWidthOfRight () { return this.maximimElementWidthOfRight; },
    get elementsWidthOfLeft () { return this.maximimElementWidthOfLeft; }
}

/**
 *
 * 그래픽, 위치 업데이트
 *
 */
OMNI.Element.Line.prototype.update = function() {

    // 구성 요소 세로 정렬
    var relativeX = OMNI.Graphics.LINE_THICKNESS / 2;
    var relativeY = 0;

    var accumulatedHeight = OMNI.Graphics.SPACE_Y;
    this.maximimElementWidthOfRight = 0;
    this.maximimElementWidthOfLeft = 0;

    for (var i = 0; i < this.elements.length; i++) {

        var element = this.elements[i];

        // 블록은 중앙 정렬, 구조체는 원점 정렬
        if (element instanceof OMNI.Element.Block) {            
            element.x = relativeX - element.width / 2;

            var halfWidth = element.width / 2;

            if(halfWidth > this.maximimElementWidthOfRight) { this.maximimElementWidthOfRight = halfWidth; }
            if(halfWidth > this.maximimElementWidthOfLeft) { this.maximimElementWidthOfLeft = halfWidth; }            

        } else {
            element.x = relativeX;

            if(element.widthOfRight > this.maximimElementWidthOfRight) { this.maximimElementWidthOfRight = element.widthOfRight; }
            if(element.widthOfLeft > this.maximimElementWidthOfLeft) { this.maximimElementWidthOfLeft = element.widthOfLeft; }
        }

        element.y = relativeY + accumulatedHeight;

        accumulatedHeight += element.height + OMNI.Graphics.SPACE_Y;
    };

    // 그래픽 업데이트
    this.graphics.height = Math.max(OMNI.Graphics.MIN_LINE_LENGTH, accumulatedHeight);

    // hitArea 업데이트
    /*
    this.graphics.hitArea.x = - OMNI.Graphics.HITAREA_PADDING_X;
    this.graphics.hitArea.y = - OMNI.Graphics.HITAREA_PADDING_Y;
    this.graphics.hitArea.height = totalHeight + OMNI.Graphics.HITAREA_PADDING_Y * 2;
    this.graphics.hitArea.width = OMNI.Graphics.LINE_THICKNESS + OMNI.Graphics.HITAREA_PADDING_X * 2;
    */

    // 부모 객체 업데이트 (상향 이벤트)
    if (this.parent != undefined) {
        this.parent.update();
    }
}

/**
 *
 * 라인에 새 코드 요소를 추가한다.
 *
 */
OMNI.Element.Line.prototype.addElement = function(element) {

    element.parent = this;

    this.elementsContainer.addChild(element.graphics);
    this.elements.push(element);

    this.update();
}

/**
 *
 * 라인에 하이라이트 효과를 준다.
 *
 */
OMNI.Element.Line.prototype.highlight = function(on) {
    if (on == true) {
        this.graphics.filters = [OMNI.Graphics.highlightFilter];
    } else {
        this.graphics.filters = null;
    }
}