"use strict";

var OMNI = {};
OMNI.Element = {};
OMNI.Code = {};
OMNI.Block = {};
OMNI.Config = {};

OMNI.Shared = {
    mode: 2,
    selectedBlock:null,
    originPoint: new PIXI.Point(0, 0)
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

	PADDING_X: 200,
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
    OMNI.Shared.workspace = this;
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

    this.palette;

    // Initialize layers    
    for (var i = 0; i < 3; i++) {
        this.layer[i] = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.layer[i]);
    };

    // Load resources. All works are suspended until loading is completed.
    loadGraphicsResources(function() {

        self.palette = new OMNI.Palette(self);
        self.layer[2].addChild(self.palette.graphics);

        self.addProcedure(OMNI.Config.Block.Predefined.INIT);

    });
  
    function loadGraphicsResources(onLoad) {
        var loader = new PIXI.AssetLoader(["./palette-ui.json"]);
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

    var accumulatedWidth = OMNI.Config.Workspace.PADDING_X;
    
    for (var i in this.procedures) {
    	var procedure = this.procedures[i];

        procedure.x = accumulatedWidth + Math.max(procedure.line.leftProminentWidth, procedure.entryBlock.width / 2);
        procedure.y = OMNI.Config.Workspace.PADDING_Y + procedure.entryBlock.height;

        accumulatedWidth += Math.max(procedure.line.width, procedure.entryBlock.width) + OMNI.Config.Workspace.SPACING;
    }

    for (var i in this.procedures) {
        this.procedures[i].update(false);
    }

}

/**
 *
 * Add test block to procedure.
 *
 * @param {OMNI.Procedure} - Procedure block is being added.
 */
OMNI.Workspace.prototype.addBlock = function(arr) {
        
    var self = this;

    var block = new OMNI.Block.Entity(arr[0], arr[1], arr[3]);
    
    block.x = Math.random() * 500 + 100;
    block.y = Math.random() * 500;

    this.regBlock(block);

    return block;
}

OMNI.Workspace.prototype.regBlock = function(block) {
        
    var self = this;

    block.onFocus = function(target) {

        // 타겟에 이미 연결된 블록이 있었다면 연결 해제

        if (target.connectedParameter) {
            target.undock();
        }

        if (target.connectedLine) {
            target.connectedLine.removeElement(target);
            target.connectedLine = null;
        }

        if(target.returnType == "void") {
            OMNI.Shared.selectedBlock = target;
        }

        var connectedBlocks = target.getAllAncestorBlocks();

        for (var i = 0; i < connectedBlocks.length; i++) {

            if( i > 0 ){
                connectedBlocks[i].graphics.alpha = OMNI.Config.Block.ANCESTOR_ALPHA;
            }

            self.layer[1].removeChild(connectedBlocks[i].graphics);
            self.layer[1].addChild(connectedBlocks[i].graphics);
        }
        
    }

    block.onDrag = function(target) {

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

                    // 만약 이미 연결된 블록이 있다면 비활성화
                    if (parameter.connectedBlock) {
                        return;
                    }
                    
                    if(parameter.dataType != target.returnType) {
                        return;
                    }

                    target.targetingConnection = parameter;
                    target.targetingConnection.highlight(true);

                    // 루틴 종료
                    return;
                }
            }
        }
    }

    block.onRelease = function (target) {

        //OMNI.Shared.selectedBlock = null;

        if (target.targetingConnection) {
            target.dock(target.targetingConnection);
            target.targetingConnection.highlight(false);
            target.targetingConnection = null;
        }

        var connectedBlocks = target.getAllAncestorBlocks();

        for (var i = 0; i < connectedBlocks.length; i++) {

            if( i > 0 ){
                connectedBlocks[i].graphics.alpha = 1;
            }
        }
    }

    this.blocks.push(block);
    this.layer[1].addChild(block.graphics);

    return block;
}


/**
 *
 * Add new procedure to current workspace.
 * 
 * @return {OMNI.Procedure}
 */
OMNI.Workspace.prototype.addProcedure = function(entryData) {

    var procedure = new OMNI.Procedure(entryData);
    procedure.parent = this;
    // Registeration
    this.procedures.push(procedure);
    this.blocks.push(procedure.entryBlock);
    this.layer[1].addChild(procedure.entryBlock.graphics);
    this.layer[0].addChild(procedure.line.graphics);

    this.update();

    return procedure;
}


OMNI.Workspace.prototype.createBranch = function(direction) {

    var branch = new OMNI.Branch(direction);
    this.layer[1].addChild(branch.entryBlock.graphics);
    this.blocks.push(branch.entryBlock);
    this.layer[0].addChild(branch.horizontal_top.graphics);
    this.layer[0].addChild(branch.horizontal_bottom.graphics);
    this.layer[0].addChild(branch.trueLine.graphics);
    this.layer[0].addChild(branch.falseLine.graphics);

    return branch;
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