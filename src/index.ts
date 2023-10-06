import './index.css';

import * as PIXI from 'pixi.js';
import { Debugger, MagicCube, Ray, WebGL, WebGLRenderer, matIV } from './model';
import { LogicCube } from './model/logic-cube';

const camera = { position: [0.0, 6.0, 12.0], target: [0.0, 0.0, 0.0] }
let hitCubePos
let cubePos
let rolldetail: any
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const debugCanvas = new Debugger()
debugCanvas.renderFps(0, 0)

let magicCube: MagicCube;
let logicCube = new LogicCube();

const pixiApp = new PIXI.Application<HTMLCanvasElement>({
    resizeTo: window,
    backgroundAlpha: 0.0,
});
pixiApp.renderer.view.style.position = "absolute";
pixiApp.renderer.view.style.left = "0px";
pixiApp.renderer.view.style.top = "0px";
let expandedView = new PIXI.Graphics();
expandedView.eventMode = 'static';
expandedView.cursor = 'pointer';
expandedView.on('pointerdown', function() {
    
});
pixiApp.stage.addChild(expandedView);
document.body.appendChild(pixiApp.view);

function drawExpandedView() {

    let data = logicCube.ToArray();

    let gridSize = 22;
    let o = [20, 85];
    let space = 2;
    expandedView.clear();
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            let color = MagicCube.colors[data[0][j][i]];
            expandedView.lineStyle(1, MagicCube.black, 1);
            expandedView.beginFill(color, 1);
            expandedView.drawRect(o[0] + (i + 3) * (gridSize + space), o[1] + (j + 1) * (gridSize + space), gridSize, gridSize);
            expandedView.endFill();
        }
    }
    for (let i = 0; i < 12; ++i) {
        for (let j = 3; j < 6; ++j) {
            let color = MagicCube.colors[data[Math.floor(i/3) + 1][j - 3][i % 3]];
            expandedView.lineStyle(1, MagicCube.black, 1);
            expandedView.beginFill(color, 1);
            expandedView.drawRect(o[0] + (i + 0) * (gridSize + space), o[1] + (j + 1) * (gridSize + space), gridSize, gridSize);
            expandedView.endFill();
        }
    }
    for (let i = 0; i < 3; ++i) {
        for (let j = 6; j < 9; ++j) {
            let color = MagicCube.colors[data[5][j - 6][i]];
            expandedView.lineStyle(1, MagicCube.black, 1);
            expandedView.beginFill(color, 1);
            expandedView.drawRect(o[0] + (i + 3) * (gridSize + space), o[1] + (j + 1) * (gridSize + space), gridSize, gridSize);
            expandedView.endFill();
        }
    }
}

pixiApp.renderer.view.addEventListener("contextmenu", function (e: any) { e.preventDefault(); });   //屏蔽右键菜单
pixiApp.renderer.view.addEventListener('mousemove', handleMouseMove, false);
pixiApp.renderer.view.addEventListener('mousedown', handleMouseDown, false);
pixiApp.renderer.view.addEventListener('mouseup', handleMouseUp, false);
drawExpandedView();

let deltaX = 0
let deltaY = 0
let canvasx = 0
let canvasy = 0

let MBUTTON: any
if (canvas) {
	canvas.addEventListener('contextmenu', function (e) {
		e.preventDefault()
	}) //屏蔽右键菜单
	canvas.addEventListener('mousemove', handleMouseMove, false)
	canvas.addEventListener('mousedown', handleMouseDown, false)
	canvas.addEventListener('mouseup', handleMouseUp, false)
	if (canvas.addEventListener) {
		canvas.addEventListener('DOMMouseScroll', scrollFunc, false)
	}
}

//鼠标操作相关变量
let lastMouseX = 0
let lastMouseY = 0
let mouseDown = false
const rightmouseRotationMatrix = matIV.create()
matIV.identity(rightmouseRotationMatrix)

// webgl的context获取
const context =
	canvas?.getContext('webgl') || canvas?.getContext('experimental-webgl')
const webgl = new WebGL(context);
var vs = webgl.createVertexShader(getShaderSource('vshader'));
var fs = webgl.createFragmentShader(getShaderSource('fshader'));
var program = webgl.createProgram(vs, fs);

// init cubes
const cubeCenter = [0.0, 0.0, 0.0]
magicCube = new MagicCube(3, cubeCenter, 0.9)
const cubes = magicCube.cubes
for (let i = 0; i < magicCube.cubes.length; i++) {
	const cube = magicCube.cubes[i] as any
	cube.program = program
	cube.buffers = {}
}
magicCube.rotateCallback = (n: any, r: any, id: any) => {
	logicCube.OnRotate(n, r, id);
	drawExpandedView();
};

function getShaderSource(id: string) {
    var scriptElement = document.getElementById(id) as HTMLScriptElement;
    if (!scriptElement) { return null; }
    return scriptElement.textContent;
}

const renderer = new WebGLRenderer(canvas)
let previousDate = new Date().getTime()
let frames = 0
// 主循环
function gameLoop() {
	resizeCanvasToDisplaySize(canvas)
	;(context as any).viewport(
		0,
		0,
		context?.canvas.width,
		context?.canvas.height,
	)
	renderer.render(camera, cubes)

	// Fps
	frames++
	const now = new Date().getTime()
	if (now > previousDate + 1000) {
		const currentFps = Math.round((frames * 1000.0) / (now - previousDate))
		debugCanvas.renderFps(currentFps, renderer.drawcall)
		previousDate = now
		frames = 0
	}
}
setInterval(gameLoop, 1000 / 60)

function resizeCanvasToDisplaySize(canvas: any) {
	const displayWidth = canvas.clientWidth
	const displayHeight = canvas.clientHeight
	const needResize =
		canvas.width !== displayWidth || canvas.height !== displayHeight
	if (needResize) {
		canvas.width = displayWidth
		canvas.height = displayHeight
	}
	return needResize
}

let hitCube: any = null
let dragDir: any
let dragGroups: any
let dragRots: any
function handleMouseMove(e: any) {
	if (!mouseDown) {
		return
	}

	//画布坐标
	const loc = windowTocanvas(canvas, e.clientX, e.clientY) as any
	canvasx = parseInt(loc.x)
	canvasy = parseInt(loc.y)

	const newX = e.clientX
	const newY = e.clientY

	deltaX = newX - lastMouseX
	deltaY = newY - lastMouseY

	//鼠标右键旋转魔方
	if (MBUTTON == 2) {
		lastMouseX = newX
		lastMouseY = newY

		const newRotationMatrix = matIV.create()
		matIV.identity(newRotationMatrix)
		const dpr = window.devicePixelRatio
		const dragSpeed = 1 / (400 / dpr)
		matIV.rotate(
			newRotationMatrix,
			deltaX * Math.PI * dragSpeed,
			[0, 1, 0],
			newRotationMatrix,
		)
		matIV.rotate(
			newRotationMatrix,
			deltaY * Math.PI * dragSpeed,
			[1, 0, 0],
			newRotationMatrix,
		)

		matIV.multiply(newRotationMatrix, magicCube.matrix, magicCube.matrix)
	}

	//鼠标左键
	if (MBUTTON == 0) {
		if (hitCube == null) return

		const dpr = window.devicePixelRatio
		const dragSpeed = 1 / (2 / dpr)
		const v = [deltaY * dragSpeed, deltaX * dragSpeed, 0]

		const groups = dragGroups
		const t = matIV.translate(matIV.identity([]), v, [])
		const signedDelta = matIV.multiply(matIV.inverse(magicCube.matrix, []), t, [])
			.slice(-4, -1) // 将转动向量变换到mcube坐标系中
		const delta = signedDelta.map(Math.abs)
		const ndir = delta.indexOf(Math.max(...delta))
		let group = groups[ndir]

		const normal = [0, 0, 0]
		normal[ndir] = 1
		magicCube.rotateGroup(group, normal, signedDelta[ndir])

		if (dragDir != void 0 && dragDir != ndir) {
			magicCube.rotateGroup(groups[dragDir], normal, 0)
		}
		if ((group = groups[(dragDir = ndir)]))
			magicCube.rotateGroup(group, normal, signedDelta[dragDir])
		dragRots = signedDelta
	}
}

function handleMouseDown(e: any) {
	mouseDown = true
	MBUTTON = e.button
	lastMouseX = e.clientX
	lastMouseY = e.clientY

	if (MBUTTON == 2) return

	const loc = windowTocanvas(canvas, e.clientX, e.clientY)
	const ray_world = screenPosToWorld(loc)
	const dir = [
		ray_world[0] - camera.position[0],
		ray_world[1] - camera.position[1],
		ray_world[2] - camera.position[2],
	]
	const ray = new Ray(camera.position, dir)

	let minDistance = 99999
	hitCube = null
	dragRots = null

	for (let i = 0; i < magicCube.cubes.length; ++i) {
		const hit = ray.intersectCube(magicCube.cubes[i])
		if (hit != null && hit.t < minDistance) {
			minDistance = hit.t
			hitCube = hit.obj
		}
	}
	// console.log(hitCube.id);
	if (hitCube != null) {
		dragGroups = [[], [], []]
		const hitCubeMatrix = hitCube.matrix
		hitCubePos = [hitCubeMatrix[12], hitCubeMatrix[13], hitCubeMatrix[14]]
		for (let i = 0; i < magicCube.cubes.length; ++i) {
			const c = magicCube.cubes[i] as any
			const cubeMatrix = c.matrix
			cubePos = [cubeMatrix[12], cubeMatrix[13], cubeMatrix[14]]
			for (let j = 0; j < 3; ++j) {
				if (c.id[j] == hitCube.id[j]) {
					dragGroups[j].push(c)
				}
			}
		}
	}
}

function handleMouseUp(e: any) {

	if (MBUTTON == 1) {
		// superflip
		magicCube.ApplyOperations("R,L,U,U,F,Ui,D,F,F,R,R,B,B,L,U,U,Fi,Bi,U,R,R,D,F,F,U,R,R,U");
		MBUTTON = null
		return;
	}

	mouseDown = false
	if (MBUTTON == 2) {
		MBUTTON = null
		return
	}
	MBUTTON = null

	if (hitCube == null) return
	if (dragGroups == null) return
	if (dragRots == null) return

	const angle = (180 * dragRots[dragDir]) / Math.PI
	const group = dragGroups[dragDir]
	const normal = [0, 0, 0]
	normal[dragDir] = 1
	let r = Math.round(dragRots[dragDir] / 90) % 4
	magicCube.onRotateDone(group, normal, r);
	if (r != 0) {
		logicCube.OnRotate(normal, r, hitCube.id);
		drawExpandedView();
	}
	if ((r = dragRots[dragDir] %= 90)) {
		if (Math.abs(r) > 45) {
			r = r < 0 ? 90 - Math.abs(r) : Math.abs(r) - 90;
		}
	}
	(function callee() {
		if (Math.abs((r *= 0.7)) < 0.5) r = 0
		magicCube.rotateGroup(group, normal, r)
		if (r) setTimeout(callee, 16)
	})();
}

function scrollFunc(e: any) {
	e = e || window.event
	if (e.detail > 0)
		//缩小
		rolldetail *= 1.0666
	//放大
	else rolldetail /= 1.0666
}

//客户端坐标转canvas坐标
function windowTocanvas(canvas: any, x: any, y: any) {
	const bbox = canvas.getBoundingClientRect()
	return {
		x: x - bbox.left * (canvas.width / bbox.width),
		y: y - bbox.top * (canvas.height / bbox.height),
	}
}

function screenPosToWorld(loc: any) {
	canvasx = parseInt(loc.x)
	canvasy = parseInt(loc.y)
	const x = (2 * canvasx) / canvas.width - 1
	const y = 1 - (2 * canvasy) / canvas.height
	const z = 1

	const matrix = {}
	const vMatrix = matIV.identity(matIV.create())
	const pMatrix = matIV.identity(matIV.create())
	matIV.lookAt(camera.position, camera.target, [0, 1, 0], vMatrix)
	matIV.perspective(45, canvas.width / canvas.height, 0.1, 100, pMatrix)

	const ray_clip = [x, y, z, 1]
	matIV.inverse(pMatrix, matrix)
	const ray_eye = matIV.multiplyVec4(matrix, ray_clip)
	matIV.inverse(vMatrix, matrix)
	const ray_world = matIV.multiplyVec4(matrix, ray_eye)
	if (ray_world[3] != 0) {
		ray_world[0] /= ray_world[3]
		ray_world[1] /= ray_world[3]
		ray_world[2] /= ray_world[3]
	}
	return ray_world
}