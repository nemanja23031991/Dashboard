var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 5000;
var io = require('socket.io')(http);

http.listen(port, function(){
  console.log('listening on *:' + port);
});

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
