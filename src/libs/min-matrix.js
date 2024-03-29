// ------------------------------------------------------------------------------------------------
// minMatrix.js
// version 0.0.1
// Copyright (c) doxas
// ------------------------------------------------------------------------------------------------
/*
>>minMatrix.js:create
函数	:	matIV.create()
参数	:	无
返回值	:	矩阵
生成一个4x4的方阵，里面包含16个元素，其实是一个Float32Array对象，所有的元素都被初始化为0。

>>minMatrix.js:identity
函数	:	matIV.identity(dest)
参数	:	dest > 初始化的矩阵
返回值	:	初始化后的矩阵
将接收的矩阵参数进行初始化并返回。

>>minMatrix.js:multiply
函数	:	matIV.multiply(mat1,mat2,dest)
参数	:	mat1 > 相乘的原始矩阵
参数	:	mat2 > 作为乘数的矩阵
参数	:	dest > 用来保存计算结果的矩阵
mat1在左，mat2在右，相乘后的结果保存到dest中。

>>minMatrix.js:scale
函数	:	matIV.scale(mat,vec,dest)
参数	:	mat > 原始矩阵
参数	:	vec > 缩放向量
参数	:	dest > 用来保存计算结果的矩阵
模型变换中的放大缩小，mat是原始矩阵，vec是X，Y，Z的各个缩放值组成的向量，最后的计算结果保存在dest中。

>>minMatrix.js:translate
函数	:	matIV.translate(mat,vec,dest)
参数	:	mat > 原始矩阵
参数	:	vec > 表示从原点开始移动一定距离的向量
参数	:	dest > 用来保存计算结果的矩阵
模型变换中的坐标移动，mat是原始矩阵，vec是X，Y，Z的各个方向上的移动量组成的向量，最后将计算结果保存到dest中。

>>minMatrix.js:rotate
函数	:	matIV.rotate(mat,angle,axis,dest)
参数	:	mat > 原始矩阵
参数	:	angle > 旋转角度
参数	:	axis > 旋转轴的向量
参数	:	dest > 用来保存计算结果的矩阵
模型变换中的旋转，mat是原始矩阵，angle是旋转角度，axis是旋转轴向量，最后将计算结果保存到dest中。

>>minMatrix.js:lookAt
函数	:	matIV.lookAt(eye,center,up,dest)
参数	:	eye > 镜头位置向量
参数	:	center > 镜头参考点的向量
参数	:	up > 镜头的方向向量
参数	:	dest > 用来保存计算结果的矩阵
视图变换矩阵的生成，eye是镜头在三维空间中的位置，center是这个镜头的参考点，up是镜头的方向向量，最后将计算结果保存到dest中。

>>minMatrix.js:perspective
函数	:	matIV.perspective(fovy,aspect,near,far,dest)
参数	:	fovy > 视角
参数	:	aspect > 屏幕的宽高比例
参数	:	near > 近截面的位置
参数	:	far > 远截面的位置
参数	:	dest > 用来保存计算结果的矩阵
投影变换矩阵的生成，这里生成的是一般被称为［透视射影］的投影变换矩阵，包含远近法则。fovy是视角，aspect是屏幕的横竖比例，near是近截面的位置（必须是大于0的数值），far远截面的位置（任意数值），最后将计算结果保存到dest中。

>>minMatrix.js:transpose
函数	:	matIV.transpose()
参数	:	mat > 原始矩阵
参数	:	dest > 用来保存计算结果的矩阵
矩阵的行列互换，将计算结果保存到dest中。

>>minMatrix.js:inverse
函数	:	matIV.inverse(mat,dest)
参数	:	mat > 原始矩阵
参数	:	dest > 用来保存计算结果的矩阵
求矩阵的逆矩阵，mat是原始矩阵，求的的逆矩阵保存到dest中。
*/

export class matIV {
	constructor() {}
	static identity(dest) {
		dest = dest || new Float32Array(16)
		dest[0] = 1
		dest[1] = 0
		dest[2] = 0
		dest[3] = 0
		dest[4] = 0
		dest[5] = 1
		dest[6] = 0
		dest[7] = 0
		dest[8] = 0
		dest[9] = 0
		dest[10] = 1
		dest[11] = 0
		dest[12] = 0
		dest[13] = 0
		dest[14] = 0
		dest[15] = 1
		return dest
	}
	static create() {
		return new Float32Array(16)
	}
	static multiply(mat1, mat2, dest) {
		var a = mat1[0],
			b = mat1[1],
			c = mat1[2],
			d = mat1[3],
			e = mat1[4],
			f = mat1[5],
			g = mat1[6],
			h = mat1[7],
			i = mat1[8],
			j = mat1[9],
			k = mat1[10],
			l = mat1[11],
			m = mat1[12],
			n = mat1[13],
			o = mat1[14],
			p = mat1[15],
			A = mat2[0],
			B = mat2[1],
			C = mat2[2],
			D = mat2[3],
			E = mat2[4],
			F = mat2[5],
			G = mat2[6],
			H = mat2[7],
			I = mat2[8],
			J = mat2[9],
			K = mat2[10],
			L = mat2[11],
			M = mat2[12],
			N = mat2[13],
			O = mat2[14],
			P = mat2[15]
		dest[0] = A * a + B * e + C * i + D * m
		dest[1] = A * b + B * f + C * j + D * n
		dest[2] = A * c + B * g + C * k + D * o
		dest[3] = A * d + B * h + C * l + D * p
		dest[4] = E * a + F * e + G * i + H * m
		dest[5] = E * b + F * f + G * j + H * n
		dest[6] = E * c + F * g + G * k + H * o
		dest[7] = E * d + F * h + G * l + H * p
		dest[8] = I * a + J * e + K * i + L * m
		dest[9] = I * b + J * f + K * j + L * n
		dest[10] = I * c + J * g + K * k + L * o
		dest[11] = I * d + J * h + K * l + L * p
		dest[12] = M * a + N * e + O * i + P * m
		dest[13] = M * b + N * f + O * j + P * n
		dest[14] = M * c + N * g + O * k + P * o
		dest[15] = M * d + N * h + O * l + P * p
		return dest
	}
	static scale(mat, vec, dest) {
		dest[0] = mat[0] * vec[0]
		dest[1] = mat[1] * vec[0]
		dest[2] = mat[2] * vec[0]
		dest[3] = mat[3] * vec[0]
		dest[4] = mat[4] * vec[1]
		dest[5] = mat[5] * vec[1]
		dest[6] = mat[6] * vec[1]
		dest[7] = mat[7] * vec[1]
		dest[8] = mat[8] * vec[2]
		dest[9] = mat[9] * vec[2]
		dest[10] = mat[10] * vec[2]
		dest[11] = mat[11] * vec[2]
		dest[12] = mat[12]
		dest[13] = mat[13]
		dest[14] = mat[14]
		dest[15] = mat[15]
		return dest
	}
	static translate(mat, vec, dest) {
		dest[0] = mat[0]
		dest[1] = mat[1]
		dest[2] = mat[2]
		dest[3] = mat[3]
		dest[4] = mat[4]
		dest[5] = mat[5]
		dest[6] = mat[6]
		dest[7] = mat[7]
		dest[8] = mat[8]
		dest[9] = mat[9]
		dest[10] = mat[10]
		dest[11] = mat[11]
		dest[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8] * vec[2] + mat[12]
		dest[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9] * vec[2] + mat[13]
		dest[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14]
		dest[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15]
		return dest
	}
	static rotate(mat, angle, axis, dest) {
		var sq = Math.sqrt(
			axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2],
		)
		if (!sq) {
			return null
		}
		var a = axis[0],
			b = axis[1],
			c = axis[2]
		if (sq != 1) {
			sq = 1 / sq
			a *= sq
			b *= sq
			c *= sq
		}
		var d = Math.sin(angle),
			e = Math.cos(angle),
			f = 1 - e,
			g = mat[0],
			h = mat[1],
			i = mat[2],
			j = mat[3],
			k = mat[4],
			l = mat[5],
			m = mat[6],
			n = mat[7],
			o = mat[8],
			p = mat[9],
			q = mat[10],
			r = mat[11],
			s = a * a * f + e,
			t = b * a * f + c * d,
			u = c * a * f - b * d,
			v = a * b * f - c * d,
			w = b * b * f + e,
			x = c * b * f + a * d,
			y = a * c * f + b * d,
			z = b * c * f - a * d,
			A = c * c * f + e
		if (angle) {
			if (mat != dest) {
				dest[12] = mat[12]
				dest[13] = mat[13]
				dest[14] = mat[14]
				dest[15] = mat[15]
			}
		} else {
			dest = mat
		}
		dest[0] = g * s + k * t + o * u
		dest[1] = h * s + l * t + p * u
		dest[2] = i * s + m * t + q * u
		dest[3] = j * s + n * t + r * u
		dest[4] = g * v + k * w + o * x
		dest[5] = h * v + l * w + p * x
		dest[6] = i * v + m * w + q * x
		dest[7] = j * v + n * w + r * x
		dest[8] = g * y + k * z + o * A
		dest[9] = h * y + l * z + p * A
		dest[10] = i * y + m * z + q * A
		dest[11] = j * y + n * z + r * A
		return dest
	}
	static lookAt(eye, center, up, dest) {
		var eyeX = eye[0],
			eyeY = eye[1],
			eyeZ = eye[2],
			upX = up[0],
			upY = up[1],
			upZ = up[2],
			centerX = center[0],
			centerY = center[1],
			centerZ = center[2]
		if (eyeX == centerX && eyeY == centerY && eyeZ == centerZ) {
			return identity
		}
		var x0, x1, x2, y0, y1, y2, z0, z1, z2, l
		z0 = eyeX - center[0]
		z1 = eyeY - center[1]
		z2 = eyeZ - center[2]
		l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2)
		z0 *= l
		z1 *= l
		z2 *= l
		x0 = upY * z2 - upZ * z1
		x1 = upZ * z0 - upX * z2
		x2 = upX * z1 - upY * z0
		l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2)
		if (!l) {
			x0 = 0
			x1 = 0
			x2 = 0
		} else {
			l = 1 / l
			x0 *= l
			x1 *= l
			x2 *= l
		}
		y0 = z1 * x2 - z2 * x1
		y1 = z2 * x0 - z0 * x2
		y2 = z0 * x1 - z1 * x0
		l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2)
		if (!l) {
			y0 = 0
			y1 = 0
			y2 = 0
		} else {
			l = 1 / l
			y0 *= l
			y1 *= l
			y2 *= l
		}
		dest[0] = x0
		dest[1] = y0
		dest[2] = z0
		dest[3] = 0
		dest[4] = x1
		dest[5] = y1
		dest[6] = z1
		dest[7] = 0
		dest[8] = x2
		dest[9] = y2
		dest[10] = z2
		dest[11] = 0
		dest[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ)
		dest[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ)
		dest[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ)
		dest[15] = 1
		return dest
	}
	static perspective(fovy, aspect, near, far, dest) {
		var t = near * Math.tan((fovy * Math.PI) / 360)
		var r = t * aspect
		var a = r * 2,
			b = t * 2,
			c = far - near
		dest[0] = (near * 2) / a
		dest[1] = 0
		dest[2] = 0
		dest[3] = 0
		dest[4] = 0
		dest[5] = (near * 2) / b
		dest[6] = 0
		dest[7] = 0
		dest[8] = 0
		dest[9] = 0
		dest[10] = -(far + near) / c
		dest[11] = -1
		dest[12] = 0
		dest[13] = 0
		dest[14] = -(far * near * 2) / c
		dest[15] = 0
		return dest
	}
	static transpose(mat, dest) {
		dest[0] = mat[0]
		dest[1] = mat[4]
		dest[2] = mat[8]
		dest[3] = mat[12]
		dest[4] = mat[1]
		dest[5] = mat[5]
		dest[6] = mat[9]
		dest[7] = mat[13]
		dest[8] = mat[2]
		dest[9] = mat[6]
		dest[10] = mat[10]
		dest[11] = mat[14]
		dest[12] = mat[3]
		dest[13] = mat[7]
		dest[14] = mat[11]
		dest[15] = mat[15]
		return dest
	}
	static inverse(mat, dest) {
		var a = mat[0],
			b = mat[1],
			c = mat[2],
			d = mat[3],
			e = mat[4],
			f = mat[5],
			g = mat[6],
			h = mat[7],
			i = mat[8],
			j = mat[9],
			k = mat[10],
			l = mat[11],
			m = mat[12],
			n = mat[13],
			o = mat[14],
			p = mat[15],
			q = a * f - b * e,
			r = a * g - c * e,
			s = a * h - d * e,
			t = b * g - c * f,
			u = b * h - d * f,
			v = c * h - d * g,
			w = i * n - j * m,
			x = i * o - k * m,
			y = i * p - l * m,
			z = j * o - k * n,
			A = j * p - l * n,
			B = k * p - l * o,
			ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w)
		dest[0] = (f * B - g * A + h * z) * ivd
		dest[1] = (-b * B + c * A - d * z) * ivd
		dest[2] = (n * v - o * u + p * t) * ivd
		dest[3] = (-j * v + k * u - l * t) * ivd
		dest[4] = (-e * B + g * y - h * x) * ivd
		dest[5] = (a * B - c * y + d * x) * ivd
		dest[6] = (-m * v + o * s - p * r) * ivd
		dest[7] = (i * v - k * s + l * r) * ivd
		dest[8] = (e * A - f * y + h * w) * ivd
		dest[9] = (-a * A + b * y - d * w) * ivd
		dest[10] = (m * u - n * s + p * q) * ivd
		dest[11] = (-i * u + j * s - l * q) * ivd
		dest[12] = (-e * z + f * x - g * w) * ivd
		dest[13] = (a * z - b * x + c * w) * ivd
		dest[14] = (-m * t + n * r - o * q) * ivd
		dest[15] = (i * t - j * r + k * q) * ivd
		return dest
	}

	/*
	 * mat4.multiplyVec3
	 * Transforms a vec3 with the given matrix
	 * 4th vector component is implicitly '1'
	 *
	 * Params:
	 * mat - mat4 to transform the vector with
	 * vec - vec3 to transform
	 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
	 *
	 * Returns:
	 * dest if specified, vec otherwise
	 */
	static multiplyVec3(mat, vec, dest) {
		if (!dest) {
			dest = vec
		}

		var x = vec[0],
			y = vec[1],
			z = vec[2]

		dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12]
		dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13]
		dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14]

		return dest
	}

	/*
	 * mat4.multiplyVec4
	 * Transforms a vec4 with the given matrix
	 *
	 * Params:
	 * mat - mat4 to transform the vector with
	 * vec - vec4 to transform
	 * dest - Optional, vec4 receiving operation result. If not specified result is written to vec
	 *
	 * Returns:
	 * dest if specified, vec otherwise
	 */
	static multiplyVec4(mat, vec, dest) {
		if (!dest) {
			dest = vec
		}

		var x = vec[0],
			y = vec[1],
			z = vec[2],
			w = vec[3]

		dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w
		dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w
		dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w
		dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w

		return dest
	}

	//get euler angles from rotation matrix
	static getEularAngles(mat, vec) {
		var angleX = Math.atan2(mat[9], mat[10])
		var angleY = Math.atan2(
			-mat[8],
			Math.sqrt(mat[9] * mat[9], mat[10] * mat[10]),
		)
		var angleZ = Math.atan2(mat[4], mat[0])
		vec[0] = angleX
		vec[1] = angleY
		vec[2] = angleZ

		return vec
	}
}
