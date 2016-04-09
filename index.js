var http = require('http').Server(app);
var io = require('socket.io')(http);

function on_intro(payload) {
    console.log('on_intro received:' + payload);
    // broadcast emit people
}

function on_ping(payload) {
    console.log('on_ping received:' + payload);
    // id emit ping
}

function on_pong(payload) {
    console.log('on_pong received:' + payload);
    // id emit meet
    // user emit meet
}

io.on('connection', function(socket) {
    socket.on('intro', on_intro);
    socket.on('intro', on_ping);
    socket.on('intro', on_pong);
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
