/**
 *
 * 파레트
 *
 */
OMNI.Palette = function(workspace) {

	var self = this;

	this.varDefList =[];
	this.varList = [];

	this.workspace = workspace;
	this.graphics = new PIXI.DisplayObjectContainer();
	this.pages = new PIXI.DisplayObjectContainer();
	this.background = new PIXI.Graphics();
	this.background.beginFill(0xffffff);
    this.background.drawRect(0, 0, 182, 600);

	this.title = new PIXI.Sprite(PIXI.Texture.fromFrame("code_palette"));
	this.branch  = new PIXI.Sprite(PIXI.Texture.fromFrame("branch"));
	this.loop  = new PIXI.Sprite(PIXI.Texture.fromFrame("loop"));
	this.data_up = new PIXI.Sprite(PIXI.Texture.fromFrame("data_up"));
	this.data_down = new PIXI.Sprite(PIXI.Texture.fromFrame("data_down"));
	this.variables_up = new PIXI.Sprite(PIXI.Texture.fromFrame("variables_up"));
	this.variables_down = new PIXI.Sprite(PIXI.Texture.fromFrame("variables_down"));
	this.functions_up = new PIXI.Sprite(PIXI.Texture.fromFrame("functions_up"));
	this.functions_down = new PIXI.Sprite(PIXI.Texture.fromFrame("functions_down"));
	this.events_up = new PIXI.Sprite(PIXI.Texture.fromFrame("events_up"));
	this.events_down = new PIXI.Sprite(PIXI.Texture.fromFrame("events_down"));
	this.dialogue_up = new PIXI.Sprite(PIXI.Texture.fromFrame("dialogue_up"));
	this.dialogue_down  = new PIXI.Sprite(PIXI.Texture.fromFrame("dialogue_down"));
	this.union_blocks_up = new PIXI.Sprite(PIXI.Texture.fromFrame("union_blocks_up"));
	this.union_blocks_down = new PIXI.Sprite(PIXI.Texture.fromFrame("union_blocks_down"));
	this.union_actions_up = new PIXI.Sprite(PIXI.Texture.fromFrame("union_actions_up"));
	this.union_actions_down = new PIXI.Sprite(PIXI.Texture.fromFrame("union_actions_down"));
	
	this.pages.x = 183;

	this.branch.x = 7;
	this.branch.y = 41;
	this.loop.x = 96;
	this.loop.y = 41;

	this.data_up.x = 15;
	this.data_down.x = 15;
	this.events_up.x = 15;
	this.events_down.x = 15;
	this.variables_up.x = 15;
	this.variables_down.x = 15;
	this.functions_up.x = 15;
	this.functions_down.x = 15;
	this.dialogue_up.x = 15;
	this.dialogue_down.x = 15;
	this.union_blocks_up.x = 15;
	this.union_blocks_down.x = 15;
	this.union_actions_up.x = 15;
	this.union_actions_down.x = 15;

	this.data_up.y = 132;
	this.data_down.y = 132;
	this.dialogue_up.y = 132 + 58;
	this.dialogue_down.y = 132 + 58;
	this.variables_up.y = 132 + 58+ 58;
	this.variables_down.y = 132 + 58+ 58;
	this.functions_up.y= 132 + 58 + 58 + 58;
	this.functions_down.y = 132 + 58 + 58 + 58;	
	this.events_up.y= 132 + 58 + 58 + 58 + 58;
	this.events_down.y = 132 + 58 + 58 + 58 + 58;	
	this.union_blocks_up.y = 132 + 58 + 58 + 58 + 58 + 58;
	this.union_blocks_down.y = 132 + 58 + 58 + 58 + 58 + 58
	this.union_actions_up.y = 132 + 58 + 58 + 58 + 58 + 58 + 58;
	this.union_actions_down.y = 132 + 58 + 58 + 58 + 58 + 58 + 58;

	this.graphics.addChild(this.background);
	this.graphics.addChild(this.title);
	this.graphics.addChild(this.branch);
	this.graphics.addChild(this.loop);
	this.graphics.addChild(this.data_up);
	this.graphics.addChild(this.data_down);
	this.graphics.addChild(this.variables_up);
	this.graphics.addChild(this.variables_down);
	this.graphics.addChild(this.functions_up);
	this.graphics.addChild(this.functions_down);
	this.graphics.addChild(this.events_up);
	this.graphics.addChild(this.events_down);
	this.graphics.addChild(this.dialogue_up);
	this.graphics.addChild(this.dialogue_down);
	this.graphics.addChild(this.union_blocks_up);
	this.graphics.addChild(this.union_blocks_down);
	this.graphics.addChild(this.union_actions_up);
	this.graphics.addChild(this.union_actions_down);
	this.graphics.addChild(this.pages);

	this.data_page = createPage([
		OMNI.Config.Block.Predefined.STRING,
		OMNI.Config.Block.Predefined.NUMBER,
		OMNI.Config.Block.Predefined.SES,
		OMNI.Config.Block.Predefined.SEN,
		OMNI.Config.Block.Predefined.NTS,
		OMNI.Config.Block.Predefined.STN,
		OMNI.Config.Block.Predefined.ADD,
		OMNI.Config.Block.Predefined.SUB,
		OMNI.Config.Block.Predefined.MUL,
		OMNI.Config.Block.Predefined.DIV,
		OMNI.Config.Block.Predefined.MOD,
		OMNI.Config.Block.Predefined.BIG,
		OMNI.Config.Block.Predefined.BGE,
		OMNI.Config.Block.Predefined.SML,
		OMNI.Config.Block.Predefined.SME,
		OMNI.Config.Block.Predefined.EQL,
		OMNI.Config.Block.Predefined.NOT,
		OMNI.Config.Block.Predefined.AND,
		OMNI.Config.Block.Predefined.ORR
	]);
	this.variables_page = createDefPage();
	this.functions_page = createDefPage();
	this.dialogue_page = createPage([
		OMNI.Config.Block.Predefined.ASK,
		OMNI.Config.Block.Predefined.SAY,
		OMNI.Config.Block.Predefined.YES_OR_NO
	]);
	this.events_page = createPage([
		OMNI.Config.Block.Predefined.CLICKED,
		OMNI.Config.Block.Predefined.COLLIDED,
		OMNI.Config.Block.Predefined.KEY_PRESSED,
		OMNI.Config.Block.Predefined.TIMER
	], true);
	
	this.union_blocks_page = createPage([]);
	this.union_actions_page = createPage([
		OMNI.Config.Block.Predefined.MOVE_BY,
		OMNI.Config.Block.Predefined.MOVE_TO,
		OMNI.Config.Block.Predefined.ROTATE
	]);

	this.graphics.interactive = true;

	initEvent(this.data_up, this.data_down, this.data_page);
	initEvent(this.variables_up, this.variables_down, this.variables_page);
	initEvent(this.functions_up, this.functions_down, this.functions_page);
	initEvent(this.events_up, this.events_down, this.events_page);
	initEvent(this.dialogue_up, this.dialogue_down, this.dialogue_page);
	initEvent(this.union_blocks_up, this.union_blocks_down, this.union_blocks_page);
	initEvent(this.union_actions_up, this.union_actions_down, this.union_actions_page);

	closeAllPages(this);

	function initEvent(up, down, page) {
		up.interactive = true;
		down.interactive = true;
		down.visible = false;

		up.mouseover = function(e) {			
			up.alpha = 0.7;
		}
		up.mouseout = function(e) {
			up.alpha = 1;
		}
		up.mousedown = function(e) {
			releaseAll(self);
			closeAllPages(self);
			up.visible = false
			down.visible = true;
			page.visible = true;
		}
		down.mousedown = function(e) {
			if(page.visible == false) {
				releaseAll(self);
				closeAllPages(self);
				up.visible = false
				down.visible = true;
				page.visible = true;
			} else {
				up.visible = true;
				down.visible = false;
				closeAllPages(self);
			}
		}
	}

	function releaseAll (scope) {
		scope.data_up.visible = true;
		scope.data_down.visible = false;
		scope.events_up.visible = true;
		scope.events_down.visible = false;
		scope.dialogue_up.visible = true;
		scope.dialogue_down.visible = false;
		scope.union_blocks_up.visible = true;
		scope.union_blocks_down.visible = false;
		scope.union_actions_up.visible = true;
		scope.union_actions_down.visible = false;
	}

	function closeAllPages(scope){
		scope.data_page.visible = false;
		scope.variables_page.visible = false;
		scope.functions_page.visible = false;
		scope.events_page.visible = false;
		scope.dialogue_page.visible = false;
		scope.union_blocks_page.visible = false;
		scope.union_actions_page.visible = false;
	}
	
	function createDefPage() {
		var container = new PIXI.DisplayObjectContainer();
		container.interactive = true;
		var bg = new PIXI.Graphics();
		bg.beginFill(0xffffff);
		bg.drawRect(0, 0, 200, 600);
		bg.alpha = 0.7;
		container.addChild(bg);
		self.pages.addChild(container);

		var def_string = new PIXI.Sprite(PIXI.Texture.fromFrame("new_string"));
		var def_number = new PIXI.Sprite(PIXI.Texture.fromFrame("new_number"));
		def_string.interactive = true;
		def_number.interactive = true;
		var mode = -1;
		def_string.mouseover = function(e){
			def_string.alpha = 0.7;
			mode = 0;
		}
		def_string.mouseout = function(e){
			def_string.alpha = 1;
		}
		def_string.mousedown = newVar;
		
		def_number.mouseover = function(e){
			def_number.alpha = 0.7;
			mode = 1;
		}
		def_number.mouseout = function(e){
			def_number.alpha = 1;
		}
		def_number.mousedown = newVar;
		function newVar(e){
			var varname = window.prompt("Please input variable name","");
			if(varname == null){ return; }
			var vdef = [varname, mode == 0 ? "string" : "number", "none", [], function() {}];
			self.varDefList.push(vdef);			

			function createVar (def) {
				var block = new OMNI.Block.Entity(def[0], def[1], def[3]);

				block.onFocus = function (target) {
					closeAllPages(self);
					container.removeChild(block.graphics);
					var cc = self.workspace.regBlock(block);					
					self.varList[self.varList.indexOf(block)] = createVar(def);
					updateDefPage();				
				}
				container.addChild(block.graphics);

				return block;
			}

			self.varList.push(createVar(vdef));

			updateDefPage();
		}
		def_string.x = 5;
		def_string.y = 10;
		def_number.x = 100;
		def_number.y = 10;
		container.addChild(def_string);
		container.addChild(def_number);

		return container;
	}

	function createPage(elements, isEventPage){
		var container = new PIXI.DisplayObjectContainer();
		container.interactive = true;
		var bg = new PIXI.Graphics();
		bg.beginFill(0xffffff);
		bg.drawRect(0, 0, 200, 600);
		bg.alpha = 0.7;
		container.addChild(bg);
		self.pages.addChild(container);
		var accumulatedHeight = 20;

		var alp = elements.length > 10 ? 50 : 100;

		for(var i =0; i < elements.length; i++){

			if(i == 11) {
				alp = 150;
				accumulatedHeight = 20;
			}

			var def = elements[i];

			function createElement (def, x, y) {
				var block = new OMNI.Block.Entity(def[0], def[1], def[3]);

				block.onFocus = function (target) {
					closeAllPages(self);
					if(isEventPage) {
						self.workspace.addProcedure(def);
					} else {
					   
					   container.removeChild(block.graphics);
					   var cc = self.workspace.regBlock(block);
					   createElement(def, x, y);
					}
				}
				block.x = x;
				block.y = y;
				container.addChild(block.graphics);

				return block;
			}			
		    
		    var block = createElement(def, alp, accumulatedHeight);
		    accumulatedHeight += block.height + 15;
		    
		}

		return container;
	}

	function updateDefPage(){
		var accumulatedHeight = 70;

		var alp = self.varList.length > 10 ? 50 : 100;

		for(var i =0; i < self.varList.length; i++){
			var vblock = self.varList[i];
			if(i == 11) {
				alp = 150;
				accumulatedHeight = 20;
			}
			vblock.x = alp;
			vblock.y = accumulatedHeight;
			accumulatedHeight += vblock.height + 15;
		}
	}

	
}