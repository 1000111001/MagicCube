function WebGLRenderer( canvas ) {
    
    // webgl的context获取
    var gl = canvas.getContext('webgl') || c.getContext('experimental-webgl');

    function initGLContext()
    {
        gl.disable(gl.CULL_FACE); 
        gl.enable(gl.DEPTH_TEST);
    }

    initGLContext();

    this.render = function(camera, objcets)
    {
        // canvas初始化
        gl.clearColor(0.2, 0.34, 0.65, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        renderObjects(camera, objcets);

        gl.flush();
    };
    
    function renderObjects(camera, objects)
    {
        for (let o of objects)
        {
            renderObject(camera, o);
        }
    }

    function renderObject(camera, object)
    {
        renderBuffer(camera, object);
    }
    
    var m = new matIV();

    let positionBuffer, normalBuffer, colorBuffer, indexBuffer;

    function renderBuffer(camera, object)
    {
		var programAttributes = getAttributes(object.program);

        if (positionBuffer == null)
        {
            positionBuffer =  gl.createBuffer();
        }
        var vertices = object.position.slice(0);
        for (var i = 0; i < vertices.length; i += 3)
        {
            var vertex = [vertices[i], vertices[i + 1], vertices[i + 2]];
            m.multiplyVec3(object.mat, vertex, vertex);
            vertices[i] = vertex[0];
            vertices[i + 1] = vertex[1];
            vertices[i + 2] = vertex[2];
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(programAttributes.position);  
        gl.vertexAttribPointer(programAttributes.position, 3, gl.FLOAT, false, 0, 0);  
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        if (normalBuffer == null)
        {
            normalBuffer =  gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer); 
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.normal), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(programAttributes.normal);  
        gl.vertexAttribPointer(programAttributes.normal, 3, gl.FLOAT, false, 0, 0);  
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        if (colorBuffer == null)
        {

            colorBuffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer); 
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.color), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(programAttributes.color);  
        gl.vertexAttribPointer(programAttributes.color, 4, gl.FLOAT, false, 0, 0);  
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        // matrix
        var uniLocation = new Array();  
        uniLocation[0] = gl.getUniformLocation(object.program, 'mMatrix');  
        uniLocation[1] = gl.getUniformLocation(object.program, 'invMatrix');  
        uniLocation[3] = gl.getUniformLocation(object.program, 'vpMatrix'); 
    
        // 各种矩阵的生成和初始化 
        var mMatrix   = m.identity(m.create());
        var vMatrix   = m.identity(m.create());
        var pMatrix   = m.identity(m.create());
        var vpMatrix  = m.identity(m.create());
        var invMatrix = m.identity(m.create()); 
        
        // 视图x投影坐标变换矩阵
        m.lookAt(camera.position, camera.target, [0, 1, 0], vMatrix);
        m.perspective(45, 800 / 600, 0.1, 100, pMatrix);
        m.multiply(pMatrix, vMatrix, vpMatrix);

        // uniform变量  
        gl.uniformMatrix4fv(uniLocation[0], false, mMatrix);
        gl.uniformMatrix4fv(uniLocation[1], false, invMatrix); 
        gl.uniformMatrix4fv(uniLocation[3], false, vpMatrix);


        // index buffer
        if (indexBuffer == null)
        {
            indexBuffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(object.index), gl.STATIC_DRAW);

        // draw
        gl.drawElements(gl.TRIANGLES, object.index.length, gl.UNSIGNED_SHORT, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    var cachedAttributes;
	function getAttributes(program) {
		if ( cachedAttributes === undefined ) {
			cachedAttributes = fetchAttributeLocations( gl, program );
		}
		return cachedAttributes;
	};

    function fetchAttributeLocations( gl, program ) {
        var attributes = {};
        var n = gl.getProgramParameter( program, gl.ACTIVE_ATTRIBUTES );
        for ( var i = 0; i < n; i ++ ) {
            var info = gl.getActiveAttrib( program, i );
            var name = info.name;
            // console.log( 'THREE.WebGLProgram: ACTIVE VERTEX ATTRIBUTE:', name, i );
            attributes[ name ] = gl.getAttribLocation( program, name );
        }
        return attributes;
    }
}