
class MagicCube {

	static red = [1.0, 0.0, 0.0, 1.0];
	static yellow = [1.0, 1.0, 0.0, 1.0];
	static orange = [1.0, 0.647, 0.0, 1.0];
	static white = [0.99, 0.99, 0.99, 1.0];
	static green = [0.0, 1.0, 0.0, 1.0];
	static blue = [0.0, 0.0, 1.0, 1.0];
	static black = [0.015, 0.015, 0.015, 1.0];

	constructor(order, center, cubeSize) {

		this.position = center;
		this.matrix = matIV.identity(matIV.create());
		matIV.translate(this.matrix, this.position, this.matrix);

		this.dimension = order;
		this.cubes = [];
		let bsize = cubeSize;
		let middle = (order - 1) / 2;
		for (let x = 0; x < order; ++x) {
			for (let y = 0; y < order; ++y) {
				for (let z = 0; z < order; ++z) {
					let cube = new Cube(bsize);

					let size = 1.12 * bsize;
					cube.setPosition([size * (x - middle), size * (y - middle), size * (z - middle)]);

					let colors = new Array();
					if (z == order - 1) colors.push(MagicCube.red); else colors.push(MagicCube.black);
					if (z == 0) colors.push(MagicCube.orange); else colors.push(MagicCube.black);
					if (x == 0) colors.push(MagicCube.yellow); else colors.push(MagicCube.black);
					if (x == order - 1) colors.push(MagicCube.white); else colors.push(MagicCube.black);
					if (y == order - 1) colors.push(MagicCube.green); else colors.push(MagicCube.black);
					if (y == 0) colors.push(MagicCube.blue); else colors.push(MagicCube.black);
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