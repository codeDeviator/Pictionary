var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var draft = require('draftlog').into(console)

var connections = [];
var users = [];
var words = ["Goku", "Luffy", "Gandhi", "Tom Cruise", "flying", "Dancing", "Programming", "Drawing", "Writing"];
app.use('/', express.static('html'));
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/html/start.html');
});
var chosenWord = "";
server.listen(1234);

function ChoosePlayer(sockets) {
    var result;
    var count = 0;
    for (var socket in sockets)
        if (Math.random() < 1 / ++count)
            result = socket;
    return result;
}

function ChooseWord() {
    chosenWord = words[Math.floor(Math.random() * words.length)];
    return chosenWord;
}

io.sockets.on("connection", function (socket) {
    connections.push(socket);
    io.sockets.sockets[socket.id].emit("getPlayerId", socket.id);
    io.sockets.emit("playerListChange", Object.keys(io.sockets.sockets));
    if (connections.length >= 5) {
        var player = ChoosePlayer(io.sockets.sockets);
        console.log(player);
        io.sockets.emit("playerSelect", player);
        io.sockets.sockets[player].emit("getWord", ChooseWord());
    }
    //console.draft('%s connected', connections.length);

    //Disconnect
    socket.on("disconnect", function (data) {
        io.sockets.emit("playerListChange", Object.keys(io.sockets.sockets));
        connections.splice(connections.indexOf(socket), 1);
        //console.draft('%s connected', connections.length);
    });

    socket.on("colorChangeCli", function (data) {
        io.sockets.emit("colorChangeSer", data);
    });
    var prevDrawData;
    socket.on("clearCli", function () {
        io.sockets.emit("clearSer");
    });
    socket.on("drawCli", function (data) {
        if (prevDrawData != undefined) {
            if (!(prevDrawData.res == "up" && data.res == "move"))
                io.sockets.emit("drawSer", data);
        }
        prevDrawData = data;
    })
    socket.on("answer", function (data) {
        if (data.toLocaleLowerCase() == chosenWord.toLocaleLowerCase())
            io.sockets.emit("getWinner", socket.id);
        else
            io.sockets.sockets[socket.id].emit("checkAnswer", false);
    })
});