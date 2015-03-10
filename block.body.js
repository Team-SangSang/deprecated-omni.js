/**
 *
 * 블록 몸체
 *
 * 블록의 이름이 표시되며, 블록 그래픽의 대부분을 차지하는 블록 몸체입니다.
 *
 * @constructor
 * @param {String} name - 블록에 표시될 텍스트입니다.
 * @param {int} color - 블록의 색깔입니다. (기본값: <Void 색상>)
 * @param {boolean} hasReturn - 블록에 리턴값이 있는지 확인합니다. 리턴값이 있으면 네모, 없으면 세모 
 */
OMNI.Block.Body = function (name, color, hasReturn, literal) {

	/** 블록 텍스트 */
	this._name = name || "undefined";

	/** 블록 색깔 */
	this._color = color || 0x999999;

    this._hasReturn = hasReturn || false;

	/** 그래픽스 */
	this.graphics = new PIXI.DisplayObjectContainer();
	this.graphics.interactive = true;

	/** 상자 그래픽 */
    this.box = new PIXI.Graphics();
    
    /** 터미널 그래픽 */
    this.terminal = new PIXI.Graphics();

    this.literal = literal;
    if(literal === undefined) {
        this.literal = false;
    }

    /** 텍스트 필드 */
    if(this._name.length < 2) {
        this._textfield = new PIXI.Text(this._name, {font: "bold 14px Segoe UI", fill: "#000000"});        
    } 

    else if(this.literal){
        this._textfield = new PIXI.Text(this._name, {font: "italic 10px Segoe UI", fill: "#0000ff"});
    }

    else {
        this._textfield = new PIXI.Text(this._name, OMNI.Config.Block.BLOCK_FONT);
    }
    this.graphics.addChild(this.box);
    this.graphics.addChild(this.terminal);
    this.graphics.addChild(this._textfield);

    /** 트윈 */
    this._tween = new TWEEN.Tween(this.box);
    this._targetValues = {
        width: 100
    };

    this._redraw();
    this.update();

};

OMNI.Block.Body.prototype = {

	/** 블록의 가로 길이 */
   	get width() {
        return this._targetValues.width;
    },
    set width(value) {

    	var max = Math.max(Math.max(value, OMNI.Config.Block.BLOCK_MIN_WIDTH), this._textfield.width + OMNI.Config.Block.BLOCK_WIDTH_PADDING * 2);

        this._targetValues.width = max;

        this._updateTween();

        // 업데이트
        this.update();
    },

    /** 블록의 세로 길이. */
    get height() {
        return this.box.height || 1;
    },
    set height(value) {
        this.box.height = value;

        // 업데이트
        this.update();
    },

    /** 터미널의 가로 길이 */
   	get terminalWidth() {
        return this.terminal.width;
    },
    set terminalWidth(value) { 

        this.terminal.width = value;
        
        // 업데이트
        this.update();
    },

    /** 블록의 x 좌표 */
    get x() {
        return this.graphics.x;
    },
    set x(value) {
        this.graphics.x = value;
    },

    /** 블록의 y 좌표 */
    get y() {
        return this.graphics.y;
    },
    set y(value) {
        this.graphics.y = value;
    },

    /** 블록에 표시될 텍스트 */
    get name() {
        return this._name;
    },
    set name(value) {
        this._name = value;
        this._textfield.setText(value);

        // 업데이트
        this.update();
    },

    /** 블록의 색깔 */
    get color() {
        return this._color;
    },
    set color(value) {
        this._color = value;

        this._redraw();
        this.update();
    },

    /** 하이라이트 */
    get highlight() {
        return this._highlight;
    },

    set highlight(value) {

        this._highlight = value;

        OMNI.Config.Line.HIGHLIGHT_FILTER[0].matrix = OMNI.Config.Line.HIGHLIGHT_MATRIX;

        if (this._highlight) {
            this.box.filters = OMNI.Config.Line.HIGHLIGHT_FILTER;
            this.terminal.filters = OMNI.Config.Line.HIGHLIGHT_FILTER;
        } else {
            this.box.filters = null;
            this.terminal.filters = null;     
        }

    },

    /** 가이드라인 
    get guideline() {
        return this._guideline;
    },

    set guideline(value) {

        this._guideline = value;

        if (this._guideline) {

            if (!this.guidelineGraphic) {

                this.guidelineGraphic = new PIXI.Graphics();

                this.guidelineGraphic.lineStyle(OMNI.Config.Block.GUIDELINE_THICKNESS, OMNI.Config.Block.GUIDELINE_COLOR, 1);
                this.guidelineGraphic.moveTo(0, 0);
                this.guidelineGraphic.lineTo(0, OMNI.Config.Block.GUIDELINE_LENGTH);
                this.graphics.addChild(this.guidelineGraphic);

            } else {

                this.guidelineGraphic.visible = true;

            }

            this.guidelineGraphic.x = this.width / 2;
            this.guidelineGraphic.y = this.height + OMNI.Config.Block.TERMINAL_HEIGHT - 1;

        } else {

            if (this.guidelineGraphic) {

                this.guidelineGraphic.visible = false;

            }

        }

    }*/
}

/**
 * 블록의 크기가 변하면 터미널과 텍스트의 위치를 업데이트합니다. 
 */
OMNI.Block.Body.prototype.update = function () {

	// 터미널을 중앙 정렬합니다.

	this.terminal.x = (this._targetValues.width - this.terminal.width) / 2;
	this.terminal.y = this.box.height - 1;

	// 텍스트를 중앙 하단으로 정렬합니다.

	this._textfield.x = Math.floor((this._targetValues.width - this._textfield.width) / 2);
	this._textfield.y = Math.floor(this.box.height - this._textfield.height) + 4;
}

OMNI.Block.Body.prototype._updateTween = function () {

    if (this._tween) {

        this._tween.to(this._targetValues, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();

    } else {

        this.box.width = this._targetValues.width;

    }

}

OMNI.Block.Body.prototype._redraw = function (){

    var width = this.width;
    var height = this.height;

    this.box.clear();

    this.box.beginFill(this._color);
    this.box.drawRect(0, 0, width, height);

    this.terminal.clear();

    if (this._hasReturn) {

        this.terminal.beginFill(this._color);
        this.terminal.drawRect(0, 0, width, OMNI.Config.Block.TERMINAL_HEIGHT);

    } else {
        this.terminal.beginFill(this._color);        
        this.terminal.moveTo(0, 0);
        this.terminal.lineTo(width, 0);
        this.terminal.lineTo(width / 2, OMNI.Config.Block.TERMINAL_HEIGHT);
        this.terminal.endFill();

    }

}