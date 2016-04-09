var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var people = {
    1: {
        sex: "male",
        topic: "beer",
        position: {
            lat: 51.084812,
            lng: 17.013667
        }
    },
    2: {
        sex: "female",
        topic: "beer",
        position: {
            lat: 51.087775,
            lng: 17.013924
        }
    },
    3: {
        sex: "female",
        topic: "beer",
        position: {
            lat: 51.087406,
            lng: 17.007773
        }
    }
};

var meetpoints = {
    1: {
        name: "Szynkarnia",
        position: {
            lat: 51.109328,
            lng: 17.025007
        }
    }
}

var sockets = {};


function get_people_list(people){
    return Object.keys(people)
      .map(id => Object.assign({}, people[id], { id: id }))
}

function get_meetpoint(meetpoints) {
    return meetpoints['1'];
}

function handle_intro(socket, payload) {
    var person = {
      sex: payload.sex,
      position: payload.position,
    };
    var topic = payload.topic;
    var id = payload.id;
    person.socket = socket;
    people[id] = person;

    console.log('on_intro received:', JSON.stringify(payload));
    io.emit('people', get_people_list());
}


function handle_ping(socket, payload) {
    console.log('on_ping received:', JSON.stringify(payload));
    var invited_id = payload.id;
    var invited_socket = sockets[invited_id];
    var topic = socket.topic;
    var person = people[topic][socket.id];
    invited_socket.emit('ping', person);
}


function handle_pong(socket, payload) {
    console.log('on_pong received:', JSON.stringify(payload));
    if (payload.accpeted == true) {
      var accepted_person_id = payload.id;
      var accepted_person_socket = sockets[accepted_person_id];
      var topic = socket.topic;
      var person = people[topic][socket.id];
      var meetpoint = get_meetpoint();

      accepted_person_socket.emit('meet', meetpoint);
      socket.emit('meet', meetpoint);
    }
    else {
      // TODO: not acceted
    }
}


io.on('connection', function(socket) {
    socket.on('intro', payload => handle_intro(socket, payload));
    socket.on('ping', payload => handle_ping(socket, payload));
    socket.on('pong', payload => handle_pong(socket, payload));
});


http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:', process.env.PORT || 3000);
});


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
