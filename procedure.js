OMNI.Procedure = function(){

	/** Parent workspace */
	this.workspace;

	/** Graphics */
	this.graphics = new PIXI.DisplayObjectContainer();

	/** Main line */
	this.line = new OMNI.Element.Line();
	this.graphics.addChild(this.line.graphics);
    this.graphics.addChild(this.line.elementsContainer);

}

OMNI.Procedure.prototype = {
	get x() {
        return this.graphics.x;
    },
    set x(value) {
       this.graphics.x = value;
    },

    get y() {
        return this.graphics.y;
    },
    set y(value) {
        this.graphics.y = value;
    }
}