/**
 *
 * 동작하는 세로선
 *
 */
OMNI.Element.Line = function() {

    // 부모 객체(element 거나 없음)
    this.parent;

    // 그래픽
    this.graphics = new PIXI.DisplayObjectContainer();
    this.lineGraphic = new PIXI.Graphics();
    this.lineGraphic.beginFill(0);
    this.lineGraphic.drawRect(0, 0, 10, 10);

    this.graphics.addChild(this.lineGraphic);

    // 구성 요소
    this.elements = [];
    this.elementsContainer = new PIXI.DisplayObjectContainer();

    this.maximumElementWidthOfRight = 0;
    this.maximumElementWidthOfLeft = 0;
    this.maximumElementHeight = 0;

    this.lineGraphic.width = OMNI.Graphics.LINE_THICKNESS;
    this.lineGraphic.height = OMNI.Graphics.MIN_LINE_LENGTH * 2;
    this.graphics.interactive = true;

    // 트윈
    this.tween = new TWEEN.Tween(this.lineGraphic);
    this.elementsTween = new TWEEN.Tween(this.elementsContainer);

    this.targetX = 0;
    this.targetY = 0;
    this.targetWidth = this.lineGraphic.width;
    this.targetHeight = this.lineGraphic.height;

    this.update();
};

// public 메서드
OMNI.Element.Line.prototype = {

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
        this.elementsTween.to({x: this.targetX, y: this.targetY}, 400).easing(OMNI.Graphics.EASING).start();
    },

    get y () { return this.targetY; },
    set y (value) {
        this.targetY = value;        
        this.updateTween();
        this.elementsTween.to({x: this.targetX, y: this.targetY}, 400).easing(OMNI.Graphics.EASING).start();
    },

    get elementsWidthOfRight () { return this.maximumElementWidthOfRight; },
    get elementsWidthOfLeft () { return this.maximumElementWidthOfLeft; },
    get elementsWidth () { return this.maximumElementWidthOfRight + this.maximumElementWidthOfLeft; },
    get elementsHeight () { return this.maximumElementHeight; }
}

/**
 *
 * 그래픽, 위치 업데이트
 *
 */
OMNI.Element.Line.prototype.update = function() {

    var that = this;

    // 구성 요소 세로 정렬
    var relativeX = OMNI.Graphics.LINE_THICKNESS / 2;
    var relativeY = 0;

    var accumulatedHeight = OMNI.Graphics.SPACE_Y;
    this.maximumElementWidthOfRight = 0;
    this.maximumElementWidthOfLeft = 0;

    for (var i = 0; i < this.elements.length; i++) {

        var element = this.elements[i];

        // 블록은 중앙 정렬, 구조체는 원점 정렬
        if (element instanceof OMNI.Element.Block) {            
            element.x = relativeX - element.width / 2;

            var halfWidth = element.width / 2;

            if(halfWidth > this.maximumElementWidthOfRight) { this.maximumElementWidthOfRight = halfWidth; }
            if(halfWidth > this.maximumElementWidthOfLeft) { this.maximumElementWidthOfLeft = halfWidth; }      

        } else {            
            element.x = relativeX;

            if(element.widthOfRight > this.maximumElementWidthOfRight) { this.maximumElementWidthOfRight = element.widthOfRight; }
            if(element.widthOfLeft > this.maximumElementWidthOfLeft) { this.maximumElementWidthOfLeft = element.widthOfLeft; }
        }        

        element.y = relativeY + accumulatedHeight;

        accumulatedHeight += element.height + OMNI.Graphics.SPACE_Y;
        
    };

    this.maximumElementHeight = Math.max(OMNI.Graphics.MIN_LINE_LENGTH, accumulatedHeight);
    this.height = this.maximumElementHeight;

    // 부모 객체 업데이트 (상향 이벤트)
    if (this.parent != undefined) {
        this.parent.update();
    }
}

/**
 *
 * 트윈 업데이트
 *
 */
OMNI.Element.Line.prototype.updateTween =  function() {
    this.tween.to({ width: this.targetWidth,
                    height: this.targetHeight,
                    x: this.targetX,
                    y: this.targetY }, 400).easing(OMNI.Graphics.EASING).start();
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
 * 라인의 특정 위치에 새 코드 요소를 추가한다.
 *
 */
OMNI.Element.Line.prototype.addElementAt = function(element, index) {

    element.parent = this;

    this.elementsContainer.addChild(element.graphics);
    this.elements.splice(index, 0, element);

    this.update();
}

/**
 *
 * 라인에서 코드 요소를 삭제한다.
 *
 */
OMNI.Element.Line.prototype.removeElement = function(element) {

    var index = this.elements.indexOf(element);

    if (index > -1){
        element.parent = null;

        this.elementsContainer.removeChild(element.graphics);
        this.elements.splice(index, 1);

        this.update(); 
    }
}

/**
 *
 * 라인에서 특정 위치에 있는 코드 요소를 삭제한다.
 *
 */
OMNI.Element.Line.prototype.removeElementAt = function(index ) {

    if (index > -1 && index < this.elements.length){
        this.elements[index].parent = null;

        this.elementsContainer.removeChild(this.elements[index].graphics);
        this.elements.splice(index, 1);

        this.update(); 
    }
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