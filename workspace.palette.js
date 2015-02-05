/**
 *
 * 파레트
 *
 */
OMNI.Workspace.Palette = function(workspace) {

	this.graphics = new PIXI.DisplayObjectContainer();

	// 백그라운드
	this.background = new PIXI.Sprite(PIXI.Texture.fromFrame("code_palette"));

	// 각종 버튼
	this.branch_up = new PIXI.Sprite(PIXI.Texture.fromFrame("branch_up"));
	this.branch_down = new PIXI.Sprite(PIXI.Texture.fromFrame("branch_down"));

	this.branch_up.interactive = true;
	this.branch_up.click = function(){
		OMNI.Shared.mode = 1;
	}

	this.branch_up.x = 15;
	this.branch_up.y = 72;

	this.loop_up = new PIXI.Sprite(PIXI.Texture.fromFrame("loop_up"));
	this.loop_down = new PIXI.Sprite(PIXI.Texture.fromFrame("loop_down"));

	this.loop_up.x = 108;
	this.loop_up.y = 72;

	this.number_up = new PIXI.Sprite(PIXI.Texture.fromFrame("number_up"));
	this.number_down = new PIXI.Sprite(PIXI.Texture.fromFrame("number_down"));

	this.number_up.x = 15;
	this.number_up.y = 189;

	this.event_up = new PIXI.Sprite(PIXI.Texture.fromFrame("event_up"));
	this.event_down = new PIXI.Sprite(PIXI.Texture.fromFrame("event_down"));

	this.event_up.interactive = true;
	this.event_up.click = function(){
		workspace.addProcedure(true);
	}

	this.event_up.x = 15;
	this.event_up.y = 232;

	this.move_up = new PIXI.Sprite(PIXI.Texture.fromFrame("move_up"));
	this.move_down = new PIXI.Sprite(PIXI.Texture.fromFrame("move_down"));

	this.move_up.interactive = true;
	this.move_up.click = function(){
		OMNI.Shared.mode = 3;
	}

	this.move_up.x = 13;
	this.move_up.y = 398;

	this.rotate_up = new PIXI.Sprite(PIXI.Texture.fromFrame("rotate_up"));
	this.rotate_down = new PIXI.Sprite(PIXI.Texture.fromFrame("rotate_down"));

	this.rotate_up.interactive = true;
	this.rotate_up.click = function(){
		OMNI.Shared.mode = 2;
	}

	this.rotate_up.x = 13;
	this.rotate_up.y = 440;

	this.graphics.addChild(this.background);
	this.graphics.addChild(this.branch_up);
	this.graphics.addChild(this.loop_up);
	this.graphics.addChild(this.number_up);
	this.graphics.addChild(this.event_up);
	this.graphics.addChild(this.move_up);
	this.graphics.addChild(this.rotate_up);
}