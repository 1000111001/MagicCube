class Cube {

    static sharedMesh =  ObjParser.parseOBJ(cubeMeshStr);

    constructor(size) {
        this.position = [0, 0, 0];
        this.scale = [0, 0, 0];
        this.rotation = matIV.identity(matIV.create());;
        this.matrix = matIV.identity(matIV.create());
        this.localMatrix = matIV.identity(matIV.create());

        let halfEdge = size / 2;
        this.vertices = Cube.sharedMesh.position;
        this.normals = Cube.sharedMesh.normal;
        this.indices = Array.from({length: Cube.sharedMesh.position.length}, (val, i) => i);
        
        this.box = {
            min: { x: -halfEdge, y: -halfEdge, z: -halfEdge },
            max: { x: halfEdge, y: halfEdge, z: halfEdge },
        };
    }
    setPosition(vec) {
        this.position = vec;
        let mat = [];
        matIV.translate(this.matrix, vec, mat);
        this.applyMatrix(mat);
    }
    SetColors(colors) {
        this.colors = [];
        for (let i = 0; i < this.vertices.length - 2; i += 3) {
            const nx = this.normals[i];
            const ny = this.normals[i + 1];
            const nz = this.normals[i + 2];
            if (nz == 1) this.colors = this.colors.concat(colors[0]);
            else if (nz == -1) this.colors = this.colors.concat(colors[1]);
            else if (nx == -1) this.colors = this.colors.concat(colors[2]);
            else if (nx == 1) this.colors = this.colors.concat(colors[3]);
            else if (ny == 1) this.colors = this.colors.concat(colors[4]);
            else if (ny == -1) this.colors = this.colors.concat(colors[5]);
            else this.colors = this.colors.concat(MagicCube.black);
        }
    }
    applyMatrix(matrix) {
        matIV.multiply(matrix, this.localMatrix, this.localMatrix);
        matIV.multiply(matrix, this.matrix, this.matrix);
    }
    getMatrix() {
        let mat = matIV.identity(matIV.create());
        matIV.multiply(mat, this.matrix, mat);
        if (this.parent) {
            matIV.multiply(this.parent.matrix, mat, mat);
        }
        return mat;
    }
}
