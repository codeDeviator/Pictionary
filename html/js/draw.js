var drawObject = {
    flag: false,
    prevX: 0,
    currX: 0,
    prevY: 0,
    currY: 0,
    dot_flag: false,
    x: "black",
    y: 2
}

var canvas, ctx;

function init() {
    canvas = document.getElementById('canvasDraw');
    ctx = canvas.getContext("2d");
    ctx.lineWidth = drawObject.y;
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        callfindxy('move', e);
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        callfindxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        callfindxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        callfindxy('out', e)
    }, false);
}

function callfindxy(res, e) {
    socket.emit("drawCli", {
        drawObject: drawObject,
        res: res,
        e: {
            clientX: e.clientX,
            clientY: e.clientY
        }
    });
}

function callColor(obj) {
    socket.emit("colorChangeCli", {
        id: obj.id
    });
}

function color(obj) {
    drawObject.x = obj.id;
    if (drawObject.x == "white") drawObject.y = 14;
    else drawObject.y = 2;
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(drawObject.prevX, drawObject.prevY);
    ctx.lineTo(drawObject.currX, drawObject.currY);
    ctx.strokeStyle = drawObject.x;
    ctx.lineWidth = drawObject.y;
    ctx.stroke();
    ctx.closePath();
}

function callErase() {
    socket.emit("clearCli");
}

function erase() {
    ctx.clearRect(0, 0, w, h);
}

function findxy(res, e) {
    if (res == 'down') {
        drawObject.prevX = drawObject.currX;
        drawObject.prevY = drawObject.currY;
        drawObject.currX = e.clientX - canvas.offsetLeft;
        drawObject.currY = e.clientY - canvas.offsetTop;

        drawObject.flag = true;
        drawObject.dot_flag = true;
        if (drawObject.dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = drawObject.x;
            ctx.fillRect(drawObject.currX, drawObject.currY, 2, 2);
            ctx.closePath();
            drawObject.dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        drawObject.flag = false;
    }
    if (res == 'move') {
        if (drawObject.flag) {
            drawObject.prevX = drawObject.currX;
            drawObject.prevY = drawObject.currY;
            drawObject.currX = e.clientX - canvas.offsetLeft;
            drawObject.currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}


socket.on("colorChangeSer", function (obj) {
    color(obj);
})

socket.on("drawSer", function (obj) {
    drawObject = obj.drawObject;
    findxy(obj.res, obj.e);
})

socket.on("clearSer", function () {
    erase();
})