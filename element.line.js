/**
 *
 * 동작하는 세로선
 *
 */
OMNI.Element.Line = function(isProcedure, trigger) {

    var that = this;

    // 부모 객체(element 거나 없음)
    this.parent;

    // 프로시저 여부
    this.isProcedure = isProcedure || false;

    // 그래픽
    this.graphics = new PIXI.DisplayObjectContainer();

    this.line = new PIXI.DisplayObjectContainer();
    this.lineGraphic = new PIXI.Graphics();
    this.lineGraphic.beginFill(0);
    this.lineGraphic.drawRect(0, 0, 10, 10);
    this.line.addChild(this.lineGraphic);
    this.graphics.addChild(this.line);

    if (isProcedure) {
        this.trigger = trigger;
        this.trigger.graphics.x = - this.trigger.graphics.width / 2  + OMNI.Graphics.LINE_THICKNESS;
        this.trigger.graphics.y = - this.trigger.graphics.height / 2;
        //this.line.y = this.trigger.graphics.height;
        this.graphics.addChild(this.trigger.graphics);
    }

    this.line.interactive = true;
    this.graphics.interactive = true;

    // 구성 요소
    this.elements = [];
    this.elementsContainer = new PIXI.DisplayObjectContainer();

    this.maximumElementWidthOfRight = 0;
    this.maximumElementWidthOfLeft = 0;
    this.maximumElementHeight = 0;    

    // 트윈
    this.tween = new TWEEN.Tween(this.graphics);
    this.lineTween = new TWEEN.Tween(this.lineGraphic)
    this.elementsTween = new TWEEN.Tween(this.elementsContainer);

    // 선 굵기
    this.thickness = OMNI.Graphics.LINE_THICKNESS;

    this.lineGraphic.width = this.thickness;
    this.lineGraphic.height = OMNI.Graphics.MIN_LINE_LENGTH * 2;

    this.targetX = 0;
    this.targetY = 0;
    this.targetWidth = this.lineGraphic.width;
    this.targetHeight = this.lineGraphic.height;

    this.line.mouseover = function(e) {
        that.onMouseRollOver(e);
    }
    this.line.mouseout = function(e) {
        that.onMouseRollOut(e);
    }

    this.update();
};

// public 메서드
OMNI.Element.Line.prototype = {

    get thickness () { return this._thickness; },
    set thickness (value) {
        this._thickness = value;        
        this.targetWidth = value;
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

    var maximumThickness = OMNI.Graphics.LINE_THICKNESS;

    // 가장 굵은 하위 요소를 찾는다.
    for (var i = 0; i < this.elements.length; i++) {
        var element = this.elements[i];
        if (element instanceof OMNI.Element.Branch) {
            if (element.thickness > maximumThickness){
                maximumThickness = element.thickness;
            }
        }
    }

    // 굵기 설정
    this.thickness = maximumThickness + OMNI.Graphics.LINE_THICKNESS_ADDER;

    // 구성 요소 세로 정렬
    var relativeX = this.thickness / 2;
    var relativeY = 0;

    var accumulatedHeight = OMNI.Graphics.SPACE_Y * 2;
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
    this.tween.to({ x: this.targetX,
                    y: this.targetY }, 400).easing(OMNI.Graphics.EASING).start();
    this.elementsTween.to({x: this.targetX, y: this.targetY}, 400).easing(OMNI.Graphics.EASING).start();
    this.lineTween.to({width: this.targetWidth, height: this.targetHeight}, 400).easing(OMNI.Graphics.EASING).start();
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
        this.lineGraphic.filters = [OMNI.Graphics.highlightFilter];
    } else {
        this.lineGraphic.filters = null;
    }
}

/**
 *
 * 힌트 스팟 추가
 *
 */
OMNI.Element.Line.prototype.addHint = function(index) {

    if (this.hintspot == null) {
        this.hintspot = new OMNI.Element.HintSpot();
    }
    this.hintspot.radius = this.thickness / 2;

    this.line.addChild(this.hintspot.graphics);
    this.elements.splice(index, 0, this.hintspot);

    var that = this;
    this.hintspot.graphics.click = function() {
        if (OMNI.Shared.mode == 1){
            that.hintspot.showDirectionBar();

            that.hintspot.directionBarLeft.click = function() {
                that.addElementAt(new OMNI.Element.Branch(false), index);
                that.removeHint();
            }

            that.hintspot.directionBarRight.click = function() {
                that.addElementAt(new OMNI.Element.Branch(true), index);
                that.removeHint();
            }

        } else if (OMNI.Shared.mode == 2){
            that.addElementAt(new OMNI.Element.Block(false), index);
            that.removeHint();
        } else {
            that.addElementAt(new OMNI.Element.Block(true), index);
            that.removeHint();
        }
        
    }

    this.update();
}

OMNI.Element.Line.prototype.removeHint = function() {

    this._currentHintSpotIndex = -1;

    var index = this.elements.indexOf(this.hintspot);

    if (index > -1) {
        this.hintspot.closeDirectionBar();
        this.line.removeChild(this.hintspot.graphics);
        this.elements.splice(index, 1);
    }
    this.update();
}

OMNI.Element.Line.prototype.onMouseRollOver = function(event) {

    this.onMouseMove(event);

    var that = this;
    this.line.mousemove = function(e) { that.onMouseMove(e); };
    
}

OMNI.Element.Line.prototype.onMouseRollOut = function(event) {
    this.line.mousemove = null;
    this.removeHint();
}


OMNI.Element.Line.prototype.onMouseMove = function(event) {    
    this._localPoint = event.getLocalPosition(this.line, this._localPoint);

    //console.log(Math.floor(this._localPoint.x) +" / "+ Math.floor(this._localPoint.y));
    // 마우스가 위치한 인덱스를 찾는다.
    var accumulatedHeight = 0;
    var previousHalfHeight = this.thickness;
    var index = this.elements.length;

    this._localPoint.y -= OMNI.Graphics.SPACE_Y;

   for (var i = 0; i < this.elements.length; i++) {
        var element = this.elements[i];           
        if (this._localPoint.y > accumulatedHeight - previousHalfHeight) {
            previousHalfHeight = element.height / 2;
            if (this._localPoint.y < accumulatedHeight + OMNI.Graphics.SPACE_Y + previousHalfHeight){
                index = i;
                break;
            }
        }
        accumulatedHeight += element.height + OMNI.Graphics.SPACE_Y;
    }
    if (index != this._currentHintSpotIndex) {        
        this.removeHint();
        this.addHint(index);
        this._currentHintSpotIndex = index;
    }
}