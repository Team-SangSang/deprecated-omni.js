var Omnigram = {};
Omnigram.Element = {};
(function() {

    "use strict";

    // 여백
    var PADDING_X = 30;
    var PADDING_Y = 30;    
    var SPACE_X = 40;
    var SPACE_Y = 15;

    // 라인 길이
    var LINE_THICKNESS = 10;
    var MIN_LINE_LENGTH = 20;

    var NUMBER_OF_LAYERS = 3;

    Omnigram.Workspace = (function() {

    	var stage;
    	var renderer;

        var layer;
        var procedures;

    	// 생성자
    	function Workspace(width, height, onLoad) {
    		stage = new PIXI.Stage(0xDDDDDD);
    		renderer = new PIXI.autoDetectRenderer(width, height);

            layer = [];
            procedures = [];

            for (var i = 0; i < NUMBER_OF_LAYERS; i++) {
                layer[i] = new PIXI.DisplayObjectContainer();
                stage.addChild(layer[i]);
            };

            loadGraphicsResources(onLoad);
    		requestAnimFrame(animate);
    	}

        // 프로시저 추가
    	Workspace.prototype.addProcedure = function () {
            var line =  new Omnigram.Element.Line();
            var line2 =  new Omnigram.Element.Line();
            console.log(line.getUniqueValue())
            console.log(line2.getUniqueValue())
            procedures.push(line);
            layer[0].addChild(line.getGraphics());

            this.update();



            for (var i = 0; i < 0; i++) {
               var block = new Omnigram.Element.Block();
                layer[0].addChild(block.getGraphics());
                line.addElement(block);
            };


            var fork = new Omnigram.Element.Branch(true);
            layer[0].addChild(fork.getGraphics());
          //  line.addElement(fork);

            for (var i = 0; i < 0; i++) {
               var block = new Omnigram.Element.Block();
                layer[0].addChild(block.getGraphics());
                line.addElement(block);
            };
            

            // 프로시저 마우스 이벤트
            line.getGraphics().mouseover = procedureMouseOver(line);
            line.getGraphics().mouseout = procedureMouseOut(line);

            
    	}

        // 프로시저 삭제
        Workspace.prototype.removeProcedure = function (procedure) {

            var index = procedures.indexOf(procedure);

            if(index != -1){
                procedures.splice(index, 1);
                layer[0].removeChild(procedure);

                this.update();
            }
        }

        // 프로시저 위치 업데이트
    	Workspace.prototype.update = function () {

            var accumulatedWidth = PADDING_X;

            for (var i = 0; i < procedures.length; i++) {

                var procedure = procedures[i];

                procedure.setX(accumulatedWidth);
                procedure.setY(PADDING_Y);
                procedure.update();

                accumulatedWidth += procedure.getWidth() + SPACE_X;
            }

            // 여백이 남으면 레이어를 중앙에 정렬
            var totalWidth = accumulatedWidth - SPACE_X + PADDING_X;
            if(totalWidth < renderer.width) {
              //  layer[0].x = (renderer.width - totalWidth) / 2;
            }
    	}

        Workspace.prototype.resize = function (width, height) {
            renderer.resize(width, height);
            this.update();
        }

    	Workspace.prototype.getDomElement = function () {
    		return renderer.view;
    	}

        var procedureMouseOver = function (procedure) {
            procedure.getGraphics().alpha = 0.5;
        }

        var procedureMouseOut = function (procedure) {
            procedure.getGraphics().alpha = 1;
        }

        var loadGraphicsResources = function (onLoad) {
            var loader = new PIXI.AssetLoader(["./omnigram.json"]);
            loader.onComplete = onLoad;
            loader.load();
        }

    	var animate = function () {
    		renderer.render(stage);
    		requestAnimFrame(animate);
    	}

    	return Workspace;

    })();

    // block
    Omnigram.Element.Block = (function() {

        var parent;
        var graphics;

        function Block(){
            graphics = new PIXI.Sprite(PIXI.Texture.fromFrame("block.png"));
        }

        Block.prototype.update = function () {
        }

        Block.prototype.getWidth = function () {
            return graphics.width;
        }

        Block.prototype.getHeight = function () {
            return graphics.height;
        }

        Block.prototype.getX = function () { return graphics.x; }
        Block.prototype.getY = function () { return graphics.y; }
        Block.prototype.setX = function (x) { graphics.x = x; }
        Block.prototype.setY = function (y) { graphics.y = y; }

        Block.prototype.getParent = function () { return parent; }
        Block.prototype.setParent = function (element) { parent = element; }

        Block.prototype.getGraphics = function () { return graphics; }

        return Block;
    })();

    // 브랜치(IF문)
    Omnigram.Element.Branch = (function() {

        // 부모는 line이다.
        var parent;

        // child 개념
        var entry;
        var line;
        var horizontal_top;
        var horizontal_bottom;
        var ssss;

        var orientation
        var graphics;

        // orientation -> true : 오른쪽, false : 왼쪽
        function Branch(orientation_){

            orientation = orientation_;

            entry = new Omnigram.Element.Block();
            line = new Omnigram.Element.Line();
            horizontal_top = new Omnigram.Element.HelperLine(true);
            horizontal_bottom = new Omnigram.Element.HelperLine(true);

            ssss = new Omnigram.Element.HelperLine(false);

            graphics = new PIXI.DisplayObjectContainer();
            graphics.addChild(horizontal_top.getGraphics());
            graphics.addChild(horizontal_bottom.getGraphics());
            graphics.addChild(line.getGraphics());
            graphics.addChild(ssss.getGraphics());
            graphics.addChild(entry.getGraphics());

            //entry.getGraphics()
            line.getGraphics().mouseover = this.highlightLine(true);
            horizontal_top.getGraphics().mouseover = this.highlightLine(true);
            horizontal_bottom.getGraphics().mouseover = this.highlightLine(true);

            line.getGraphics().mouseout = this.highlightLine(false);
            horizontal_top.getGraphics().mouseout = this.highlightLine(false);
            horizontal_bottom.getGraphics().mouseout = this.highlightLine(false);

            this.update();
        }

        Branch.prototype.update = function () {

            var entryGraphic = entry.getGraphics();
            var vGraphic = line.getGraphics();
            var htGraphic = horizontal_top.getGraphics();
            var hbGraphic = horizontal_bottom.getGraphics();

            entryGraphic.x = - entryGraphic.width / 2;
            entryGraphic.y = 0;

            // 오른쪽
            if (orientation == true) {

                htGraphic.width = entryGraphic.width / 2  + line.getWidth() + MIN_LINE_LENGTH;
                htGraphic.x = 0;
                htGraphic.y = (entryGraphic.height - htGraphic.height) / 2;

                hbGraphic.width = htGraphic.width;
                hbGraphic.x = 0;
                hbGraphic.y = htGraphic.y + line.getHeight();

                htGraphic.x = 100
                htGraphic.y = 100;

                hbGraphic.x = 300;
                hbGraphic.y = 300;

                console.log(horizontal_bottom.getUniqueValue());
                console.log(line.getUniqueValue());


                vGraphic.x = htGraphic.width;
                vGraphic.y = htGraphic.y;

            } else {

                htGraphic.width = entryGraphic.width / 2  + line.getWidth() + MIN_LINE_LENGTH;
                htGraphic.x = - htGraphic.width;
                htGraphic.y = (entryGraphic.height - htGraphic.height) / 2;

                hbGraphic.width = htGraphic.width;
                hbGraphic.x = - htGraphic.width;
                hbGraphic.y = htGraphic.y + line.getHeight();

                vGraphic.x = - htGraphic.width;
                vGraphic.y = htGraphic.y;

            }
        }

        Branch.prototype.highlightEntry = function (on) {
            this.highlightLine(on);            
        }

        Branch.prototype.highlightLine = function (on) {
            if (on == true) {
                line.highlight(true);
                horizontal_top.highlight(true);
                horizontal_bottom.highlight(true);
            } else {
                line.highlight(false);
                horizontal_top.highlight(false);
                horizontal_bottom.highlight(false);
            }
        }

        Branch.prototype.getWidth = function () {
            return graphics.width;
        }

        Branch.prototype.getHeight = function () {
            return horizontal_bottom.getGraphics().y;
        }

        Branch.prototype.getX = function () { return graphics.x; }
        Branch.prototype.getY = function () { return graphics.y; }
        Branch.prototype.setX = function (x) { graphics.x = x; }
        Branch.prototype.setY = function (y) { graphics.y = y; }

        Branch.prototype.getOrientation = function () { return orientation; }
        Branch.prototype.setOrientation = function (orientation_) { orientation = orientation_; this.update(); }

        Branch.prototype.getParent = function () { return parent; }
        Branch.prototype.setParent = function (element) { parent = element; }

        Branch.prototype.getGraphics = function () { return graphics; }

        return Branch;
    })();

    // 루프(WHILE문)
    Omnigram.Element.Loop = (function() {

        function Loop(){

        }

        return Loop;

    })();

    // 동작하는 세로선
    Omnigram.Element.Line = (function() {

        var parent;
        var elements;

        // 그래픽
        var graphics;

        var unique;
        

        function Line(){
             unique = Math.random() * 1000000;

            graphics = new PIXI.Sprite(PIXI.Texture.fromFrame("vertical-line.png"));            

            graphics.width = LINE_THICKNESS;
            graphics.height = MIN_LINE_LENGTH * 2;

            graphics.interactive = true;

            elements = [];
        }
Line.prototype.getUniqueValue = function() { return unique }
        Line.prototype.addElement = function (element) {
            elements.push(element);
            element.setParent(this);

            this.update();
        }


        Line.prototype.addElementAt = function (element, index) {
            elements.splice(index, 0, element);
            element.setParent(this);

            this.update();
        }

        Line.prototype.update = function () {

            // 엘리먼트 정렬
            var relativeX = graphics.x + LINE_THICKNESS / 2;
            var relativeY = graphics.y;

            var accumulatedHeight = SPACE_Y;

            for (var i = 0; i < elements.length; i++) {

                var child = elements[i];

                if (child instanceof Omnigram.Element.Block) {
                    child.setX(relativeX - child.getWidth() / 2);
                } else {
                    child.setX(relativeX);
                }

                child.setY(relativeY + accumulatedHeight);

                accumulatedHeight += child.getHeight() + SPACE_Y;
            };

            // 그래픽 업데이트
            var totalHeight = accumulatedHeight;
            graphics.height = totalHeight;

            // 상향식 업데이트
            if (parent != undefined){
                parent.update();
            }

        }

        Line.prototype.highlight = function (on) {
            if (on == true) {
                graphics.alpha = 0.5;
            } else {
                graphics.alpha = 1;
            }
        }

        Line.prototype.getX = function () { return graphics.x; }
        Line.prototype.getY = function () { return graphics.y; }

        Line.prototype.setX = function (x) {           
            graphics.x = x;        
        }

        Line.prototype.setY = function (y) {            
            graphics.y = y;
        }

        Line.prototype.getWidth = function () {
            return graphics.width;
        }

        Line.prototype.getHeight = function () {
            return graphics.height;
        }

        Line.prototype.getParent = function () { return parent; }
        Line.prototype.setParent = function (element) { parent = element; }
        Line.prototype.getElements = function () { return elements; }

        Line.prototype.getGraphics = function () { return graphics; }

        return Line;

    })();

    // 동작안하는 세로/가로선
    Omnigram.Element.HelperLine = (function(){

        var parent;

        var horizontal;
        var graphics;
        var unique;
        HelperLine.prototype.getUniqueValue = function() { return unique }

        function HelperLine(horizontal_){

            horizontal = horizontal_;
            unique = Math.random() * 1000000;

            if (horizontal == true){
                graphics = new PIXI.Sprite(PIXI.Texture.fromFrame("horizontal-line.png"));
                graphics.width = MIN_LINE_LENGTH * 2;
                graphics.height = LINE_THICKNESS;
            } else {
                graphics = new PIXI.Sprite(PIXI.Texture.fromFrame("vertical-line.png"));
                graphics.width = LINE_THICKNESS;
                graphics.height = MIN_LINE_LENGTH * 2;
                horizontal = false;
            }

            graphics.interactive = true;
        }

        HelperLine.prototype.highlight = function (on) {
            if (on == true) {
                graphics.alpha = 0.5;
            } else {
                graphics.alpha = 1;
            }
        }
        
        HelperLine.prototype.getX = function () { return graphics.x; }
        HelperLine.prototype.getY = function () { return graphics.y; }
        HelperLine.prototype.setX = function (x) { graphics.x = x; }
        HelperLine.prototype.setY = function (y) { graphics.y = y; }

        HelperLine.prototype.getWidth = function () { return graphics.width; }
        HelperLine.prototype.getHeight = function () { return graphics.height; }
        HelperLine.prototype.setWidth = function (width) { graphics.width = width; }
        HelperLine.prototype.setHeight = function (height) { graphics.height = height; }

        HelperLine.prototype.getParent = function () { return parent; }
        HelperLine.prototype.setParent = function (element) { parent = element; }

        HelperLine.prototype.getGraphics = function () {
            return graphics;
        }

        HelperLine.prototype.isHorizontal = function () {
            return horizontal;
        }

        return HelperLine;

    }());

})();