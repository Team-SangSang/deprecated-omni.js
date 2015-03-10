OMNI.Procedure = function(entryInfo){

	/** Parent workspace */
	this.parent;

    this.entryBlock = new OMNI.Block.Entity(entryInfo[0], entryInfo[1], entryInfo[3], {entry: true});

	/** Main line */
	this.line = new OMNI.Line();
    this.line.parent = this;

}

OMNI.Procedure.prototype = {
	get x() {
        return this.line.x;
    },
    set x(value) {
       this.line.x = value;
    },

    get y() {
        return this.line.y;
    },
    set y(value) {
        this.line.y = value;
    }
}

OMNI.Procedure.prototype.update = function (ascending) {


    if (ascending === undefined) {
        ascending = true;
    }

    // 부모 업데이트로 가는 중이면
    if (ascending) {

        // 사이즈 등 업데이트

        if (this.parent) {
            this.parent.update(true);

            return;
        }
    }

    // 하위 요소 업데이트
    this.entryBlock.x = this.x;
    this.entryBlock.y = this.y - this.entryBlock.height;
    this.line.update(false);
}