/**
 *
 * 동작하는 세로선
 *
 */
Omnigram.Element.Line = function() {

    // 부모 객체(element 거나 없음)
    this.parent;

    // 그래픽
    this.graphics = new PIXI.DisplayObjectContainer();
    this.line = new PIXI.Sprite(PIXI.Texture.fromFrame("vertical-line.png"));

    // 품고 있는 코드 요소들
    this.elements = [];

    this.line.width = Omnigram.Graphics.LINE_THICKNESS;
    this.line.height = Omnigram.Graphics.MIN_LINE_LENGTH * 2;

    this.graphics.interactive = true;
    this.graphics.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

    this.graphics.addChild(this.line);
    this.update();
};

// public 메서드
Omnigram.Element.Line.prototype = {

    get width () { return this.line.width; },
    set width (value) { this.line.width = value },

    get height () { return this.line.height; },
    set height (value) { this.line.height = value },

    get x () { return this.graphics.x; },
    set x (value) { this.graphics.x = value },

    get y () { return this.graphics.y; },
    set y (value) { this.graphics.y = value }

}

/**
 *
 * 그래픽, 위치 업데이트
 *
 */
Omnigram.Element.Line.prototype.update = function() {

    // 구성 요소 세로 정렬

    var relativeX;
    var relativeY;

    if(this.parent != undefined) {
        relativeX = this.parent.graphics.x  + this.graphics.x + Omnigram.Graphics.LINE_THICKNESS / 2;
        relativeY = this.parent.graphics.y + this.graphics.y;
    } else {
        relativeX = this.graphics.x + Omnigram.Graphics.LINE_THICKNESS / 2;
        relativeY = this.graphics.y;
    }

    var accumulatedHeight = Omnigram.Graphics.SPACE_Y;

    for (var i = 0; i < this.elements.length; i++) {

        var element = this.elements[i];

        // 블록은 중앙 정렬, 구조체는 원점 정렬
        if (element instanceof Omnigram.Element.Block) {
            element.x = relativeX - element.width / 2;
        } else {
            element.x = relativeX;
        }
        element.y = relativeY + accumulatedHeight;

        accumulatedHeight += element.height + Omnigram.Graphics.SPACE_Y;
    };

    // 그래픽 업데이트
    var totalHeight = accumulatedHeight;
    this.line.height = Math.max(Omnigram.Graphics.MIN_LINE_LENGTH * 2, totalHeight);

    // hitArea 업데이트
    this.graphics.hitArea.x = - Omnigram.Graphics.HITAREA_PADDING_X;
    this.graphics.hitArea.y = - Omnigram.Graphics.HITAREA_PADDING_Y;
    this.graphics.hitArea.height = totalHeight + Omnigram.Graphics.HITAREA_PADDING_Y * 2;
    this.graphics.hitArea.width = Omnigram.Graphics.LINE_THICKNESS + Omnigram.Graphics.HITAREA_PADDING_X * 2;

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
Omnigram.Element.Line.prototype.addElement = function(element) {

    this.elements.push(element);
    element.parent = this;

    this.update();
}

/**
 *
 * 라인의 특정 위치에 새 코드 요소를 추가한다.
 *
 */
Omnigram.Element.Line.prototype.addElementAt = function(element, index) {

    this.elements.splice(index, 0, element);
    element.parent = this;

    this.update();
}

/**
 *
 * 라인에 하이라이트 효과를 준다.
 *
 */
Omnigram.Element.Line.prototype.highlight = function(on) {
    if (on == true) {
        this.graphics.alpha = 0.5;
    } else {
       this.graphics.alpha = 1;
    }
}