var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var draft = require('draftlog').into(console)

var player;
var connections = [];
var users = [];
var playerTimer = 120;
var scoreInterval;
var gameInProgress = false;
var words = ["Angel", "Angry", "Baby", "Beard", "Bible", "Bikini", "Book", "Bucket", "Bumble bee", "Butterfly", "Camera", "Cat", "Church", "Crayon", "Dolphin", "Egg", "Eiffel Tower", "Eyeball", "Fireworks", "Flower", "Flying saucer", "Giraffe", "Glasses", "High heel", "Ice cream cone", "Igloo", "Lady bug", "Lamp", "Lion", "Mailbox", "Night", "Nose", "Olympics", "Peanut", "Pizza", "Pumpkin", "Rainbow", "Recycle", "Sand castle", "Snowflake", "Stairs", "Starfish", "Strawberry", "Sun", "Tire", "Toast", "Toothbrush", "Toothpaste", "Truck", "Volleyball", "Abraham Lincoln", "Brain", "Bubble bath", "Buckle", "Bus", "Car accident", "Castle", "Chain saw", "Circus tent", "Computer", "Crib", "Dragon", "Dumbbell", "Eel", "Ferris wheel", "Flag", "Junk mail", "Kiss", "Kitten", "Kiwi", "Lipstick", "Lobster", "Lollipop", "Magnet", "Megaphone", "Mermaid", "Minivan", "Mount Rushmore", "Music", "North pole", "Nurse", "Owl", "Pacifier", "Piano", "Pigtails", "Playground", "Pumpkin pie", "Raindrop", "Robot", "Sand castle", "Slipper", "Snowball", "Sprinkler", "Statue of Liberty", "Tadpole", "Teepee", "Telescope", "Train", "Tricycle", "Tutu", "Attic", "Back seat", "Birthday", "Black hole", "Blizzard", "Burrito", "Captain", "Chandelier", "Crib", "Cruise ship", "Dance", "Deodorant", "Facebook", "Flat", "Frame", "Full moon", "Game", "Glue", "Highchair", "Hockey", "Hotel", "Jump rope", "Koala", "Leprechaun", "Light", "Mask", "Mechanic", "Mom", "Mr Potato Head", "Pantyhose", "Paper plate", "Photo", "Pilgram", "Pirate", "Pocket watch", "Rock band", "Sasquatch", "Scrambled eggs", "Seat belt", "Skip", "Solar eclipse", "Space", "Stethoscope", "Stork", "Sunburn", "Thread", "Tourist", "United States", "WIFI", "Zombie"];
app.use('/', express.static('html'));
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/html/start.html');
});
var chosenWord = "";
server.listen(1234,"0.0.0.0",()=>{
    console.log("You can see the appication on  http://localhost:1234")
});

function ChoosePlayer(sockets) {
    var  randomNumber= Math.floor(Math.random()*connections.length)
    console.log(randomNumber);
    var result=connections[randomNumber]

        return result.id;
}

function ChooseWord() {
    chosenWord = words[Math.floor(Math.random() * words.length)];
    return chosenWord;
}

function formPlayerObjectArray(socketObject) {
    var playerArray = [];
    Object.keys(socketObject).forEach(function (socket) {
        playerArray.push({
            id: socketObject[socket].id,
            totalScore: socketObject[socket].score,
            isReady: socketObject[socket].isReady
        })
    }, this);
    return playerArray;
}

function startGame(ioSockets) {
    gameInProgress = true;
    player = ChoosePlayer(ioSockets.sockets);
    clearInterval(scoreInterval);
    io.sockets.emit("clearSer");
    io.sockets.emit("playerSelect", player);
    io.sockets.sockets[player].emit("getWord", ChooseWord());
    playerTimer = 120;
    scoreInterval = setInterval(function () {
        playerTimer--;
        if (playerTimer === 0) {
            clearInterval(scoreInterval);
            ioSockets.emit("gameOver", chosenWord);
            gameInProgress = false;
            Object.keys(io.sockets.sockets).forEach(function (playerSocket) {
                io.sockets.sockets[playerSocket].isReady = false;
            }, this);
            io.sockets.emit("playerListChange", formPlayerObjectArray(io.sockets.sockets));
        }
    }, 1000);
}

io.sockets.on("connection", function (socket) {
    connections.push(socket);
    socket.score = 0;
    socket.isReady = false;
    
    io.sockets.sockets[socket.id].emit("getPlayerId", socket.id);
    io.sockets.emit("playerListChange", formPlayerObjectArray(io.sockets.sockets));
    //console.draft('%s connected', connections.length);

    //Disconnect
    socket.on("disconnect", function (data) {
        io.sockets.emit("playerListChange", formPlayerObjectArray(io.sockets.sockets));
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
    });
    socket.on("answer", function (data) {
        if (data.toLocaleLowerCase() == chosenWord.toLocaleLowerCase()) {
            socket.score += playerTimer;
            io.sockets.sockets[player].score += playerTimer;
            io.sockets.emit("getWinner", {
                winner: socket.id,
                word: chosenWord,
                score: playerTimer,
                totalScore: socket.score
            });
            Object.keys(io.sockets.sockets).forEach(function (playerSocket) {
                io.sockets.sockets[playerSocket].isReady = false;
            }, this);
            io.sockets.emit("playerListChange", formPlayerObjectArray(io.sockets.sockets));
            gameInProgress = false;
            clearInterval(scoreInterval);
        } else
            io.sockets.sockets[socket.id].emit("checkAnswer", false);
    });
    socket.on("playerReady", function () {
        var allReady = true;
        if (gameInProgress) {
            io.sockets.sockets[socket.id].emit("Restrict");
        } else {
            socket.isReady = true;
        }
        io.sockets.emit("playerListChange", formPlayerObjectArray(io.sockets.sockets));
        Object.keys(io.sockets.sockets).forEach(function (playerSocket) {
            if (io.sockets.sockets[playerSocket].isReady == false) {
                allReady = false;
            }
        }, this);
        if (allReady && !gameInProgress)
            startGame(io.sockets);
    });
});