/**
 *
 * Omni.js 파라미터 모듈 
 *
 * 코드 블록의 파라미터 그래픽과 다른 블록과의 접속 이벤트를 담당합니다.
 *	
 * @constructor
 * @param {String} name - 파라미터의 이름입니다. (필수 데이터)
 * @param {String} dataType - 파라미터의 데이터 타입입니다. (기본값: number)
 * @param {Object} options - 파라미터에 추가 옵션을 지정할 수 있습니다. 추가 가능한 옵션: description, necessary
 */
OMNI.Block.Parameter = function (name, dataType, options) {

	var self = this;

	/** 파라미터 이름 */
	this._name = name || "undefined";

	/** 파라미터 데이터 타입 */
	this._dataType = dataType || "undefined";

	/** 파라미터 설명 */
	this._description = (options ? options.description : false) || "";

	/** 필수 파라미터 여부 */
	this._necessary = (options ? options.necessary : false) || false;

	/** 이 파라미터가 속한 부모 블록 */
    this.parentBlock;

    /** 이 파라미터와 연결되어 있는 블록 */
	this.connectedBlock;

	/** 그래픽스 */
	this.graphics = new PIXI.DisplayObjectContainer();
	this.graphics.interactive = true;

    // 그래픽스 초기화
	this.textfield = new PIXI.Text(this._name, OMNI.Config.Block.PARAMETER_FONT);

    this.box = new PIXI.Graphics();
    this.box.beginFill( OMNI.Config.Block.Type.get(dataType).color );
    this.box.drawRect(0, 0, Math.max(this.textfield.width, OMNI.Config.Block.PARAMETER_MIN_WIDTH) + OMNI.Config.Block.PARAMETER_WIDTH_PADDING * 2, OMNI.Config.Block.PARAMETER_HEIGHT);

    this.graphics.addChild(this.box);
    this.graphics.addChild(this.textfield);

	// 이벤트 등록 
	this.graphics.mousedown = function (e) { self.onMouseDown(e) };
	this.graphics.mouseup = function (e) { self.onMouseUp(e) };
	this.graphics.mouseupoutside = function (e) { self.onMouseUp(e) };
	this.graphics.mouseover = function (e) { self.onMouseRollOver(e) };
	this.graphics.mouseout = function (e) { self.onMouseRollOut(e) };

    this.update();
    
};

OMNI.Block.Parameter.prototype = {

	/** 파라미터의 가로 길이 (읽기 전용) */
    get width() {
        return this.graphics.width;
    },

    /** 파라미터의 세로 길이 (읽기 전용) */
    get height() {
        return this.graphics.height;
    },
  	
  	/** 파라미터의 x 좌표 */
    get x() {
        return this.graphics.x;
    },
    set x(value) {
        this.graphics.x = value;
    },

    /** 파라미터의 y 좌표 */
    get y() {
        return this.graphics.y;
    },
    set y(value) {
        this.graphics.y = value;
    },

    /** 파라미터의 이름 */
    get name() {
        return this._name;
    },
    set name(value) {
        this._name = value;
        this.textfield.setText(value);

        // 업데이트
        this.update();
    },

    /** 파라미터 데이터 타입 */
    get dataType() {
        return this._dataType;
    },
    set dataType(value) {
        this._dataType = value;

        // 업데이트
        this.update();
    },

    /** 파라미터 설명 */
    get description() {
        return this._description;
    },
    set description(value) {
        this._description = value;
    },

    /** 필수 파라미터 여부 */
    get necessary() {
        return this._necessary;
    },
    set necessary(value) {
        this._necessary = value;
    },
}

/**
 * 파라미터 타입이나 명칭이 바뀌었을 때 그래픽을 업데이트합니다.
 */
OMNI.Block.Parameter.prototype.update = function () {

	this.box.clear();
	this.box.beginFill(OMNI.Config.Block.Type.get(this._dataType).color);
    this.box.drawRect(0, 0, Math.max(this.textfield.width, OMNI.Config.Block.PARAMETER_MIN_WIDTH) + OMNI.Config.Block.PARAMETER_WIDTH_PADDING * 2, OMNI.Config.Block.PARAMETER_HEIGHT);     

	// 텍스트 필드 위치 업데이트

	this.textfield.x = Math.floor((this.box.width - this.textfield.width) / 2) + 0.5;
    this.textfield.y = Math.floor((this.box.height - this.textfield.height) / 2) + 2.5;
}

OMNI.Block.Parameter.prototype.highlight = function (on) {

	OMNI.Config.Line.HIGHLIGHT_FILTER[0].matrix = OMNI.Config.Line.HIGHLIGHT_MATRIX;

    if (on == true) {
    	this.box.filters = OMNI.Config.Line.HIGHLIGHT_FILTER;
    } else {
        this.box.filters = null;  
    }
}


/** 마우스로 파라미터를 눌렀을 때 */
OMNI.Block.Parameter.prototype.onMouseDown = function (event) {
}

/** 마우스가 파라미터를 누르기를 그만두었을 때 */
OMNI.Block.Parameter.prototype.onMouseUp = function (event) {
	
}

/** 마우스가 파라미터 위에 놓였을 때 */
OMNI.Block.Parameter.prototype.onMouseRollOver = function (event) {
	this.highlight(true);
}

/** 마우스가 파라미터 위에 놓이기를 그만두었을 때 */
OMNI.Block.Parameter.prototype.onMouseRollOut = function (event) {
	this.highlight(false);
}

OMNI.Block.Parameter.prototype.getScript = function() {
    return this.connectedBlock.getScript();
}
