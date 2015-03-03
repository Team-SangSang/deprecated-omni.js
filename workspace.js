"use strict";

var OMNI = {};
OMNI.Element = {};
OMNI.Code = {};
OMNI.Block = {};
OMNI.Config = {};

OMNI.Shared = {
    mode: 2,
    integer:0xD02090,
    string:0x1C86EE,
    void:0xEEC900
}

OMNI.Config.Tween = {
    TIME: 600,
    EASING: TWEEN.Easing.Elastic.Out    
}

OMNI.Config.Workspace = {

	DEFAULT_WIDTH: 640,
	DEFAULT_HEIGHT: 480,

	// Gap between procedures
	SPACING: 20,

	LAYER_PROCEDURE_X: 0,
	LAYER_PROCEDURE_Y: 0,

	PADDING_X: 10,
    PADDING_Y: 50,

    BACKGROUND_COLOR: 0xDDDDDD
}



/**
 *
 * Every job releated to omni.js is done on workspace. Workspace consists of procedures and
 * elements palette.
 * 
 * @author HyunJun Kim
 * @constructor
 * @param {int} width - Width of workspace.
 * @param {int} height - Height of workspace.
 */
OMNI.Workspace = function(width, height) {
    
    var self = this;
    width = width || OMNI.Config.Workspace.DEFAULT_WIDTH;
    height = height || OMNI.Config.Workspace.DEFAULT_HEIGHT;

    /** Stage(root) */
    this.stage = new PIXI.Stage(OMNI.Config.Workspace.BACKGROUND_COLOR);

    /** Stage renderer */
    this.renderer = new PIXI.autoDetectRenderer(width, height);

    /** Layers */
    this.layer = [];    

    /** Procedures */
    this.procedures = [];

    /** 스테이지에 있는 블록들의 목록입니다. */
    this.blocks = [];

    // Initialize layers    
    for (var i = 0; i < 3; i++) {
        this.layer[i] = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.layer[i]);
    };

    // Load resources. All works are suspended until loading is completed.
    loadGraphicsResources(function(){

        for (var i = 0; i < 10; i++) {
            self.addBlock("test_block_" + i, "string", [{
                    name: "Integer",
                    type: "integer"}, { 

                    name: "String",
                    type: "string"}]);
        }

        self.addBlock("test_long_name_block 한글지원", "string", [{
                    name: "인티저 입려크",
                    type: "integer",
                    desciption: "afasfasf" }, { 

                    name: "스트링 입력",
                    type: "string",
                    description: "test parameter~~!" }]);

        self.addBlock("숏네임 블로크", "integer", [{
                    name: "스트으링 입려크",
                    type: "integer",
                    desciption: "afasfasf" }, { 

                    name: "인티저어 입력",
                    type: "string",
                    description: "test parameter~~!" }]);

    });
  
    function loadGraphicsResources(onLoad) {
        var loader = new PIXI.AssetLoader(["./gui.json"]);
        loader.onComplete = onLoad;
        loader.load();
    }
   	
   	// Realtime update and rendering
    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time)
        self.renderer.render(self.stage);
    }
    animate();
};

/**
 * 
 * Update positions of all procedures on the root
 *
 */
OMNI.Workspace.prototype.update = function() {

    // X-Axis align

    var accumulatedWidth = OMNI.Config.Workspace.PADDING_X;
    
    for (var i in this.procedures) {
    	var procedure = this.procedures[i];

        procedure.x = accumulatedWidth + procedure.line.elementsWidthOfLeft;
        procedure.y = OMNI.Config.Workspace.PADDING_Y;

        accumulatedWidth += procedure.line.elementsWidth + OMNI.Config.Workspace.SPACING;
    }

    // Align procedure layer to center if there are enough spaces.

    this.layer[0].x = 0;

    var availableSpace = this.renderer.width - OMNI.Config.Workspace.LAYER_PROCEDURE_X

    if (accumulatedWidth < availableSpace) {
        this.layer[0].x = (availableSpace - accumulatedWidth) / 2;
    }

    this.layer[0].x += OMNI.Config.Workspace.LAYER_PROCEDURE_X;
}

/**
 *
 * Add test block to procedure.
 *
 * @param {OMNI.Procedure} - Procedure block is being added.
 */
OMNI.Workspace.prototype.addBlock = function(a,b,c,d) {
        
    var self = this;

    var block = new OMNI.Block.Entity(a,b,c,d);
    
    block.x = Math.random() * 500 + 100;
    block.y = Math.random() * 500;

    block.onFocus = function(target) {
        self.layer[1].removeChild(target.graphics);
        self.layer[1].addChild(target.graphics);
    }

    block.onDragStart = function(target) {

        // 타겟에 이미 연결된 블록이 있었다면 연결 해제

        if (target.connection) {
            target.undock();
        }

        if (target.targetingConnection) {
            target.targetingConnection.highlight(false);
            target.targetingConnection = null;
        }

        // 이 블록의 터미널과 다른 모든 블록의 파라미터와의 hitTest 검사를 시행합니다.

        for(var i = 0; i < self.blocks.length; i++) {
            var block = self.blocks[i];

            for(var j = 0; j < block.parameters.length; j++) {
                var parameter = block.parameters[j];

                if (target.intersect(parameter)){

                    //if (self._hitTest(target.body.terminal, parameter.graphics)) {
                   
                    target.targetingConnection = parameter;
                    target.targetingConnection.highlight(true);

                    //target.dock(parameter);




                    // 루틴 종료
                    return;
                }
            }
        }
    }

    block.onDragFinish = function (target) {
        if (target.targetingConnection) {
            target.dock(target.targetingConnection);
            target.targetingConnection.highlight(false);
            target.targetingConnection = null;
        }
    }

    this.blocks.push(block);
    this.layer[1].addChild(block.graphics);
}


/**
 *
 * Add new procedure to current workspace.
 * 
 * @return {OMNI.Procedure}
 */
OMNI.Workspace.prototype.addProcedure = function() {

    var procedure = new OMNI.Procedure();

    // Registeration
    this.procedures.push(procedure);
    this.layer[0].addChild(procedure.graphics);

    this.update();

    return procedure;
}

/**
 *
 * Remove procedure from current workspace.
 *
 */
OMNI.Workspace.prototype.removeProcedure = function(procedure) {

    var index = this.procedures.indexOf(procedure);

    if (index != -1) {
        this.procedures.splice(index, 1);
        this.layer[0].removeChild(procedure.graphics);

        this.update();
    }
}

/**
 *
 * Resize the workspace
 *
 * @param {int} width
 * @param {int} height
 */
OMNI.Workspace.prototype.resize = function(width, height) {
    this.renderer.resize(width, height);

    this.update();
}

/**
 *
 * Get DOM element from workspace
 * 
 * @returns DOM Element
 */
OMNI.Workspace.prototype.getDomElement = function() {
    return this.renderer.view;
}