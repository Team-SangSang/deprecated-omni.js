/**
 *
 * 블록
 *
 */
Omnigram.Element.Block = function() {

    // 부모 객체(라인)
    this.parent;

    // 그래픽
    this.graphics = new PIXI.Sprite(PIXI.Texture.fromFrame("block.png"));

};

// public 메서드
Omnigram.Element.Block.prototype = {
    
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
Omnigram.Element.Block.prototype.update =  function() {
    // TODO
}