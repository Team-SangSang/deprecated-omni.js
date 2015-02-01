/**
 *
 * 동작하지 않는 가로/세로선
 * 
 * orientation: true-vertical, false-horizontal
 */
OMNI.Element.HelperLine = function(orientation) {

    // 부모 객체
    this.parent;

    // 방향
    this.orientation = orientation;
    
    // 그래픽
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0);
    this.graphics.drawRect(0, 0, 10, 10);

    if (orientation) {
        this.graphics.width = OMNI.Graphics.LINE_THICKNESS;
        this.graphics.height = OMNI.Graphics.MIN_LINE_LENGTH * 2;
    } else {
        this.graphics.width = OMNI.Graphics.MIN_LINE_LENGTH * 2;
        this.graphics.height = OMNI.Graphics.LINE_THICKNESS;
    }
    this.graphics.interactive = true;

    this.update();
};

// public 메서드
OMNI.Element.HelperLine.prototype = {

    get width () { return this.graphics.width; },
    set width (value) { this.graphics.width = value },

    get height () { return this.graphics.height; },
    set height (value) { this.graphics.height = value },

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
OMNI.Element.HelperLine.prototype.update =  function() {
    // TODO
}

/**
 *
 * 라인에 하이라이트 효과를 준다.
 *
 */
OMNI.Element.HelperLine.prototype.highlight = function(on) {
    if (on == true) {
        this.graphics.filters = [OMNI.Graphics.highlightFilter];
    } else {
        this.graphics.filters = null;
    }
}