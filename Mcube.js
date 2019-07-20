/*-------------------------------------------
数据成员列表
this.blocks           方块数量
this.blocksize        方块大小
this.Bcenter          方块中心
this.blockPos         坐标数据
this.colors           颜色数据


---------------------------------------------*/
function Mcube(Morder, Mcenter, Msize) {
	//create a cube with center of cube and radius
	this.create_cube = function (cpos, size) {
		var position = [
			//前表面
			cpos[0] - size, cpos[1] + size, cpos[2] + size,    //0
			cpos[0] + size, cpos[1] + size, cpos[2] + size,    //1
			cpos[0] + size, cpos[1] - size, cpos[2] + size,    //2
			cpos[0] - size, cpos[1] - size, cpos[2] + size,    //3
			//后表面
			cpos[0] - size, cpos[1] + size, cpos[2] - size,    //4
			cpos[0] - size, cpos[1] - size, cpos[2] - size,    //5
			cpos[0] + size, cpos[1] - size, cpos[2] - size,    //6
			cpos[0] + size, cpos[1] + size, cpos[2] - size,    //7
			//左表面
			cpos[0] - size, cpos[1] + size, cpos[2] - size,    //4
			cpos[0] - size, cpos[1] + size, cpos[2] + size,    //0
			cpos[0] - size, cpos[1] - size, cpos[2] + size,    //3
			cpos[0] - size, cpos[1] - size, cpos[2] - size,    //5
			//右表面
			cpos[0] + size, cpos[1] + size, cpos[2] + size,    //1
			cpos[0] + size, cpos[1] + size, cpos[2] - size,    //7
			cpos[0] + size, cpos[1] - size, cpos[2] - size,    //6
			cpos[0] + size, cpos[1] - size, cpos[2] + size,    //2
			//上表面
			cpos[0] + size, cpos[1] + size, cpos[2] + size,    //1
			cpos[0] - size, cpos[1] + size, cpos[2] + size,    //0
			cpos[0] - size, cpos[1] + size, cpos[2] - size,    //4
			cpos[0] + size, cpos[1] + size, cpos[2] - size,    //7
			//下表面
			cpos[0] - size, cpos[1] - size, cpos[2] + size,    //3
			cpos[0] + size, cpos[1] - size, cpos[2] + size,    //2
			cpos[0] + size, cpos[1] - size, cpos[2] - size,    //6
			cpos[0] - size, cpos[1] - size, cpos[2] - size     //5
		];

		return position;
	};

	//create every block's coord
	this.create_blockPos = function () {
		this.blockPos = new Array();

		//每个方块一个坐标组
		for (var i = 0; i < this.blocks; i++) {
			this.blockPos[i] = this.create_cube(this.Bcenter[i], this.blocksize);
		}

		var wgl_position = new Array();      //整合到一个数组
		for (var i = 0; i < this.blockPos.length; i++) {
			arrPush(this.blockPos[i], wgl_position);
		}


		return wgl_position;
	};

	this.create_normals = function () {
		var normals = [
			//front
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			//back
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			//left
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			//right
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			//top
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			//bottom
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0
		];

		return normals;
	}

	this.dot3 = function (gap) {
		this.red = [1.0, 0.0, 0.0, 1.0];
		this.yellow = [1.0, 1.0, 0.0, 1.0];
		this.orange = [1.0, 0.357, 0.0, 1.0];
		this.white = [1.0, 1.0, 1.0, 1.0];
		this.green = [0.0, 1.0, 0.0, 1.0];
		this.blue = [0.0, 0.0, 1.0, 1.0];
		this.black = [0.0, 0.0, 0.0, 1.0];

		var bsize = Msize / Morder;
		this.blocksize = bsize;

		this.Bcenter = [
			[Mcenter[0] - 2 * bsize - gap, Mcenter[1] + 2 * bsize + gap, Mcenter[2] + 2 * bsize + gap],
			[Mcenter[0] - 0.00 + 0.00, Mcenter[1] + 2 * bsize + gap, Mcenter[2] + 2 * bsize + gap],
			[Mcenter[0] + 2 * bsize + gap, Mcenter[1] + 2 * bsize + gap, Mcenter[2] + 2 * bsize + gap],

			[Mcenter[0] - 2 * bsize - gap, Mcenter[1] + 0.00 + 0.00, Mcenter[2] + 2 * bsize + gap],
			[Mcenter[0] - 0.00 + 0.00, Mcenter[1] + 0.00 + 0.00, Mcenter[2] + 2 * bsize + gap],
			[Mcenter[0] + 2 * bsize + gap, Mcenter[1] + 0.00 + 0.00, Mcenter[2] + 2 * bsize + gap],

			[Mcenter[0] - 2 * bsize - gap, Mcenter[1] - 2 * bsize - gap, Mcenter[2] + 2 * bsize + gap],
			[Mcenter[0] - 0.00 + 0.00, Mcenter[1] - 2 * bsize - gap, Mcenter[2] + 2 * bsize + gap],
			[Mcenter[0] + 2 * bsize + gap, Mcenter[1] - 2 * bsize - gap, Mcenter[2] + 2 * bsize + gap],
			//

			[Mcenter[0] - 2 * bsize - gap, Mcenter[1] + 2 * bsize + gap, Mcenter[2] + 0.00 + 0.00],
			[Mcenter[0] - 0.00 + 0.00, Mcenter[1] + 2 * bsize + gap, Mcenter[2] + 0.00 + 0.00],
			[Mcenter[0] + 2 * bsize + gap, Mcenter[1] + 2 * bsize + gap, Mcenter[2] + 0.00 + 0.00],

			[Mcenter[0] - 2 * bsize - gap, Mcenter[1] + 0.00 + 0.00, Mcenter[2] + 0.00 + 0.00],
			[Mcenter[0] - 0.00 + 0.00, Mcenter[1] + 0.00 + 0.00, Mcenter[2] + 0.00 + 0.00],
			[Mcenter[0] + 2 * bsize + gap, Mcenter[1] + 0.00 + 0.00, Mcenter[2] + 0.00 + 0.00],

			[Mcenter[0] - 2 * bsize - gap, Mcenter[1] - 2 * bsize - gap, Mcenter[2] + 0.00 + 0.00],
			[Mcenter[0] - 0.00 + 0.00, Mcenter[1] - 2 * bsize - gap, Mcenter[2] + 0.00 + 0.00],
			[Mcenter[0] + 2 * bsize + gap, Mcenter[1] - 2 * bsize - gap, Mcenter[2] + 0.00 + 0.00],
			//

			[Mcenter[0] - 2 * bsize - gap, Mcenter[1] + 2 * bsize + gap, Mcenter[2] - 2 * bsize - gap],
			[Mcenter[0] - 0.00 + 0.00, Mcenter[1] + 2 * bsize + gap, Mcenter[2] - 2 * bsize - gap],
			[Mcenter[0] + 2 * bsize + gap, Mcenter[1] + 2 * bsize + gap, Mcenter[2] - 2 * bsize - gap],

			[Mcenter[0] - 2 * bsize - gap, Mcenter[1] + 0.00 + 0.00, Mcenter[2] - 2 * bsize - gap],
			[Mcenter[0] - 0.00 + 0.00, Mcenter[1] + 0.00 + 0.00, Mcenter[2] - 2 * bsize - gap],
			[Mcenter[0] + 2 * bsize + gap, Mcenter[1] + 0.00 + 0.00, Mcenter[2] - 2 * bsize - gap],

			[Mcenter[0] - 2 * bsize - gap, Mcenter[1] - 2 * bsize - gap, Mcenter[2] - 2 * bsize - gap],
			[Mcenter[0] - 0.00 + 0.00, Mcenter[1] - 2 * bsize - gap, Mcenter[2] - 2 * bsize - gap],
			[Mcenter[0] + 2 * bsize + gap, Mcenter[1] - 2 * bsize - gap, Mcenter[2] - 2 * bsize - gap]
		];

		this.blocks = Morder * Morder * Morder;

		return this.Bcenter;
	};

	this.setgap = function (gap) {

	}

	//create color array
	this.dot3_colors = function () {
		this.colors = new Array();
		var redP = new Array();
		var greenP = new Array();
		var blueP = new Array();
		var yellowP = new Array();
		var orangeP = new Array();
		var whiteP = new Array();
		var blackP = new Array();
		for (var j = 0; j < 4; j++) {
			arrPush(this.red, redP);
			arrPush(this.green, greenP);
			arrPush(this.blue, blueP);
			arrPush(this.yellow, yellowP);
			arrPush(this.orange, orangeP);
			arrPush(this.white, whiteP);
			arrPush(this.black, blackP);
		}

		//每个方块分派一个颜色组
		for (var i = 0; i < this.blocks; i++) {
			var tmpArr = new Array();
			if (i >= 0 && i <= 8) {  //第一层
				arrPush(redP, tmpArr);  //前面颜色为red
				arrPush(blackP, tmpArr);

			}
			if (i >= 9 && i <= 17) {  //第二层
				arrPush(blackP, tmpArr);
				arrPush(blackP, tmpArr);

			}
			if (i >= 18 && i <= 26) {  //第三层
				arrPush(blackP, tmpArr);
				arrPush(orangeP, tmpArr);

			}

			if ((i + 1) % 9 == 1 || (i + 1) % 9 == 4 || (i + 1) % 9 == 7) {
				arrPush(blueP, tmpArr);
			} else {
				arrPush(blackP, tmpArr);
			}

			if ((i + 1) % 9 == 3 || (i + 1) % 9 == 6 || (i + 1) % 9 == 0) {
				arrPush(greenP, tmpArr);
			} else {
				arrPush(blackP, tmpArr);
			}

			if ((i + 1) % 9 == 1 || (i + 1) % 9 == 2 || (i + 1) % 9 == 3) {
				arrPush(yellowP, tmpArr);
			} else {
				arrPush(blackP, tmpArr);
			}

			if ((i + 1) % 9 == 7 || (i + 1) % 9 == 8 || (i + 1) % 9 == 0) {
				arrPush(whiteP, tmpArr);
			} else {
				arrPush(blackP, tmpArr);
			}

			this.colors[i] = tmpArr;
			delete tmpArr;
		}

		var wgl_color = new Array();  //整合到一个数组
		for (var i = 0; i < this.colors.length; i++) {
			arrPush(this.colors[i], wgl_color);
		}

		return wgl_color;
	};

	this.dot2 = function () {
		this.red = [1.0, 0.0, 0.0, 1.0];
		this.yellow = [1.0, 1.0, 0.0, 1.0];
		this.orange = [1.0, 0.647, 0.0, 1.0];
		this.white = [0.99, 0.99, 0.99, 1.0];
		this.green = [0.0, 1.0, 0.0, 1.0];
		this.blue = [0.0, 0.0, 1.0, 1.0];
		this.black = [0.015, 0.015, 0.015, 1.0];

		var bsize = Msize / Morder;
		this.blocksize = bsize;
		var gap = 0.44;

		this.Bcenter = [
			[Mcenter[0] - 0.5 * bsize - gap, Mcenter[1] + 0.5 * bsize + gap, Mcenter[2] + 0.5 * bsize + gap],
			[Mcenter[0] + 0.5 * bsize + gap, Mcenter[1] + 0.5 * bsize + gap, Mcenter[2] + 0.5 * bsize + gap],
			[Mcenter[0] - 0.5 * bsize - gap, Mcenter[1] - 0.5 * bsize - gap, Mcenter[2] + 0.5 * bsize + gap],
			[Mcenter[0] + 0.5 * bsize + gap, Mcenter[1] - 0.5 * bsize - gap, Mcenter[2] + 0.5 * bsize + gap],
			[Mcenter[0] - 0.5 * bsize - gap, Mcenter[1] + 0.5 * bsize + gap, Mcenter[2] - 0.5 * bsize - gap],
			[Mcenter[0] + 0.5 * bsize + gap, Mcenter[1] + 0.5 * bsize + gap, Mcenter[2] - 0.5 * bsize - gap],
			[Mcenter[0] - 0.5 * bsize - gap, Mcenter[1] - 0.5 * bsize - gap, Mcenter[2] - 0.5 * bsize - gap],
			[Mcenter[0] + 0.5 * bsize + gap, Mcenter[1] - 0.5 * bsize - gap, Mcenter[2] - 0.5 * bsize - gap]
		];

		this.blocks = Morder * Morder * Morder;

		return this.Bcenter;
	}
	this.dot2_colors = function () {
		this.colors = new Array();
		var redP = new Array();
		var greenP = new Array();
		var blueP = new Array();
		var yellowP = new Array();
		var orangeP = new Array();
		var whiteP = new Array();
		var blackP = new Array();
		for (var j = 0; j < 4; j++) {
			arrPush(this.red, redP);
			arrPush(this.green, greenP);
			arrPush(this.blue, blueP);
			arrPush(this.yellow, yellowP);
			arrPush(this.orange, orangeP);
			arrPush(this.white, whiteP);
			arrPush(this.black, blackP);
		}

		var i = 0;

		for (i = 0; i < this.blocks; i++) {
			var tmpArr = new Array();
			if (i >= 0 && i <= 3) {
				arrPush(redP, tmpArr);  //前面颜色为red
				arrPush(blackP, tmpArr);
			}
			if (i >= 4 && i <= 7) {
				arrPush(blackP, tmpArr);  //前面颜色为red
				arrPush(orangeP, tmpArr);
			}

			if ((i + 1) % 4 == 1 || (i + 1) % 4 == 3) {
				arrPush(blueP, tmpArr);
			} else {
				arrPush(blackP, tmpArr);
			}

			if ((i + 1) % 4 == 2 || (i + 1) % 4 == 0) {
				arrPush(greenP, tmpArr);
			} else {
				arrPush(blackP, tmpArr);
			}

			if ((i + 1) % 4 == 1 || (i + 1) % 4 == 2) {
				arrPush(yellowP, tmpArr);
			} else {
				arrPush(blackP, tmpArr);
			}

			if ((i + 1) % 4 == 3 || (i + 1) % 4 == 0) {
				arrPush(whiteP, tmpArr);
			} else {
				arrPush(blackP, tmpArr);
			}

			this.colors[i] = tmpArr;
			delete tmpArr;
		}

		var wgl_color = new Array();  //整合到一个数组
		for (var i = 0; i < this.colors.length; i++) {
			arrPush(this.colors[i], wgl_color);
		}

		return wgl_color;
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

//push arr to desArr
function arrPush(arr, desArr) {
	for (var i = 0; i < arr.length; i++) {
		desArr.push(arr[i]);
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