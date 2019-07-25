Cube = function(size)
{
    this.position = [0, 0, 0];
    this.scale = [0, 0, 0];
    this.rotation = matrixHelper.identity(matrixHelper.create());;
    this.matrix = matrixHelper.identity(matrixHelper.create());
    this.m = matrixHelper.identity(matrixHelper.create());

    let halfEdge = size / 2;
    this.vertices = [
        //前表面
        -halfEdge,  +halfEdge,  +halfEdge,    //0
        +halfEdge,  +halfEdge,  +halfEdge,    //1
        +halfEdge,  -halfEdge,  +halfEdge,    //2
        -halfEdge,  -halfEdge,  +halfEdge,    //3
        //后表面
        -halfEdge,  +halfEdge,  -halfEdge,    //4
        -halfEdge,  -halfEdge,  -halfEdge,    //5
        +halfEdge,  -halfEdge,  -halfEdge,    //6
        +halfEdge,  +halfEdge,  -halfEdge,    //7
        //左表面
        -halfEdge,  +halfEdge,  -halfEdge,    //4
        -halfEdge,  +halfEdge,  +halfEdge,    //0
        -halfEdge,  -halfEdge,  +halfEdge,    //3
        -halfEdge,  -halfEdge,  -halfEdge,    //5
        //右表面
        +halfEdge,  +halfEdge,  +halfEdge,    //1
        +halfEdge,  +halfEdge,  -halfEdge,    //7
        +halfEdge,  -halfEdge,  -halfEdge,    //6
        +halfEdge,  -halfEdge,  +halfEdge,    //2
        //上表面
        +halfEdge,  +halfEdge,  +halfEdge,    //1
        -halfEdge,  +halfEdge,  +halfEdge,    //0
        -halfEdge,  +halfEdge,  -halfEdge,    //4
        +halfEdge,  +halfEdge,  -halfEdge,    //7
        //下表面
        -halfEdge,  -halfEdge,  +halfEdge,    //3
        +halfEdge,  -halfEdge,  +halfEdge,    //2
        +halfEdge,  -halfEdge,  -halfEdge,    //6
        -halfEdge,  -halfEdge,  -halfEdge,    //5
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
        0, 1, 2,     0, 2, 3,
        4, 5, 6,     4, 6, 7,
        8, 9, 10,    8, 10, 11,
        12, 13, 14,  12, 14, 15,
        16, 17, 18,  16, 18, 19,
        20, 21, 22,  20, 22, 23,
    ];

    this.box = {
        min : { x : -halfEdge, y : -halfEdge, z : -halfEdge },
        max : { x :  halfEdge, y :  halfEdge, z :  halfEdge },
    }
}

Cube.prototype = {

    setPosition : function(vec) {
        this.position = vec;
        let mat = [];
        matrixHelper.translate(this.matrix, vec, mat);
        this.applyMatrix(mat);
    },

    SetColors : function(colors) {
        this.colors = colors;
    },

    applyMatrix : function(matrix) {
        matrixHelper.multiply(matrix, this.m, this.m);
        matrixHelper.multiply(matrix, this.matrix, this.matrix);
    },

    getMatrix : function() {
        let mat = matrixHelper.identity(matrixHelper.create());
        matrixHelper.multiply(mat, this.matrix, mat);
        if (this.parent)
        {
            matrixHelper.multiply(this.parent.matrix, mat, mat);
        }
        return mat;
    }
}