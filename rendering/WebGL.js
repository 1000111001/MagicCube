class WebGL {
    constructor(context) {
        this.gl = context;
    }
    //初始化数据
    gl_DataInit (data) {
    };

    //绘制对象
    gl_draw (index) {
        this.gl.drawElements(this.gl.TRIANGLES, index.length, this.gl.UNSIGNED_SHORT, 0);

    };

    gl_writeToVbo (vbo, data) {
        // 绑定缓存  
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);

        // 向缓存中写入数据  Float32Array 浮点
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);

        // 将绑定的缓存设为无效  
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    };

    // 生成着色器的函数  
    create_shader (id) {
        // 用来保存着色器的变量  
        var shader;

        // 根据id从HTML中获取指定的script标签  
        var scriptElement = document.getElementById(id);

        // 如果指定的script标签不存在，则返回  
        if (!scriptElement) { return; }

        // 判断script标签的type属性  
        switch (scriptElement.type) {

            // 顶点着色器的时候  
            case 'x-shader/x-vertex':
                shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                break;

            // 片段着色器的时候  
            case 'x-shader/x-fragment':
                shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                break;
            default:
                return;
        }

        // 将标签中的代码分配给生成的着色器  
        this.gl.shaderSource(shader, scriptElement.text);

        // 编译着色器  
        this.gl.compileShader(shader);

        // 判断一下着色器是否编译成功  
        if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {

            // 编译成功，则返回着色器  
            return shader;
        } else {

            // 编译失败，弹出错误消息  
            alert(this.gl.getShaderInfoLog(shader));
        }
    };

    // 程序对象的生成和着色器连接的函数  
    create_program (vs, fs) {
        // 程序对象的生成  
        var program = this.gl.createProgram();

        // 向程序对象里分配着色器  
        this.gl.attachShader(program, vs);
        this.gl.attachShader(program, fs);

        // 将着色器连接  
        this.gl.linkProgram(program);

        // 判断着色器的连接是否成功  
        if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {

            // 成功的话，将程序对象设置为有效  
            // this.gl.useProgram(program);  
            // 返回程序对象  
            return program;
        } else {

            // 如果失败，弹出错误信息  
            alert(this.gl.getProgramInfoLog(program));
        }
    };

    // 生成VBO的函数  
    create_vbo (data, destbuffer) {
        // 生成缓存对象  
        var vbo = this.gl.createBuffer();
        if (destbuffer == null) destbuufer = vbo;

        // 绑定缓存  
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);

        // 向缓存中写入数据  Float32Array 浮点
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);

        // 将绑定的缓存设为无效  
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        // 返回生成的VBO  
        return vbo;
    };

    // 绑定VBO相关的函数  
    set_attribute (vbo, attL, attS) {
        // 处理从参数中得到的数组  
        for (var i in vbo) {
            // 绑定缓存  
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);

            // 将attributeLocation设置为有效  
            this.gl.enableVertexAttribArray(attL[i]);

            //通知并添加attributeLocation  
            this.gl.vertexAttribPointer(attL[i], attS[i], this.gl.FLOAT, false, 0, 0);
        }
    };
    // IBO的生成函数
    create_ibo (data) {
        // 生成缓存对象
        var ibo = this.gl.createBuffer();

        // 绑定缓存
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);

        // 向缓存中写入数据 
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);

        // 将缓存的绑定无效化
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

        // 返回生成的IBO
        return ibo;
    };
}