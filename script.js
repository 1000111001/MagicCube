matrixHelper = new matIV();
let camera = { position: [0.0, 4.0, 12.0], target: [0.0, 0.0, 0.0] };

onload = function () {
    // canvas对象获取
    var canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 600;

    // debug信息
    var debugCanvas = document.getElementById("text");
    debugCanvas.width = 120;
    debugCanvas.height = 20;

    //鼠标相关变量
    var deltaX = 0;
    var deltaY = 0;
    var canvasx = 0;
    var canvasy = 0;

    //注册鼠标事件
    var MBUTTON;
    debugCanvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });   //屏蔽右键菜单
    canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });   //屏蔽右键菜单
    canvas.addEventListener('mousemove', handleMouseMove, false);
    canvas.addEventListener('mousedown', handleMouseDown, false);
    canvas.addEventListener('mouseup', handleMouseUp, false);
    if (canvas.addEventListener) {
        canvas.addEventListener('DOMMouseScroll', scrollFunc, false);
    } else {
        test();
    }

    // matIV对象生成，矩阵相关处理对象
    var m = new matIV();

    //鼠标操作相关变量
    var lastMouseX = 0;
    var lastMouseY = 0;
    var mouseDown = false;
    var rightmouseRotationMatrix = m.create();
    m.identity(rightmouseRotationMatrix);

    //旋转方块用临时矩阵
    var t = m.create();
    m.identity(t);

    // webgl的context获取
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    var wgl = new WebGL(gl);

    // 顶点着色器和片段着色器的生成 
    var v_shader = wgl.create_shader('vshader');
    var f_shader = wgl.create_shader('fshader');
    // 程序对象的生成和连接
    var prg = wgl.create_program(v_shader, f_shader);

    // init cubes
    var cubeCenter = [0.0, 0.0, 0.0];
    var mcube = new Mcube(3, cubeCenter, 0.9);
    let cubes = mcube.cubes;
    for (let i = 0; i < mcube.cubes.length; i++) {
        let cube = mcube.cubes[i];
        cube.program = prg;
        cube.buffers = {};
    }

    var text_ctx = debugCanvas.getContext("2d");
    text_ctx.font = "15pt Calibri";
    function renderFps(fps, drawcall) {
        text_ctx.clearRect(0, 0, text_ctx.canvas.width, text_ctx.canvas.height);

        let fpsMsg = fps + " fps";
        let drawcallMsg = drawcall + " dc";
        fpsMsg += ('\n' + drawcallMsg);
        text_ctx.fillText(fpsMsg, 10, 20);
    }

    let renderer = new WebGLRenderer(canvas);
    let previousDate = new Date().getTime();
    let frames = 0;
    // 主循环
    function gameLoop() {

        renderer.render(camera, cubes);

        // Fps
        frames++;
        var now = new Date().getTime();
        if (now > previousDate + 1000) {
            var currentFps = Math.round(frames * 1000.0 / (now - previousDate));
            renderFps(currentFps, renderer.drawcall);
            previousDate = now;
            frames = 0;
        }
    }
    setInterval(gameLoop, 1000 / 60);

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

            var newRotationMatrix = m.create();
            m.identity(newRotationMatrix);
            m.rotate(newRotationMatrix, deltaX * Math.PI / 400, [0, 1, 0], newRotationMatrix);
            m.rotate(newRotationMatrix, deltaY * Math.PI / 400, [1, 0, 0], newRotationMatrix);

            matrixHelper.multiply(newRotationMatrix, mcube.matrix, mcube.matrix);
        }

        //鼠标左键
        if (MBUTTON == 0) {
            if (hitCube == null) return;

            let v = [deltaY / 2, deltaX / 2, 0];
            // let inverseMat = [];
            // matrixHelper.inverse(mcube.matrix, inverseMat);
            // matrixHelper.multiplyVec3(inverseMat, v, v);
            
            let groups = dragGroups;
            var ndir;
            let m = matrixHelper.translate(matrixHelper.identity([]), v, []);
            let mpos = matrixHelper.multiply(matrixHelper.inverse(mcube.matrix, []), m, []).slice(-4,-1); // 将转动向量变换到mcube坐标系中
            let group=groups[o=mpos.map(Math.abs),ndir=o.indexOf(Math.max.apply(Math,o))];

            let normal = [0, 0, 0];
            normal[ndir] = 1;
            mcube.rotateGroup(group, normal, mpos[ndir]);
            
            if(dragDir != void 0 &&  dragDir != ndir)
            {
                mcube.rotateGroup(groups[dragDir], normal, 0);
            }
            if(group = groups[dragDir = ndir])
                mcube.rotateGroup(group, normal, mpos[dragDir]);
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
        for (let i = 0; i < mcube.cubes.length; ++i)
        {
            let hit = ray.intersectCube(mcube.cubes[i]);
            if (hit != null && hit.t < minDistance) {
                minDistance = hit.t;
                hitCube = hit.obj;
            }
        }
        // console.log(hitCube);
        if (hitCube != null)
        {
            dragGroups=[[],[],[]]
            let hitCubeMatrix = hitCube.matrix;
            hitCubePos = [hitCubeMatrix[12], hitCubeMatrix[13], hitCubeMatrix[14]];
            for (let i = 0; i < mcube.cubes.length; ++i)
            {
                let c = mcube.cubes[i];
                let cubeMatrix = c.matrix;
                cubePos = [cubeMatrix[12], cubeMatrix[13], cubeMatrix[14]];
                for (let j = 0; j < 3; ++j)
                {
                    if (c.id[j] == hitCube.id[j])
                    {
                        dragGroups[j].push(c);
                    }
                }
            }
        }
    }

    function handleMouseUp(e) {
        mouseDown = false;
        if (MBUTTON == 2)
        {
            MBUTTON = null;
            return;
        }
        MBUTTON = null;

        if (hitCube == null) return;
        if (dragGroups == null) return;
        
        let angle = 180 * dragRots[dragDir] / Math.PI;
        let group = dragGroups[dragDir];
        let normal = [0, 0, 0];
        normal[dragDir] = 1;
        let r = Math.round(dragRots[dragDir]/90)%4;
        for(let i = 0; i < group.length; i++)
        {
            let o = group[i];
            mcube.rotateCube(o, normal, r)
        }
        if(r = dragRots[dragDir]%=90)
        {
            if(Math.abs(r)>45)
            {
                r = r < 0 ? 90-Math.abs(r) : Math.abs(r)-90;   
            }
        }
        (function callee(){
            if(Math.abs(r*=0.7) < 0.5) r=0;
            mcube.rotateGroup(group, normal, r);
            if(r)setTimeout(callee,16);
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
        let x = (2 * canvasx) / 800 - 1;
        let y = 1 - (2 * canvasy) / 600;    
        let z = 1;
        
        let matrix = {};
        let vMatrix = m.identity(m.create());
        let pMatrix = m.identity(m.create());
        m.lookAt(camera.position, camera.target, [0, 1, 0], vMatrix);
        m.perspective(45, 800 / 600, 0.1, 100, pMatrix);
        
        let ray_clip = [x, y, z, 1];
        matrixHelper.inverse(pMatrix, matrix);
        let ray_eye = matrixHelper.multiplyVec4(matrix, ray_clip);
        matrixHelper.inverse(vMatrix, matrix);
        let ray_world = matrixHelper.multiplyVec4(matrix, ray_eye);
        if (ray_world[3] != 0)  
        {  
            ray_world[0] /= ray_world[3];  
            ray_world[1] /= ray_world[3];  
            ray_world[2] /= ray_world[3];           
        }
        return ray_world;
    }
};