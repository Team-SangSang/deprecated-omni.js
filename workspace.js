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

OMNI.Workspace.prototype.getScript = function () {

    var buffer = "";

    for(var i = 0; i < this.procedures.length; i++){
        buffer += this.procedures[i].getScript() + "\n";
    }

    return buffer;
}

OMNI.Workspace.prototype.export = function() {    
    OMNI.Shared.procedureNo = 0;
    OMNI.Shared.blockNo = 0;
    OMNI.Shared.lineNo = 0;
    OMNI.Shared.branchNo = 0;
    var buffer = "";
    for(var i = 0; i < this.procedures.length; i ++) {
        var procedure = this.procedures[i];
        var pExp = procedure.export();
        buffer += pExp[1] + "|";
    }
    this.import(buffer);
    return buffer;
}
OMNI.Workspace.prototype.import = function(data) {

    this.procedures = [];
    this.blocks = [];

    // Initialize layers    
    for (var i = 0; i < 2; i++) {
        this.stage.removeChild(this.layer[i]);
        this.layer[i] = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.layer[i]);
    };
    this.stage.removeChild(this.layer[2]);
    this.stage.addChild(this.layer[2]);

    var units = data.split("|");
    OMNI.Shared.Ims = {block:[], line:[], branch:[], procedure:[]};
    for(var i = 0; i < units.length; i++){
        var unit = units[i];
        if(unit.length < 1) { continue};
        var chk = unit.split(",");
        switch(chk[0]) {
            case "p": // 프로시저
                OMNI.Shared.Ims.procedure[Number(chk[1])] = {
                    entry:Number(chk[2]),
                    line:Number(chk[3])
                };
                break;
            case "l": // 라인
                var elem = [];
                for(var j=2; j < chk.length; j++){
                    var er = chk[j].split(":");
                    if(er.length != 2) { continue; }
                    switch(er[0]){
                        case "b":
                            elem.push(Number(er[1]));
                            break;
                        case "r":
                            elem.push(Number(er[1]) + 10000);
                            break;
                    }
                }
                OMNI.Shared.Ims.line[Number(chk[1])] = {
                    elements:elem
                };
                break;
            case "r": // 브랜치
                OMNI.Shared.Ims.branch[Number(chk[1])] = {
                    direction:chk[2] == "true",
                    entry:Number(chk[3]),
                    tline:Number(chk[4]),
                    fline:Number(chk[5])
                };
                break;
            case "b": // 블록                
                var adc = 0;
                if(chk[2] == "STRING_VAR" || chk[2] == "NUMBER_VAR" || chk[2] == "STRING" || chk[2] == "NUMBER") {
                    adc = 1;
                }
                var parms = [];
                for (var j = 3 + adc; j < chk.length; j++){
                    parms.push(Number(chk[j] != "" ? chk[j] : null));
                }
                OMNI.Shared.Ims.block[Number(chk[1])] = {
                    acc:chk[2],
                    name:(adc > 0 ? chk[3] : null),
                    parameters:parms
                };
                break;
            default:
        }
    }

    for(var i = 0; i < OMNI.Shared.Ims.procedure.length; i++){
        this.loadProcedure(i);
    }
    this.update();


}

OMNI.Workspace.prototype.loadProcedure = function(no) {

    var data = OMNI.Shared.Ims.procedure[no];
    var entryBlock = this.loadBlock(data.entry);
    var line = this.loadLine(data.line);

    var procedure = new OMNI.Procedure(entryBlock, line);
    procedure.parent = this;
    this.procedures.push(procedure);

    return procedure;
}

OMNI.Workspace.prototype.loadLine = function(no) {
    var data = OMNI.Shared.Ims.line[no];
    var line = new OMNI.Line();
    this.layer[0].addChild(line.graphics);
    for(var i =0; i < data.elements.length; i++){
        var elemno = data.elements[i];
        if(elemno >= 10000) {

            var branch = this.loadBranch(elemno - 10000);
            line.addElement(branch);
        }else{
            var block = this.loadBlock(elemno);
            line.addElement(block);
        }
    }

    
    return line;
}

OMNI.Workspace.prototype.loadBlock = function(no) {
    var data = OMNI.Shared.Ims.block[no];
    var block;
    switch(data.acc){
        case "STRING_VAR":
            block = new OMNI.Block.Entity(data.name, "string", [], null, {acc:"STRING_VAR"});            
            break;
        case "NUMBER_VAR":
            block = new OMNI.Block.Entity(data.name, "number", [], null, {acc:"NUMBER_VAR"});
            break;
        case "STRING":
            block = new OMNI.Block.Entity(data.name, "string", [], null, {acc:"STRING", literal:true});
            break;
        case "NUMBER":
            block = new OMNI.Block.Entity(data.name, "number", [], null, {acc:"NUMBER", literal:true});
            break;
        default:
            var def = OMNI.Config.Block.Predefined[data.acc];
            block = new OMNI.Block.Entity(def[0], def[1], def[3],def[4], {acc:def[5]});
    }

    this.regBlock(block);

    this.blocks.push(block);
    this.layer[1].addChild(block.graphics);
    console.log(data.parameters)
    for(var i = 0; i < data.parameters.length; i++){
        var param = data.parameters[i];
        if(param == null || param == 0) { continue; }
        var tblock = this.loadBlock(param);

        tblock.dock(block.parameters[i]);        
    }

    return block;
}

OMNI.Workspace.prototype.loadBranch = function(no) {

    var data = OMNI.Shared.Ims.branch[no];
    var entry = this.loadBlock(data.entry);
    var tline = this.loadLine(data.tline);
    var fline = this.loadLine(data.fline);
    var branch = new OMNI.Branch(data.direction, entry, tline, fline);

    this.layer[0].addChild(branch.horizontal_top.graphics);
    this.layer[0].addChild(branch.horizontal_bottom.graphics);

    return branch;

}

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
        

    var block = new OMNI.Block.Entity(arr[0], arr[1], arr[3],arr[4], {acc:arr[5]});
    
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
