OMNI.Procedure = function(entryInfo, lineInfo){

	/** Parent workspace */
	this.parent;

    if(entryInfo instanceof OMNI.Block.Entity) {
        this.entryBlock = entryInfo;
    } else {
        this.entryBlock = new OMNI.Block.Entity(entryInfo[0], entryInfo[1], entryInfo[3], entryInfo[4], {entry: true, acc:entryInfo[5]});
    }
	/** Main line */
    if(lineInfo === undefined){
	    this.line = new OMNI.Line();
    } else {
        this.line = lineInfo;
    } 
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

OMNI.Procedure.prototype.getScript = function () {
    return this.entryBlock.targetFunction(this.entryBlock.getJustParamScript(), this.line.getScript());
}

OMNI.Procedure.prototype.export = function () {
    var blockExp = this.entryBlock.export();
    var lineExp = this.line.export();
    var thisno = OMNI.Shared.procedureNo ++;
    
    var buffer = blockExp[1] + "|" + lineExp[1]+ "|";
    buffer += "p," + thisno + "," + blockExp[0] + "," + lineExp[0];

    return [thisno, buffer];
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