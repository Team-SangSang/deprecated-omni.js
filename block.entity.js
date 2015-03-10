OMNI.Config.Block = {

	// 데이터 타입

	Type: {
		get: function (dataType) {
			switch (dataType.toLowerCase()) {
				case "number": return OMNI.Config.Block.Type.NUMBER;
				case "string": return OMNI.Config.Block.Type.STRING;
				case "boolean": return OMNI.Config.Block.Type.BOOLEAN;
				case "array": return OMNI.Config.Block.Type.ARRAY;
				case "union": return OMNI.Config.Block.Type.UNION;
				case "void": return OMNI.Config.Block.Type.VOID;
				case "branch": return OMNI.Config.Block.Type.BRANCH;
				case "loop": return OMNI.Config.Block.Type.LOOP;
				default: return OMNI.Config.Block.Type.UNDEFINED;
			}
		},
		NUMBER: { color:0x2196F3 }, // blue
		STRING: { color:0x64DD17 },	// light green	
		BOOLEAN: { color:0xFF5722 }, // Orange
		ARRAY: { color:0x1C86EE },
		UNION: { color:0x4A148C },
		VOID: { color:0xFFC107 }, // amber
		BRANCH: { color:0xFFEB3B }, //yellow
		LOOP: { color:0xFFEB3B }, // yelow
		UNDEFINED: { color:0x607D8B }, // blue grey
	},

	// 블록 정의

	Predefined: {
		/*예시: ["블록 이름",
				 "블록 타입",
				 "블록 설명", [{

                 name: "파리미터 이름",
                 type: "파라미터 타입",
                 desciption: "파라미터 설명" }, { 

                 name: "파라미터 이름",
                 type: "파리미터 타입",
                 description: "파라미터 설명" }],

                 function (a, b) {
                 	return;
                 }],*/
        STRING: ["String", "string", "string",[], function () { }],
        NUMBER: ["Number", "number", "number",[], function () { }],
        BRANCH: ["Branch",
				 "branch",
				 "Splits the line into two.", [{

                 name: "Condition",
                 type: "boolean",
                 description: "branch condition" }],

                 function (a, b, c) {
                 	return "if (" + a + "== true) {\n" + b + "\n} else {\n" + c + "\n}\n";
                 }],

        INIT: ["Program start",
				 "void",
				 "Entry of program.", [],

                 function (a) {
                 	return "function () {\n" + a + "\n}\n";
                 }],

        CLICKED: ["When clicked",
				 "void",
				 "clicked", [],

                 function (a) {
                 	return "SANGJA.player.api.keyPressed(function (key) {\n" + a + "\n});\n";
                 }],

        COLLIDED: ["When collided",
				 "void",
				 "clicked", [{

                 name: "target",
                 type: "union",
                 description: "collided object" }],

                 function (a) {
                 	return "SANGJA.player.api.keyPressed(function (key) {\n" + a + "\n});\n";
                 }],
        TIMER: ["Every given seconds",
				 "void",
				 "clicked", [{

                 name: "seconds",
                 type: "number",
                 description: "tick time" }],

                 function (a) {
                 	return "SANGJA.player.api.keyPressed(function (key) {\n" + a + "\n});\n";
                 }],

        KEY_PRESSED: ["When key pressed",
				 "void",
				 "key pressed", [{

                 name: "Pressed key",
                 type: "string",
                 description: "pressed key" }],

                 function (a) {
                 	return "SANGJA.player.api.keyPressed(function (key) {\n" + a + "\n});\n";
                 }],

        // 사칙연산부터 정의한다!

        SES: ["assign", "void", "set", [{name:"target", type:"string"}, {name:"value", type:"string"}], function () {} ],
        SEN: ["assign", "void", "set", [{name:"target", type:"number"}, {name:"value", type:"number"}], function () {} ],
        ADD: ["+", "number", "add", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        SUB: ["-", "number", "set", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        MUL: ["*", "number", "set", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        DIV: ["/", "number", "set", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        MOD: ["mod", "number", "set", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        BIG: [">", "boolean", "set", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        BGE: [">=", "boolean", "set", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        SML: ["<", "boolean", "set", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        SME: ["<=", "boolean", "set", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        EQL: ["equal", "boolean", "set", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        NOT: ["not", "boolean", "set", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        AND: ["and", "boolean", "set", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        ORR: ["or", "boolean", "set", [{name:"A", type:"number"}, {name:"B", type:"number"}], function () {} ],
        NTS: ["Number to string", "string", "set", [{name:"Number", type:"number"}], function () {} ],
		STN: ["String to number", "number", "set", [{name:"String", type:"string"}], function () {} ],

        MOVE_BY: ["Move by",
				 "void",
				 "Moves union by some amount", [{

                 name: "target",
                 type: "union",
                 desciption: "union to move" },{

                 name: "x",
                 type: "number",
                 desciption: "x amount" }, { 

                 name: "y",
                 type: "number",
                 description: "y amount" }, { 

                 name: "z",
                 type: "number",
                 description: "z amount" }],

                 function (a, b, c, d) {
                 	return "SANJA.player.api.moveBy(" + a + ", " + b + ", " + c + ", " + d + ");";
                 }],

        MOVE_TO: ["Move to",
				 "void",
				 "Moves union by some amount", [{

                 name: "target",
                 type: "union",
                 desciption: "union to move" },{

                 name: "x",
                 type: "number",
                 desciption: "x amount" }, { 

                 name: "y",
                 type: "number",
                 description: "y amount" }, { 

                 name: "z",
                 type: "number",
                 description: "z amount" }],

                 function (a, b, c, d) {
                 	return "SANJA.player.api.moveBy(" + a + ", " + b + ", " + c + ", " + d + ");";
                 }],
        ROTATE: ["Rotate",
				 "void",
				 "rotate unit", [{

                 name: "target",
                 type: "union",
                 desciption: "union to move" },{

                 name: "radius",
                 type: "number",
                 desciption: "amount" }],

                 function (a, b, c, d) {
                 	return "SANJA.player.api.moveBy(" + a + ", " + b + ", " + c + ", " + d + ");";
                 }],

        ASK: ["Ask",
				 "string",
				 "ask user something", [{

                 name: "question",
                 type: "string",
                 desciption: "something to say" }],

                 function (a, b, c, d) {
                 	return "SANJA.player.api.moveBy(" + a + ", " + b + ", " + c + ", " + d + ");";
                 }],
        YES_OR_NO: ["Yes or no",
				 "boolean",
				 "ask user something", [{

                 name: "question",
                 type: "string",
                 desciption: "something to say" }],

                 function (a, b, c, d) {
                 	return "SANJA.player.api.moveBy(" + a + ", " + b + ", " + c + ", " + d + ");";
                 }],
        SAY: ["Say",
				 "void",
				 "ask user something", [{

                 name: "message",
                 type: "string",
                 desciption: "something to say" }],

                 function (a, b, c, d) {
                 	return "SANJA.player.api.moveBy(" + a + ", " + b + ", " + c + ", " + d + ");";
                 }]
	},

	// 블록 관련 설정

	BLOCK_HEIGHT: 15,
	BLOCK_MIN_WIDTH: 20,
	BLOCK_WIDTH_PADDING: 5,
	BLOCK_FONT: {font: "bold 9px Segoe UI", fill: "#000000"},

	TERMINAL_HEIGHT: 9,
	TERMINAL_MIN_WIDTH: 16,
	TERMINAL_HITTING_EDGE_WIDTH: 8,
	TERMINAL_TO_BLOCK_RATIO: 0.4,

	// 가이드라인 관련 설정

	GUIDELINE_LENGTH: 20,
	GUIDELINE_THICKNESS: 2,
	GUIDELINE_COLOR: 0xCCCCCC,

	// 파라미터 관련 설정

	PARAMETER_HEIGHT: 14,
	PARAMETER_MIN_WIDTH: 14,
	PARAMETER_WIDTH_PADDING: 4,
	PARAMETER_FONT: {font: "9px Segoe UI", fill: "#FFFFFF"},

	// 인접한 블록 사이의 최소 여백

	SPACE_ADJACENT_BLOCK: 7,

	// 블록 드래그 이벤트 호출 Interval

	DRAG_EVENT_INTERVAL: 200,

	// 드래그 시 조상 블록들에 적용되는 알파

	ANCESTOR_ALPHA: 0.6

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

	this.literal = false;
	if(name == "String" || name == "Number") {
		this.literal = true;
	}

	/** 블록 리턴 타입 */
	this._returnType = returnType || "void";

	/** 블록 설명 */
	this._description = (options ? options.description : false) || "";
	this._

	/** 그래픽스 */
	this.graphics = new PIXI.DisplayObjectContainer();

	this.container = new PIXI.DisplayObjectContainer();
	this.graphics.addChild(this.container);

	/** 블록 구성 요소 */
	this.body = new OMNI.Block.Body(this._name, OMNI.Config.Block.Type.get(returnType).color, this._returnType != "void" && this._returnType != "branch", this.literal);

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
	this.connectedParameter;
	this.targetingConnection;
	this.connectedLine;

	var lastClick = 0;
    var space = 350;

	// 이벤트 등록 
	this.body.graphics.mousedown = function (e) { 

		var now = Date.now();
	    var diff = now - lastClick;

	    event = e.originalEvent;

	    if(event.which === 3 || event.button === 2) {
	    } else if(lastClick && (diff < space)) {
	        lastClick = 0;
	        self.onMouseDoubleDown(e);
	    } else {
	        lastClick = now;
	        self.onMouseDown(e);
	    }
	};
	this.body.graphics.mouseup = function (e) { self.onMouseUp(e) };
	this.body.graphics.mouseupoutside = function (e) { self.onMouseUp(e) };
	this.body.graphics.mouseover = function (e) { self.onMouseRollOver(e) };
	this.body.graphics.mouseout = function (e) { self.onMouseRollOut(e) };
	this.body.graphics.mousemove = function (e) { self.onMouseMove(e) };

	// 트윈 데이터

	this.tween = new TWEEN.Tween(this.graphics);
	this.tweenTarget = {
		x: 0,
		y: 0
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
        return this.tweenTarget.y;
    },
    set y(value) {
        this.tweenTarget.y = value;
        this.updateTween();
    },
    set y_t(value) {    	
        this.graphics.y = value;
    },

    /** 왼쪽 돌출부 */
    get leftProminentWidth() {
    	return this._leftProminentWidth;
    },

     /** 오른족 돌출부 */
    get rightProminentWidth() {
    	return this._rightProminentWidth;
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
        this.body.name = value;
        this.update();
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

    /** 그룹의 전체 높이 */
    get groupHeight() {
    	return this._groupHeight;
    }
}

/**
 * 
 * 블록 간의 연결 상태를 반영하여 블록 내부 요소의 크기를 새로 조정합니다.
 *
 */
OMNI.Block.Entity.prototype.update = function (ascending) {
	
	if (ascending === undefined) {
		ascending = true;
	}

	if(ascending) {

		this._updateSize();

		if (this.connectedLine) {
			this.connectedLine.update();
			return;
		} 

		else if (this.connectedParameter) {
			this.connectedParameter.parentBlock.update(true);
			return;
		}
	} 

	else {

		this._updatePosition();

	}

	for (var i = 0; i < this.parameters.length; i++) {
		var parameter = this.parameters[i];
		if (parameter.connectedBlock) { 
			parameter.connectedBlock.update(false);
		}
	}
}

OMNI.Block.Entity.prototype.updateOnlyPosition = function () {
	
	this._updatePosition();


	for (var i = 0; i < this.parameters.length; i++) {
		var parameter = this.parameters[i];
		if (parameter.connectedBlock) { 
			parameter.connectedBlock.updateOnlyPosition(false);
		}
	}

}


OMNI.Block.Entity.prototype.updateTween = function () {

    if (this.tween) {

        this.tween.to(this.tweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();

    } else {

        this.graphics.x = this.tweenTarget.x;
        this.graphics.y = this.tweenTarget.y;
    }
}

OMNI.Block.Entity.prototype.updateInternalTween = function () {

    if (this.containerTween) {

        this.containerTween.to(this.containerTweenTarget, OMNI.Config.Tween.TIME).easing(OMNI.Config.Tween.EASING).start();       
   
    } else {

        this.container.x = this.containerTweenTarget.x;

    }
}

/**
 * 이 블록에 연결된 상위 블록의 파라미터와 위치를 일치시킵니다.
 * 주의: 이 구문은 파라미터 클래스의 구조에 민감합니다. 포함 관계가 변경되면 반드시 아래 코드도 수정되어야 함.
 */
OMNI.Block.Entity.prototype._updatePosition = function () {

	if (this.connectedParameter) {

		var root = this.connectedParameter.graphics.parent ? (this.connectedParameter.graphics.parent.parent ?  this.connectedParameter.graphics.parent.parent : null) : null;

		if (root) {

			this.x = this.connectedParameter.parentBlock.x + this.connectedParameter.x + (this.connectedParameter.width - this.connectedParameter.parentBlock.width) / 2;
			this.y = this.connectedParameter.parentBlock.y - this.height;

		}
	}
}

OMNI.Block.Entity.prototype._updateSize = function () {

	var blockWidthInfo = this._updateParameters(OMNI.Config.Block.SPACE_ADJACENT_BLOCK);

	this.body.width = blockWidthInfo[1];

	this._leftProminentWidth = blockWidthInfo[0];
	this._rightProminentWidth = blockWidthInfo[2];

	this._updateTerminal();

	this.body.height = OMNI.Config.Block.BLOCK_HEIGHT;	
	if (this.parameters.length > 0) { this.body.height += OMNI.Config.Block.PARAMETER_HEIGHT; }

	this._groupHeight += this.height;

	// 블록 이름이 길다거나 하는 이유로 여백이 남으면 파라미터 간격을 조정합니다.

	var gap = this.body.width - blockWidthInfo[1];

	if (gap > 0 && this.parameters.length > 0) {
		
		var extendedSpace = (gap + OMNI.Config.Block.SPACE_ADJACENT_BLOCK * (this.parameters.length - 1)) / (this.parameters.length - 1);


		if(this.parameters.length == 1) {

			this.parameters[0].x += gap / 2;

		} else {

			
			this._updateParameters(extendedSpace);
		}
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

	this._groupHeight = 0;

	var leftProminentWidth = 0;
	var rightProminentWidth = 0;

	for (var i = 0; i < this.parameters.length; i++) {

		var parameter = this.parameters[i];
		var parameterWidth;

		if (parameter.connectedBlock) {

			if (this._groupHeight < parameter.connectedBlock.groupHeight) {
				this._groupHeight = parameter.connectedBlock.groupHeight;
			}

			if (i < 1 && this.parameters.length > 1) {
				
				parameterWidth = (parameter.connectedBlock.width + parameter.width) / 2 + parameter.connectedBlock.rightProminentWidth;
				leftProminentWidth = (parameter.connectedBlock.width - parameter.width) / 2 + parameter.connectedBlock.leftProminentWidth;
				leftProminentWidth -= OMNI.Config.Block.BLOCK_WIDTH_PADDING;

				parameter.x = widthAccumulation;

			} else if (i > this.parameters.length - 2 && this.parameters.length > 1) {

				parameterWidth = (parameter.connectedBlock.width + parameter.width) / 2 + parameter.connectedBlock.leftProminentWidth;
				rightProminentWidth = (parameter.connectedBlock.width - parameter.width) / 2 + parameter.connectedBlock.rightProminentWidth;
				rightProminentWidth -= OMNI.Config.Block.BLOCK_WIDTH_PADDING;

				parameter.x = widthAccumulation + parameterWidth - parameter.width;

			} else {

				parameterWidth = parameter.connectedBlock.leftProminentWidth + parameter.connectedBlock.width + parameter.connectedBlock.rightProminentWidth;
				parameter.x = widthAccumulation + parameter.connectedBlock.leftProminentWidth + (parameter.connectedBlock.width - parameter.width) / 2;

			}

			parameter.connectedBlock._updateTerminal();
		}

		else {

			parameterWidth = parameter.width;
			parameter.x = widthAccumulation;

		}

		widthAccumulation += parameterWidth + space;
	}

	this._groupHeight;

	var centerWidth = widthAccumulation - space + OMNI.Config.Block.BLOCK_WIDTH_PADDING;

	return [leftProminentWidth, centerWidth, rightProminentWidth];
}

/**
 * 이 블록의 터미널의 크기와 위치를 업데이트합니다.
 */
OMNI.Block.Entity.prototype._updateTerminal = function () {

	if (this.connectedParameter) {

		this.body.terminalWidth = this.connectedParameter.width;

	} else {

		this.body.terminalWidth = this.body.width * OMNI.Config.Block.TERMINAL_TO_BLOCK_RATIO;

	}
}


/**
 * 이 블록과 파라미터를 통해 연결된 모든 조상 블록의 목록을 구합니다.
 * 
 * @return {Array} 연결된 모든 조상의 리스트
 */
OMNI.Block.Entity.prototype.getAllAncestorBlocks = function (existingBuffer) {

	var buffer = existingBuffer || [];

	buffer.push(this);

	for(var i = 0; i < this.parameters.length; i++) {
		var parameter = this.parameters[i];

		if (parameter.connectedBlock) {
			parameter.connectedBlock.getAllAncestorBlocks(buffer);
		}

	}

	return buffer;
}


/**
 * 이 블록과 하위 블록의 위치를 델타값을 사용하여 업데이트합니다.
 */
OMNI.Block.Entity.prototype.setGroupDelta = function (deltaX, deltaY) {

	this.graphics.x += deltaX;
	this.graphics.y += deltaY;

	this.tweenTarget.x += deltaX;
	this.tweenTarget.y += deltaY;

	for (var i = 0; i < this.parameters.length; i++) {
		var parameter = this.parameters[i];
		if (parameter.connectedBlock) {
			parameter.connectedBlock.setGroupDelta(deltaX, deltaY);
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
     
    /*
    // Right check
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

	this.connectedParameter = parameter;
	parameter.connectedBlock = this;
	
	this.update();
}


/**
 * 블록에 연결된 파라미터를 제거합니다.
 */
OMNI.Block.Entity.prototype.undock = function () {
	
	var connected = this.connectedParameter;

	this.connectedParameter.connectedBlock = null;
	this.connectedParameter = null;
	
	this.update();
	connected.parentBlock.update();

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

	parameter.parentBlock = this;

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
		parameter.parentBlock = null;
		this.parameters.splice(index, 1);
		this.container.removeChild(parameter.graphics);
	}

}

/** 마우스가 블록 위에 놓였을 때 */
OMNI.Block.Entity.prototype.onMouseDoubleDown = function (event) {
	if(this.literal){
		var value = window.prompt("Please enter a literal value", this.name);
		if(value == null) {
			return;
		}
		this.name = value;
	}

}

/** 마우스로 블록을 눌렀을 때 */
OMNI.Block.Entity.prototype.onMouseDown = function (event) {

	this._dragging = true;
	if (!this._localOriginPosition) { this._localOriginPosition = new PIXI.Point(); }
	event.getLocalPosition(this.graphics.parent, this._localOriginPosition);

	// void 블록일 경우 가이드라인 활성화

	if (this.returnType == "void") {

		this._movedDeltaX = this._localOriginPosition.x - this.x;
		this._movedDeltaY = this._localOriginPosition.y - this.height - this.y - 2;

		this.x += this._movedDeltaX;
		this.y += this._movedDeltaY;

		this.update();
	}

	this._localOriginPosition.x -= this.x;
	this._localOriginPosition.y -= this.y;

	// 포커스 이벤트 트리거

	this.onFocus(this);

	// 드래그 이벤트 트리거

	var self = this;

	this._prevX = 0;
	this._prevY = 0;

	this.onDrag(this);
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

	if (this.returnType == "void") {

		this.x -= this._movedDeltaX;
		this.y -= this._movedDeltaY;

		this.update();

	}

	this._dragging = false;

	this.onRelease(this);

	// 드래그 이벤트 해제
	clearInterval(this._intervalId);

}

/** 마우스가 블록 위에 놓였을 때 */
OMNI.Block.Entity.prototype.onMouseRollOver = function (event) {

	this.body.highlight = true;

}

/** 마우스가 블록 위에 놓이기를 그만두었을 때 */
OMNI.Block.Entity.prototype.onMouseRollOut = function (event) {

	this.body.highlight = false;

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
 * 마우스로 블록을 드래그 할 때 (Dispatch 용) 
 *
 * @param {OMNI.Block.Entity} - 클릭된 블록
 */
OMNI.Block.Entity.prototype.onDrag = function (targetBlock) { }

/**
 * 드래그가 끝났을 때 (Dispatch 용) 
 *
 * @param {OMNI.Block.Entity} - 클릭된 블록
 */
OMNI.Block.Entity.prototype.onRelease = function (targetBlock) { }