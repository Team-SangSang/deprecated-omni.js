var Omnigram = {};
Omnigram.Element = {};

// 그래픽스 관련 설정
Omnigram.Graphics = {
    PADDING_X: 30,
    PADDING_Y: 30,
    HITAREA_PADDING_X: 15,
    HITAREA_PADDING_Y: 15,
    SPACE_X: 40,
    SPACE_Y: 15,
    LINE_THICKNESS: 10,
    MIN_LINE_LENGTH: 20
}

/**
 *
 * 모든 작업이 시작되는 곳
 *
 */
Omnigram.Workspace = function (width, height, onLoad) {

    "use strict";

    var that = this;

    // 모든 요소들이 올려질 스테이지
    this.stage = new PIXI.Stage(0xDDDDDD);

    // 랜더러
    this.renderer = new PIXI.autoDetectRenderer(width, height);

    // 레이어
    var NUMBER_OF_LAYERS = 3;
    this.layer = [];

    // 최상위 작업 유닛인 프로시저
    this.procedures = [];

    for (var i = 0; i < NUMBER_OF_LAYERS; i++) {
        this.layer[i] = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.layer[i]);
    };

    loadGraphicsResources(onLoad);

    /**
     *
     * 그래픽 요소를 로드한다.
     *
     */
    function loadGraphicsResources(onLoad) {
        var loader = new PIXI.AssetLoader(["./omnigram.json"]);
        loader.onComplete = onLoad;
        loader.load();
    }

    function procedureMouseOver(procedure) {
        procedure.graphics.alpha = 0.5;
    }

    function procedureMouseOut(procedure) {
        procedure.graphics.alpha = 1;
    }

    /**
     *
     * 특정 프로시저에 블록을 추가한다.
     *
     */
    this.addBlock = function(procedure) {
        var block = new Omnigram.Element.Block();
        this.layer[0].addChild(block.graphics);
        procedure.addElement(block);

        return block;
    }

    /**
     *
     * 특정 프로시저에 가지를 추가한다.
     *
     */
    this.addBranch = function(procedure, flipped) {
        var branch = new Omnigram.Element.Branch(flipped);
        this.layer[0].addChild(branch.graphics);
        procedure.addElement(branch);

        return branch;
    }

    /**
     *
     * 새 프로시저를 스테이지에 추가한다.
     *
     */
    this.addProcedure = function() {

        // 프로시저의 기반은 라인이다.
        var line = new Omnigram.Element.Line();

        // 등록
        this.procedures.push(line);
        this.layer[0].addChild(line.graphics);
        this.update();

        // 프로시저 마우스 이벤트
        line.graphics.mouseover = function() {
            procedureMouseOver(line);
        }
        line.graphics.mouseout = function() {
            procedureMouseOut(line);
        }

        return line;  
    }

    /**
     *
     * 프로시저를 스테이지에서 삭제한다.
     *
     */
    this.removeProcedure = function(procedure) {

        var index = this.procedures.indexOf(procedure);

        if (index != -1) {

            this.procedures.splice(index, 1);
            this.layer[0].removeChild(procedure);

            this.update();
        }
    }

    /**
     *
     * 스테이지 위의 모든 구성 요소의 위치를 업데이트한다.
     *
     */
    this.update = function() {

        // 프로시저 가로 정렬
        var accumulatedWidth = Omnigram.Graphics.PADDING_X;

        for (var i = 0; i < this.procedures.length; i++) {

            var procedure = this.procedures[i];

            procedure.x = accumulatedWidth;
            procedure.y = Omnigram.Graphics.PADDING_Y;

            procedure.update();

            accumulatedWidth += procedure.width + Omnigram.Graphics.SPACE_X;
        }

        // 여백이 남으면 레이어를 중앙에 정렬
        var totalWidth = accumulatedWidth - Omnigram.Graphics.SPACE_X + Omnigram.Graphics.PADDING_X;
        if (totalWidth < this.renderer.width) {
            this.layer[0].x = (this.renderer.width - totalWidth) / 2;
        }
    }

    /**
     *
     * 스테이지의 크기를 변경한다.
     *
     */
    this.resize = function(width, height) {

        this.renderer.resize(width, height);

        this.update();
    }

    /**
     *
     * 실시간 랜더링
     *
     */

    function animate() {
        that.renderer.render(that.stage);

        requestAnimFrame(animate);
    }

    requestAnimFrame(animate);
};
/**
 *
 * DOM 객체
 *
 */
Omnigram.Workspace.prototype.getDomElement = function() {
    return this.renderer.view;
}