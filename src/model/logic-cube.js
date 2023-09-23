class LogicBlock {
    constructor () {
        this.index = {x: 0, y: 0, z: 0};
        this.position = {x: 0, y: 0, z: 0};
        this.colors = [0, 0, 0, 0, 0, 0];
    }
}

class LogicCube {
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
    }

    ToArray() {
        function to2D(arr) {
            const newArr = [];
            while(arr.length) newArr.push(arr.splice(0,3));
            return newArr;
        }
        let data = [];
        data.push(to2D(this.blocks.filter(b => b.position.y == 1).map(b => b.colors[0])));
        data.push(to2D(this.blocks.filter(b => b.position.x == -1).map(b => b.colors[1])));
        data.push(to2D(this.blocks.filter(b => b.position.z == 1).map(b => b.colors[2])));
        data.push(to2D(this.blocks.filter(b => b.position.x == 1).map(b => b.colors[3])));
        data.push(to2D(this.blocks.filter(b => b.position.z == -1).map(b => b.colors[4])));
        data.push(to2D(this.blocks.filter(b => b.position.y == -1).map(b => b.colors[5])));
        return data;
    }

    L() {
        
    }
    
    R() {
        
    }
    
    F() {
        
    }

    B() {
        
    }

    U() {

    }

    D() {

    }
}