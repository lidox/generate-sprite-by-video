var express = require('express');
var app = express();
var path = require('path');
var port = 443;

//middleware configuration
var batchFileWithPath = 'D:/projekte/generate-sprite-by-video/batch/convert.bat';

// middleware
app.use(express.static(__dirname + '/public'));

// index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});
//C:/Users/schaefa/Desktop/convert.bat
app.listen(port, function () {
  console.log('App listening on port ' + port);

	var spawn = require('child_process').spawn,
	ls    = spawn('cmd.exe', ['/c', batchFileWithPath]);

	ls.stdout.on('data', function (data) {
	console.log('stdout: ' + data);
	});

	ls.stderr.on('data', function (data) {
	console.log('stderr: ' + data);
	});

	ls.on('exit', function (code) {
	console.log('child process exited with code ' + code);
	});
});