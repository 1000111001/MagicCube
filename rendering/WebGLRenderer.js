class WebGLRenderer {
    constructor(canvas) {

        this.drawcall = 0;

        // webgl的context获取
        var gl = canvas.getContext('webgl') || c.getContext('experimental-webgl');

        function initGLContext() {
            gl.disable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
        }

        initGLContext();
        this.render = function (camera, objects) {
            // canvas初始化
            gl.clearColor(0.2, 0.34, 0.65, 1.0);
            gl.clearDepth(1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            this.drawcall = 0;
            this.renderObjects(camera, objects);

            gl.flush();
        };

        this.renderObjects = function (camera, objects) {
            for (let o of objects) {
                this.renderObject(camera, o);
            }
        };

        this.renderObject = function (camera, object) {
            this.renderBuffer(camera, object);
        };

        let positionBuffer, normalBuffer, colorBuffer, indexBuffer;

        this.renderBuffer = function (camera, object) {
            var programAttributes = getAttributes(object.program);

            let buffers = object.buffers;
            if (!buffers.position) {
                buffers.position = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.enableVertexAttribArray(programAttributes.position);
            gl.vertexAttribPointer(programAttributes.position, 3, gl.FLOAT, false, 0, 0);

            if (!buffers.normal) {
                buffers.normal = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.normals), gl.STATIC_DRAW);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
            gl.enableVertexAttribArray(programAttributes.normal);
            gl.vertexAttribPointer(programAttributes.normal, 3, gl.FLOAT, false, 0, 0);

            if (!buffers.color) {
                buffers.color = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
            gl.enableVertexAttribArray(programAttributes.color);
            gl.vertexAttribPointer(programAttributes.color, 4, gl.FLOAT, false, 0, 0);

            gl.useProgram(object.program);

            // 各种矩阵的生成和初始化 
            let mMatrix = object.getMatrix(); // 模型矩阵
            let vMatrix = matIV.identity(matIV.create());
            let pMatrix = matIV.identity(matIV.create());
            let vpMatrix = matIV.create();
            let mvpMatrix = matIV.create();

            // 视图x投影坐标变换矩阵
            matIV.lookAt(camera.position, camera.target, [0, 1, 0], vMatrix);
            matIV.perspective(45, 800 / 600, 0.1, 100, pMatrix);
            matIV.multiply(pMatrix, vMatrix, vpMatrix);
            matIV.multiply(vpMatrix, mMatrix, mvpMatrix);

            // uniform变量
            gl.uniformMatrix4fv(gl.getUniformLocation(object.program, 'mMatrix'), false, mMatrix);
            gl.uniformMatrix4fv(gl.getUniformLocation(object.program, 'mvpMatrix'), false, mvpMatrix);
            gl.uniform3f(gl.getUniformLocation(object.program, 'lightDirection'), -0.5, 1.0, 0.5);

            // index buffer
            if (indexBuffer == null) {
                indexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(object.indices), gl.STATIC_DRAW);
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

            // draw
            gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT, 0);
            this.drawcall++;

            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        };

        var cachedAttributes;
        function getAttributes(program) {
            if (cachedAttributes === undefined) {
                cachedAttributes = fetchAttributeLocations(gl, program);
            }
            return cachedAttributes;
        };

        function fetchAttributeLocations(gl, program) {
            var attributes = {};
            var n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < n; i++) {
                var info = gl.getActiveAttrib(program, i);
                var name = info.name;
                attributes[name] = gl.getAttribLocation(program, name);
            }
            return attributes;
        }
    }
}