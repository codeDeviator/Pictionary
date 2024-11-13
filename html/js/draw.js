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
var playerId;





main = new Vue({
        el: '#main',
        data: {
            isGuessed:false,
            playerId: '',
            playerList: [],
            currentPlayer: '',
            word: '',
            guess: '',
            rightGuess: '',
            lost: '',
            winner: '',
            currentScorePoints: 120,
            winnerScorePoints: 0,
            scoreInterval: '',
            isReady: false
        },
        computed: {
            isCurrentPlayer: function () {
                return this.playerId == this.currentPlayer;
            },
            turnText: function () {
                return this.currentPlayer + "'s turn";
            },
            canStart: function () {
                return this.enrichedPlayerList.length > 2;
            },
            enrichedPlayerList: function () {
                var enrichedList = [];
                this.playerList.forEach(function (player) {
                    if (player.id == this.currentPlayer) {
                        enrichedList.push({
                            id: player.id,
                            isPlaying: true,
                            totalScore: player.totalScore,
                            isReady: player.isReady
                        });
                    } else {
                        enrichedList.push({
                            id: player.id,
                            isPlaying: false,
                            totalScore: player.totalScore,
                            isReady: player.isReady
                        });
                    }
                }, this);
                return enrichedList;
            }
        },
        methods: {
            checkAnswer: function () {
                socket.emit("answer", main.guess);
                this.rightGuess = false;
                this.isGuessed = true
            },
            reduceScorePoints: function () {
                self = this;
                self.scoreInterval = setInterval(function () {
                    self.currentScorePoints--;
                    if (self.currentScorePoints == 0)
                        clearInterval(self.scoreInterval);
                }, 1000);
            },
            ready: function () {
                var self = this;
                self.isReady = true;
                socket.emit("playerReady");
            }
        }
    });

    canvas = document.getElementById('canvasDraw');
    canvasContainer = document.getElementById('container');
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
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    if (res == 'down') {
        drawObject.prevX = (drawObject.prevOffsetX - rect.left) * scaleX;
        drawObject.prevY = (drawObject.prevOffsetY - rect.top) * scaleY;
        drawObject.prevOffsetX = e.clientX;
        drawObject.prevOffsetY = e.clientY;
        drawObject.currX = (e.clientX - rect.left) * scaleX;
        drawObject.currY = (e.clientY - rect.top) * scaleY;
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
            drawObject.prevX = (drawObject.prevOffsetX - rect.left) * scaleX;
            drawObject.prevY = (drawObject.prevOffsetY - rect.top) * scaleY;
            drawObject.prevOffsetX = e.clientX;
            drawObject.prevOffsetY = e.clientY;
            drawObject.currX = (e.clientX - rect.left) * scaleX;
            drawObject.currY = (e.clientY - rect.top) * scaleY;
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

socket.on("playerSelect", function (id) {
    main.currentPlayer = id;
    main.rightGuess = false;
    main.lost = false;
    main.winner = '';
    main.currentScorePoints = 120;
    clearInterval(main.scoreInterval);
    if (id == playerId) {
        $("#canvasDraw").removeClass("disabled");
    } else {
        $("#canvasDraw").addClass("disabled");
        main.word = '';
    }
    main.reduceScorePoints();
})

socket.on("playerListChange", function (players) {
    main.playerList = players;
});

socket.on("getPlayerId", function (id) {
    playerId = id;
    main.playerId = id;
})

socket.on("getWord", function (word) {
    main.word = word;
})

socket.on("gameOver", function (word) {
    main.word = word;
    main.lost = true;
    main.winner = "";
    main.isGuessed=false
    setTimeout(function () {
        main.isReady = false;
        main.winner = "";
        main.lost = false;
        main.word = "";
        main.rightGuess = false;
        main.currentPlayer = "";
    }, 5000);
})

socket.on("getWinner", function (obj) {
    if (main.playerId == obj.winner) {
        main.rightGuess = true;
    } else {
        main.lost = true;
        main.word = obj.word
    }
    main.winner = obj.winner;
    main.winnerScorePoints = obj.score;
    clearInterval(main.scoreInterval);
    setTimeout(function () {
        main.isReady = false;
        main.winner = "";
        main.lost = false;
        main.word = "";
        main.rightGuess = false;
        main.currentPlayer = "";
    }, 5000);
});

socket.on("Restrict", function (data) {
    main.isReady = false;
    alert("A game in progress, please wait for it to complete.");
});