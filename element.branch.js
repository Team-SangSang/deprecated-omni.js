/**
 *
 * 브랜치 (if문 역할)
 * 
 * orientation: true-right, false-left
 */
Omnigram.Element.Branch = function(right) {
    
    var that = this;

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
    
    // 부모 설정
    this.entry.parent = this;
    this.line.parent = this;
    this.horizontal_top.parent = this;
    this.horizontal_bottom.parent = this;

    this.graphics.addChild(this.horizontal_top.graphics);
    this.graphics.addChild(this.horizontal_bottom.graphics);
    this.graphics.addChild(this.line.graphics);
    this.graphics.addChild(this.entry.graphics);

    // 이벤트 등록
    function triggerHighlightOn() { that.highlightLine(true) }
    function triggerHighlightOff() { that.highlightLine(false) }

    this.graphics.interactive = true;
    this.graphics.mouseover = triggerHighlightOn;
    this.graphics.mouseout = triggerHighlightOff;
    /*this.line.graphics.mouseover = triggerHighlightOn;
    this.horizontal_top.graphics.mouseover = triggerHighlightOn;
    this.horizontal_bottom.graphics.mouseover = triggerHighlightOn;

    this.line.graphics.mouseout = triggerHighlightOff;
    this.horizontal_top.graphics.mouseout = triggerHighlightOff;
    this.horizontal_bottom.graphics.mouseout = triggerHighlightOff;
    */
    this.update();
};

// public 메서드
Omnigram.Element.Branch.prototype = {

    get width () { return this.graphics.width; },
    set width (value) { this.graphics.width = value },

    get height () { return this.graphics.height; },
    set height (value) { this.graphics.height = value },

    get x () { return this.graphics.x; },
    set x (value) { this.graphics.x = value },

    get y () { return this.graphics.y; },
    set y (value) { this.graphics.y = value },

    get orientation () { return this.flipped; },
    set orientation (value) { this.flipped = value; this.update(); },

    get procedure () { return this.line; }

}

/**
 *
 * 그래픽, 위치 업데이트
 *
 */
Omnigram.Element.Branch.prototype.update = function() {

    this.entry.x =  - this.entry.width / 2;
    this.entry.y = 0;

    this.horizontal_top.width = this.entry.width / 2 + this.line.width + Omnigram.Graphics.MIN_LINE_LENGTH;
    this.horizontal_bottom.width = this.horizontal_top.width;

    // 오른쪽
    if (this.flipped) {
        
        this.horizontal_top.x = Omnigram.Graphics.LINE_THICKNESS / 2;
        this.horizontal_top.y = (this.entry.height - this.horizontal_top.height) / 2;

        this.horizontal_bottom.x = Omnigram.Graphics.LINE_THICKNESS / 2;
        this.horizontal_bottom.y = this.horizontal_top.y + this.line.height + Omnigram.Graphics.LINE_THICKNESS;

        this.line.x = this.horizontal_top.width - Omnigram.Graphics.LINE_THICKNESS / 2;
        this.line.y = this.horizontal_top.y + Omnigram.Graphics.LINE_THICKNESS;

    } else {

        this.horizontal_top.x = - this.horizontal_top.width - (Omnigram.Graphics.LINE_THICKNESS / 2);
        this.horizontal_top.y = (this.entry.height - this.horizontal_top.height) / 2;
        
        this.horizontal_bottom.x = - this.horizontal_bottom.width - (Omnigram.Graphics.LINE_THICKNESS / 2);
        this.horizontal_bottom.y = this.horizontal_top.y + this.line.height + Omnigram.Graphics.LINE_THICKNESS;

        this.line.x = - this.horizontal_top.width - Omnigram.Graphics.LINE_THICKNESS / 2;
        this.line.y = this.horizontal_top.y + Omnigram.Graphics.LINE_THICKNESS;
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
Omnigram.Element.Branch.prototype.highlightEntry = function(on) {
    this.highlightLine(on);
}

/**
 *
 * 라인에 하이라이트 효과를 준다.
 *
 */
Omnigram.Element.Branch.prototype.highlightLine = function(on) {
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