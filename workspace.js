"use strict";

var OMNI = {};
OMNI.Element = {};
OMNI.Config = {};



OMNI.Shared = {
    mode: 2
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

    // Initialize layers    
    for (var i = 0; i < 3; i++) {
        this.layer[i] = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.layer[i]);
    };

    // Load resources. All works are suspended until loading is completed.
    loadGraphicsResources(function(){
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
OMNI.Workspace.prototype.addBlock = function(procedure) {
    var block = new OMNI.Element.Block();
    procedure.line.addElement(block);

    return block;
}

/**
 *
 * Add test branch to procedure.
 *
 * @param {OMNI.Procedure} - Procedure branch is being added.
 */
OMNI.Workspace.prototype.addBranch = function(procedure, flipped) {
    var branch = new OMNI.Element.Branch(flipped);
    procedure.line.addElement(branch);

    return branch;
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