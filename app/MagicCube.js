/*-------------------------------------------
数据成员列表
this.blocks           方块数量
this.blocksize        方块大小
this.Bcenter          方块中心
this.blockPos         坐标数据
this.colors           颜色数据


---------------------------------------------*/
class MagicCube {
	constructor(Morder, Mcenter, Msize) {

		this.position = [0, 0, 0];
		this.matrix = matIV.identity(matIV.create());

		this.red = [1.0, 0.0, 0.0, 1.0];
		this.yellow = [1.0, 1.0, 0.0, 1.0];
		this.orange = [1.0, 0.647, 0.0, 1.0];
		this.white = [0.99, 0.99, 0.99, 1.0];
		this.green = [0.0, 1.0, 0.0, 1.0];
		this.blue = [0.0, 0.0, 1.0, 1.0];
		this.black = [0.015, 0.015, 0.015, 1.0];

		this.dimension = Morder;
		this.cubes = [];
		let bsize = Msize;
		let middle = (Morder - 1) / 2;
		for (let x = 0; x < Morder; ++x) {
			for (let y = 0; y < Morder; ++y) {
				for (let z = 0; z < Morder; ++z) {
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

					this.cubes.push(cube);
				}
			}
		}
	}
	
	rotateGroup (group, normal, angle) {
		for (let i = 0; i < group.length; ++i) {
			let cube = group[i];
			let rot = matIV.identity(matIV.create());
			matIV.rotate(rot, Math.PI * angle / 180.0, normal, rot);
			matIV.multiply(rot, cube.localMatrix, cube.matrix);
		}
	};

	onRotateDone (group, normal, r) {
		for(let i = 0; i < group.length; i++)
        {
            let o = group[i];
            this.rotateCube(o, normal, r)
        }
	}

	rotateCube (cube, normal, angle) {
		let rot = matIV.identity(matIV.create());
		matIV.rotate(rot, angle * Math.PI / 2, normal, rot);
		matIV.multiply(rot, cube.localMatrix, cube.localMatrix);

		let e = (this.dimension - 1) / 2;
		let matrix = matIV.translate(matIV.identity(), cube.id, []);
		let temp = matIV.translate(matIV.identity(), [-e, -e, -e], []);
		matIV.multiply(temp, matrix, matrix);
		matIV.multiply(rot, matrix, matrix);
		temp = matIV.translate(matIV.identity(), [e, e, e], []);
		matIV.multiply(temp, matrix, matrix);
		cube.id = matrix.slice(-4, -1).map(Math.round);
	};
}