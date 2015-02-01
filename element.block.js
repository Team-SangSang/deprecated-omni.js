/**
 *
 * 블록
 *
 */
OMNI.Element.Block = function() {

    // 부모 객체(라인)
    this.parent;

    // 그래픽
    //this.graphics = new PIXI.Sprite(PIXI.Texture.fromFrame("block.png"));

    var size = Math.random() * 60 + 45

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(Math.random() * 0xFFFFFF);
    this.graphics.lineStyle(2, 0x000000);
    this.graphics.drawRect(0, 0, size, size/4);

    this.graphics.interactive = true;

};

// public 메서드
OMNI.Element.Block.prototype = {
    
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
OMNI.Element.Block.prototype.update =  function() {
    // TODO
}

/**
 *
 * 블록에 하이라이트 효과를 준다.
 *
 */
OMNI.Element.Block.prototype.highlight =  function(on) {
    // TODO
}