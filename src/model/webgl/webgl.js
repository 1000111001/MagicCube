export class WebGL {
    constructor(context) {
        this.gl = context;
    }

    createVertexShader(source) {
        return this.createShader(source, this.gl.VERTEX_SHADER);
    }

    createFragmentShader(source) {
        return this.createShader(source, this.gl.FRAGMENT_SHADER);
    }

    createShader (source, type) {
        if (!source) { return; }

        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            return shader;
        } else {
            alert(this.gl.getShaderInfoLog(shader));
        }
    };

    createProgram (vs, fs) {
        // 程序对象的生成  
        var program = this.gl.createProgram();

        // 向程序对象里分配着色器  
        this.gl.attachShader(program, vs);
        this.gl.attachShader(program, fs);

        // 将着色器连接  
        this.gl.linkProgram(program);

        // 判断着色器的连接是否成功  
        if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            return program;
        } else {
            alert(this.gl.getProgramInfoLog(program));
        }
    };
}