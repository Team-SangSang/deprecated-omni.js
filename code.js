OMNI.Config.Code = {

	// 데이터 타입

	Data: {
		get: function (dataType) {
			switch (dataType.toLowerCase()) {
				case "integer": return OMNI.Config.Code.Data.INTEGER;
				case "string": return OMNI.Config.Code.Data.STRING;
				case "void": return OMNI.Config.Code.Data.VOID;
				default: return OMNI.Config.Code.Data.UNDEFINED;
			}
		},
		INTEGER: { color:0xD02090 },
		STRING: { color:0x1C86EE },
		VOID: { color:0xEEC900 },
		UNDEFINED: { color:0x000000 }
	}

}

OMNI.Code = function () {

}

