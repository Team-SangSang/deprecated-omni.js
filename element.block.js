/**
 *
 * 블록
 *
 */
OMNI.Element.Block = function(test) {

    // 부모 객체(라인)
    this.parent;

    // 그래픽
    //this.graphics = new PIXI.Sprite(PIXI.Texture.fromFrame("block.png"));

    var size = Math.random() * 60 + 45

    if (test == true){
        this.graphics = new PIXI.Sprite(PIXI.Texture.fromFrame("block"));
    } else {
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(Math.random() * 0xFFFFFF);
        this.graphics.lineStyle(2, 0x000000);
        this.graphics.drawRect(0, 0, size, size/4);
    }

    this.graphics.interactive = true;

    // 트윈
    this.tween = new TWEEN.Tween(this.graphics);

    this.targetX = 0;
    this.targetY = 0;
    this.targetWidth = this.graphics.width;
    this.targetHeight = this.graphics.height;

};

// public 메서드
OMNI.Element.Block.prototype = {
    
    get width () { return this.graphics.width; },
    set width (value) { this.graphics.width = value },

    get height () { return this.graphics.height; },
    set height (value) { this.graphics.height = value },

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
OMNI.Element.Block.prototype.update =  function() {
    // TODO
}

/**
 *
 * 트윈 업데이트
 *
 */
OMNI.Element.Block.prototype.updateTween =  function() {
    this.tween.to({ x: this.targetX,
                    y: this.targetY }, 400).easing(OMNI.Graphics.EASING).start();
}

/**
 *
 * 블록에 하이라이트 효과를 준다.
 *
 */
OMNI.Element.Block.prototype.highlight =  function(on) {
    // TODO
}