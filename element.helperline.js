/**
 *
 * 동작하지 않는 가로/세로선
 * 
 * orientation: true-vertical, false-horizontal
 */
Omnigram.Element.HelperLine = function(vertical) {

    // 부모 객체
    this.parent;

    // 방향
    this.orientation = vertical;
    
    // 그래픽
    this.graphics = new PIXI.DisplayObjectContainer();
    this.line;

    if (vertical) {
        this.line = new PIXI.Sprite(PIXI.Texture.fromFrame("vertical-line.png"));
        this.line.width = Omnigram.Graphics.LINE_THICKNESS;
        this.line.height = Omnigram.Graphics.MIN_LINE_LENGTH * 2;
    } else {
        this.line = new PIXI.Sprite(PIXI.Texture.fromFrame("horizontal-line.png"));
        this.line.width = Omnigram.Graphics.MIN_LINE_LENGTH * 2;
        this.line.height = Omnigram.Graphics.LINE_THICKNESS;
    }

    this.graphics.addChild(this.line);
    this.graphics.interactive = true;

};

// public 메서드
Omnigram.Element.HelperLine.prototype = {

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
Omnigram.Element.HelperLine.prototype.update =  function() {
    // TODO
}

/**
 *
 * 라인에 하이라이트 효과를 준다.
 *
 */
Omnigram.Element.HelperLine.prototype.highlight = function(on) {
    if (on == true) {
        this.graphics.alpha = 0.5;
    } else {
        this.graphics.alpha = 1;
    }
}