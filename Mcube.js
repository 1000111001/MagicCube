/*-------------------------------------------
数据成员列表
this.blocks           方块数量
this.blocksize        方块大小
this.Bcenter          方块中心
this.blockPos         坐标数据
this.colors           颜色数据


---------------------------------------------*/
function Mcube(Morder, Mcenter, Msize) {

	this.position = [0, 0, 0];
	this.matrix = matrixHelper.identity(matrixHelper.create());

	this.red    = [1.0, 0.0, 0.0, 1.0];
	this.yellow = [1.0, 1.0, 0.0, 1.0];
	this.orange = [1.0, 0.647, 0.0, 1.0];
	this.white  = [0.99, 0.99, 0.99, 1.0];
	this.green  = [0.0, 1.0, 0.0, 1.0];
	this.blue   = [0.0, 0.0, 1.0, 1.0];
	this.black  = [0.015, 0.015, 0.015, 1.0];

	this.cubes = [];
	let bsize = Msize;
	let middle = (Morder - 1) / 2;
	for (let x = 0; x < Morder; ++x)
	for (let y = 0; y < Morder; ++y)
	for (let z = 0; z < Morder; ++z)
	{
		let cube = new Cube(bsize);

		let size = 1.1 * bsize;
		cube.setPosition([size * (x - middle), size * (y - middle), size * (z - middle)]);

		let colors = [];
		if (z == Morder - 1) for (var j = 0; j < 4; j++) colors = colors.concat(this.red);
		else for (var j = 0; j < 4; j++) colors = colors.concat(this.black);
		if (z == 0) for (var j = 0; j < 4; j++) colors = colors.concat(this.orange);
		else for (var j = 0; j < 4; j++) colors = colors.concat(this.black);
		if (x == 0) for (var j = 0; j < 4; j++) colors = colors.concat(this.yellow);
		else for (var j = 0; j < 4; j++) colors = colors.concat(this.black);
		if (x == Morder - 1) for (var j = 0; j < 4; j++) colors = colors.concat(this.white);
		else for (var j = 0; j < 4; j++) colors = colors.concat(this.black);
		if (y == Morder - 1) for (var j = 0; j < 4; j++) colors = colors.concat(this.green);
		else for (var j = 0; j < 4; j++) colors = colors.concat(this.black);
		if (y == 0) for (var j = 0; j < 4; j++) colors = colors.concat(this.blue);
		else for (var j = 0; j < 4; j++) colors = colors.concat(this.black);
		cube.SetColors(colors);

		cube.id = [x, y, z];
		cube.parent = this;

		this.cubes.push(cube)
	}

	this.rotateGroup = function(group, normal) {
		for (let cube in group)
		{
			let rot = matrixHelper.identity(matrixHelper.create());
			matrixHelper.rotate(rot, Math.PI / 2, normal, rot);
			matrixHelper.multiply(rot, cube.matrix, cube.matrix);
		}
	}

	//create indexs
	this.create_index = function () {
		this._index = new Array();
		var i = 0;
		var j = 0;

		for (i = 0; i < this.blocks; i++) {  //this.blocks(27)个方块
			for (j = 0; j < 6; j++) {   //每个方块6个面, 24个索引
				//每个面两个三角形基本图元，4个索引
				this._index.push(0 + 4 * j + 24 * i);
				this._index.push(1 + 4 * j + 24 * i);
				this._index.push(2 + 4 * j + 24 * i);
				this._index.push(0 + 4 * j + 24 * i);
				this._index.push(2 + 4 * j + 24 * i);
				this._index.push(3 + 4 * j + 24 * i);
			}
		}

		return this._index;
	};


	//-------------------function for operation--------------------
	//方块颜色纵向旋转
	this.roll_col_colors_90 = function (i, pages) {
		//rollArrReserve(pages, 0);
		if (!pages) pages = [0, 1, 2, 3, 4, 5];
		var tmp = new Array();
		for (var k = 0; k < 16; k++) {
			tmp.push(this.colors[i][pages[0] * 16 + k]);
		}
		for (var j = 0; j < 16; j++) {
			this.colors[i][pages[0] * 16 + j] = this.colors[i][pages[4] * 16 + j];  //上转前
			this.colors[i][pages[4] * 16 + j] = this.colors[i][pages[1] * 16 + j];
			this.colors[i][pages[1] * 16 + j] = this.colors[i][pages[5] * 16 + j];
			this.colors[i][pages[5] * 16 + j] = tmp[j];
		}

		return this.colors[i];
	};

	//方块颜色横向旋转
	this.roll_row_colors_90 = function (i, pages) {
		if (!pages) pages = [0, 1, 2, 3, 4, 5];
		var tmp = new Array();
		for (var k = 0; k < 16; k++) {
			tmp.push(this.colors[i][pages[0] * 16 + k]);
		}
		//前0 后1 左2 右3 上4 下5
		for (var j = 0; j < 16; j++) {
			this.colors[i][pages[0] * 16 + j] = this.colors[i][pages[2] * 16 + j];  //左转前
			this.colors[i][pages[2] * 16 + j] = this.colors[i][pages[1] * 16 + j];
			this.colors[i][pages[1] * 16 + j] = this.colors[i][pages[3] * 16 + j];
			this.colors[i][pages[3] * 16 + j] = tmp[j];
		}

		return this.colors[i];
	};

	this.colorChangeforTurn = function (i) {

	}

}

//数组反转用于方块逆向旋转
function rollArrReserve(arr, flag) {
	if (arr.length != 6) alert("error!");
	var tmp;
	if (flag == 0) {   //col
		tmp = arr[4];
		arr[4] = arr[5];
		arr[5] = tmp;
	}
	if (flag == 1) {   //row
		tmp = arr[2];
		arr[2] = arr[3];
		arr[3] = tmp;
	}
}

function arrReserve(arr) {
	var i = 0, j = arr.length - 1;
	while (i < j) {
		var tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
		i++;
		j--;
	}
}