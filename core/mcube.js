var MCUBE;
(function (MCUBE) {
    var Camera = (function () {
        function Camera() {
            this.Position = BABYLON.Vector3.Zero();
            this.Target = BABYLON.Vector3.Zero();
        }
        return Camera;
    })();
    MCUBE.Camera = Camera; 
    var Mesh = (function () {
        function Mesh(name, verticesCount, facesCount) {
            this.name = name;
            this.Vertices = new Array(verticesCount);
            this.Faces = new Array(facesCount);
            this.Rotation = new BABYLONTS.Vector3(0, 0, 0);
            this.Position = new BABYLONTS.Vector3(0, 0, 0);
        }
        return Mesh;
    })();
    MCUBE.Mesh = Mesh;    
})(MCUBE || (MCUBE = {}));