var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var people = {
    piwo: {
        1: {
            sex: "male",
            position: {
                lat: 51.084812,
                lng: 17.013667
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
    },
};

var sockets = {};

function get_people_list_by_topic(people, topic){
    return Object.keys(people[topic])
      .map(id => Object.assign({}, people[id], { id: id }))
}

function handle_intro(socket, payload) {
    var person = {
      sex: payload.sex,
      position: payload.position,
    };
    var topic = payload.topic;
    var id = payload.id;

    people[topic][id] = person;
    sockets[id] = socket;
    socket.id = id;

    console.log('on_intro received:', JSON.stringify(payload));
    io.emit('people', get_people_list_by_topic(people, topic));
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
