/**
 *
 * 루프 (while문 역할)
 * 
 * orientation: true-right, false-left
 */
Omnigram.Element.Loop = function(right) {
    
    // 부모 객체 (line)
    this.parent;

    // 그래픽
    this.graphics = new PIXI.DisplayObjectContainer();

    // 진입 블록
    this.entry = new Omnigram.Element.Block();

    // 분기된 라인
    this.line = new Omnigram.Element.Line();

    // 보조선
    this.horizontal_top = new Omnigram.Element.HelperLine(false);
    this.horizontal_bottom = new Omnigram.Element.HelperLine(false);
    
    // 접힌 방향
    this.flipped = right;
    
    this.graphics.addChild(this.horizontal_top.graphics);
    this.graphics.addChild(this.horizontal_bottom.graphics);
    this.graphics.addChild(this.line.graphics);
    this.graphics.addChild(this.entry.graphics);

    // 이벤트 등록
    this.line.graphics.mouseover = this.highlightLine(true);
    this.horizontal_top.graphics.mouseover = this.highlightLine(true);
    this.horizontal_bottom.graphics.mouseover = this.highlightLine(true);

    this.line.graphics.mouseout = this.highlightLine(false);
    this.horizontal_top.graphics.mouseout = this.highlightLine(false);
    this.horizontal_bottom.graphics.mouseout = this.highlightLine(false);

    this.update();
};

// public 메서드
Omnigram.Element.Loop.prototype = {

    get width () { return this.graphics.width; },
    set width (value) { this.graphics.width = value },

    get height () { return this.graphics.height; },
    set height (value) { this.graphics.height = value },

    get x () { return this.graphics.x; },
    set x (value) { this.graphics.x = value },

    get y () { return this.graphics.y; },
    set y (value) { this.graphics.y = value },

    get orientation () { return this.flipped; },
    set orientation (value) { this.flipped = value; this.update(); }

}

/**
 *
 * 그래픽, 위치 업데이트
 *
 */
Omnigram.Element.Loop.prototype.update = function() {

    this.entry.x =  - this.entry.width / 2;
    this.entry.y = 0;

    this.horizontal_top.width = this.entry.width / 2 + this.line.width + Omnigram.Graphics.MIN_LINE_LENGTH;
    this.horizontal_bottom.width = this.horizontal_top.width;

    // 오른쪽
    if (this.flipped) {
        
        this.horizontal_top.x = 0;
        this.horizontal_top.y = (this.entry.height - this.horizontal_top.height) / 2;

        this.horizontal_bottom.x = 0;
        this.horizontal_bottom.y = this.horizontal_top.y + this.line.height;

        this.line.x = this.horizontal_top.width - Omnigram.Graphics.LINE_THICKNESS;
        this.line.y = this.horizontal_top.y + Omnigram.Graphics.LINE_THICKNESS / 2;

    } else {

        this.horizontal_top.x = - this.horizontal_top.width;
        this.horizontal_top.y = (this.entry.height - this.horizontal_top.height) / 2;
        
        this.horizontal_bottom.x = - this.horizontal_bottom.width;
        this.horizontal_bottom.y = this.horizontal_top.y + this.line.height;

        this.line.x = - this.horizontal_top.width
        this.line.y = this.horizontal_top.y + Omnigram.Graphics.LINE_THICKNESS / 2;
    }

    // 부모 객체 업데이트 (상향 이벤트)
    if (this.parent != undefined) {
        this.parent.update();
    }
}

/**
 *
 * 진입점에 하이라이트 효과를 준다.
 *
 */
Omnigram.Element.Loop.prototype.highlightEntry = function(on) {
    this.highlightLine(on);
}

/**
 *
 * 라인에 하이라이트 효과를 준다.
 *
 */
Omnigram.Element.Loop.prototype.highlightLine = function(on) {
    if (on) {
        this.line.highlight(true);
        this.horizontal_top.highlight(true);
        this.horizontal_bottom.highlight(true);
    } else {
        this.line.highlight(false);
        this.horizontal_top.highlight(false);
        this.horizontal_bottom.highlight(false);
    }
}