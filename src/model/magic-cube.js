import { matIV } from '../libs/min-matrix';
import { Cube } from './core/cube';
export class MagicCube {
	static red = [0.717, 0.070, 0.0, 1.0];
	static yellow = [1.0, 0.835, 0.0, 1.0];
	static orange = [1.0, 0.345, 0.0, 1.0];
	static white = [0.99, 0.99, 0.99, 1.0];
	static green = [0.0, 0.708, 0.282, 1.0];
	static blue = [0.0, 0.275, 0.778, 1.0];
	static black = [0.015, 0.015, 0.015, 1.0];
	static colors = [
		this.black, this.white, this.green, this.red, this.blue, this.orange, this.yellow,
	];

	constructor(order, center, cubeSize) {
		this.position = center
		this.matrix = matIV.identity(matIV.create())
		matIV.translate(this.matrix, this.position, this.matrix)

		this.rotateCallback = null;
		this.dimension = order
		this.cubes = []
		this.rotating = false;
		const bsize = cubeSize
		const middle = (order - 1) / 2
		for (let x = 0; x < order; ++x) {
			for (let y = 0; y < order; ++y) {
				for (let z = 0; z < order; ++z) {
					const cube = new Cube(bsize)

					const size = 1.12 * bsize
					cube.setPosition([
						size * (x - middle),
						size * (y - middle),
						size * (z - middle),
					])

					const colors = []
					if (z == order - 1) colors.push(MagicCube.red)
					else colors.push(MagicCube.black)
					if (z == 0) colors.push(MagicCube.orange)
					else colors.push(MagicCube.black)
					if (x == 0) colors.push(MagicCube.green)
					else colors.push(MagicCube.black)
					if (x == order - 1) colors.push(MagicCube.blue)
					else colors.push(MagicCube.black)
					if (y == order - 1) colors.push(MagicCube.white)
					else colors.push(MagicCube.black)
					if (y == 0) colors.push(MagicCube.yellow)
					else colors.push(MagicCube.black)
					cube.SetColors(colors)

					cube.id = [x, y, z]
					cube.parent = this

					this.cubes.push(cube)
				}
			}
		}
		this.upCenter = getCube(this, 1, 2, 1);
		this.rightCenter = getCube(this, 2, 1, 1);
		this.frontCenter = getCube(this, 1, 1, 2);
		this.downCenter = getCube(this, 1, 0, 1);
		this.leftCenter = getCube(this, 0, 1, 1);
		this.backCenter = getCube(this, 1, 1, 0);
		this.centers

		function getCube(self, x, y, z) {
			return self.cubes[3*(3*x + y) + z]
		}
	}

	rotateGroup(group, normal, angle) {
		for (let i = 0; i < group.length; ++i) {
			const cube = group[i]
			const rot = matIV.identity(matIV.create())
			matIV.rotate(rot, (angle / 180.0) * Math.PI, normal, rot)
			matIV.multiply(rot, cube.localMatrix, cube.matrix)
		}
	}

	onRotateDone(group, normal, r) {
		for (let i = 0; i < group.length; i++) {
			const o = group[i]
			this.rotateCube(o, normal, r)
		}
	}

	rotateCube(cube, normal, angle) {
		const rot = matIV.identity(matIV.create())
		matIV.rotate(rot, (angle * Math.PI) / 2, normal, rot)
		matIV.multiply(rot, cube.localMatrix, cube.localMatrix)

		const e = (this.dimension - 1) / 2
		const matrix = matIV.translate(matIV.identity(), cube.id, [])
		let temp = matIV.translate(matIV.identity(), [-e, -e, -e], [])
		matIV.multiply(temp, matrix, matrix)
		matIV.multiply(rot, matrix, matrix)
		temp = matIV.translate(matIV.identity(), [e, e, e], [])
		matIV.multiply(temp, matrix, matrix)
		cube.id = matrix.slice(-4, -1).map(Math.round)
	}

	ApplyOperations(ops) {
		var opArr = ops.split(',');
		opArr = opArr.reverse();
		const cube = this;
		(function callee() {
			if (opArr.length == 0) return;
			if (!cube.rotating) {
				var op = opArr.pop();
				cube[op]();
			}
			setTimeout(callee, 16);
		})();
	}
	
    L() { this.Rot(this.leftCenter, 90); }
    R() { this.Rot(this.rightCenter, 90); }
    F() { this.Rot(this.frontCenter, 90); }
    B() { this.Rot(this.backCenter, 90); }
    U() { this.Rot(this.upCenter, 90); }
    D() { this.Rot(this.downCenter, 90); }
	
    Li() { this.Rot(this.leftCenter, -90); }
    Ri() { this.Rot(this.rightCenter, -90); }
    Fi() { this.Rot(this.frontCenter, -90); }
    Bi() { this.Rot(this.backCenter, -90); }
    Ui() { this.Rot(this.upCenter, -90); }
    Di() { this.Rot(this.downCenter, -90); }
	
    L2() { this.Rot(this.leftCenter, 180); }
    R2() { this.Rot(this.rightCenter, 180); }
    F2() { this.Rot(this.frontCenter, 180); }
    B2() { this.Rot(this.backCenter, 180); }
    U2() { this.Rot(this.upCenter, 180); }
    D2() { this.Rot(this.downCenter, 180); }

	Rot(center, degree) {
		let id = center.id.map(x => Math.abs(x - 1));
		let axis = id.indexOf(Math.max(...id));
		let j = center.id[axis];
		const g = []
		for (let i = 0; i < this.cubes.length; ++i) {
			if (this.cubes[i].id[axis] == j) g.push(this.cubes[i]);
		}
		const normal = [0, 0, 0];
		normal[axis] = j - 1;
		this.RotWithAnime(g, normal, degree);
	}

	RotWithAnime(group, normal, r) {
		if (this.rotating) {
			return;
		}
		var cube = this;
		var targetR = r;
		cube.onRotateDone(group, normal, -Math.round(targetR / 90) % 4);
		if (cube.rotateCallback) cube.rotateCallback(normal, -Math.round(targetR / 90) % 4, group[0].id);
		(function callee() {
			cube.rotating = true;
			r *= 0.7;
			if (Math.abs(r) < 0.5) r = 0
			cube.rotateGroup(group, normal, r)
			if (r) setTimeout(callee, 16);
			else {
				cube.rotating = false;
			}
		})();
	}
}
