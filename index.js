var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var draft = require('draftlog').into(console)

var connections = [];
var users = [];

app.use('/', express.static('html'));
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/html/start.html');
});
server.listen(1234);

io.sockets.on("connection", function (socket) {
    connections.push(socket);
    //console.draft('%s connected', connections.length);

    //Disconnect
    socket.on("disconnect", function (data) {
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
});