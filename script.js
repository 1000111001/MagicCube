matrixHelper = new matIV();

onload = function () {
    // canvas对象获取
    var canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 600;

    //输出测试数据用
    var coordArea = document.getElementById("gl-text");

    var keycode = null;

    var keyQ = 81;
    var keyW = 87;
    var keyE = 69;
    var keyA = 65;
    var keyS = 83;
    var keyD = 68;
    var keys = [keyQ, keyW, keyE, keyA, keyS, keyD];

    //鼠标相关变量
    var deltaX = 0;
    var deltaY = 0;
    var canvasx = 0;
    var canvasy = 0;

    //注册鼠标事件
    var MBUTTON;
    coordArea.addEventListener("contextmenu", function (e) { e.preventDefault(); });   //屏蔽右键菜单
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

    // attributeLocation的获取
    var attLocation = new Array();
    attLocation[0] = gl.getAttribLocation(prg, 'position');
    attLocation[1] = gl.getAttribLocation(prg, 'color');
    attLocation[2] = gl.getAttribLocation(prg, 'normal');

    // 将元素数attribute保存到数组中
    var attStride = new Array();
    attStride[0] = 3;
    attStride[1] = 4;
    attStride[2] = 3;

    // 获取uniformLocation并保存到数组中  
    var uniLocation = new Array();
    uniLocation[0] = gl.getUniformLocation(prg, 'mMatrix');
    uniLocation[1] = gl.getUniformLocation(prg, 'invMatrix');
    uniLocation[2] = gl.getUniformLocation(prg, 'lightDirection');
    uniLocation[3] = gl.getUniformLocation(prg, 'vpMatrix');
    uniLocation[4] = gl.getUniformLocation(prg, 'switchs');

    // 平行光源的方向  
    var lightDirection = [-0.5, 1.0, 0.5];
    // 平行光源开关
    var switchs = [0, 0, 0];

    var gaptext = document.getElementById("gap");

    document.getElementById('light').checked = "true";
    document.getElementById('depth').checked = "true";
    gaptext.value = "3";

    // init cubes
    var cubeCenter = [0.0, 0.0, 0.0];
    var mcube = new Mcube(3, cubeCenter, 0.9);
    let cubes = mcube.cubes;
    for (let i = 0; i < mcube.cubes.length; i++) {
        let cube = mcube.cubes[i];
        cube.program = prg;
        cube.buffers = {};
    }

    var textCanvas = document.getElementById("text");
    var text_ctx = textCanvas.getContext("2d");
    text_ctx.font = "15pt Calibri";
    function renderFps(fps, drawcall) {
        text_ctx.clearRect(0, 0, text_ctx.canvas.width, text_ctx.canvas.height);

        let fpsMsg = fps + " fps";
        let drawcallMsg = drawcall + " dc";
        fpsMsg += ('\n' + drawcallMsg);
        text_ctx.fillText(fpsMsg, 10, 20);
    }

    let camera = { position: [0.0, 4.0, 12.0], target: [0.0, 0.0, 0.0] };
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

        }
    }

    function handleMouseDown(e) {
        mouseDown = true;
        MBUTTON = e.button;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }

    function handleMouseUp(e) {
        mouseDown = false;
        MBUTTON = null;
    }

    function scrollFunc(e) {
        e = e || window.event;
        if (e.detail > 0)   //缩小
            rolldetail *= 1.0666;
        else             //放大
            rolldetail /= 1.0666;
    }

    function _write(format, str) {
        coordArea.innerHTML = format + str + '<br>';
    }

    function writeln(format, str) {
        coordArea.innerHTML += format + str + '<br>';
    }

    function clearCoordarea() {
        coordArea.innerHTML = null;;
    }

    //客户端坐标转canvas坐标
    function windowTocanvas(canvas, x, y) {
        var bbox = canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        };
    }
};