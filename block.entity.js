OMNI.Config.Block = {

	// 블록 관련 설정

	BLOCK_HEIGHT: 25,
	BLOCK_MIN_WIDTH: 30,
	BLOCK_WIDTH_PADDING: 5,
	BLOCK_FONT: {font: "bold 12px Arial", fill: "#000000"},

	TERMINAL_HEIGHT: 12,
	TERMINAL_TO_BLOCK_RATIO: 0.4,

	// 파라미터 관련 설정

	PARAMETER_HEIGHT: 20,
	PARAMETER_MIN_WIDTH: 25,
	PARAMETER_WIDTH_PADDING: 5,
	PARAMETER_FONT: {font: "12px Arial", fill: "#000000"},

	// 인접한 블록 사이의 최소 여백

	SPACE_ADJACENT_BLOCK: 5,

	// 블록 드래그 이벤트 호출 Interval

	DRAG_EVENT_INTERVAL: 200,

}

 /**
 *
 * 코드 블록
 *
 * 블록 명령을 의미합니다. 블록에는 파라미터를 붙여서 다른 블록의 반환값을 받을 수도 있고, 터미널을 통해 다른 블록으로 반환값을 내보낼 수도 있습니다.
 * 블록 하나 이상이 모여 의미있는 명령을 구성하게 되며, 이 명령은 네이티브 코드로 변환되어 프로그램 실행에 관여합니다.
 *
 * @constructor 
 * @param {String} name - 코드 블록의 이름입니다. 보통 이 블록이 의미하는 명령을 나타냅니다.
 * @param {String} returnType - 블록의 리턴 타입입니다. 이 속성이 void이거나 정해지지 않을 경우 터미널이 생성되지 않습니다. (기본값: void)
 * @param {Array} parameters - 블록에 추가할 파라미터들의 정보입니다. 자세한 형식은 파라미터 모듈을 참고하세요.
 * @param {Object} options - 코드 블록에 대한 추가 옵션입니다. 설정 가능한 값: description
 *
 */
OMNI.Block.Entity = function (name, returnType, parameters, options) {

	var self = this;

	/** 블록 이름 */
	this._name = name || "undefined";

	/** 블록 리턴 타입 */
	this._returnType = returnType || "void";

	/** 블록 설명 */
	this._description = (options ? options.description : false) || "";

	/** 그래픽스 */
	this.graphics = new PIXI.DisplayObjectContainer();

	this.container = new PIXI.DisplayObjectContainer();
	this.graphics.addChild(this.container);

	/** 블록 구성 요소 */
	this.body = new OMNI.Block.Body(this._name);

	this.body.color = OMNI.Config.Code.Data.get(returnType).color;

	this.container.addChild(this.body.graphics);

	/** 파라미터 목록 */
	this.parameters = [];

	if (parameters) {
		for (var i = 0; i < parameters.length; i++) {

			var parameterData = parameters[i];
			var parameter = new OMNI.Block.Parameter(parameterData.name, parameterData.type);

			this.parameters.push(parameter);
			this.container.addChild(parameter.graphics);
		}
	}

	/** 이 블록의 연결 정보. 다른 블록의 파라미터가 될 수도 있고 라인일 수도 있습니다. */
	this.connection;

	// 이벤트 등록 
	this.body.graphics.mousedown = function (e) { self.onMouseDown(e) };
	this.body.graphics.mouseup = function (e) { self.onMouseUp(e) };
	this.body.graphics.mouseupoutside = function (e) { self.onMouseUp(e) };
	this.body.graphics.mouseover = function (e) { self.onMouseRollOver(e) };
	this.body.graphics.mouseout = function (e) { self.onMouseRollOut(e) };
	this.body.graphics.mousemove = function (e) { self.onMouseMove(e) };

	// 업데이트
	this.update();
}

OMNI.Block.Entity.prototype = {

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

    /** 블록 이름 */
    get name() {
        return this._name;
    },
    set name(value) {
        this._name = value;
    },

    /** 블록의 리턴 타입 */
    get returnType() {
        return this._returnType;
    },
    set returnType(value) {
        this._returnType = value;
    },

    /** 블록 설명 */
    get description() {
        return this._description;
    },
    set description(value) {
        this._description = value;
    },
}

/**
 * 
 * 블록 간의 연결 상태를 반영하여 블록 내부 요소의 크기를 새로 조정합니다.
 *
 */
OMNI.Block.Entity.prototype.update = function () {
	
	// 파라미터 정렬

	var widthAccumulation = this._updateParametersPosition(OMNI.Config.Block.SPACE_ADJACENT_BLOCK);

	// 블록 크기 설정

	this.body.width = widthAccumulation;
	this.body.height = OMNI.Config.Block.BLOCK_HEIGHT;

	if (this.parameters.length > 0) { this.body.height += OMNI.Config.Block.PARAMETER_HEIGHT; }

	// 블록 이름이 길다거나 하는 이유로 여백이 남으면 파라미터 간격을 조정합니다.

	var gap = this.body.width - widthAccumulation;

	if (gap > 0 && this.parameters.length > 0) {

		var gapDiv = (gap + OMNI.Config.Block.SPACE_ADJACENT_BLOCK * (this.parameters.length - 1)) / (this.parameters.length + 1);

		this._updateParametersPosition(gapDiv);
	}

	this.container.x = - Math.floor(this.body.width / 2);
}

OMNI.Block.Entity.prototype._updateParametersPosition = function (space) {

	// 파라미터에 연결된 블록이 있다면 그 너비를 고려하여 파라미터의 위치를 정합니다. 

	var widthAccumulation = space;

	for (var i = 0; i < this.parameters.length; i++) {

		var parameter = this.parameters[i];
		var boundaryWidth = Math.max(parameter.connectedBlock ? parameter.connectedBlock.width : 0 , parameter.width);

		parameter.x = widthAccumulation + (boundaryWidth - parameter.width) / 2;

		widthAccumulation += boundaryWidth + space;

	}

	return widthAccumulation;
}

/** 마우스로 블록을 눌렀을 때 */
OMNI.Block.Entity.prototype.onMouseDown = function (event) {
	this._dragging = true;

	if (!this._localOriginPosition) { this._localOriginPosition = new PIXI.Point(); }
	event.getLocalPosition(this.graphics.parent, this._localOriginPosition);

	this._localOriginPosition.x -= this.x;
	this._localOriginPosition.y -= this.y;

	// 포커스 이벤트 트리거

	this.onFocus(this);

	// 드래그 이벤트 트리거

	var self = this;

	this._prevX = 0;
	this._prevY = 0;

	this._intervalId = setInterval(function () {

		if(self.x != self._prevX || self.y != self._prevY) {
			self.onDrag(self);

			self._prevX = self.x;
			self._prevY = self.y;
		}
	}, OMNI.Config.Block.DRAG_EVENT_INTERVAL);
}

/** 마우스가 블록을 누르기를 그만두었을 때 */
OMNI.Block.Entity.prototype.onMouseUp = function (event) {
	this._dragging = false;

	// 드래그 이벤트 해제
	clearInterval(this._intervalId);
}

/** 마우스가 블록 위에 놓였을 때 */
OMNI.Block.Entity.prototype.onMouseRollOver = function (event) {
	this.body.highlight(true);
}

/** 마우스가 블록 위에 놓이기를 그만두었을 때 */
OMNI.Block.Entity.prototype.onMouseRollOut = function (event) {
	this.body.highlight(false);
}

/** 마우스가 블록 위에서 움직을 때 */
OMNI.Block.Entity.prototype.onMouseMove = function (event) {

	if (this._dragging) {

		if (!this._localPosition) { this._localPosition = new PIXI.Point(); }

		event.getLocalPosition(this.graphics.parent, this._localPosition);

		this.x = this._localPosition.x - this._localOriginPosition.x;
		this.y = this._localPosition.y - this._localOriginPosition.y;
	}
}

/**
 * 마우스가 블록을 클릭했을 때 (Dispatch 용) 
 *
 * @param {OMNI.Block.Entity} - 클릭된 블록
 */
OMNI.Block.Entity.prototype.onFocus = function (targetBlock) { }

/**
 * 마우스로 블록을 움직일 때 (Dispatch 용) 
 *
 * @param {OMNI.Block.Entity} - 클릭된 블록
 */
OMNI.Block.Entity.prototype.onDrag = function (targetBlock) { }