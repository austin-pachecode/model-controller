var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
var hostname = '192.168.0.41';
var port = 9000;

app.post('/led', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ',req.body);
    res.send(req.body);
});

app.get('/', (req, res) => {
  res.send('root')
})
// start the server
app.listen(port, hostname);
console.log('Server started! At http://localhost:' + port);