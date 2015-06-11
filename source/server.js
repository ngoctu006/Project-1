var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser')
var app = express();

var port = process.env.PORT || 3000;
app.set('port', port);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use(function(req, res){
  res.setHeader('Content-Type', 'text/plain');
  res.end(JSON.stringify(req.body, null, 2));
});

http.createServer(app).listen(port);
console.log('Frontend template is running on port ' + port);
