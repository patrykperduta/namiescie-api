var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var people = {
    1: {
        sex: "male",
        position: {
            lat: 51.084812,
            lgt: 17.013667
        }
    },
    2: {
        sex: "female",
        position: {
            lat: 51.087775,
            lng: 17.013924
        }
    },
    3: {
        sex: "female",
        position: {
            lat: 51.087406,
            lng: 17.007773
        }
    }
};

function get_people_list(people){
    var return_list = [];
    for (var key in Object.keys(people)){
        var key = Object.keys(people)[key];
        var person = people[key];
        person.id = key;
        return_list.push(person);
    }
    return return_list;
}

function handle_intro(socket, payload) {
    console.log('on_intro received:', JSON.stringify(payload));
    socket.broadcast.emit('people', get_people_list(people));
}

function handle_ping(socket, payload) {
    console.log('on_ping received:', JSON.stringify(payload));
    // id emit ping
}

function handle_pong(socket, payload) {
    console.log('on_pong received:', JSON.stringify(payload));
    // id emit meet
    // user emit meet
}
//

io.on('connection', function(socket) {
    socket.on('intro', payload => handle_intro(socket, payload));
    socket.on('ping', payload => handle_ping(socket, payload));
    socket.on('pong', payload => handle_pong(socket, payload));
});


http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:', process.env.PORT || 3000);
    console.log('people defined: \n', get_people_list(people));
});


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
