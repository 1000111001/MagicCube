import { matIV } from ".";

class LogicBlock {
    index: any;
    position: any;
    colors: Array<number>;

    constructor () {
        this.index = {x: 0, y: 0, z: 0};
        this.position = {x: 0, y: 0, z: 0};
        this.colors = [0, 0, 0, 0, 0, 0];
    }
}

interface BlockFilter {
    (b:LogicBlock):boolean;
}

export class LogicCube {
    blocks: Array<LogicBlock>;
    colorTransL: Array<number>;
    colorTransR: Array<number>;
    colorTransU: Array<number>;
    colorTransD: Array<number>;
    colorTransF: Array<number>;
    colorTransB: Array<number>;

    constructor() {
        this.blocks = []
		for (let x = -1; x <= 1; ++x) {
			for (let y = -1; y <= 1; ++y) {
				for (let z = -1; z <= 1; ++z) {
					let cube = new LogicBlock();
                    cube.index = {x, y, z};
                    cube.position = {x, y, z};
					if (y == 1) cube.colors[0] = 1;
					if (x == -1) cube.colors[1] = 2;
					if (z == 1) cube.colors[2] = 3;
					if (x == 1) cube.colors[3] = 4;
					if (z == -1) cube.colors[4] = 5;
					if (y == -1) cube.colors[5] = 6;
					this.blocks.push(cube);
				}
			}
		}

        this.colorTransL = [0, 4, 5, 2];
        this.colorTransR = Array.from(this.colorTransL).reverse();
        this.colorTransU = [4, 1, 2, 3];
        this.colorTransD = Array.from(this.colorTransU).reverse();
        this.colorTransF = [0, 1, 5, 3];
        this.colorTransB = Array.from(this.colorTransF).reverse();
    }

    ToArray() {
        function to2D(arr: Array<any>) {
            const newArr = [];
            while(arr.length) newArr.push(arr.splice(0,3));
            return newArr;
        }
        let data = [];
        data.push(to2D(this.blocks.filter(b => b.position.y == 1).sort((a, b) => {
            return a.position.z != b.position.z ? a.position.z - b.position.z : a.position.x - b.position.x;
        }).map(b => b.colors[0])));
        data.push(to2D(this.blocks.filter(b => b.position.x == -1).sort((a, b) => {
            return a.position.y != b.position.y ? b.position.y - a.position.y : a.position.z - b.position.z;
        }).map(b => b.colors[1])));
        data.push(to2D(this.blocks.filter(b => b.position.z == 1).sort((a, b) => {
            return a.position.y != b.position.y ? b.position.y - a.position.y : a.position.x - b.position.x;
        }).map(b => b.colors[2])));
        data.push(to2D(this.blocks.filter(b => b.position.x == 1).sort((a, b) => {
            return a.position.y != b.position.y ? b.position.y - a.position.y : b.position.z - a.position.z;
        }).map(b => b.colors[3])));
        data.push(to2D(this.blocks.filter(b => b.position.z == -1).sort((a, b) => {
            return a.position.y != b.position.y ? b.position.y - a.position.y : b.position.x - a.position.x;
        }).map(b => b.colors[4])));
        data.push(to2D(this.blocks.filter(b => b.position.y == -1).sort((a, b) => {
            return a.position.z != b.position.z ? a.position.z - b.position.z : a.position.x - b.position.x;
        }).map(b => b.colors[5])));
        return data;
    }

    OnRotate(normal: any, r: number, index: any) {
        let clockwise = r < 0;
        let colorTrans: Array<number> = [];
        let j = 0;
        if (normal[0] == -1) {
            colorTrans = clockwise ? this.colorTransL : this.colorTransR;
            j = Math.round(index[0] - 1);
        } 
        else if (normal[0] == 1) {
            colorTrans = clockwise ? this.colorTransR: this.colorTransL;
            j = Math.round(index[0] - 1);
        }
        else if (normal[2] == 1) {
            colorTrans = clockwise ? this.colorTransF: this.colorTransB;
            j = Math.round(index[2] - 1);
        }
        else if (normal[2] == -1) {
            colorTrans = clockwise ? this.colorTransB: this.colorTransF;
            j = Math.round(index[2] - 1);
        }
        else if (normal[1] == 1) {
            colorTrans = clockwise ? this.colorTransU: this.colorTransD;
            j = Math.round(index[1] - 1);
        }
        else if (normal[1] == -1) {
            colorTrans = clockwise ? this.colorTransD: this.colorTransU;
            j = Math.round(index[1] - 1);
        }
        let step = Math.abs(r);
        for (let i = 0; i < step; ++i) {
            this.Rot(clockwise, normal, (b: LogicBlock) => {
                if (normal[0] != 0) return b.position.x == j;
                else if (normal[1] != 0) return b.position.y == j;
                else if (normal[2] != 0) return b.position.z == j;
                return false;
            }, colorTrans);
        }
    }

    L() { this.Rot(true, [-1, 0, 0], b => b.position.x == -1, this.colorTransL); }
    R() { this.Rot(true, [1, 0, 0], b => b.position.x == 1, this.colorTransR); }
    F() { this.Rot(true, [0, 0, 1], b => b.position.z == 1, this.colorTransF); }
    B() { this.Rot(true, [0, 0, -1], b => b.position.z == -1, this.colorTransB); }
    U() { this.Rot(true, [0, 1, 0], b => b.position.y == 1, this.colorTransU); }
    D() { this.Rot(true, [0, -1, 0], b => b.position.y == -1, this.colorTransD); }

    Rot(clockwise: boolean, axis: Array<number>, filter: BlockFilter, colorTrans: Array<number>) {
        let radius = clockwise ? -0.5 * Math.PI : 0.5 * Math.PI; 
        let mat = matIV.identity();
        matIV.rotate(mat, radius, axis, mat);
        let list = this.blocks.filter(filter);
        for (let i = 0; i < list.length; i++) {
            const b = list[i];
            let p = [b.position.x, b.position.y, b.position.z];
            p = matIV.multiplyVec3(mat, p);
            b.position.x = Math.round(p[0]);
            b.position.y = Math.round(p[1]);
            b.position.z = Math.round(p[2]);
            this.TransColor(b.colors, colorTrans);
        }
    }

    TransColor(colors: Array<number>, trans: Array<number>) {
        let c = colors[trans[0]];
        for (let i = 0; i < trans.length - 1; ++i) {
            let next = (i + 1) % trans.length;
            colors[trans[i]] = colors[trans[next]];
        }
        colors[trans[trans.length - 1]] = c;
    }
}