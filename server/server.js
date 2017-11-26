var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 5000;
var todo = require('./routes/todo.js');
var completed = require('./routes/completed.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

app.use('/todo', todo);

app.use('/completed', completed)

//Start listening for requests on port 5k
app.listen(port, function() {
    console.log('listening on port ', port);    
});