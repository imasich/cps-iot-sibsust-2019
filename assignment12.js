var http = require("http").createServer(handler); // on req - hand
var fs = require("fs"); // variable for file system for providing html
var firmata = require("firmata");
const WebSocket = require('ws'); // for permanent connection between server and client

const wss = new WebSocket.Server({port: 8888}); // websocket port is 8888

var messageJSON;

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function() { // ACM Abstract Control Model for serial communication with Arduino (could be USB)
    console.log("Arduino connect");
    board.pinMode(2, board.MODES.OUTPUT); // direction of DC motor
    board.pinMode(3, board.MODES.PWM); // PWM of motor i.e. speed of rotation
    board.pinMode(4, board.MODES.OUTPUT); // direction DC motor
    board.digitalWrite(2,1); // initialization of digital pin 2 to rotate Left on start
    board.digitalWrite(4,0); // initialization of digital pin 2 to rotate Left on start
    board.pinMode(9, board.MODES.SERVO);
});

function handler(req, res) {
    fs.readFile(__dirname + "/assignment12.html",
    function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Error loading html page.");
        }
    res.writeHead(200);
    res.end(data);
    })
}

http.listen(8080); // server will listen on port 8080

board.on("ready", function() {

wss.on('connection', function (ws, req) { // start of wss code
    messageJSON = {"type": "message", "content": "Srv connected, board OK"};
    ws.send(JSON.stringify(messageJSON));

    ws.on("message", function (msgString) { // message comes as string -> msgString
        var msg = JSON.parse(msgString); // string from ws which comes as a string is put to JSON
        switch(msg.type) {
            case "sendDP":
                //board.analogWrite(3,msg.pwm);
                board.servoWrite(9, msg.dp);
                console.log("dp");
                messageJSON = {"type": "message", "content": "DP set to: " + msg.dp};
                ws.send(JSON.stringify(messageJSON));
            break;
            case "set0":
                //board.digitalWrite(2,msg.AIN1);
                //board.digitalWrite(4,msg.AIN2);
                board.servoWrite(9, 0);
                console.log("set0");
                messageJSON = {"type": "message", "content": "DP: 0"};
                ws.send(JSON.stringify(messageJSON));                
            break;
            case "set45":
                board.servoWrite(9, 45);
                console.log("set45");
                messageJSON = {"type": "message", "content": "DP: 45"};
                ws.send(JSON.stringify(messageJSON));                
            break;
            case "set90":
                board.servoWrite(9, 90);
                console.log("set90");
                messageJSON = {"type": "message", "content": "DP: 90"};
                ws.send(JSON.stringify(messageJSON));                
            break;
            case "set135":
                board.servoWrite(9, 135);
                console.log("set135");
                messageJSON = {"type": "message", "content": "DP: 135"};
                ws.send(JSON.stringify(messageJSON));                
            break;
            case "set180":
                board.servoWrite(9, 180);
                console.log("set180");
                messageJSON = {"type": "message", "content": "DP: 180"};
                ws.send(JSON.stringify(messageJSON));                
            break;
            
        }

    }); // end of wss.on code  
}); // end of wss on connection
}); // end of board.on ready