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
        this.graphics.width = this.thickness;
        this.graphics.height = OMNI.Graphics.MIN_LINE_LENGTH * 2;
    } else {
        this.graphics.width = OMNI.Graphics.MIN_LINE_LENGTH * 2;
        this.graphics.height = this.thickness;
    }
    this.graphics.interactive = true;

    // 트윈
    this.tween = new TWEEN.Tween(this.graphics);

    // 선 굵기
    this.thickness = OMNI.Graphics.LINE_THICKNESS;

    this.targetX = 0;
    this.targetY = 0;
    this.targetWidth = this.graphics.width;
    this.targetHeight = this.graphics.height;

    this.update();
};

// public 메서드
OMNI.Element.HelperLine.prototype = {

    get thickness () { return this._thickness; },
    set thickness (value) {
        this._thickness = value;

        if (this.orientation) {
            this.targetWidth = value;
        } else {
            this.targetHeight = value;
        }

        this.updateTween();
    },

    get width () { return this.targetWidth; },
    set width (value) {
        this.targetWidth = value;
        this.updateTween();
    },

    get height () { return this.targetHeight; },
    set height (value) {
        this.targetHeight = value;
        this.updateTween();
    },

    get x () { return this.targetX; },
    set x (value) {
        this.targetX = value;
        this.updateTween();
    },

    get y () { return this.targetY; },
    set y (value) {
        this.targetY = value;
        this.updateTween();
    }
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
 * 트윈 업데이트
 *
 */
OMNI.Element.HelperLine.prototype.updateTween =  function() {
    this.tween.to({ width: this.targetWidth,
                    height: this.targetHeight,
                    x: this.targetX,
                    y: this.targetY }, 400).easing(OMNI.Graphics.EASING).start();
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