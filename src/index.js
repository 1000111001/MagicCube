import './index.css';
import {
    MagicCube,
    WebGL,
    WebGLRenderer,
    matIV,
    Ray,
    Debugger
} from './model';


let camera = { position: [0.0, 4.0, 12.0], target: [0.0, 0.0, 0.0] };

var canvas = document.getElementById('canvas');
var debugCanvas = new Debugger();
debugCanvas.renderFps(0, 0);

var deltaX = 0;
var deltaY = 0;
var canvasx = 0;
var canvasy = 0;

var MBUTTON;
canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });   //屏蔽右键菜单
canvas.addEventListener('mousemove', handleMouseMove, false);
canvas.addEventListener('mousedown', handleMouseDown, false);
canvas.addEventListener('mouseup', handleMouseUp, false);
if (canvas.addEventListener) {
    canvas.addEventListener('DOMMouseScroll', scrollFunc, false);
}

//鼠标操作相关变量
var lastMouseX = 0;
var lastMouseY = 0;
var mouseDown = false;
var rightmouseRotationMatrix = matIV.create();
matIV.identity(rightmouseRotationMatrix);

// webgl的context获取
var context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
var webgl = new WebGL(context);
var v_shader = webgl.create_shader('vshader');
var f_shader = webgl.create_shader('fshader');
var program = webgl.create_program(v_shader, f_shader);

// init cubes
var cubeCenter = [0.0, 0.0, 0.0];
var magicCube = new MagicCube(3, cubeCenter, 0.9);
let cubes = magicCube.cubes;
for (let i = 0; i < magicCube.cubes.length; i++) {
    let cube = magicCube.cubes[i];
    cube.program = program;
    cube.buffers = {};
}

let renderer = new WebGLRenderer(canvas);
let previousDate = new Date().getTime();
let frames = 0;
// 主循环
function gameLoop() {
    resizeCanvasToDisplaySize(canvas);
    context.viewport(0, 0, context.canvas.width, context.canvas.height);
    renderer.render(camera, cubes);

    // Fps
    frames++;
    var now = new Date().getTime();
    if (now > previousDate + 1000) {
        var currentFps = Math.round(frames * 1000.0 / (now - previousDate));
        debugCanvas.renderFps(currentFps, renderer.drawcall);
        previousDate = now;
        frames = 0;
    }
}
setInterval(gameLoop, 1000 / 60);

function resizeCanvasToDisplaySize(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;
    if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    return needResize;
}

let hitCube = null;
let dragDir;
let dragGroups;
let dragRots;
function handleMouseMove(e) {
    if (!mouseDown) {
        return;
    }

    //画布坐标
    var loc = windowTocanvas(canvas, e.clientX, e.clientY);
    canvasx = parseInt(loc.x);
    canvasy = parseInt(loc.y);

    var newX = e.clientX;
    var newY = e.clientY;

    deltaX = newX - lastMouseX;
    deltaY = newY - lastMouseY;

    //鼠标右键旋转魔方
    if (MBUTTON == 2) {
        lastMouseX = newX;
        lastMouseY = newY;

        var newRotationMatrix = matIV.create();
        matIV.identity(newRotationMatrix);
        const dpr = window.devicePixelRatio;
        const dragSpeed = 1 / (400 / dpr);
        matIV.rotate(newRotationMatrix, deltaX * Math.PI * dragSpeed, [0, 1, 0], newRotationMatrix);
        matIV.rotate(newRotationMatrix, deltaY * Math.PI * dragSpeed, [1, 0, 0], newRotationMatrix);

        matIV.multiply(newRotationMatrix, magicCube.matrix, magicCube.matrix);
    }

    //鼠标左键
    if (MBUTTON == 0) {
        if (hitCube == null) return;

        const dpr = window.devicePixelRatio;
        const dragSpeed = 1 / (2 / dpr);
        let v = [deltaY * dragSpeed, deltaX * dragSpeed, 0];

        let groups = dragGroups;
        var o;
        var ndir;
        let m = matIV.translate(matIV.identity([]), v, []);
        let mpos = matIV.multiply(matIV.inverse(magicCube.matrix, []), m, []).slice(-4, -1); // 将转动向量变换到mcube坐标系中
        let group = groups[o = mpos.map(Math.abs), ndir = o.indexOf(Math.max.apply(Math, o))];

        let normal = [0, 0, 0];
        normal[ndir] = 1;
        magicCube.rotateGroup(group, normal, mpos[ndir]);

        if (dragDir != void 0 && dragDir != ndir) {
            magicCube.rotateGroup(groups[dragDir], normal, 0);
        }
        if (group = groups[dragDir = ndir])
            magicCube.rotateGroup(group, normal, mpos[dragDir]);
        dragRots = mpos;
    }
}

function handleMouseDown(e) {
    mouseDown = true;
    MBUTTON = e.button;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    if (MBUTTON == 2) return;

    var loc = windowTocanvas(canvas, e.clientX, e.clientY);
    let ray_world = screenPosToWorld(loc);
    let dir = [ray_world[0] - camera.position[0], ray_world[1] - camera.position[1], ray_world[2] - camera.position[2]];
    let ray = new Ray(camera.position, dir);

    let minDistance = 99999;
    hitCube = null;
    dragRots = null;

    for (let i = 0; i < magicCube.cubes.length; ++i) {
        let hit = ray.intersectCube(magicCube.cubes[i]);
        if (hit != null && hit.t < minDistance) {
            minDistance = hit.t;
            hitCube = hit.obj;
        }
    }
    // console.log(hitCube.id);
    if (hitCube != null) {
        dragGroups = [[], [], []]
        let hitCubeMatrix = hitCube.matrix;
        window.hitCubePos = [hitCubeMatrix[12], hitCubeMatrix[13], hitCubeMatrix[14]];
        for (let i = 0; i < magicCube.cubes.length; ++i) {
            let c = magicCube.cubes[i];
            let cubeMatrix = c.matrix;
            window.cubePos = [cubeMatrix[12], cubeMatrix[13], cubeMatrix[14]];
            for (let j = 0; j < 3; ++j) {
                if (c.id[j] == hitCube.id[j]) {
                    dragGroups[j].push(c);
                }
            }
        }
    }
}

function handleMouseUp(e) {
    mouseDown = false;
    if (MBUTTON == 2) {
        MBUTTON = null;
        return;
    }
    MBUTTON = null;

    if (hitCube == null) return;
    if (dragGroups == null) return;
    if (dragRots == null) return;

    let angle = 180 * dragRots[dragDir] / Math.PI;
    let group = dragGroups[dragDir];
    let normal = [0, 0, 0];
    normal[dragDir] = 1;
    let r = Math.round(dragRots[dragDir] / 90) % 4;
    magicCube.onRotateDone(group, normal, r);
    if (r = dragRots[dragDir] %= 90) {
        if (Math.abs(r) > 45) {
            r = r < 0 ? 90 - Math.abs(r) : Math.abs(r) - 90;
        }
    }
    (function callee() {
        if (Math.abs(r *= 0.7) < 0.5) r = 0;
        magicCube.rotateGroup(group, normal, r);
        if (r) setTimeout(callee, 16);
    })();
}

function scrollFunc(e) {
    e = e || window.event;
    if (e.detail > 0)   //缩小
        rolldetail *= 1.0666;
    else             //放大
        rolldetail /= 1.0666;
}

//客户端坐标转canvas坐标
function windowTocanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

function screenPosToWorld(loc) {
    canvasx = parseInt(loc.x);
    canvasy = parseInt(loc.y);
    let x = (2 * canvasx) / canvas.width - 1;
    let y = 1 - (2 * canvasy) / canvas.height;
    let z = 1;

    let matrix = {};
    let vMatrix = matIV.identity(matIV.create());
    let pMatrix = matIV.identity(matIV.create());
    matIV.lookAt(camera.position, camera.target, [0, 1, 0], vMatrix);
    matIV.perspective(45, canvas.width / canvas.height, 0.1, 100, pMatrix);

    let ray_clip = [x, y, z, 1];
    matIV.inverse(pMatrix, matrix);
    let ray_eye = matIV.multiplyVec4(matrix, ray_clip);
    matIV.inverse(vMatrix, matrix);
    let ray_world = matIV.multiplyVec4(matrix, ray_eye);
    if (ray_world[3] != 0) {
        ray_world[0] /= ray_world[3];
        ray_world[1] /= ray_world[3];
        ray_world[2] /= ray_world[3];
    }
    return ray_world;
}
