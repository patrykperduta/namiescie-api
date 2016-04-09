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
  var people_list = [];
  var keys = Object.keys(people);
  for (var key in keys){
    people_list.push(people[key]);
    people_list[people_list.length-1].id = key;
  }
  return people_list;
}

function handle_intro(payload) {
    console.log('on_intro received:' + payload);
    socket.broadcast.emit('people', get_people_list(people));
}

function handle_ping(payload) {
    console.log('on_ping received:' + payload);
    // id emit ping
}

function handle_pong(payload) {
    console.log('on_pong received:' + payload);
    // id emit meet
    // user emit meet
}


io.on('connection', function(socket) {
    socket.on('intro', handle_intro);
    socket.on('ping', handle_ping);
    socket.on('pong', handle_pong);
});


http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:', process.env.PORT || 3000);
    //console.log('people defined: \n', get_people_list(people));
});


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
