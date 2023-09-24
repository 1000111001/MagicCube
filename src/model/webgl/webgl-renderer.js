import { matIV } from '../../libs/min-matrix';
export class WebGLRenderer {
	constructor(canvas) {
		this.drawcall = 0
		this.cachedAttributes = undefined;

		var gl = this.initGL(canvas);

		this.render = function (camera, objects) {
            gl.clearColor(136 / 255, 175 / 255, 204 / 255, 1.0);
			gl.clearDepth(1.0)
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

			this.drawcall = 0
			this.renderObjects(camera, objects)

			gl.flush()
		}

		this.renderObjects = function (camera, objects) {
			for (const o of objects) {
				this.renderObject(camera, o)
			}
		}

		this.renderObject = function (camera, object) {
			this.renderBuffer(camera, object);
		}

		this.renderBuffer = function (camera, object) {
			var programAttributes = this.getAttributes(object.program);
			const buffers = this.initBuffers(object);

			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
			gl.enableVertexAttribArray(programAttributes.position)
			gl.vertexAttribPointer(programAttributes.position, 3, gl.FLOAT, false, 0, 0)

			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal)
			gl.enableVertexAttribArray(programAttributes.normal)
			gl.vertexAttribPointer(programAttributes.normal, 3, gl.FLOAT, false, 0, 0)

			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
			gl.enableVertexAttribArray(programAttributes.aColor)
			gl.vertexAttribPointer(programAttributes.aColor, 4, gl.FLOAT, false, 0, 0)

			gl.useProgram(object.program)

			// 各种矩阵的生成和初始化
			const mMatrix = object.getMatrix() // 模型矩阵
			const vMatrix = matIV.identity(matIV.create())
			const pMatrix = matIV.identity(matIV.create())
			const vpMatrix = matIV.create()
			const mvpMatrix = matIV.create()

			// 视图x投影坐标变换矩阵
			matIV.lookAt(camera.position, camera.target, [0, 1, 0], vMatrix)
			matIV.perspective(45, canvas.width / canvas.height, 0.1, 100, pMatrix)
			matIV.multiply(pMatrix, vMatrix, vpMatrix)
			matIV.multiply(vpMatrix, mMatrix, mvpMatrix)

			// uniform变量
			gl.uniformMatrix4fv(gl.getUniformLocation(object.program, 'mMatrix'), false, mMatrix)
			gl.uniformMatrix4fv(gl.getUniformLocation(object.program, 'mvpMatrix'), false, mvpMatrix)
			gl.uniform3f(gl.getUniformLocation(object.program, 'lightDirection'), -0.5, 1.0, 0.5)
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer)

			// draw
			gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT, 0)
			this.drawcall++

			gl.bindBuffer(gl.ARRAY_BUFFER, null)
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
		}
	}

	initGL(canvas) {
		this.gl = canvas.getContext('webgl') || c.getContext('experimental-webgl');
		this.gl.disable(this.gl.CULL_FACE);
		this.gl.enable(this.gl.DEPTH_TEST);
		return this.gl;
	}

	initBuffers(object) {
		const gl = this.gl;
		const buffers = object.buffers;
		if (!buffers.position) {
			buffers.position = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW)
		}
		if (!buffers.normal) {
			buffers.normal = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.normals), gl.STATIC_DRAW)
		}
		if (!buffers.color) {
			buffers.color = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW)
		}
		if (!buffers.indexBuffer) {
			buffers.indexBuffer = gl.createBuffer()
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer)
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(object.indices), gl.STATIC_DRAW)
		}
		return buffers;
	}

	getAttributes(program) {
		const gl = this.gl;
		if (this.cachedAttributes === undefined) {
			this.cachedAttributes = this.fetchAttributeLocations(gl, program)
		}
		return this.cachedAttributes;
	}

	fetchAttributeLocations(gl, program) {
		var attributes = {}
		var n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
		for (var i = 0; i < n; i++) {
			var info = gl.getActiveAttrib(program, i)
			console.log(info.name);
			var name = info.name
			attributes[name] = gl.getAttribLocation(program, name)
		}
		
		var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
		for(var i = 0; i < numUniforms; ++i) {
			var u = gl.getActiveUniform(program, i );
			if (u) {
				console.log(u.name);
			}
		}
		return attributes
	}
}
