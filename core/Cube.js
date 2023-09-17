class Cube {
    constructor(size) {
        this.position = [0, 0, 0];
        this.scale = [0, 0, 0];
        this.rotation = matIV.identity(matIV.create());;
        this.matrix = matIV.identity(matIV.create());
        this.m = matIV.identity(matIV.create());

        let halfEdge = size / 2;
        this.vertices = [
            //前表面
            -halfEdge, +halfEdge, +halfEdge,
            +halfEdge, +halfEdge, +halfEdge,
            +halfEdge, -halfEdge, +halfEdge,
            -halfEdge, -halfEdge, +halfEdge,

            //后表面
            -halfEdge, +halfEdge, -halfEdge,
            -halfEdge, -halfEdge, -halfEdge,
            +halfEdge, -halfEdge, -halfEdge,
            +halfEdge, +halfEdge, -halfEdge,

            //左表面
            -halfEdge, +halfEdge, -halfEdge,
            -halfEdge, +halfEdge, +halfEdge,
            -halfEdge, -halfEdge, +halfEdge,
            -halfEdge, -halfEdge, -halfEdge,

            //右表面
            +halfEdge, +halfEdge, +halfEdge,
            +halfEdge, +halfEdge, -halfEdge,
            +halfEdge, -halfEdge, -halfEdge,
            +halfEdge, -halfEdge, +halfEdge,

            //上表面
            +halfEdge, +halfEdge, +halfEdge,
            -halfEdge, +halfEdge, +halfEdge,
            -halfEdge, +halfEdge, -halfEdge,
            +halfEdge, +halfEdge, -halfEdge,

            //下表面
            -halfEdge, -halfEdge, +halfEdge,
            +halfEdge, -halfEdge, +halfEdge,
            +halfEdge, -halfEdge, -halfEdge,
            -halfEdge, -halfEdge, -halfEdge, //5
        ];

        this.normals = [
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

        this.indices = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ];

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
        this.colors = colors;
    }
    applyMatrix(matrix) {
        matIV.multiply(matrix, this.m, this.m);
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
