var OMNI = {};
OMNI.Element = {};
OMNI.Trigger = {};

// 그래픽스 관련 설정
OMNI.Graphics = {

    PADDING_X: 10,
    PADDING_Y: 50,

    HITAREA_PADDING_X: 15,
    HITAREA_PADDING_Y: 15,

    SPACE_X: 15,
    SPACE_Y: 15,

    LINE_THICKNESS: 7,
    LINE_THICKNESS_ADDER: -0.1,

    MIN_LINE_LENGTH: 20,

    HIGHLIGHT_MATRIX: [
        1, 0, 0, 0.5,
        0, 1, 0, 0.5,
        0, 0, 1, 0.5,
        0, 0, 0, 1
    ],

    EASING: TWEEN.Easing.Elastic.Out,
    
}

OMNI.Shared = {
    mode: 1
}

/**
 *
 * 모든 작업이 시작되는 곳
 *
 */
OMNI.Workspace = function(width, height) {

    "use strict";
    
    var that = this;

    // 모든 요소들이 올려질 스테이지
    this.stage = new PIXI.Stage(0xDDDDDD);

    // 랜더러
    this.renderer = new PIXI.autoDetectRenderer(width, height);

    // 레이어
    this.layer = [];    

    // 최상위 작업 유닛인 프로시저
    this.procedures = [];

    for (var i = 0; i < 3; i++) {
        this.layer[i] = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.layer[i]);
    };

    OMNI.Graphics.highlightFilter = new PIXI.ColorMatrixFilter();
    OMNI.Graphics.highlightFilter.matrix = OMNI.Graphics.HIGHLIGHT_MATRIX;

    // 파레트 로드
    loadGraphicsResources(function(){
        that.palette = new OMNI.Workspace.Palette(that);
        that.layer[1].addChild(that.palette.graphics);

        that.addProcedure(false);
    });
    /**
     *
     * 그래픽 요소를 로드한다.
     *
     */
    function loadGraphicsResources(onLoad) {
        var loader = new PIXI.AssetLoader(["./gui.json"]);
        loader.onComplete = onLoad;
        loader.load();
    }
    /**
     *
     * 실시간 랜더링
     *
     */
    
    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time)
        that.renderer.render(that.stage);
    }
    animate();
};

/**
 *
 * 스테이지 위의 모든 구성 요소의 위치를 업데이트한다.
 *
 */
OMNI.Workspace.prototype.update = function() {

    // 프로시저 가로 정렬
    var accumulatedWidth = OMNI.Graphics.PADDING_X;

    for (var i = 0; i < this.procedures.length; i++) {

        var procedure = this.procedures[i];

        procedure.x = accumulatedWidth;
        procedure.y = OMNI.Graphics.PADDING_Y;

        accumulatedWidth += procedure.graphics.width + OMNI.Graphics.SPACE_X;
    }

    this.layer[0].x = 0;
    // 여백이 남으면 레이어를 중앙에 정렬
    var totalWidth = accumulatedWidth - OMNI.Graphics.SPACE_X + OMNI.Graphics.PADDING_X;
    if (totalWidth < (this.renderer.width - 200)) {
        this.layer[0].x = (this.renderer.width - 200 - totalWidth) / 2;
    }
    this.layer[0].x += 200;
}

/**
 *
 * 특정 프로시저에 블록을 추가한다.
 *
 */
OMNI.Workspace.prototype.addBlock = function(procedure) {
    var block = new OMNI.Element.Block();
    procedure.addElement(block);

    return block;
}

/**
 *
 * 특정 프로시저에 가지를 추가한다.
 *
 */
OMNI.Workspace.prototype.addBranch = function(procedure, flipped) {
    var branch = new OMNI.Element.Branch(flipped);
    procedure.addElement(branch);

    return branch;
}

/**
 *
 * 새 프로시저를 스테이지에 추가한다.
 *
 */
OMNI.Workspace.prototype.addProcedure = function(key) {

    // 프로시저의 기반은 라인이다.
    var procedure = new OMNI.Element.Line(true,  key ? new OMNI.Trigger.Key() : new OMNI.Trigger.Beginning());
    procedure.parent = this;

    // 등록
    this.procedures.push(procedure);
    this.layer[0].addChild(procedure.graphics);
    this.layer[0].addChild(procedure.elementsContainer);
    
    // 프로시저 마우스 이벤트
    procedure.graphics.mouseover = function() {
        procedure.highlight(true);
    }

    procedure.graphics.mouseout = function() {
        procedure.highlight(false);
    }

    this.update();

    return procedure;
}

/**
 *
 * 프로시저를 스테이지에서 삭제한다.
 *
 */
OMNI.Workspace.prototype.removeProcedure = function(procedure) {

    var index = this.procedures.indexOf(procedure);

    if (index != -1) {
        this.procedures.splice(index, 1);
        this.layer[0].removeChild(procedure.graphics);
        this.layer[0].removeChild(procedure.elementsContainer);

        this.update();
    }
}

/**
 *
 * 스테이지의 크기를 변경한다.
 *
 */
OMNI.Workspace.prototype.resize = function(width, height) {
    this.renderer.resize(width, height);

    this.update();
}

/**
 *
 * DOM 객체
 *
 */
OMNI.Workspace.prototype.getDomElement = function() {
    return this.renderer.view;
}