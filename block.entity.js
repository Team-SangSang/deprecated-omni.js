OMNI.Config.Block = {

	// 블록 관련 설정

	BLOCK_HEIGHT: 15,
	BLOCK_MIN_WIDTH: 20,
	BLOCK_WIDTH_PADDING: 5,
	BLOCK_FONT: {font: "bold 9px Segoe UI", fill: "#000000"},

	TERMINAL_HEIGHT: 12,
	TERMINAL_MIN_WIDTH: 16,
	TERMINAL_HITTING_EDGE_WIDTH: 8,
	TERMINAL_TO_BLOCK_RATIO: 0.4,

	// 파라미터 관련 설정

	PARAMETER_HEIGHT: 14,
	PARAMETER_MIN_WIDTH: 14,
	PARAMETER_WIDTH_PADDING: 4,
	PARAMETER_FONT: {font: "9px Segoe UI", fill: "#FFFFFF"},

	// 인접한 블록 사이의 최소 여백

	SPACE_ADJACENT_BLOCK: 7,

	// 블록 드래그 이벤트 호출 Interval

	DRAG_EVENT_INTERVAL: 200,

}
/*
OMNI.Config.Block = {

	// 블록 관련 설정

	BLOCK_HEIGHT: 25,
	BLOCK_MIN_WIDTH: 30,
	BLOCK_WIDTH_PADDING: 9,
	BLOCK_FONT: {font: "bold 12px Arial", fill: "#000000"},

	TERMINAL_HEIGHT: 12,
	TERMINAL_MIN_WIDTH: 16,
	TERMINAL_HITTING_EDGE_WIDTH: 8,
	TERMINAL_TO_BLOCK_RATIO: 0.4,

	// 파라미터 관련 설정

	PARAMETER_HEIGHT: 20,
	PARAMETER_MIN_WIDTH: 25,
	PARAMETER_WIDTH_PADDING: 5,
	PARAMETER_FONT: {font: "12px Arial", fill: "#000000"},

	// 인접한 블록 사이의 최소 여백

	SPACE_ADJACENT_BLOCK: 7,

	// 블록 드래그 이벤트 호출 Interval

	DRAG_EVENT_INTERVAL: 200,

}
*/
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
	this.body = new OMNI.Block.Body(this._name, OMNI.Config.Code.Data.get(returnType).color, this._returnType != "void");

	this.container.addChild(this.body.graphics);

	/** 파라미터 목록 */
	this.parameters = [];

	if (parameters) {
		for (var i = 0; i < parameters.length; i++) {
			var parameterData = parameters[i];
			this.addParameter(new OMNI.Block.Parameter(parameterData.name, parameterData.type));
		}
	}

	/** 이 블록의 연결 정보. 다른 블록의 파라미터가 될 수도 있고 라인일 수도 있습니다. */
	this.connection;
	this.targetingConnection;

	// 이벤트 등록 
	this.body.graphics.mousedown = function (e) { self.onMouseDown(e) };
	this.body.graphics.mouseup = function (e) { self.onMouseUp(e) };
	this.body.graphics.mouseupoutside = function (e) { self.onMouseUp(e) };
	this.body.graphics.mouseover = function (e) { self.onMouseRollOver(e) };
	this.body.graphics.mouseout = function (e) { self.onMouseRollOut(e) };
	this.body.graphics.mousemove = function (e) { self.onMouseMove(e) };


	/** 트윈 데이터 */
	this.tween = new TWEEN.Tween(this.graphics);
	this.tweenTarget = {
		x: 0
	}

	this.containerTween = new TWEEN.Tween(this.container);
	this.containerTweenTarget = {
		x: 0
	}

	// 업데이트
	this.update();
}

OMNI.Block.Entity.prototype = {

	/** 블록의 x 좌표 */
	get x() {
        return this.tweenTarget.x;
    },
    set x(value) {
    	this.tweenTarget.x = value;
    	this.updateTween();
    },
    set x_t(value) {    	
        this.graphics.x = value;
    },

    /** 블록의 y 좌표 */
    get y() {
        return this.graphics.y;
    },
    set y(value) {
        this.graphics.y = value;
    },
    set y_t(value) {    	
        this.graphics.y = value;
    },

    /** 왼쪽 돌출부 */
    get leftProminent() {
    	return this._leftProminent;
    },

     /** 오른족 돌출부 */
    get rightProminent() {
    	return this._rightProminent;
    },

    /** 블록의 가로 길이 */
    get width() {
    	return this.body.width;
    },

    /** 블록의 세로 길이 */
    get height() {
    	return this.graphics.height;
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
// direction에는 up(0) 과 down(1) 이 있음.
OMNI.Block.Entity.prototype.update = function (ascending) {
	
	// up : 위치 업데이트
	if(ascending) {
		this._updatePosition();
	} 

	// down : 크기 업데이트
	else {

		this._updateSize();		

		// 하향 업데이트
		if (this.connection) {
			this.connection.block.update(false);
			return;
		}

	}

	// 바닥까지 도달했거나 상향 업데이트 중이면 상향 업데이트
	for (var i = 0; i < this.parameters.length; i++) {
		var parameter = this.parameters[i];
		if (parameter.connection) {
			parameter.connection.update(true);
		}
	}


}

OMNI.Block.Entity.prototype.updateTween = function () {
    if (this.tween) {
        this.tween.to(this.tweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();
        //this.containerTween.to(this.containerTweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();       
    } else {
        this.graphics.x = this.tweenTarget.x;
        //this.container.x = this.containerTweenTarget.x;
    }
}

OMNI.Block.Entity.prototype.updateInternalTween = function () {
    if (this.tween) {
        //this.tween.to(this.tweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();
        this.containerTween.to(this.containerTweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();       
    } else {
        //this.graphics.x = this.tweenTarget.x;
        this.container.x = this.containerTweenTarget.x;
    }
}

/**
 * 이 블록에 연결된 상위 블록의 파라미터와 위치를 일치시킵니다.
 * 주의: 이 구문은 파라미터 클래스의 구조에 민감합니다. 포함 관계가 변경되면 반드시 아래 코드도 수정되어야 함.
 */
OMNI.Block.Entity.prototype._updatePosition = function () {

	if (this.connection) {

		var root = this.connection.graphics.parent ? (this.connection.graphics.parent.parent ?  this.connection.graphics.parent.parent : null) : null;

		if (root) {

			this.x = this.connection.block.x + this.connection.x + (this.connection.width - this.connection.block.width) / 2;
			this.y = root.y - this.height;

		}
	}
}

OMNI.Block.Entity.prototype._updateSize = function () {

	var blockWidthInfo = this._updateParameters(OMNI.Config.Block.SPACE_ADJACENT_BLOCK);

	this.body.width = blockWidthInfo[1];

	this._leftProminent = blockWidthInfo[0];
	this._rightProminent = blockWidthInfo[2];

	this._updateTerminal();

	this.body.height = OMNI.Config.Block.BLOCK_HEIGHT;	
	if (this.parameters.length > 0) { this.body.height += OMNI.Config.Block.PARAMETER_HEIGHT; }

	// 블록 이름이 길다거나 하는 이유로 여백이 남으면 파라미터 간격을 조정합니다.

	var gap = this.body.width - blockWidthInfo[1];

	if (gap > 0 && this.parameters.length > 0) {
		console.log(this.name)
		var extendedSpace = (gap + OMNI.Config.Block.SPACE_ADJACENT_BLOCK * (this.parameters.length - 1)) / (this.parameters.length - 1);

		this._updateParameters(extendedSpace);
	}

	this.containerTweenTarget.x = - Math.floor(this.body.width / 2);
	this.updateInternalTween();
}

/**
 * 파라미터에 연결된 블록들을 업데이트하고, 블록들의 크기를 반영하여 파라미터를 정렬합니다.
 *
 * @param {int} space - 파라미터 간 최소 간격입니다.
 * @return {Array} - [좌측으로 튀어나온 파라미터 길이, 실제 총 길이, 우측으로 튀어나온 파라미터 길이]
 */
OMNI.Block.Entity.prototype._updateParameters = function (space) {

	var widthAccumulation = OMNI.Config.Block.BLOCK_WIDTH_PADDING;

	var leftProminent = 0;
	var rightProminent = 0;

	for (var i = 0; i < this.parameters.length; i++) {

		var parameter = this.parameters[i];
		var parameterWidth;

		if (parameter.connection) {

			if (i < 1) {
				
				parameterWidth = (parameter.connection.width + parameter.width) / 2 + parameter.connection.rightProminent;
				leftProminent = (parameter.connection.width - parameter.width) / 2 + parameter.connection.leftProminent;
				leftProminent -= OMNI.Config.Block.BLOCK_WIDTH_PADDING;

				parameter.x = widthAccumulation;

			} else if (i > this.parameters.length - 2) {

				parameterWidth = (parameter.connection.width + parameter.width) / 2 + parameter.connection.leftProminent;
				rightProminent = (parameter.connection.width - parameter.width) / 2 + parameter.connection.rightProminent;
				rightProminent -= OMNI.Config.Block.BLOCK_WIDTH_PADDING;

				parameter.x = widthAccumulation + parameterWidth - parameter.width;

			} else {

				parameterWidth = parameter.connection.leftProminent + parameter.connection.width + parameter.connection.rightProminent;
				parameter.x = widthAccumulation + parameter.connection.leftProminent + (parameter.connection.width - parameter.width) / 2;

			}

			parameter.connection._updateTerminal();
		}

		else {

			parameterWidth = parameter.width;
			parameter.x = widthAccumulation;

		}

		widthAccumulation += parameterWidth + space;
	}

	var centerWidth = widthAccumulation - space + OMNI.Config.Block.BLOCK_WIDTH_PADDING;

	return [leftProminent, centerWidth, rightProminent];
}

/**
 * 이 블록의 터미널의 크기와 위치를 업데이트합니다.
 */
OMNI.Block.Entity.prototype._updateTerminal = function () {

	if (this.connection) {

		this.body.terminalWidth = this.connection.width;

	} else {

		this.body.terminalWidth = this.body.width * OMNI.Config.Block.TERMINAL_TO_BLOCK_RATIO;

	}
}

/**
 * 이 블록과 하위 블록의 위치를 델타값을 사용하여 업데이트합니다.
 */
OMNI.Block.Entity.prototype.setGroupDelta = function (deltaX, deltaY) {

	this.graphics.x += deltaX;
	this.graphics.y += deltaY;

	this.tweenTarget.x += deltaX;

	for (var i = 0; i < this.parameters.length; i++) {
		var parameter = this.parameters[i];
		if (parameter.connection) {
			parameter.connection.setGroupDelta(deltaX, deltaY);
		}
	}
}


/**
 * 두 그래픽 요소 간의 충돌 여부를 Global 레벨에서 검사합니다.
 * o1 : 터미널, o2: 파라미터
 */
OMNI.Block.Entity.prototype.intersect = function(parameter) {

	var o1 = this.body.terminal;
	var o2 = parameter.graphics;

    if(!this._worldOriginPoint) { this._worldOriginPoint = new PIXI.Point(0, 0); }

    var p1 = o1.toGlobal(this._worldOriginPoint);
    var p2 = o2.toGlobal(this._worldOriginPoint);

    // Left check

    if (p1.x + OMNI.Config.Block.TERMINAL_HITTING_EDGE_WIDTH > p2.x) {
        if (p1.x < p2.x + o2.width) {
           if (p1.y + o1.height > p2.y) {
                if (p1.y < p2.y + o2.height) {
                    return true;
                }
            }
        }
    }

     // Right check
     /*
    if (p1.x + o1.width > p2.x) {
        if (p1.x + o1.width - OMNI.Config.Block.TERMINAL_HITTING_EDGE_WIDTH < p2.x + o2.width) {
           if (p1.y + o1.height > p2.y) {
                if (p1.y < p2.y + o2.height) {
                    return true;
                }
            }
        }
    }
    */
    return false;
}

/**
 * 블록을 특정 파라미터에 연결합니다.
 *
 * @param {OMNI.Block.Parameter} parameter - 이 블록과 연결된 파라미터
 */
OMNI.Block.Entity.prototype.dock = function (parameter) {

	this.connection = parameter;
	parameter.connection = this;
	
	this.update();
}


/**
 * 블록에 연결된 파라미터를 제거합니다.
 */
OMNI.Block.Entity.prototype.undock = function () {
	
	var connected = this.connection;

	this.connection.connection = null;
	this.connection = null;
	
	this.update();
	connected.block.update();

}

/**
 *
 * 블록에 파라미터를 추가합니다.
 *
 * @param {OMNI.Block.Parameter} parameter - 추가할 파라미터
 */
OMNI.Block.Entity.prototype.addParameter = function (parameter) {
	this.addParameterAt(parameter, this.parameters.length);	
}

/**
 *
 * 블록에 파라미터를 추가합니다. 파라미터의 순서를 지정할 수 있습니다.
 *
 * @param {OMNI.Block.Parameter} parameter - 추가할 파라미터
 * @param {int} index - 추가할 파라미터의 인덱스
 */
OMNI.Block.Entity.prototype.addParameterAt = function (parameter, index) {
	parameter.block = this;
	this.parameters.splice(index, 0, parameter);
	this.container.addChild(parameter.graphics);
}

/**
 *
 * 블록에서 파라미터를 제거합니다.
 *
 * @param {OMNI.Block.Parameter} parameter - 제거할 파라미터
 */
OMNI.Block.Entity.prototype.removeParameter = function (parameter) {

	// 제거할 블록이 실제 존재하는지 확인
	var index = this.parameters.indexOf(parameter);

	if (index > -1) {
		parameter.block = null;
		this.parameters.splice(index, 1);
		this.container.removeChild(parameter.graphics);
	}
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

	this.onDragStart(this);
	this._intervalId = setInterval(function () {

		if(self.x != self._prevX || self.y != self._prevY) {
			self.onDragStart(self);

			self._prevX = self.x;
			self._prevY = self.y;
		}
	}, OMNI.Config.Block.DRAG_EVENT_INTERVAL);
}

/** 마우스가 블록을 누르기를 그만두었을 때 */
OMNI.Block.Entity.prototype.onMouseUp = function (event) {
	this._dragging = false;

	this.onDragFinish(this);

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

		var deltaX = this._localPosition.x - this._localOriginPosition.x - this.x;
		var deltaY = this._localPosition.y - this._localOriginPosition.y - this.y;

		this.setGroupDelta(deltaX, deltaY);
	}
}

/**
 * 마우스가 블록을 클릭했을 때 (Dispatch 용) 
 *
 * @param {OMNI.Block.Entity} - 클릭된 블록
 */
OMNI.Block.Entity.prototype.onFocus = function (targetBlock) { }

/**
 * 마우스로 블록을 드래그하기 시작했을 때 (Dispatch 용) 
 *
 * @param {OMNI.Block.Entity} - 클릭된 블록
 */
OMNI.Block.Entity.prototype.onDragStart = function (targetBlock) { }

/**
 * 드래그가 끝났을 때 (Dispatch 용) 
 *
 * @param {OMNI.Block.Entity} - 클릭된 블록
 */
OMNI.Block.Entity.prototype.onDragFinish = function (targetBlock) { }