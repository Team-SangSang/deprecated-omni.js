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
OMNI.Block.Body = function (name, color, hasReturn) {

	/** 블록 텍스트 */
	this._name = name || "undefined";

	/** 블록 색깔 */
	this._color = color || 0x999999;

	/** 그래픽스 */
	this.graphics = new PIXI.DisplayObjectContainer();
	this.graphics.interactive = true;

	/** 상자 그래픽 */
    this.box = new PIXI.Graphics();
    
    /** 터미널 그래픽 */

    this.hasReturn = hasReturn || false;

    this.terminal = new PIXI.Graphics();

    

    /** 텍스트 필드 */
    this.textfield = new PIXI.Text(this._name, OMNI.Config.Block.BLOCK_FONT);

    this.graphics.addChild(this.box);
    this.graphics.addChild(this.terminal);
    this.graphics.addChild(this.textfield);

    /** 트윈 */
    this.tween = new TWEEN.Tween(this.box);
    this.tweenTarget = {
        width: 100
    };

    this.redraw();
    this.update();

};

OMNI.Block.Body.prototype = {

	/** 블록의 가로 길이 */
   	get width() {
        return this.tweenTarget.width;
    },
    set width(value) {

    	var max = Math.max(Math.max(value, OMNI.Config.Block.BLOCK_MIN_WIDTH), this.textfield.width + OMNI.Config.Block.BLOCK_WIDTH_PADDING * 2);

        this.tweenTarget.width = max;

        this.updateTween();

        // 업데이트
        this.update();
    },

    /** 블록의 세로 길이. */
    get height() {
        return this.box.height || 100;
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
        this.textfield.setText(value);

        // 업데이트
        this.update();
    },

    /** 블록의 색깔 */
    get color() {
        return this._color;
    },
    set color(value) {
        this._color = value;

        this.redraw();
        this.update();
    },

}

/**
 * 블록의 크기가 변하면 터미널과 텍스트의 위치를 업데이트합니다. 
 */
OMNI.Block.Body.prototype.update = function () {

	// 터미널을 중앙 정렬합니다.

	this.terminal.x = (this.tweenTarget.width - this.terminal.width) / 2;
	this.terminal.y = this.box.height - 1;

	// 텍스트를 중앙 하단으로 정렬합니다.

	this.textfield.x = Math.floor((this.tweenTarget.width - this.textfield.width) / 2);
	this.textfield.y = Math.floor(this.box.height - this.textfield.height) + 4;
}

OMNI.Block.Body.prototype.updateTween = function () {
    if (this.tween) {
        this.tween.to(this.tweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();        
    } else {
        this.box.width = this.tweenTarget.width;
    }
}

OMNI.Block.Body.prototype.redraw = function (){

    var width = this.width;
    var height = this.height;

    this.box.clear();

    this.box.beginFill(this._color);
    this.box.drawRect(0, 0, width, height);

    this.terminal.clear();

    if (this.hasReturn) {

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

OMNI.Block.Body.prototype.highlight = function (on) {

	OMNI.Config.Line.HIGHLIGHT_FILTER[0].matrix = OMNI.Config.Line.HIGHLIGHT_MATRIX;

    if (on == true) {
    	this.box.filters = OMNI.Config.Line.HIGHLIGHT_FILTER;
        this.terminal.filters = OMNI.Config.Line.HIGHLIGHT_FILTER;
    } else {
        this.box.filters = null;
        this.terminal.filters = null;     
    }
}