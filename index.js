var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require("node-uuid");

var people = [
  {
    id: uuid.v4(),
    sex: "male",
    topic: "piwo",
    position: {
      lat: 51.084812,
      lng: 17.013667
    }
  },
  {
    id: uuid.v4(),
    sex: "female",
    topic: "piwo",
    position: {
      lat: 51.087775,
      lng: 17.013924
    }
  },
  {
    id: uuid.v4(),
    sex: "female",
    topic: "piwo",
    position: {
      lat: 51.087406,
      lng: 17.007773
    }
  }
];

var places = [
  {
    id: uuid.v4(),
    name: "Szynkarnia",
    position: {
      lat: 51.109328,
      lng: 17.025007
    }
  },
  {
    id: uuid.v4(),
    name: "Cukiernia Furtak",
    position: {
      lat: 51.085025,
      lng: 17.010706
    }
  }
];

function broadcast(people, event, payload) {
  people.forEach(person => {
    if (person.socket) person.socket.emit(event, payload);
  });
}

function filterPeopleByTopic(people, topic) {
  return people.filter(person => person.topic === topic);
}

function findById(collection, id) {
  return collection.find(item => item.id === id);
}

function getNearestPlace(places, sourcePos, destinationPos) {
  return places[1];
}

function serializePerson(person) {
  var newPerson = Object.assign({}, person);
  delete newPerson.socket;
  return newPerson;
}

function handleDisconnect(socket) {
  console.log("on disconnect");

  people = people.filter(person => person.socket !== socket);
  broadcast(people, 'people', people.map(serializePerson));
}

function handleIntro(socket, payload) {
  console.log("on intro");

  people.push(Object.assign({}, payload, { socket: socket }));
  const peopleFromTopic = filterPeopleByTopic(people, payload.topic);
  broadcast(peopleFromTopic, "people", peopleFromTopic.map(serializePerson));
}

function handleNotify(socket, payload) {
    console.log("on notify");

    const source = findById(people, payload.sourceId);
    const destination = findById(people, payload.destinationId);
    console.log(source.id, destination.id);
    destination.socket.emit("getNotified", serializePerson(source));
}

function handleAcceptNotification(socket, payload) {
    console.log("on acceptNotification");

    if (!payload.accepted) return;

    const source = findById(people, payload.sourceId);
    const destination = findById(people, payload.destinationId);
    const place = getNearestPlace(places, source.position, destination.position);

    source.socket.emit("place", place);
    destination.socket.emit("place", place);
}

io.on('connection', function(socket) {
    socket.on('intro', payload => handleIntro(socket, payload));
    socket.on('notify', payload => handleNotify(socket, payload));
    socket.on('disconnect', payload => handleDisconnect(socket, payload));
    socket.on('acceptNotification', payload => handleAcceptNotification(socket, payload));
});

http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:', process.env.PORT || 3000);
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
